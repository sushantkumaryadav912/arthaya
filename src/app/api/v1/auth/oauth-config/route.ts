import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.API_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://arthaya-backend-1xdm.onrender.com";

const FALLBACK_CONFIG = {
  firebase: {
    projectId: "miora-67ffd",
    authDomain: "miora-67ffd.firebaseapp.com",
    storageBucket: "miora-67ffd.firebasestorage.app",
  },
  google: {
    webClientId:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "709981652871-ooh40oomj1outfprsq4vcrh3333omv6v.apps.googleusercontent.com",
    androidClientId:
      "709981652871-sg8q2sohfnbrjteiuajj1vv1t6cqucqd.apps.googleusercontent.com",
  },
  github: {
    clientId:
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "Ov23liNxGegvzY9xfUsA",
    authorizeUrl:
      "https://github.com/login/oauth/authorize?client_id=Ov23liNxGegvzY9xfUsA&scope=user:email",
  },
};

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/oauth-config`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.warn("Could not fetch oauth-config from backend, using default config:", err);
  }

  return NextResponse.json(FALLBACK_CONFIG);
}
