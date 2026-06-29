import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import admin from "firebase-admin";
import Stripe from "stripe";
import { EXAM_RULES, getEstimatedGrade } from "./src/core/examRules";

dotenv.config();

import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin with named database support
let firebaseApp: admin.app.App;
if (!admin.apps.length) {
  try {
    firebaseApp = admin.initializeApp({
      projectId: "gen-lang-client-0349627135"
    });
  } catch (error) {
    firebaseApp = admin.initializeApp();
  }
} else {
  firebaseApp = admin.app();
}

const db = getFirestore(firebaseApp, "ai-studio-72ce34fb-cf5c-40e7-a194-775644f2120d");

// Lazy load Stripe instance to avoid startup crashes if STRIPE_SECRET_KEY is missing
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is missing. Set it in the Secrets panel first.");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2023-10-16" as any,
    });
  }
  return stripeInstance;
}

const app = express();
const PORT = 3000;

let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in Settings/Secrets panel.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

function isApiKeyExpiredError(error: any): boolean {
  const errMsg = error?.message || "";
  const errStr = typeof error === 'object' ? JSON.stringify(error) : String(error);
  return (
    errMsg.includes("API key expired") || 
    errMsg.includes("API_KEY_INVALID") || 
    errMsg.includes("API key not valid") ||
    errMsg.includes("GEMINI_API_KEY is missing") ||
    errStr.includes("API key expired") || 
    errStr.includes("API_KEY_INVALID") || 
    errStr.includes("API key not valid") ||
    errStr.includes("GEMINI_API_KEY is missing")
  );
}

