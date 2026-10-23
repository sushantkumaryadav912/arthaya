import { isDemoSessionAsync } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { DataSourceInfo } from "@/lib/types";
import { buildDataSources } from "@/lib/mock/datasources";

export async function getDataSources(): Promise<{ group: string; sources: DataSourceInfo[] }[]> {
  const fallback = buildDataSources();
  if (await isDemoSessionAsync()) return fallback;

  try {
    const raw = await apiGet<{ data?: any[] } | any[]>("/data-sources");
    const list = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.data) ? raw.data : null);
    if (list && list.length > 0) {
      return [
        {
          group: "Live Quantitative & Agentic Data Infrastructure",
          sources: list.map((s) => ({
            provider: s.provider,
            dataType: s.dataType,
            status: "connected",
            coverage: s.coverage || "Live Pipeline",
            lastUpdate: "Live Connection",
          })),
        },
      ];
    }
  } catch (err) {
    console.warn("Could not load /data-sources from backend, using active baseline:", err);
  }

  return fallback;
}
