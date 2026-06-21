"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Sparkles,
  UserRound
} from "lucide-react";
import { usePreferences } from "@/app/preferences-provider";
import { PreferencesControls } from "@/components/app-shell/preferences-controls";
import { buildAdminRoute, buildHomeRoute } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { WorkspaceCopy } from "@/components/study/workspace/types";

export function WorkspaceSidebar({
  collapsed = false,
  canAccessAdmin,
  copy,
  isAuthenticated,
  isLoggingOut,
  onOpenAuth,
  onLogout,
  onCloseMobile,
  onToggleCollapsed
}: {
  collapsed?: boolean;
  canAccessAdmin: boolean;
  copy: WorkspaceCopy;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onCloseMobile?: () => void;
  onToggleCollapsed?: () => void;
}) {
  const { locale } = usePreferences();
  const isOverlayMenu = !!onCloseMobile;
  const mainItems: Array<{
    href?: string;
    label: string;
    icon: ReactNode;
    active?: boolean;
  }> = [
    { href: buildHomeRoute(locale), label: copy.homeLabel, icon: <Home className="h-5 w-5" /> },
    { label: copy.studyLabel, icon: <BookOpenText className="h-5 w-5" />, active: true }
  ];

  if (canAccessAdmin) {
    mainItems.splice(2, 0, {
      href: buildAdminRoute(locale),
      label: copy.adminLabel,
      icon: <Sparkles className="h-5 w-5" />
    });
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden border-b border-border bg-card lg:h-screen lg:border-b-0 lg:border-r">
      <div
        className={cn(
          "shrink-0",
          "flex items-center border-b border-border px-5 py-5",
          isOverlayMenu && "px-6 py-6 md:px-7 md:py-7",
          collapsed ? "justify-center lg:px-3" : "justify-between"
        )}
      >
        <Link
          href={buildHomeRoute(locale)}
          onClick={onCloseMobile}
          className={cn(
            "flex min-w-0 items-center transition-colors hover:opacity-90",
            collapsed && "lg:gap-0"
          )}
        >
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-2xl font-black tracking-tight text-foreground">VocaSa</p>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy.brandSubtitle}
              </p>
            </div>
          ) : null}
        </Link>

        {onToggleCollapsed ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hidden rounded-full border-border lg:inline-flex"
            onClick={onToggleCollapsed}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">{copy.collapseSidebar}</span>
          </Button>
        ) : null}
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col p-4 sm:p-5",
          isOverlayMenu && "p-5 md:p-6",
          collapsed && "xl:px-3"
        )}
      >
        <div
          className={cn(
            "grid gap-2 sm:grid-cols-2 lg:grid-cols-1",
            isOverlayMenu && "grid-cols-1 gap-3"
          )}
        >
          {mainItems.map((item) => (
            <Link
              key={item.label}
              href={item.href ?? "#"}
              aria-disabled={!item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-3 rounded-[18px] border px-4 py-3 text-sm font-semibold transition-colors",
                isOverlayMenu && "min-h-[60px] rounded-[20px] px-5 py-4 text-base",
                item.active
                  ? "border-sky-300 bg-sky-50 text-sky-600 shadow-[0_12px_24px_rgba(125,211,252,0.18)] dark:border-sky-400/28 dark:bg-sky-500/10 dark:text-sky-100 dark:shadow-[0_16px_28px_rgba(14,116,144,0.16)]"
                  : "border-transparent bg-card text-foreground",
                collapsed && "lg:relative lg:justify-center lg:px-3",
                !item.href && "pointer-events-none"
              )}
              onClick={item.href ? onCloseMobile : undefined}
            >
              <span>{item.icon}</span>
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          ))}
        </div>

        <div className={cn("mt-auto pt-6", collapsed ? "xl:pt-5" : "")}>
          <div className="mb-4 border-t border-border" />
          <div className="mb-4">
            <PreferencesControls
              compact
              compactStyle={collapsed && !isOverlayMenu ? "sidebar" : "button"}
            />
          </div>
          {isAuthenticated ? (
            <Button
              type="button"
              variant="outline"
              onClick={onLogout}
              disabled={isLoggingOut}
              className={cn(
                "h-12 w-full justify-start rounded-[18px] border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 shadow-none hover:bg-red-100 hover:text-red-700 dark:border-rose-400/24 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/16 dark:hover:text-rose-100",
                isOverlayMenu && "h-14 rounded-[20px] px-5 text-base",
                collapsed && "lg:justify-center lg:px-3"
              )}
            >
              <LogOut className={cn("h-4 w-4", collapsed ? "lg:mr-0" : "mr-3")} />
              {!collapsed ? <span>{copy.signOut}</span> : null}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onOpenAuth}
              className={cn(
                "h-12 w-full justify-center gap-2 rounded-[18px] bg-primary px-4 text-center text-sm font-semibold leading-none text-primary-foreground shadow-none hover:bg-primary/90",
                isOverlayMenu && "h-14 rounded-[20px] px-5 text-base",
                collapsed && "lg:px-3"
              )}
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              {!collapsed ? <span>{copy.signIn}</span> : null}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

export function WorkspaceTopbar({
  onOpenSidebar,
  progressReady,
  studySetTitle,
  unitTitle,
  activeModeLabel,
  userLabel,
  userRoleLabel,
  copy
}: {
  onOpenSidebar: () => void;
  progressReady: boolean;
  studySetTitle: string;
  unitTitle: string;
  activeModeLabel: string;
  userLabel: string;
  userRoleLabel: string;
  copy: WorkspaceCopy;
}) {
  const { locale } = usePreferences();
  const topbarCardClassName =
    "min-h-[80px] rounded-[22px] border border-border bg-card px-4 py-3 shadow-[0_10px_24px_rgba(148,163,184,0.09)]";

  return (
    <div className="shrink-0 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:hidden">
        <Link
          href={buildHomeRoute(locale)}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BookOpenText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold tracking-tight text-foreground">VocaSa</p>
            <p className="truncate text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {copy.brandSubtitle}
            </p>
          </div>
        </Link>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full border-border"
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{copy.openStudyMenu}</span>
        </Button>
      </div>

      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(15rem,22rem)] lg:items-stretch lg:gap-6 lg:px-8 lg:py-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className={cn("min-w-0", topbarCardClassName)}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/12 dark:text-sky-200">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {copy.currentLesson}
              </p>
              <p className="truncate text-sm font-bold text-foreground">{unitTitle}</p>
              <p className="truncate text-sm text-muted-foreground">
                {studySetTitle} • {activeModeLabel}
              </p>
            </div>
          </div>
        </div>

        <div className={cn("min-w-0", topbarCardClassName, "flex items-center gap-3")}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-foreground">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-foreground">{userLabel}</p>
            <p className="truncate text-sm text-muted-foreground">
              {userRoleLabel} • {progressReady ? copy.lessonReady : copy.loadingData}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