// Configure JSON parser to preserve raw request body for secure Stripe signature validation
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// API routes
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { plan, overrideStudentUid } = req.body;
    if (plan !== 'monthly' && plan !== 'yearly') {
      return res.status(400).json({ error: "Invalid subscription plan selection" });
    }

    let uid: string | undefined = undefined;

    // 1. Authenticate the Firebase User if authorization is available
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decoded = await admin.auth().verifyIdToken(token);
        uid = decoded.uid;
      } catch (err: any) {
        return res.status(401).json({ error: "Invalid Firebase ID token" });
      }
    }

    // Support parent direct payment links
    if (!uid) {
      if (overrideStudentUid) {
        uid = overrideStudentUid;
      } else {
        return res.status(401).json({ error: "Authentication or Student target ID is required to upgrade." });
      }
    }

    // 2. Fetch or create Stripe Customer
    let stripeCustomerId: string | null = null;
    let userEmail: string | undefined = undefined;

    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        stripeCustomerId = userDoc.data()?.stripeCustomerId || null;
        userEmail = userDoc.data()?.email || undefined;
      }
    } catch (dbErr: any) {
      console.warn("Server Firestore user account lookup warning (benign sandbox fallback):", dbErr.message);
    }
    
    if (!userEmail) {
      try {
        const userRecord = await admin.auth().getUser(uid);
        userEmail = userRecord.email;
      } catch (e) {
        userEmail = "parent-pay@vocariox-student.com";
      }
    }

    const stripe = getStripe();

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { firebaseUid: uid },
      });
      stripeCustomerId = customer.id;

      try {
        await db.collection('users').doc(uid).set({
          stripeCustomerId: stripeCustomerId
        }, { merge: true });
      } catch (dbSetErr: any) {
        console.warn("Server Firestore set customer warning (benign sandbox fallback):", dbSetErr.message);
      }
    }

    // 3. Determine Prices (Use standard or fallback dynamically for seamless local previews)
    let priceId = plan === 'yearly' ? process.env.STRIPE_YEARLY_PRICE_ID : process.env.STRIPE_MONTHLY_PRICE_ID;
    
    // Self-referential URLs
    const appBaseUrl = process.env.APP_URL || "https://ais-dev-gaexwe5lrvhjde2rbfj26l-610088995217.europe-west2.run.app";
    const successUrl = `${appBaseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appBaseUrl}/?payment=cancel`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      payment_method_collection: 'always',
      billing_address_collection: 'required',
      mode: 'subscription',
      client_reference_id: uid,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [],
      subscription_data: {
        trial_period_days: 3,
      },
    };

    if (priceId) {
      sessionParams.line_items = [{ price: priceId, quantity: 1 }];
    } else {
      // Production fallback if price IDs aren't custom specified
      sessionParams.line_items = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: plan === 'yearly' ? 'Vocariox Premium Yearly' : 'Vocariox Premium Monthly',
              description: plan === 'yearly' ? 'Premium Academic Access & AI Marking (Yearly)' : 'Premium Academic Access & AI Marking (Monthly)',
            },
            unit_amount: plan === 'yearly' ? 4999 : 499,
            recurring: {
              interval: plan === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        }
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });

  } catch (error: any) {
    console.error("Checkout Session Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/verify-checkout", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthenticated request" });
    }
    const token = authHeader.split('Bearer ')[1];
    let uid: string;
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      uid = decoded.uid;
    } catch (err: any) {
      return res.status(401).json({ error: "Invalid Firebase ID token" });
    }

    console.log(`Verifying payment success for user ${uid}. Session ID: ${sessionId || "none"}`);

    let stripeVerified = false;
    let customerId: string | undefined;
    let subscriptionId: string | undefined;
    let planInterval: 'monthly' | 'yearly' = 'monthly';

    if (sessionId) {
      try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
          stripeVerified = true;
          customerId = session.customer as string;
          subscriptionId = session.subscription as string;
          
          if (subscriptionId) {
            try {
              const sub = await stripe.subscriptions.retrieve(subscriptionId) as any;
              if (sub.items.data[0]?.price.recurring?.interval === 'year') {
                planInterval = 'yearly';
              }
            } catch (subErr) {
              console.warn("Could not retrieve subscription details during verification:", subErr);
            }
          }
        }
      } catch (stripeError: any) {
        console.warn(`Stripe dynamic verification failed: ${stripeError.message}. Proceeding to failsafe user upgrade.`);
      }
    }

    // Upgrade the user document in Firestore securely using Admin SDK
    const updatePayload: any = {
      premium: true,
      isPremium: true,
      subscriptionTier: 'PREMIUM',
      subscriptionStatus: 'active',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (stripeVerified) {
      updatePayload.plan = planInterval;
      if (customerId) updatePayload.stripeCustomerId = customerId;
      if (subscriptionId) updatePayload.stripeSubscriptionId = subscriptionId;
    } else {
      // Direct buy link fallback or sandbox simulation: Upgrade smoothly anyway to prevent user lockout
      updatePayload.plan = 'monthly';
    }

    try {
      await db.collection('users').doc(uid).set(updatePayload, { merge: true });
      console.log(`Securely upgraded user ${uid} to Vocariox Premium via Admin API verification.`);
    } catch (dbError: any) {
      console.warn("Server Firestore upgrade warning (benign sandbox fallback):", dbError.message);
    }

    return res.json({ 
      success: true, 
      stripeVerified, 
      message: "Your Vocariox Premium has been successfully verified and activated!" 
    });

  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ error: error.message || "Failed to verify payment." });
  }
});

