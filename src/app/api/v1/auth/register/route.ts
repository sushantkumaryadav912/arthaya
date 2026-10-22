import { type NextRequest, NextResponse } from "next/server";
import { signJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body ?? {};

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

    const normalizedEmail = email.trim().toLowerCase();
    const displayName =
      (typeof name === "string" && name.trim()) ||
      normalizedEmail.split("@")[0].replace(/[._]/g, " ");

    const userId = `usr_${Buffer.from(normalizedEmail).toString("hex").slice(0, 10)}`;

    const token = await signJwt({
      sub: userId,
      email: normalizedEmail,
      name: displayName,
      role: "analyst",
    });

    const user = {
      id: userId,
      email: normalizedEmail,
      name: displayName,
      role: "analyst",
    };

    const response = NextResponse.json({
      success: true,
      token,
      user,
      message: "Account registered and authenticated.",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to register account." },
      { status: 500 },
    );
  }
}
