import { type NextRequest, NextResponse } from "next/server";
import { signJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "https://arthaya-backend-1xdm.onrender.com";

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
        { error: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    const displayName =
      (typeof name === "string" && name.trim()) ||
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      email.split("@")[0].replace(/[._]/g, " ");

    const userRole = typeof role === "string" && role.trim() ? role.trim() : "Quantitative Analyst";
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Register user on live Render backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          name: displayName,
          role: userRole,
          organization: organization || "Institutional",
        }),
      });

      if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.detail || errorData.error || "Registration failed on backend." },
          { status: backendRes.status || 400 },
        );
      }

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
        isDemo: false,
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

      response.cookies.set({
        name: "arthaya_demo",
        value: "false",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 3600,
      });

      return response;
    } catch (backendErr) {
      console.warn("Backend register notice:", backendErr);
      return NextResponse.json(
        { error: "Backend service temporarily unavailable. Please try again in a few moments." },
        { status: 503 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to register account." },
      { status: 500 },
    );
  }
}