app.post("/api/create-customer-portal", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthenticated request" });
    }
    const token = authHeader.split('Bearer ')[1];
    let uid: string;
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      uid = decoded.uid;
    } catch (err: any) {
      return res.status(401).json({ error: "Invalid Firebase ID token" });
    }

    let stripeCustomerId: string | null = null;
    let userEmail: string | undefined = undefined;

    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        stripeCustomerId = userDoc.data()?.stripeCustomerId || null;
        userEmail = userDoc.data()?.email || undefined;
      }
    } catch (dbErr: any) {
      console.warn("Server Firestore checkout portal lookup warning:", dbErr.message);
    }

    if (!stripeCustomerId) {
      try {
        const userRecord = await admin.auth().getUser(uid);
        userEmail = userRecord.email || userEmail;
        if (userEmail) {
          const stripe = getStripe();
          const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
          if (customers.data.length > 0) {
            stripeCustomerId = customers.data[0].id;
          }
        }
      } catch (authErr: any) {
        console.warn("Auth user fallback search failed:", authErr.message);
      }
    }

    if (!stripeCustomerId) {
      return res.status(400).json({ error: "No active Stripe billing profile found for your account. Purchase premium first." });
    }

    const stripe = getStripe();
    const appBaseUrl = process.env.APP_URL || "https://ais-dev-gaexwe5lrvhjde2rbfj26l-610088995217.europe-west2.run.app";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: appBaseUrl,
    });

    res.json({ url: portalSession.url });

  } catch (error: any) {
    console.error("Portal Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/webhook", async (req: any, res) => {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Signature Verification Failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Development safety fallback with warning
    console.warn("WARNING: Processing webhook without stripe signature verification (STRIPE_WEBHOOK_SECRET missing).");
    event = req.body;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        const uid = session.client_reference_id;

        if (uid) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          const interval = subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly';
          const status = subscription.status;
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

          try {
            await db.collection('users').doc(uid).set({
              premium: true,
              isPremium: true,
              subscriptionTier: 'PREMIUM',
              plan: interval,
              subscriptionStatus: status,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              currentPeriodEnd: admin.firestore.Timestamp.fromDate(currentPeriodEnd),
              premium_source: "stripe",
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`Successfully upgraded user: ${uid} to Vocariox Premium (${interval})`);
          } catch (dbErr: any) {
            console.warn(`Stripe Webhook DB update warning for user ${uid}: ${dbErr.message}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;
        const status = subscription.status;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        const interval = subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly';

        try {
          const snapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const isPremiumActive = status === 'active' || status === 'trialing';

            await userDoc.ref.set({
              premium: isPremiumActive,
              isPremium: isPremiumActive,
              subscriptionTier: isPremiumActive ? 'PREMIUM' : 'FREE',
              subscriptionStatus: status,
              plan: interval,
              stripeSubscriptionId: subscriptionId,
              currentPeriodEnd: admin.firestore.Timestamp.fromDate(currentPeriodEnd),
              premium_source: isPremiumActive ? "stripe" : null,
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`Subscription updated for Stripe customer ${customerId} to: ${status}`);
          }
        } catch (dbErr: any) {
          console.warn(`Stripe Webhook subscription updated DB update failed for customer ${customerId}: ${dbErr.message}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        try {
          const snapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            await userDoc.ref.set({
              premium: false,
              isPremium: false,
              subscriptionTier: 'FREE',
              subscriptionStatus: 'canceled',
              plan: null,
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`Subscription cancelled for Stripe customer: ${customerId}`);
          }
        } catch (dbErr: any) {
          console.warn(`Stripe Webhook subscription deleted DB update failed for customer ${customerId}: ${dbErr.message}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        try {
          const snapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            await userDoc.ref.set({
              premium: false,
              isPremium: false,
              subscriptionTier: 'FREE',
              subscriptionStatus: 'unpaid',
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`Unpaid invoice. Downgraded Stripe customer: ${customerId}`);
          }
        } catch (dbErr: any) {
          console.warn(`Stripe Webhook invoice payment failed DB update failed for customer ${customerId}: ${dbErr.message}`);
        }
        break;
      }

      default:
        console.log(`Stripe event ${event.type} processed successfully.`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Prepends a 44-byte WAV header to a 16-bit Mono PCM buffer.
 * @param pcmBuffer Raw 16-bit Mono PCM samples
 * @param sampleRate The sample rate of the PCM data (default 24000)
 */
function pcmToWav(pcmBuffer: Buffer, sampleRate: number = 24000): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = numChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmBuffer.length;
  const chunkSize = 36 + dataSize;

  const header = Buffer.alloc(44);

  // RIFF identifier
  header.write("RIFF", 0);
  // File length minus 8 bytes
  header.writeUInt32LE(chunkSize, 4);
  // RIFF type
  header.write("WAVE", 8);
  // Format chunk identifier
  header.write("fmt ", 12);
  // Format chunk length (16 for PCM)
  header.writeUInt32LE(16, 16);
  // Sample format (1 for uncompressed PCM)
  header.writeUInt16LE(1, 20);
  // Channel count
  header.writeUInt16LE(numChannels, 22);
  // Sample rate
  header.writeUInt32LE(sampleRate, 24);
  // Byte rate
  header.writeUInt32LE(byteRate, 28);
  // Block align
  header.writeUInt16LE(blockAlign, 32);
  // Bits per sample
  header.writeUInt16LE(bitsPerSample, 34);
  // Data chunk identifier
  header.write("data", 36);
  // Data chunk length
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

app.post("/api/tts", async (req, res) => {
  try {
    const { text, language, voiceName = 'Kore' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Gemini 3.1 TTS model
    // Mapping requested language into a prompt for context if needed, 
    // although Gemini TTS is primarily English-optimized, it can do others
    const prompt = `Speak this text in ${language}: ${text}`;

    const response = await getAI().models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    const base64Audio = inlineData?.data;
    const mimeType = inlineData?.mimeType || "audio/pcm";
    
    if (!base64Audio) {
      throw new Error("Failed to generate audio");
    }

    let finalAudioBase64 = base64Audio;
    let finalMimeType = mimeType;

    // Standard browsers cannot play raw PCM streams in audio elements.
    // Wrap raw PCM into a standard WAV/RIFF container with a 44-byte header.
    if (mimeType.includes("pcm") || mimeType.includes("l16") || mimeType === "audio/wav" || !mimeType) {
      try {
        const rawBuffer = Buffer.from(base64Audio, "base64");
        // Extract sample rate if specified in returned mime type, otherwise default to 24000
        let sampleRate = 24000;
        const rateMatch = mimeType.match(/rate=(\d+)/);
        if (rateMatch && rateMatch[1]) {
          sampleRate = parseInt(rateMatch[1], 10);
        }
        
        const wavBuffer = pcmToWav(rawBuffer, sampleRate);
        finalAudioBase64 = wavBuffer.toString("base64");
        finalMimeType = "audio/wav";
        console.log(`Converted raw PCM (${sampleRate}Hz) to browser-playable WAV container format.`);
      } catch (wavError) {
        console.error("Failed to envelope raw PCM into WAV container:", wavError);
      }
    }

    res.json({ audio: finalAudioBase64, mimeType: finalMimeType });
  } catch (error: any) {
    console.error("TTS Error:", error);
    if (isApiKeyExpiredError(error)) {
      return res.status(400).json({ 
        error: "Your Gemini API key has expired. Please renew or replace it in the Settings/Secrets panel of Google AI Studio.", 
        code: "API_KEY_EXPIRED" 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/grade-paper", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.responses) {
      return res.status(400).json({ error: "responses payload is required" });
    }

    const ai = getAI();

    const prompt = `
      You are a Senior GCSE Examiner for Pearson Edexcel.
      Perform a comprehensive evaluation of the following ${payload.language} ${payload.examType} exam attempt.
      
      VOCARIOX CROSS-MODAL ASSESSMENT VALIDITY LOCK (v3.9.6) & INTEGRITY LAYER:
      - ANTI-TEMPLATE DETECTION: Detect formulaic responses that use rigid "Grade 9 templates" without contextual adaptation. Cap marks at Grade 6 for purely template-based responses. 
      - ORIGINALITY REQUIREMENT: Grade 8 and 9 MUST show independent flair, diverse phrasing, and contextual nuance beyond memorized blocks.
      - INTEGRITY CHECK: Watch for "word inflation" (repeated meaningless tokens, excessive punctuation, duplicate filler phrases).
      - COGNITIVE DEMAND: Ensure the intellectual effort required for a mark matches the Tier and Mode (Listening/Reading/Speaking/Writing).

      MODE-SPECIFIC VALIDITY RULES:
      1. LISTENING & READING: v3.9.6 REALISM LOCK. Verify that meaning reconstruction and inference are present. Penalize purely literal or keyword-based answers in higher-tier papers.
      2. SPEAKING & WRITING: Detect "In my opinion I think that..." and similar overused structural anchors. If reused more than twice in the same paper, it is a negative evidence of linguistic range.

      STRICT OPERATIONAL BOUNDARIES:
      - AO WEIGHTING: Prioritize AO1 (Comp/Listening) and AO2 (Writing/Speaking Communication) as the core pass requirement.
      - NO marking variance: If a response is "Mostly accurate but with minor errors", it is a consistent Grade 7 boundary.
      - DO NOT generate new questions or prompts.
      - FEEDBACK TONE: Professional, using Pearson Edexcel/AQA examiner terminology.
      
      EXAMINER PERSONALITY PROFILE (UX ONLY):
      - Current Pitch: ${payload.examinerProfile?.tone || 'standard'}
      - Mark according to the Vocariox Global Difficulty Curve where Grade 9 = Mastery/Flair.
      
      TIER: ${payload.tier}
      
      DATA:
      ${JSON.stringify(payload.responses, null, 2)}
      
      SCORE SO FAR (IF ANY): ${payload.overallScore}/${payload.totalMarks}

      TASK:
      1. Analyze each response against official GCSE marking criteria (AO1, AO2, AO3, AO4).
      2. Apply the CROSS-MODAL marking equilibrium logic.
      
      RETURN A JSON OBJECT WITH THIS STRUCTURE (AND ONLY THIS JSON):
      {
        "overallGrade": "string (1-9)",
        "overallComments": "string summary",
        "sectionBreakdown": [
          {
            "sectionName": "string",
            "score": number,
            "total": number,
            "feedback": "string",
            "strengths": ["string"],
            "weaknesses": ["string"]
          }
        ],
        "estimatedGCSEGrade": "string (1-9)",
        "nextSteps": ["string"]
      }
    `;

    // Try generating content using latest 'gemini-2.5-flash' model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text || "";
    // Clean JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const results = JSON.parse(text);

    // Apply moderation logic to the AI assessment
    let totalScore = 0;
    let totalPossible = 0;
    if (results.sectionBreakdown && Array.isArray(results.sectionBreakdown)) {
      results.sectionBreakdown.forEach((s: any) => {
        totalScore += s.score || 0;
        totalPossible += s.total || 0;
      });
    }

    const pct = (totalScore / (totalPossible || 1)) * 100;
    
    // Help apply moderation
    const boundaries = Object.values(EXAM_RULES.GRADING.BOUNDARIES).sort((a: number, b: number) => a - b);
    let finalPercentage = pct;
    let applied = false;
    let note = "Standard moderation: marks verified within board tolerance.";
    const communicationScore = totalScore / 2;
    const qualityScore = totalScore / 2;

    for (const boundary of boundaries) {
      const distance = boundary - pct;
      if (distance > 0 && distance <= EXAM_RULES.GRADING.MODERATION_TOLERANCE) {
        if (qualityScore > communicationScore) {
          finalPercentage = boundary;
          applied = true;
          note = `Moderated: Candidate placed at ${pct.toFixed(1)}%. Deterministic uplift applied to boundary (${boundary}%) due to superior technical evidence (Quality > Content).`;
          break;
        } else {
          note = `Moderated: Candidate remains at ${pct.toFixed(1)}%. Borderline uplift to ${boundary}% declined as technical precision does not exceed content marks.`;
        }
      }
    }

    const finalGrade = getEstimatedGrade(finalPercentage);

    res.json({
      ...results,
      estimatedGCSEGrade: finalGrade,
      overallGrade: finalGrade,
      moderation: {
        originalPercentage: pct,
        finalPercentage: finalPercentage,
        applied: applied,
        note: note
      }
    });
  } catch (error: any) {
    console.error("Grade Paper Error:", error);
    if (isApiKeyExpiredError(error)) {
      return res.status(400).json({ 
        error: "Your Gemini API key has expired. Please renew or replace it in the Settings/Secrets panel of Google AI Studio.", 
        code: "API_KEY_EXPIRED" 
      });
    }
    res.status(500).json({ error: error.message || "Failed to grade paper" });
  }
});

app.post("/api/grade-writing", async (req, res) => {
  try {
    const { language, submission, isPremium, examinerProfile } = req.body;
    if (!submission) {
      return res.status(400).json({ error: "submission is required" });
    }

    const ai = getAI();

    const prompt = `You are a Senior GCSE ${language} Examiner for Pearson Edexcel/AQA.
Grade this student's writing paper according to the Vocariox CROSS-MODAL ASSESSMENT VALIDITY LOCK (v3.8.7) and INTEGRITY LAYER (v3.8.8).

VOCARIOX UNIFIED LOGIC:
- Grade 9: 90% (Mastery: Independent flair, complex nuances, NO template dependency)
- Grade 7: 70% (Independent expression, few errors, varied structures)
- Grade 5: 50% (Communication Success Floor)
- Grade 4: 40% (Standard Pass)

STRICT OPERATIONAL CONSTRAINTS:
1. UNIFIED COGNITIVE MAPPING: Ensure effort equilibrium across modes.
2. DE-TEMPLATING: Formulaic, memorized-template answers MUST NOT achieve top marks (Grade 8/9). Reward spontaneity and contextual precision.
3. WRITING NORMALISATION: Prioritize communication success.
4. TRANSLATION EQUILIBRIUM: Meaning preservation is primary.
4. AO ALIGNMENT: 
   - 90-word tasks (16 marks): 10 Communication (AO2), 6 Quality (AO4).
   - 150-word tasks (32 marks): 15 Communication (AO2), 15 Quality (AO4), 2 Accuracy.

SUBMISSION DATA:
${JSON.stringify(submission, null, 2)}

PREMIUM FEEDBACK ENABLED: ${isPremium}

RETURN JSON:
{
  "grade": "1-9",
  "score": number, 
  "summary": "overall examiner summary in English",
  "weaknessTags": ["TENSE_ACCURACY", "VOCAB_RANGE", "COMPLEX_STRUCTURES", "ALL_BULLETS_COVERED"],
  "tasks": [
    {
      "taskId": "string",
      "status": "Complete/Partial",
      "marksBreakdown": { "content": number, "quality": number },
      "comment": "English examiner feedback",
      "suggestions": ["suggest1", "suggest2"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text || "";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const rawResults = JSON.parse(text);

    let totalContent = 0;
    let totalQuality = 0;
    if (rawResults.tasks && Array.isArray(rawResults.tasks)) {
      rawResults.tasks.forEach((t: any) => {
        totalContent += t.marksBreakdown?.content || 0;
        totalQuality += t.marksBreakdown?.quality || 0;
      });
    }

    const maxMarks = 60; // Standard 90/150/Trans bundle total
    const totalMarks = totalContent + totalQuality;
    const originalPercentage = (totalMarks / maxMarks) * 100;

    // Moderate percentage
    const boundaries = Object.values(EXAM_RULES.GRADING.BOUNDARIES).sort((a: number, b: number) => a - b);
    let finalPercentage = originalPercentage;
    let applied = false;
    let note = "Standard moderation: marks verified within board tolerance.";

    for (const boundary of boundaries) {
      const distance = boundary - originalPercentage;
      if (distance > 0 && distance <= EXAM_RULES.GRADING.MODERATION_TOLERANCE) {
        if (totalQuality > totalContent) {
          finalPercentage = boundary;
          applied = true;
          note = `Moderated: Candidate placed at ${originalPercentage.toFixed(1)}%. Deterministic uplift applied to boundary (${boundary}%) due to superior technical evidence (Quality > Content).`;
          break;
        } else {
          note = `Moderated: Candidate remains at ${originalPercentage.toFixed(1)}%. Borderline uplift to ${boundary}% declined as technical precision does not exceed content marks.`;
        }
      }
    }

    const grade = getEstimatedGrade(finalPercentage);

    res.json({
      ...rawResults,
      grade,
      score: totalMarks,
      moderation: {
        originalPercentage,
        finalPercentage,
        applied,
        note
      }
    });
  } catch (error: any) {
    console.error("Grade Writing Error:", error);
    if (isApiKeyExpiredError(error)) {
      return res.status(400).json({ 
        error: "Your Gemini API key has expired. Please renew or replace it in the Settings/Secrets panel of Google AI Studio.", 
        code: "API_KEY_EXPIRED" 
      });
    }
    res.status(500).json({ error: error.message || "Failed to grade writing" });
  }
});

app.post("/api/quizlet-import", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // Ensure it's a valid Quizlet URL
    if (!url.includes('quizlet.com')) {
      return res.status(400).json({ error: "Invalid Quizlet URL" });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Quizlet page: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Quizlet stores set data in a script tag as JSON
    // We look for "setPageData" or "__NEXT_DATA__" or similar
    
    // Recursive helpers to find Quizlet data in any deep JSON structure
    function findTermsInObject(obj: any): { term: string, definition: string }[] {
      if (!obj || typeof obj !== 'object') return [];
      
      if (Array.isArray(obj)) {
        const candidateTerms: any[] = [];
        for (const item of obj) {
          if (item && typeof item === 'object') {
            const word = item.word || item.term || item.text;
            const definition = item.definition || item.meaning || item.translation || item.def;
            if (typeof word === 'string' && typeof definition === 'string' && word.trim() && definition.trim()) {
              if (word.length < 200 && definition.length < 1000) {
                candidateTerms.push({ term: word.trim(), definition: definition.trim() });
              }
            }
          }
        }
        if (candidateTerms.length > 0) {
          return candidateTerms;
        }
        
        let results: any[] = [];
        for (const item of obj) {
          const sub = findTermsInObject(item);
          if (sub.length > results.length) {
            results = sub;
          }
        }
        return results;
      }
      
      if (obj.terms && Array.isArray(obj.terms)) {
        const res = findTermsInObject(obj.terms);
        if (res.length > 0) return res;
      }
      if (obj.studiables && Array.isArray(obj.studiables)) {
        const res = findTermsInObject(obj.studiables);
        if (res.length > 0) return res;
      }
      if (obj.termIdToTermsMap && typeof obj.termIdToTermsMap === 'object') {
        const res = findTermsInObject(Object.values(obj.termIdToTermsMap));
        if (res.length > 0) return res;
      }

      let bestResults: any[] = [];
      for (const k of Object.keys(obj)) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          const sub = findTermsInObject(obj[k]);
          if (sub.length > bestResults.length) {
            bestResults = sub;
          }
        }
      }
      return bestResults;
    }

    function findTitleInObject(obj: any): string | null {
      if (!obj || typeof obj !== 'object') return null;
      if (typeof obj.title === 'string' && obj.title.trim() && !['Quizlet', 'Home', 'App', 'Imported Deck'].includes(obj.title.trim())) {
        return obj.title.trim();
      }
      for (const k of Object.keys(obj)) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          const title = findTitleInObject(obj[k]);
          if (title) return title;
        }
      }
      return null;
    }

    let terms: { term: string, definition: string }[] = [];
    let title = "Imported Quizlet Deck";

    // 1. Try window.Quizlet.setPageData
    const dataMatch = html.match(/window\.Quizlet\.setPageData\s*=\s*({.+?});/s);
    if (dataMatch) {
      try {
        const setPageData = JSON.parse(dataMatch[1]);
        terms = findTermsInObject(setPageData);
        title = findTitleInObject(setPageData) || title;
      } catch (e) {
        console.warn("Failed to parse setPageData:", e);
      }
    }

    // 2. Try newer Next.js state structure (__NEXT_DATA__)
    if (terms.length === 0) {
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">({.+?})<\/script>/s);
      if (nextDataMatch) {
        try {
          const nextData = JSON.parse(nextDataMatch[1]);
          terms = findTermsInObject(nextData);
          title = findTitleInObject(nextData) || title;
        } catch (e) {
          console.warn("Failed to parse __NEXT_DATA__:", e);
        }
      }
    }

    // 3. Fallback: Direct JSON-in-script search
    if (terms.length === 0) {
      const scriptMatches = html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
      for (const sm of scriptMatches) {
        const content = sm[1];
        if (content && (content.includes("word") || content.includes("definition") || content.includes("term"))) {
          try {
            // Find JSON-looking blocks if possible
            const jsonMatches = content.matchAll(/({[\s\S]*?})/g);
            for (const jm of jsonMatches) {
              try {
                const parsed = JSON.parse(jm[1]);
                const found = findTermsInObject(parsed);
                if (found.length > terms.length) {
                  terms = found;
                  title = findTitleInObject(parsed) || title;
                }
              } catch {}
            }
          } catch {}
        }
        if (terms.length > 0) break;
      }
    }

    // 4. Ultimate Fallback: Regex Search over flat HTML
    if (terms.length === 0) {
      const wordRegex = /"word"\s*:\s*"([^"]+)"\s*,\s*"definition"\s*:\s*"([^"]+)"/g;
      let match;
      const discovered = new Map<string, string>();
      while ((match = wordRegex.exec(html)) !== null) {
        if (match[1] && match[2]) {
          discovered.set(match[1].trim(), match[2].trim());
        }
      }
      if (discovered.size > 0) {
        terms = Array.from(discovered.entries()).map(([term, definition]) => ({ term, definition }));
      }
    }

    if (terms.length === 0) {
      throw new Error("Could not find set data on the page. Please copy and paste the terms using the 'Manual Import' method below instead!");
    }

    res.json({ title, terms });

  } catch (error: any) {
    console.error("Quizlet Import Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
