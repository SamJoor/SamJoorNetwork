import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.SITE_PASSWORD || "";
const COOKIE = process.env.SITE_AUTH_COOKIE || "sj_auth";

// Paths that never require auth
const PUBLIC_PATHS = [
  "/enter",
  "/api/auth",
  "/api/logout",
  "/api/coffee",     
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/_next")) return true;              // Next internals
  if (pathname.startsWith("/assets") || pathname.startsWith("/public")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  // Gate off unless a password is configured
  if (!PASSWORD) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (isPublicPath(pathname)) return NextResponse.next();

  const authed = req.cookies.get(COOKIE)?.value === "ok";
  if (authed) return NextResponse.next();

  // Not authed → redirect to /enter and remember where they were going
  const url = req.nextUrl.clone();
  url.pathname = "/enter";
  url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // broad, assets excluded above
  ],
};
