"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkspaceSidebar, WorkspaceTopbar } from "@/components/study/workspace/shared";
import type { WorkspaceCopy } from "@/components/study/workspace/types";
import { cn } from "@/lib/utils";

export function WorkspaceShell({
  collapsed,
  sidebarOpen,
  copy,
  canAccessAdmin,
  isAuthenticated,
  isLoggingOut,
  progressReady,
  studySetTitle,
  unitTitle,
  activeModeLabel,
  userLabel,
  userRoleLabel,
  onOpenAuth,
  onLogout,
  onToggleCollapsed,
  onSidebarOpenChange,
  onOpenSidebar,
  children
}: {
  collapsed: boolean;
  sidebarOpen: boolean;
  copy: WorkspaceCopy;
  canAccessAdmin: boolean;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  progressReady: boolean;
  studySetTitle: string;
  unitTitle: string;
  activeModeLabel: string;
  userLabel: string;
  userRoleLabel: string;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleCollapsed: () => void;
  onSidebarOpenChange: (open: boolean) => void;
  onOpenSidebar: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:h-screen lg:overflow-hidden">
      <div
        className={cn(
          "lg:grid lg:min-h-screen",
          collapsed
            ? "lg:grid-cols-[96px_minmax(0,1fr)]"
            : "lg:grid-cols-[245px_minmax(0,1fr)]"
        )}
      >
        <div className="hidden lg:block">
          <WorkspaceSidebar
            collapsed={collapsed}
            canAccessAdmin={canAccessAdmin}
            isAuthenticated={isAuthenticated}
            isLoggingOut={isLoggingOut}
            copy={copy}
            onOpenAuth={onOpenAuth}
            onLogout={onLogout}
            onToggleCollapsed={onToggleCollapsed}
          />
        </div>

        <Dialog
          open={sidebarOpen}
          onOpenChange={onSidebarOpenChange}
        >
          <DialogContent className="left-4 right-4 top-[calc(env(safe-area-inset-top)+1rem)] w-auto max-w-none translate-x-0 translate-y-0 rounded-[28px] border border-border bg-card p-0 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-[34rem] sm:max-w-[calc(100vw-3rem)] sm:translate-x-[-50%] sm:translate-y-[-50%] md:w-[38rem] lg:hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Menu bài học</DialogTitle>
              <DialogDescription>Chọn nhanh mục bạn muốn mở trong khu học.</DialogDescription>
            </DialogHeader>
            <WorkspaceSidebar
              canAccessAdmin={canAccessAdmin}
              isAuthenticated={isAuthenticated}
              isLoggingOut={isLoggingOut}
              copy={copy}
              onOpenAuth={onOpenAuth}
              onLogout={onLogout}
              onCloseMobile={() => onSidebarOpenChange(false)}
            />
          </DialogContent>
        </Dialog>

        <div className="flex min-w-0 flex-col lg:h-screen lg:min-h-0 lg:overflow-hidden">
          <WorkspaceTopbar
            onOpenSidebar={onOpenSidebar}
            progressReady={progressReady}
            studySetTitle={studySetTitle}
            unitTitle={unitTitle}
            activeModeLabel={activeModeLabel}
            userLabel={userLabel}
            userRoleLabel={userRoleLabel}
            copy={copy}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
