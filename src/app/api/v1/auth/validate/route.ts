import { type NextRequest, NextResponse } from "next/server";
import { verifyJwt, extractToken, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  const token = extractToken(authHeader, cookieToken);

  if (!token) {
    return NextResponse.json(
      {
        valid: false,
        authorized: false,
        error: "Missing JWT authentication token.",
      },
      { status: 401 },
    );
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    return NextResponse.json(
      {
        valid: false,
        authorized: false,
        error: "Invalid or expired JWT token.",
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    valid: true,
    authorized: true,
    user: {
      id: payload.sub,
      email: payload.email,
      name: payload.name || "Quantitative Analyst",
      role: payload.role,
    },
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
  });
}
