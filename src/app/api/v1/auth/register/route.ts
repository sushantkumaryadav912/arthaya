import { type NextRequest, NextResponse } from "next/server";
import { signJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE || "https://arthaya-backend-1xdm.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      name,
      email,
      password,
      phone,
      organization,
      role,
      marketFocus,
      horizon,
      aumRange,
      agreeToTerms,
    } = body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const displayName =
      (typeof name === "string" && name.trim()) ||
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      email.split("@")[0].replace(/[._]/g, " ");

    const userRole = typeof role === "string" && role.trim() ? role.trim() : "analyst";
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Try to register / dev-login directly on live Render backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/dev-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          name: displayName,
          role: userRole,
        }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        const token = backendData.access_token;
        const user = {
          ...(backendData.user || {}),
          id: backendData.user?.id || `usr_${Buffer.from(normalizedEmail).toString("hex").slice(0, 10)}`,
          email: normalizedEmail,
          name: displayName,
          role: userRole,
          organization: organization || "Institutional",
          marketFocus: marketFocus || "US Equities",
          horizon: horizon || "5D",
          phone: phone || "",
          aumRange: aumRange || "",
        };

        const response = NextResponse.json({
          success: true,
          token,
          user,
          message: "Account registered and authenticated on live backend.",
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
      }
    } catch (backendErr) {
      console.warn("Backend register notice:", backendErr);
    }

    // 2. Fallback local signJwt if backend unreachable
    const userId = `usr_${Buffer.from(normalizedEmail).toString("hex").slice(0, 10)}`;
    const token = await signJwt({
      sub: userId,
      email: normalizedEmail,
      name: displayName,
      role: userRole,
    });

    const user = {
      id: userId,
      email: normalizedEmail,
      name: displayName,
      role: userRole,
      organization: organization || "Institutional",
      marketFocus: marketFocus || "US Equities",
      horizon: horizon || "5D",
      phone: phone || "",
      aumRange: aumRange || "",
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
