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

export async function GET(request) {
  try {
    const cookie = request.cookies.get("pdfbolt_pro")?.value;
    const customerId = verifyCookie(cookie);

    if (!customerId) {
      return NextResponse.json({ pro: false });
    }

    // Check active subscription with Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      return NextResponse.json({ pro: true });
    }

    // Also check trialing
    const trialing = await stripe.subscriptions.list({
      customer: customerId,
      status: "trialing",
      limit: 1,
    });

    if (trialing.data.length > 0) {
      return NextResponse.json({ pro: true });
    }

    // No active subscription — clear cookie
    const response = NextResponse.json({ pro: false });
    response.cookies.delete("pdfbolt_pro");
    return response;
  } catch (err) {
    return NextResponse.json({ pro: false });
  }
}
