import { type NextRequest, NextResponse } from "next/server";
import { signJwt, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "https://arthaya-backend-1xdm.onrender.com";

const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.FIREBASE_API_KEY ||
  "AIzaSyDsF-LjOVyViriY4CL1sAAWJFBgAwtc37E";

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

    // 1. Register user directly in Firebase Auth in real time
    const fbSignUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
    let fbRes: Response;
    try {
      fbRes = await fetch(fbSignUpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          returnSecureToken: true,
        }),
      });
    } catch (networkErr) {
      console.error("Firebase network registration error:", networkErr);
      return NextResponse.json(
        { error: "Registration service temporarily unreachable. Please try again." },
        { status: 503 },
      );
    }

    const fbData = await fbRes.json().catch(() => ({}));

    if (!fbRes.ok || !fbData.idToken) {
      const errCode = fbData?.error?.message || "";
      let errorMsg = "Failed to register account with Firebase.";
      if (errCode.includes("EMAIL_EXISTS")) {
        errorMsg = "An account with this email address already exists. Please sign in.";
      } else if (errCode.includes("WEAK_PASSWORD")) {
        errorMsg = "Password must be at least 6 characters long.";
      } else if (errCode.includes("INVALID_EMAIL")) {
        errorMsg = "Please provide a valid email address.";
      }
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Set display name in Firebase Auth
    const firebaseUid = fbData.localId;
    if (displayName) {
      try {
        const fbUpdateUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`;
        await fetch(fbUpdateUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: fbData.idToken,
            displayName,
            returnSecureToken: true,
          }),
        });
      } catch (upErr) {
        console.warn("Failed to set Firebase displayName:", upErr);
      }
    }

    // 2. Optionally sync profile with backend database
    let appToken: string | null = null;
    let backendUser: any = null;
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

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        appToken = backendData.access_token;
        backendUser = backendData.user;
      }
    } catch (backendErr) {
      console.warn("Backend register sync notice:", backendErr);
    }

    if (!appToken) {
      appToken = await signJwt({
        sub: firebaseUid,
        email: normalizedEmail,
        name: displayName,
        role: userRole,
      });
    }

    const user = {
      ...(backendUser || {}),
      id: firebaseUid,
      email: normalizedEmail,
      name: displayName,
      role: userRole,
      organization: organization || "Institutional",
      marketFocus: marketFocus || "US Equities",
      horizon: horizon || "5D",
      phone: phone || "",
      aumRange: aumRange || "",
      provider: "firebase",
      isDemo: false,
    };

    const response = NextResponse.json({
      success: true,
      token: appToken,
      user,
      message: "Account registered and authenticated in real-time via Firebase.",
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
      { error: err instanceof Error ? err.message : "Failed to register account." },
      { status: 500 },
    );
  }
}
