// app/api/auth/route.ts
import { NextResponse } from "next/server";

const COOKIE = process.env.SITE_AUTH_COOKIE || "sj_auth";
const PASS   = process.env.SITE_PASSWORD || ""; // configure on Vercel

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({} as { password?: string }));

  // If no password configured, effectively disable the gate (dev convenience)
  const ok = PASS ? password === PASS : true;

  if (ok) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, "ok", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return res;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
