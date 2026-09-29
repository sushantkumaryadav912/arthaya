"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, LogOut, X } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/constants/nav";
import { cn } from "@/lib/utils/cn";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { authService } from "@/services/authService";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch {
      // safe fallback
    }
    onClose();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="flex size-7 items-center justify-center rounded-md bg-accent text-bg">
              <Activity className="size-4" strokeWidth={2.5} />
            </span>
            <span className="font-display text-[0.95rem] font-medium tracking-tight text-fg">
              Arthaya
            </span>
          </Link>
          <button
            className="rounded-md p-1 text-fg-muted hover:bg-elevated hover:text-fg lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section, i) => (
            <div key={i} className="space-y-0.5">
              {section.title && (
                <p className="eyebrow px-3 pb-1.5">{section.title}</p>
              )}
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md py-2 pl-3 pr-3 text-sm transition-colors",
                      active
                        ? "font-medium text-fg"
                        : "text-fg-muted hover:bg-elevated hover:text-fg",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {active && (
                      <span
                        className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent"
                        aria-hidden
                      />
                    )}
                    <Icon
                      className={cn("size-4 shrink-0", active ? "text-accent" : "")}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer: Demo badge, Logout just above profile, and User profile card */}
        <div className="shrink-0 space-y-3 border-t border-border px-4 pt-3.5 pb-8">
          <DemoBadge />

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-elevated hover:text-negative"
          >
            <LogOut className="size-4 shrink-0 transition-colors group-hover:text-negative" />
            <span>Log out</span>
          </button>

          <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-elevated/40 p-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-semibold text-fg">
              AR
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-fg">Analyst (demo)</p>
              <p className="truncate text-[10px] text-fg-subtle">Active session</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
