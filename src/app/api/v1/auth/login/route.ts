import { type NextRequest, NextResponse } from "next/server";
import { signJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "https://arthaya-backend-1xdm.onrender.com";

const DEMO_EMAIL = "analyst@arthaya.ai";
const DEMO_PASSWORD = "password123";

const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.FIREBASE_API_KEY ||
  "AIzaSyDsF-LjOVyViriY4CL1sAAWJFBgAwtc37E";

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

      // Valid demo credentials: fetch signed token from live backend or fallback to local JWT
      let token: string | null = null;
      let user: any = null;

      try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });
        if (backendRes.ok) {
          const backendData = await backendRes.json();
          token = backendData.access_token || backendData.token;
          user = backendData.user;
        }
      } catch (backendErr) {
        console.warn("Backend demo login notice:", backendErr);
      }

      if (!token) {
        token = await signJwt({
          sub: "usr_analyst_demo",
          email: normalizedEmail,
          name: "Lead Quantitative Analyst (Demo)",
          role: "analyst",
        });
      }

      if (!user) {
        user = {
          id: "usr_analyst_demo",
          email: normalizedEmail,
          name: "Lead Quantitative Analyst (Demo)",
          role: "Demo Quantitative Analyst",
          isDemo: true,
          provider: "demo",
        };
      }

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

    // 2. Validate all other users in REAL TIME
    // First attempt authentication via live backend
    let appToken: string | null = null;
    let backendUser: any = null;

    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        appToken = backendData.access_token || backendData.token;
        backendUser = backendData.user;
      } else if (backendRes.status === 401) {
        const errData = await backendRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: errData.detail || "Invalid email or password. Please verify your credentials or register for an account." },
          { status: 401 },
        );
      }
    } catch (backendErr) {
      console.warn("Backend live login sync error (falling back to direct Firebase REST):", backendErr);
    }

    // Fallback: If backend is sleeping/offline, validate directly against Firebase Auth REST API
    if (!appToken) {
      const fbUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
      let fbRes: Response;
      try {
        fbRes = await fetch(fbUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
            returnSecureToken: true,
          }),
        });
      } catch (networkErr) {
        console.error("Firebase network validation error:", networkErr);
        return NextResponse.json(
          { error: "Authentication service temporarily unreachable. Please try again." },
          { status: 503 },
        );
      }

      const fbData = await fbRes.json().catch(() => ({}));

      // If Firebase Auth rejects credentials, fail immediately with 401
      if (!fbRes.ok || !fbData.idToken) {
        const errCode = fbData?.error?.message || "";
        let userFriendlyMessage = "Invalid email or password. Please verify your credentials or register for an account.";
        if (errCode.includes("USER_DISABLED")) {
          userFriendlyMessage = "This user account has been disabled. Please contact support.";
        } else if (errCode.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
          userFriendlyMessage = "Access temporarily blocked due to too many failed attempts. Please try again later.";
        }

        return NextResponse.json(
          { error: userFriendlyMessage },
          { status: 401 },
        );
      }

      const firebaseUid = fbData.localId;
      const displayName = fbData.displayName || normalizedEmail.split("@")[0].replace(/[._]/g, " ");

      appToken = await signJwt({
        sub: firebaseUid,
        email: normalizedEmail,
        name: displayName,
        role: "user",
      });

      backendUser = {
        id: firebaseUid,
        email: normalizedEmail,
        name: displayName,
        role: "Quantitative Analyst",
        provider: "firebase",
        isDemo: false,
      };
    }

    const user = {
      ...(backendUser || {}),
      id: backendUser?.id || "usr_" + normalizedEmail.split("@")[0],
      email: normalizedEmail,
      name: backendUser?.name || normalizedEmail.split("@")[0],
      role: backendUser?.role || "Quantitative Analyst",
      provider: "firebase",
      isDemo: false,
    };

    const response = NextResponse.json({
      success: true,
      token: appToken,
      user,
      message: "Authentication successful via real-time Firebase validation.",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: appToken,
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
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sign in." },
      { status: 500 },
    );
  }
}
