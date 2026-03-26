import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  monthly: "price_1TF2NbFWXJE8IJxPZGznfJxa",
  yearly: "price_1TF2QDFWXJE8IJxPHFXcp2rb",
};

export async function POST(request) {
  try {
    const { plan } = await request.json();
    const priceId = plan === "yearly" ? PRICES.yearly : PRICES.monthly;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get("origin")}/?success=true`,
      cancel_url: `${request.headers.get("origin")}/?canceled=true`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
