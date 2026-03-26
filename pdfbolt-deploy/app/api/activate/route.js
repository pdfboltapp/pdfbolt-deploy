import Stripe from "stripe";
import { NextResponse } from "next/server";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SECRET = process.env.STRIPE_SECRET_KEY;

function signCookie(customerId) {
  const sig = crypto.createHmac("sha256", SECRET).update(customerId).digest("hex").slice(0, 16);
  return `${customerId}.${sig}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const customerId = session.customer;
    const cookieValue = signCookie(customerId);

    const response = NextResponse.json({ success: true, pro: true });
    response.cookies.set("pdfbolt_pro", cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 400, // ~13 months
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
