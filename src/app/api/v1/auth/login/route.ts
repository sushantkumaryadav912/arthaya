import { type NextRequest, NextResponse } from "next/server";
import { signJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string" || password.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters." },
        { status: 400 },
      );
    }

    // Standard demo analyst identity
    const normalizedEmail = email.trim().toLowerCase();
    const name =
      normalizedEmail.startsWith("analyst")
        ? "Lead Quantitative Analyst"
        : normalizedEmail.split("@")[0].replace(/[._]/g, " ");

    const userId = `usr_${Buffer.from(normalizedEmail).toString("hex").slice(0, 10)}`;

    const token = await signJwt({
      sub: userId,
      email: normalizedEmail,
      name,
      role: "analyst",
    });

    const user = {
      id: userId,
      email: normalizedEmail,
      name,
      role: "analyst",
    };

    const response = NextResponse.json({
      success: true,
      token,
      user,
      message: "Authentication successful.",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: false, // Allow client JS access while also being available to HTTP requests
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sign in." },
      { status: 500 },
    );
  }
}
