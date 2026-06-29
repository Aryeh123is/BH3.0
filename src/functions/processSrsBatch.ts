import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const MAX_BATCH_SIZE = 150;

/**
 * Validates and batch-writes SRS review events.
 * NO SRS logic or interval calculation here. Standard validation only.
 */
export const processSrsBatch = functions.https.onCall(async (data, context) => {
  // 1. Validate Auth
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be logged in to sync SRS progress.'
    );
  }

  const uid = context.auth.uid;
  const batchData = data.batch;

  // 2. Validate Payload Structure & Limits
  if (!Array.isArray(batchData)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Payload must contain a batch array.'
    );
  }

  if (batchData.length > MAX_BATCH_SIZE) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      `Batch size exceeds the maximum limit of ${MAX_BATCH_SIZE}.`
    );
  }

  const batch = db.batch();

  // 3. Validate and Queue Writes
  const validMasteryStates = ['new', 'learning', 'mastered'];
  const now = Date.now();
  const maxFutureReview = now + 3 * 365 * 24 * 60 * 60 * 1000; // +3 years

  for (const event of batchData) {
    // Basic structural checks
    if (!event || typeof event !== 'object') continue;
    if (typeof event.wordId !== 'string' || !event.wordId.trim()) {
       throw new functions.https.HttpsError('invalid-argument', 'Missing or invalid wordId in batch event.');
    }

    // Strict Type & Value Validation
    const intervalDays = event.intervalDays;
    const nextReview = event.nextReview;
    const mastery = event.mastery;
    const lastStudied = event.lastStudied;

    if (
      typeof intervalDays !== 'number' ||
      isNaN(intervalDays) ||
      intervalDays < 0 ||
      intervalDays > 1000
    ) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid intervalDays bounds.');
    }

    if (
      typeof nextReview !== 'number' ||
      isNaN(nextReview) ||
      nextReview < 0 ||
      nextReview > maxFutureReview
    ) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid nextReview timestamp.');
    }
    
    if (!validMasteryStates.includes(mastery)) {
       throw new functions.https.HttpsError('invalid-argument', 'Invalid mastery state.');
    }

    // Safety check on lastStudied
    if (typeof lastStudied !== 'number' || isNaN(lastStudied) || lastStudied < 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid lastStudied timestamp.');
    }

    const docRef = db.collection('users').doc(uid).collection('progress').doc(event.wordId);

    batch.set(docRef, {
      nextReview: nextReview,
      intervalDays: intervalDays,
      mastery: mastery,
      lastStudied: lastStudied,
      lastSyncId: event.id || null,     // Idempotency tracing
      serverTimestamp: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  // 4. Commit batch
  try {
    await batch.commit();
    return { success: true, count: batchData.length };
  } catch (error) {
    console.error(`Failed to commit SRS batch for user ${uid}:`, error);
    throw new functions.https.HttpsError('internal', 'Failed to commit batch to database.');
  }
});
