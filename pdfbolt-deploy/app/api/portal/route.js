import Stripe from "stripe";
import { NextResponse } from "next/server";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SECRET = process.env.STRIPE_SECRET_KEY;

function verifyCookie(value) {
  if (!value || !value.includes(".")) return null;
  const [customerId, sig] = value.split(".");
  const expected = crypto.createHmac("sha256", SECRET).update(customerId).digest("hex").slice(0, 16);
  if (sig !== expected) return null;
  return customerId;
}

export async function POST(request) {
  try {
    const cookie = request.cookies.get("pdfbolt_pro")?.value;
    const customerId = verifyCookie(cookie);

    if (!customerId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const origin = request.headers.get("origin");

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
