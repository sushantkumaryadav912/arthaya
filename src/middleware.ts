import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

// List of protected top-level routes
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/markets",
  "/watchlist",
  "/analyze",
  "/predictions",
  "/agents",
  "/compare",
  "/reports",
  "/data-sources",
  "/models",
  "/settings",
  "/stocks",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Expire invalid cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/markets/:path*",
    "/watchlist/:path*",
    "/analyze/:path*",
    "/predictions/:path*",
    "/agents/:path*",
    "/compare/:path*",
    "/reports/:path*",
    "/data-sources/:path*",
    "/models/:path*",
    "/settings/:path*",
    "/stocks/:path*",
  ],
};
