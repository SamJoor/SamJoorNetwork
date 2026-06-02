import { NextResponse } from "next/server";

type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();

function clientId(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

export function rateLimit(req: Request, scope: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const key = `${scope}:${clientId(req)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)),
        },
      },
    );
  }

  return null;
}

export async function readJson<T = unknown>(req: Request, maxBytes = 16_384): Promise<T | null> {
  const text = await req.text();
  if (text.length > maxBytes) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
}

export function isUuid(value: unknown) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

export function isFen(value: unknown) {
  return typeof value === "string" && value.length <= 120 && value.split(" ").length >= 4;
}

export function isUci(value: unknown) {
  return typeof value === "string" && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(value);
}
