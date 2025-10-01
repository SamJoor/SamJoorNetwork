import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "418 I'm a teapot ☕  (Nice find!)" },
    { status: 418 }
  );
}
