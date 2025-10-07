import { NextResponse } from "next/server";

const COOKIE = process.env.SITE_AUTH_COOKIE || "sj_auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
