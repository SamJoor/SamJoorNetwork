import { NextResponse } from "next/server";

const PASSWORD = process.env.SITE_PASSWORD || "";
const COOKIE = process.env.SITE_AUTH_COOKIE || "sj_auth";

// POST { password }
export async function POST(req: Request) {
  if (!PASSWORD) {
    // gate disabled → auto-allow
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, "ok", { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  }

  const { password } = await req.json().catch(() => ({}));
  if (!password || password !== PASSWORD) {
    return NextResponse.json({ message: "Wrong password, plz no hack" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // secure: true, // enable on production https
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
