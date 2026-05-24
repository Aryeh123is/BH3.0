import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// STEP: choose plan
const PRICE_MAP = {
  monthly: "price_1Tad1KLIxxy0pqBqqMzKdSaB",
  yearly: "price_1Tad2DLIxxy0pqBqvqG6TTf6",
};

// STEP: create Stripe checkout
app.post("/checkout", async (req, res) => {
  const { plan, userId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],

    line_items: [
      {
        price: PRICE_MAP[plan],
        quantity: 1,
      },
    ],

    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",

    client_reference_id: userId,
  });

  res.json({ url: session.url });
});

app.listen(3000, () => {
  console.log("Server running");
});
