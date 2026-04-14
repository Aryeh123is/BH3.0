import Stripe from 'stripe';

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe is not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });

    const url = new URL(request.url);
    const domainURL = `${url.protocol}//${url.host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      client_reference_id: userId,
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Premium Lifetime Access',
              description: 'Unlimited Flashcards, Streak Freezes, Advanced Analytics, and Custom Decks.',
            },
            unit_amount: 250, // £2.50
          },
          quantity: 1,
        },
      ],
      success_url: `${domainURL}/?session_id={CHECKOUT_SESSION_ID}&premium=success`,
      cancel_url: `${domainURL}/?premium=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
