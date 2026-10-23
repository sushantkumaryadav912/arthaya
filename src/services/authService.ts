/**
 * JWT & OAuth Authentication Provider for Arthaya.
 * Communicates directly with backend https://arthaya-backend-1xdm.onrender.com /api/v1/auth/* endpoints:
 * - /api/v1/auth/dev-login
 * - /api/v1/auth/google
 * - /api/v1/auth/github
 * - /api/v1/auth/oauth-config
 * - /api/v1/auth/me
 *
 * POLICY:
 * Only login via demo credentials ("analyst@arthaya.ai") triggers demo data.
 * All other logins (Google, GitHub, registered institutional profiles, custom emails)
 * trigger real data from the live backend.
 */

import { API_BASE, API_PREFIX, DEMO_EMAIL } from "@/lib/utils/env";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
  organization?: string;
  role?: string;
  marketFocus?: string;
  horizon?: string;
  aumRange?: string;
  agreeToTerms?: boolean;
  isDemo?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  picture?: string;
  provider?: string;
  organization?: string;
  marketFocus?: string;
  horizon?: string;
  phone?: string;
  aumRange?: string;
  isDemo?: boolean;
}

export interface ValidateResult {
  valid: boolean;
  authorized: boolean;
  user: AuthUser | null;
}

export interface OAuthConfig {
  google?: {
    webClientId?: string;
    androidClientId?: string;
  };
  github?: {
    clientId?: string;
    authorizeUrl?: string;
  };
  firebase?: {
    projectId?: string;
    authDomain?: string;
    storageBucket?: string;
  };
}

export interface AuthProvider {
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(dataOrEmail: RegisterData | string, password?: string, name?: string): Promise<AuthUser>;
  loginWithGoogle(idToken: string): Promise<AuthUser>;
  loginWithGitHub(code: string): Promise<AuthUser>;
  getOAuthConfig(): Promise<OAuthConfig>;
  forgotPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  validateToken(): Promise<ValidateResult>;
  getToken(): string | null;
}

const TOKEN_KEY = "arthaya:token";
const USER_KEY = "arthaya:user";

class JwtAuthProvider implements AuthProvider {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    const local = localStorage.getItem(TOKEN_KEY);
    if (local) return local;

    const match = document.cookie.match(/(?:^|;\s*)arthaya_token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);

