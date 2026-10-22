import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.API_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://arthaya-backend-1xdm.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_token } = body ?? {};

    if (!id_token || typeof id_token !== "string") {
      return NextResponse.json(
        { error: "A valid Google ID token is required." },
        { status: 400 },
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || "Google authentication failed on backend." },
        { status: backendRes.status },
      );
    }

    const token = data.access_token || data.token;
    const user = {
      ...(data.user || {}),
      isDemo: false,
    };

    const response = NextResponse.json({
      success: true,
      token,
      user,
      message: "Google authentication successful via backend.",
    });

    if (token) {
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 3600,
      });

      response.cookies.set({
        name: "arthaya_demo",
        value: "false",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 3600,
      });
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to verify Google OAuth." },
      { status: 500 },
    );
  }
}
