import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // For MVP: no provider call here. In production, forward to Mailchimp/ConvertKit or Supabase+SendGrid.
    console.log("email-subscribe", body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


