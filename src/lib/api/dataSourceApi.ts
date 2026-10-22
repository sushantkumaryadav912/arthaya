import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { DataSourceInfo } from "@/lib/types";
import { buildDataSources } from "@/lib/mock/datasources";

export async function getDataSources(): Promise<{ group: string; sources: DataSourceInfo[] }[]> {
  const fallback = buildDataSources();
  if (DEMO_MODE) return fallback;

  try {
    const raw = await apiGet<any[]>("/data-sources");
    if (Array.isArray(raw) && raw.length > 0) {
      return [
        {
          group: "Active Backend Data Sources (Live Pipeline)",
          sources: raw.map((s) => ({
            provider: s.provider,
            dataType: s.dataType,
            status: s.status === "connected" ? "configured" : (s.status || "not-configured"),
            coverage: s.coverage || "Live Pipeline",
            lastUpdate: "Live Connection",
          })),
        },
      ];
    }
  } catch (err) {
    console.warn("Could not load /data-sources from backend:", err);
  }

  return fallback;
}
