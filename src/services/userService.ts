/** User profile / preferences abstraction (backend-ready). */

export interface UserPreferences {
  defaultHorizon: "1D" | "5D" | "20D";
  defaultChartPeriod: "1D" | "5D" | "1M" | "6M" | "1Y" | "5Y";
  defaultMarket: "US" | "IN";
  theme: "dark" | "light";
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultHorizon: "5D",
  defaultChartPeriod: "6M",
  defaultMarket: "US",
  theme: "dark",
};

const STORAGE_KEY = "arthaya:preferences";

export const userService = {
  getPreferences(): UserPreferences {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },
  savePreferences(prefs: Partial<UserPreferences>) {
    if (typeof window === "undefined") return;
    const next = { ...this.getPreferences(), ...prefs };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  },
};
