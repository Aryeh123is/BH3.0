export async function onRequest(context) {
  const stripe = require("stripe")(context.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: "price_1TOPUOL0boOruOWZZRwkOQgf",
        quantity: 1,
      },
    ],
    success_url: "https://bhkeywords.pages.dev/success",
    cancel_url: "https://bhkeywords.pages.dev/",
  });

  return Response.json({ url: session.url });
}
