import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Simple local cookie-based progress for now
export async function GET() {
  const cookieStore = cookies();
  const found = cookieStore.get("eggs-found")?.value;
  return NextResponse.json({ found: found ? JSON.parse(found) : [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { found } = body;

  // Save back to cookies (so user’s browser remembers progress)
  cookies().set("eggs-found", JSON.stringify(found), {
    path: "/",
    httpOnly: false, // allow client-side JS to update
  });

  return NextResponse.json({ success: true });
}
