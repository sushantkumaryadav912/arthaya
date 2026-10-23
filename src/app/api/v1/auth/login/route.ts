import { type NextRequest, NextResponse } from "next/server";
import { signJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "https://arthaya-backend-1xdm.onrender.com";

const DEMO_EMAIL = "analyst@arthaya.ai";
const DEMO_PASSWORD = "password123";

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
    const isDemo = normalizedEmail === DEMO_EMAIL;

    // 1. Strict demo credentials check
    if (isDemo) {
      if (password !== DEMO_PASSWORD) {
        return NextResponse.json(
          { error: "Invalid credentials. For demo access use analyst@arthaya.ai and password123" },
          { status: 401 },
        );
      }

      // Valid demo credentials: issue demo session
      const userId = "usr_analyst_demo";
      const name = "Lead Quantitative Analyst (Demo)";
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
        role: "Demo Quantitative Analyst",
        isDemo: true,
      };

      const response = NextResponse.json({
        success: true,
        token,
        user,
        message: "Demo authentication successful.",
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
        value: "true",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 3600,
      });

      return response;
    }

    // 2. Authenticate real users with backend /api/v1/auth/login
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => ({}));
        const rawMsg = errorData.detail || errorData.error;
        const msg =
          rawMsg && rawMsg !== "Not Found"
            ? rawMsg
            : "Invalid email or password. Please verify your credentials or register for an account.";
        return NextResponse.json(
          { error: msg },
          { status: backendRes.status === 400 ? 400 : 401 },
        );
      }

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
    } catch (backendErr) {
      console.warn("Backend auth call warning:", backendErr);
    }

    // For any other email/password, reject if backend could not verify
    return NextResponse.json(
      { error: "Invalid email or password. Please verify your credentials or register for an account." },
      { status: 401 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sign in." },
      { status: 500 },
    );
  }
}
