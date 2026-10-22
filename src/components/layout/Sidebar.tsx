"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/constants/nav";
import { cn } from "@/lib/utils/cn";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import * as React from "react";
import { authService, type AuthUser } from "@/services/authService";

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
  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    authService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });
  }, []);

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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 shadow-xl lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand Header with Official Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/80 px-4">
          <Link href="/" className="group flex items-center gap-3" onClick={onClose} title="Arthaya Home & Overview">
            <div className="relative flex size-9 items-center justify-center rounded-lg border border-accent/30 bg-bg p-1 shadow-inner transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_14px_rgba(16,185,129,0.35)]">
              <Image
                src="/arthaya_logo.png"
                alt="Arthaya Logo"
                width={28}
                height={28}
                priority
                className="rounded object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[1.1rem] font-bold tracking-tight text-fg transition-colors group-hover:text-accent">
                  Arthaya
                </span>
                <span className="rounded bg-accent/15 px-1 py-0.2 text-[9px] font-semibold text-accent border border-accent/20">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-medium tracking-wide text-fg-subtle">
                Multi-Agent Stock Intel
              </span>
            </div>
          </Link>
          <button
            className="rounded-md p-1.5 text-fg-muted hover:bg-elevated hover:text-fg lg:hidden transition-colors"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section, i) => (
            <div key={i} className="space-y-1">
              {section.title && (
                <p className="eyebrow px-3 pb-1.5 font-semibold text-[10px] tracking-wider text-fg-subtle uppercase">
                  {section.title}
                </p>
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
                      "group relative flex items-center gap-3 rounded-lg py-2 pl-3 pr-3 text-sm transition-all duration-200",
                      active
                        ? "bg-accent/10 font-medium text-accent border border-accent/20 shadow-[0_0_12px_rgba(16,185,129,0.12)]"
                        : "text-fg-muted hover:bg-elevated/70 hover:text-fg hover:translate-x-0.5",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {active && (
                      <span
                        className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-accent shadow-[0_0_8px_#10b981]"
                        aria-hidden
                      />
                    )}
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                        active ? "text-accent" : "text-fg-subtle group-hover:text-fg",
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer: Demo badge, Logout, and User profile card */}
        <div className="shrink-0 space-y-3 border-t border-border/80 px-4 pt-3.5 pb-6 bg-surface/50">
          <DemoBadge isDemo={currentUser?.isDemo} />

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-muted transition-all duration-200 hover:bg-negative/10 hover:text-negative border border-transparent hover:border-negative/20"
          >
            <LogOut className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="font-medium">Log out</span>
          </button>

          <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-elevated/50 p-2.5 transition-colors hover:border-border-strong">
            <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/20 border border-accent/40 text-xs font-bold text-accent shadow-sm">
              {currentUser?.name
                ? currentUser.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : currentUser?.email
                ? currentUser.email.slice(0, 2).toUpperCase()
                : "AR"}
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-positive ring-2 ring-surface" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-fg">
                {currentUser?.name || currentUser?.email || "Quantitative Analyst"}
              </p>
              <p className="truncate text-[10px] text-fg-subtle">
                {currentUser?.organization
                  ? `${currentUser.organization} • ${currentUser.role || "Analyst"}`
                  : currentUser?.role || "Active Session"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

