import { NextResponse } from "next/server";

const API_KEY = process.env.MAILERLITE_API_KEY;

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: { company: "PDFBolt" },
        groups: [],
        status: "active",
      }),
    });

    const data = await res.json();

    if (res.ok || res.status === 200 || res.status === 201) {
      return NextResponse.json({ success: true });
    }

    // Already subscribed is still a success
    if (data?.message?.includes("already")) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: data?.message || "Failed" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
