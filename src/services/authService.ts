/**
 * JWT Authentication Provider for Arthaya.
 * Communicates with backend https://arthaya-backend-1xdm.onrender.com /api/v1/auth/* endpoints,
 * maintains auth state in cookies and localStorage, and provides token validation.
 */

import { API_BASE, API_PREFIX } from "@/lib/utils/env";

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
}

export interface ValidateResult {
  valid: boolean;
  authorized: boolean;
  user: AuthUser | null;
}

export interface AuthProvider {
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(dataOrEmail: RegisterData | string, password?: string, name?: string): Promise<AuthUser>;
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

  async signIn(email: string, password: string): Promise<AuthUser> {
    // Call live backend dev-login endpoint
    const backendUrl = `${API_BASE}${API_PREFIX}/auth/dev-login`;
    let res: Response;
    try {
      res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "analyst" }),
      });
    } catch {
      // Fallback to local Next.js proxy if direct connection has issues
      res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    }

    const data = await res.json();
    const token = data.access_token || data.token;

    if (!res.ok || !token) {
      throw new Error(data.detail || data.error || "Failed to sign in with backend.");
    }

    const user: AuthUser = data.user || {
      id: "usr_" + email.split("@")[0],
      email,
      name: "Arthaya Quantitative Analyst",
      role: "analyst",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      document.cookie = `arthaya_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
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
    let role = "analyst";
    let organization = "";
    let marketFocus = "";
    let horizon = "5D";
    let phone = "";
    let aumRange = "";

    if (typeof dataOrEmail === "object") {
      email = dataOrEmail.email.trim().toLowerCase();
      password = dataOrEmail.password;
      name = `${dataOrEmail.firstName || ""} ${dataOrEmail.lastName || ""}`.trim() || email.split("@")[0];
      role = dataOrEmail.role || "analyst";
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

    const backendUrl = `${API_BASE}${API_PREFIX}/auth/dev-login`;
    let res: Response;
    try {
      res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role }),
      });
    } catch {
      res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role, organization, marketFocus, horizon, phone, aumRange }),
      });
    }

    const data = await res.json();
    const token = data.access_token || data.token;

    if (!res.ok || !token) {
      throw new Error(data.detail || data.error || "Failed to register account.");
    }

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
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      document.cookie = `arthaya_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
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
      document.cookie = "arthaya_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
          if (typeof window !== "undefined") {
            const current = await this.getCurrentUser();
            localStorage.setItem(
              USER_KEY,
              JSON.stringify({ ...(current || {}), ...data.user }),
            );
          }
          return { valid: true, authorized: true, user: data.user as AuthUser };
        }
      }

      // If backend returned 401, token is invalid
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
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
