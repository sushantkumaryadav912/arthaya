import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL ||
  process.env.API_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://arthaya-backend-1xdm.onrender.com";

const demoMode =
  process.env.DEMO_MODE ||
  process.env.NEXT_PUBLIC_DEMO_MODE ||
  "false";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE: backendUrl,
    NEXT_PUBLIC_BACKEND_URL: backendUrl,
    NEXT_PUBLIC_DEMO_MODE: demoMode,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
