import Stripe from 'stripe';
import admin from 'firebase-admin';

let firebaseInitialized = false;

function initializeFirebase(env: any) {
  if (!firebaseInitialized && env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseInitialized = true;
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Webhook Error: Secret not set', { status: 400 });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  });

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Webhook Error: No signature', { status: 400 });
  }

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.firebaseUid || session.client_reference_id;

      if (userId) {
        initializeFirebase(env);
        if (firebaseInitialized) {
          const db = admin.firestore();
          await db.collection('users').doc(userId).set({
            isPremium: true,
            premiumSince: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          console.log(`Successfully upgraded user ${userId} to Premium`);
        } else {
          console.warn('Firebase Admin not initialized, cannot update user');
          return new Response('Firebase Admin not initialized', { status: 500 });
        }
      } else {
        console.warn('No user ID found in session metadata');
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