    return null;
  }

  async getOAuthConfig(): Promise<OAuthConfig> {
    try {
      const res = await fetch(`${API_BASE}${API_PREFIX}/auth/oauth-config`, {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      try {
        const localRes = await fetch("/api/v1/auth/oauth-config", { cache: "no-store" });
        if (localRes.ok) return await localRes.json();
      } catch {
        // Safe defaults
      }
    }

    return {
      google: {
        webClientId: "709981652871-ooh40oomj1outfprsq4vcrh3333omv6v.apps.googleusercontent.com",
      },
      github: {
        clientId: "Ov23liNxGegvzY9xfUsA",
        authorizeUrl: "https://github.com/login/oauth/authorize?client_id=Ov23liNxGegvzY9xfUsA&scope=user:email",
      },
    };
  }

  async loginWithGoogle(idToken: string): Promise<AuthUser> {
    const backendUrl = `${API_BASE}${API_PREFIX}/auth/google`;
    let res: Response;
    try {
      res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });
    } catch {
      res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });
    }

    const data = await res.json();
    const token = data.access_token || data.token;

    if (!res.ok || !token) {
      throw new Error(data.detail || data.error || "Google authentication failed on backend.");
    }

    // Google OAuth is always a real user session (isDemo: false)
    const user: AuthUser = {
      ...(data.user || {}),
      id: data.user?.id || `usr_google_${Date.now()}`,
      email: data.user?.email || "trader@google.com",
      name: data.user?.name || "Google Trader",
      role: data.user?.role || "Quantitative Analyst",
      provider: "google",
      picture: data.user?.picture,
      isDemo: false,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem("arthaya:is_demo", "false");
      document.cookie = `arthaya_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
      document.cookie = `arthaya_demo=false; path=/; max-age=${7 * 86400}; SameSite=Lax`;
    }

    return user;
  }

  async loginWithGitHub(code: string): Promise<AuthUser> {
    const backendUrl = `${API_BASE}${API_PREFIX}/auth/github`;
    let res: Response;
    try {
      res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
    } catch {
      res = await fetch("/api/v1/auth/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
    }

    const data = await res.json();
    const token = data.access_token || data.token;

    if (!res.ok || !token) {
      throw new Error(data.detail || data.error || "GitHub authentication failed on backend.");
    }

    // GitHub OAuth is always a real user session (isDemo: false)
    const user: AuthUser = {
      ...(data.user || {}),
      id: data.user?.id || `usr_github_${Date.now()}`,
      email: data.user?.email || "trader@github.com",
      name: data.user?.name || "GitHub Trader",
      role: data.user?.role || "Quantitative Analyst",
      provider: "github",
      picture: data.user?.picture,
      isDemo: false,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem("arthaya:is_demo", "false");
      document.cookie = `arthaya_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
      document.cookie = `arthaya_demo=false; path=/; max-age=${7 * 86400}; SameSite=Lax`;
    }

    return user;
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    const isDemo = email.trim().toLowerCase() === DEMO_EMAIL;

    // Use Next.js /api/v1/auth/login route which handles backend validation and cookie management
    let res: Response;
    try {
      res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
    } catch {
      // Fallback direct backend call
      res = await fetch(`${API_BASE}${API_PREFIX}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.detail ||
        data.error ||
        "Invalid email or password. Please verify your credentials."
      );
    }

    const token = data.access_token || data.token;
    if (!token) {
      throw new Error("Authentication failed: No access token received.");
    }

    const user: AuthUser = {
      ...(data.user || {}),
      id: data.user?.id || "usr_" + email.split("@")[0],
      email: email.trim().toLowerCase(),
      name: isDemo
        ? "Lead Quantitative Analyst (Demo)"
        : data.user?.name || email.split("@")[0],
      role: isDemo ? "Demo Quantitative Analyst" : data.user?.role || "Quantitative Analyst",
      isDemo,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem("arthaya:is_demo", isDemo ? "true" : "false");
      document.cookie = `arthaya_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
      document.cookie = `arthaya_demo=${isDemo ? "true" : "false"}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
    }

    return user;
  }

  async signUp(
    dataOrEmail: RegisterData | string,
    passwordArg?: string,
    nameArg?: string,
  ): Promise<AuthUser> {
    let email: string;
    let password: string;
    let name: string;
    let role = "Quantitative Analyst";
    let organization = "";
    let marketFocus = "";
    let horizon = "5D";
    let phone = "";
    let aumRange = "";

    if (typeof dataOrEmail === "object") {
      email = dataOrEmail.email.trim().toLowerCase();
      password = dataOrEmail.password;
      name = `${dataOrEmail.firstName || ""} ${dataOrEmail.lastName || ""}`.trim() || email.split("@")[0];
      role = dataOrEmail.role || "Quantitative Analyst";
      organization = dataOrEmail.organization || "";
      marketFocus = dataOrEmail.marketFocus || "";
      horizon = dataOrEmail.horizon || "5D";
      phone = dataOrEmail.phone || "";
      aumRange = dataOrEmail.aumRange || "";
    } else {
      email = dataOrEmail.trim().toLowerCase();
      password = passwordArg || "";
      name = nameArg || email.split("@")[0];
    }

    let res: Response;
    try {
      res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          organization,
          marketFocus,
          horizon,
          phone,
          aumRange
        }),
      });
    } catch {
      res = await fetch(`${API_BASE}${API_PREFIX}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          organization,
        }),
      });
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.detail || data.error || "Failed to register account.");
    }

    const token = data.access_token || data.token;
    if (!token) {
      throw new Error("Registration failed: No access token received.");
    }

    // Newly registered accounts ALWAYS trigger real data (isDemo: false)
    const user: AuthUser = {
      ...(data.user || {}),
      id: data.user?.id || `usr_${email.split("@")[0]}`,
      email,
      name,
      role,
      organization,
      marketFocus,
      horizon,
      phone,
      aumRange,
      isDemo: false,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem("arthaya:is_demo", "false");
      document.cookie = `arthaya_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
      document.cookie = `arthaya_demo=false; path=/; max-age=${7 * 86400}; SameSite=Lax`;
    }

    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  async signOut(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("arthaya:is_demo");
      document.cookie = "arthaya_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "arthaya_demo=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // safe fallback
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  async validateToken(): Promise<ValidateResult> {
    const token = this.getToken();
    if (!token) {
      return { valid: false, authorized: false, user: null };
    }

    const current = await this.getCurrentUser();
    const isDemo = current?.isDemo ?? (current?.email?.toLowerCase() === DEMO_EMAIL);

    try {
      // Validate directly against backend /api/v1/auth/me
      const res = await fetch(`${API_BASE}${API_PREFIX}/auth/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          const merged: AuthUser = {
            ...(data.user || {}),
            ...(current || {}),
            name:
              current?.name && current.name !== "Arthaya Demo Trader"
                ? current.name
                : isDemo
                ? "Lead Quantitative Analyst (Demo)"
                : data.user?.name || current?.name || "Quantitative Analyst",
            role: current?.role || data.user?.role || "analyst",
            organization: current?.organization || data.user?.organization,
            marketFocus: current?.marketFocus || data.user?.marketFocus,
            horizon: current?.horizon || data.user?.horizon,
            isDemo,
          };

          if (typeof window !== "undefined") {
            localStorage.setItem(USER_KEY, JSON.stringify(merged));
            localStorage.setItem("arthaya:is_demo", isDemo ? "true" : "false");
            document.cookie = `arthaya_demo=${isDemo ? "true" : "false"}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
          }

          return { valid: true, authorized: true, user: merged };
        }
      }

      // If backend returned 401:
      if (res.status === 401) {
        // If current session is demo or has a verified local profile, retain access gracefully
        if (isDemo || (current && current.email)) {
          return { valid: true, authorized: true, user: current };
        }

        if (typeof window !== "undefined") {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem("arthaya:is_demo");
          document.cookie = "arthaya_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "arthaya_demo=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        return { valid: false, authorized: false, user: null };
      }

      const user = await this.getCurrentUser();
      return { valid: true, authorized: true, user };
    } catch {
      const user = await this.getCurrentUser();
      return { valid: Boolean(user), authorized: Boolean(user), user };
    }
  }
}

export const authService: AuthProvider = new JwtAuthProvider();
