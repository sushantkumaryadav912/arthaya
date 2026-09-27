import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Bot,
  Database,
  Eye,
  FileText,
  GitCompare,
  Gauge,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

/** Sidebar navigation (project.md §3). */
export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Markets", href: "/markets", icon: TrendingUp },
      { label: "Watchlist", href: "/watchlist", icon: Eye },
      { label: "Analyze", href: "/analyze", icon: Sparkles },
      { label: "Predictions", href: "/predictions", icon: LineChart },
      { label: "Agent Intelligence", href: "/agents", icon: Bot },
      { label: "Research", href: "/compare", icon: GitCompare },
      { label: "Reports", href: "/reports", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Data Sources", href: "/data-sources", icon: Database },
      { label: "Model Performance", href: "/models", icon: Gauge },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/markets": "Markets",
  "/watchlist": "Watchlist",
  "/analyze": "Live Analysis Workspace",
  "/predictions": "AI Prediction Engine",
  "/agents": "Agent Intelligence",
  "/compare": "Stock Comparison",
  "/reports": "Research Reports",
  "/data-sources": "Data Sources",
  "/models": "Model Performance",
  "/settings": "Settings",
};

export const CHART_ICONS = { BarChart3, Activity, LineChart };
