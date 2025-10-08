// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = process.env.SITE_AUTH_COOKIE || "sj_auth";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // public routes & assets
  if (
    pathname.startsWith("/enter") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|txt|xml|json)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const authed = req.cookies.get(COOKIE)?.value === "ok";

  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/enter";
    // preserve the original target so we can return there
    url.searchParams.set("redirect", pathname + (searchParams.toString() ? `?${searchParams}` : ""));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // run middleware on all paths (assets are short-circuited above)
  matcher: ["/:path*"],
};
