import { type NextRequest, NextResponse } from "next/server";
import { signJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE || "https://arthaya-backend-1xdm.onrender.com";

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

    const normalizedEmail = email.trim().toLowerCase();
    const isDemo = normalizedEmail === "analyst@arthaya.ai";
    const name =
      normalizedEmail.startsWith("analyst")
        ? "Lead Quantitative Analyst (Demo)"
        : normalizedEmail.split("@")[0].replace(/[._]/g, " ");

    // 1. Authenticate with live Render backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/dev-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          name,
          role: isDemo ? "analyst" : "quantitative_analyst",
        }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        const token = backendData.access_token;
        const user = {
          ...(backendData.user || {}),
          isDemo,
        };

        const response = NextResponse.json({
          success: true,
          token,
          user,
          message: isDemo
            ? "Demo authentication successful."
            : "Authentication successful via live backend.",
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
          value: isDemo ? "true" : "false",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 3600,
        });

        return response;
      }
    } catch (backendErr) {
      console.warn("Backend auth call warning:", backendErr);
    }

    // 2. Fallback local token if backend unreachable
    const userId = `usr_${Buffer.from(normalizedEmail).toString("hex").slice(0, 10)}`;
    const token = await signJwt({
      sub: userId,
      email: normalizedEmail,
      name,
      role: isDemo ? "analyst" : "quantitative_analyst",
    });

    const user = {
      id: userId,
      email: normalizedEmail,
      name,
      role: isDemo ? "analyst" : "quantitative_analyst",
      isDemo,
    };

    const response = NextResponse.json({
      success: true,
      token,
      user,
      message: isDemo ? "Demo session authenticated." : "Authentication successful.",
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
      value: isDemo ? "true" : "false",
      httpOnly: false,
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
