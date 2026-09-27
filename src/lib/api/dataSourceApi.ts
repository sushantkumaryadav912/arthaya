import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { DataSourceInfo } from "@/lib/types";
import { buildDataSources } from "@/lib/mock/datasources";

export async function getDataSources(): Promise<{ group: string; sources: DataSourceInfo[] }[]> {
  if (DEMO_MODE) return buildDataSources();
  return apiGet("/data-sources");
}
