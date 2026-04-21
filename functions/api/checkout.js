import Stripe from "stripe";

export async function onRequest(context) {
  const stripe = new Stripe(context.env.STRIPE_SECRET_KEY);

  const { plan } = await context.request.json();

  let priceId;

  if (plan === "monthly") {
    priceId = "price_1TOfy2L0boOruOWZgWbfqdDP";
  } 
  else if (plan === "yearly") {
    priceId = "price_1TOfycL0boOruOWZQcPk16hi";
  } 
  else {
    return new Response("Invalid plan", { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: "https://bhkeywords.pages.dev/success",
    cancel_url: "https://bhkeywords.pages.dev/",
  });

  return Response.json({ url: session.url });
}
