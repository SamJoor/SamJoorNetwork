import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { rateLimit, readJson } from "@/lib/server/apiGuards";

export async function GET() {
  const cookieStore = await cookies();
  const found = cookieStore.get("eggs-found")?.value;
  if (!found) return NextResponse.json({ found: [] });

  try {
    const parsed = JSON.parse(found);
    return NextResponse.json({ found: Array.isArray(parsed) ? parsed.slice(0, 20) : [] });
  } catch {
    return NextResponse.json({ found: [] });
  }
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "eggs-progress", 40, 60_000);
  if (limited) return limited;

  const body = await readJson<{ found?: unknown }>(req, 2_048);
  const found = Array.isArray(body?.found)
    ? body.found.filter((item): item is string => typeof item === "string" && item.length <= 40).slice(0, 20)
    : [];

  const cookieStore = await cookies();
  cookieStore.set("eggs-found", JSON.stringify(found), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 180,
  });

  return NextResponse.json({ success: true });
}
