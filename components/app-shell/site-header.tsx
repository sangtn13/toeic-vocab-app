"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { usePreferences } from "@/app/preferences-provider";
import { useI18n } from "@/hooks/use-i18n";
import {
  BookOpenText,
  ChevronDown,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import { toast } from "sonner";
import {
  buildAdminRoute,
  buildHomeRoute,
  buildNavigationHref,
  isHomePath
} from "@/config/routes";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getUserFacingErrorMessage } from "@/utils/error";
import { getRoleBadgeLabel, getRoleLabel } from "@/utils/user-copy";

const AuthPanel = dynamic(
  () => import("@/components/auth/auth-panel").then((module) => module.AuthPanel)
);

export function SiteHeader() {
  const { locale } = usePreferences();
  const pathname = usePathname();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const { bootstrapStatus, hasHydrated, isAdmin, isAuthenticated, user } = useAuth();
  const logoutMutation = useLogout();
  const isHomePage = isHomePath(pathname);
  const copy = useI18n("app").header;

  useEffect(() => {
    if (!accountOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [accountOpen]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success(copy.loggedOut);
      setAccountOpen(false);
      setMenuOpen(false);
      router.replace(buildHomeRoute(locale));
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, copy.logoutFailed, locale));
    }
  };

  const showAccount = hasHydrated && isAuthenticated && user;
  const showLoading = hasHydrated && !!bootstrapStatus && bootstrapStatus === "loading" && !user;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container flex min-h-[4.5rem] items-center justify-between gap-4 py-3 sm:min-h-20">
          <Link
            href={buildHomeRoute(locale)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-extrabold tracking-tight sm:text-lg">VocaSa</p>
              <p className="hidden text-xs uppercase tracking-[0.22em] text-muted-foreground min-[420px]:block">
                {copy.brandSubtitle}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {copy.navigationItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className="rounded-full"
              >
                <Link href={buildNavigationHref(locale, item.href, isHomePage)}>{item.label}</Link>
              </Button>
            ))}

            {showAccount ? (
              <div
                ref={accountMenuRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => setAccountOpen((current) => !current)}
                  className="flex min-h-10 max-w-[min(100%,22rem)] items-center gap-2 rounded-full border border-border bg-card px-4 text-sm text-foreground shadow-sm transition hover:bg-muted"
                >
                  <UserRound className="h-4 w-4 text-primary" />
                  <span className="max-w-[10rem] truncate font-semibold">{user.fullName}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="max-w-[7rem] truncate">{getRoleBadgeLabel(user.role, locale)}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      accountOpen && "rotate-180"
                    )}
                  />
                </button>

                {accountOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-[24px] border border-border bg-card p-3 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                    <div className="rounded-[20px] bg-muted/60 p-4">
                      <p className="font-bold text-foreground">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground">{getRoleLabel(user.role, locale)}</p>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {isAdmin ? (
                        <AccountMenuLink
                          href={buildAdminRoute(locale)}
                          label={copy.accountManage}
                          icon={<ShieldCheck className="h-4 w-4" />}
                          onNavigate={() => setAccountOpen(false)}
                        />
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        className="justify-start rounded-2xl px-4 py-6 text-left text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => void handleLogout()}
                        disabled={logoutMutation.isPending}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {copy.logout}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : showLoading ? (
              <div className="flex h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground">
                {copy.loading}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  className="rounded-full"
                  onClick={() => setAuthOpen(true)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {copy.signIn}
                </Button>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{copy.openMenu}</span>
            </Button>
          </div>
        </div>
      </header>

      <Dialog
        open={menuOpen}
        onOpenChange={setMenuOpen}
      >
        <DialogContent className="left-4 right-4 top-[calc(env(safe-area-inset-top)+4.75rem)] w-auto max-w-sm translate-x-0 translate-y-0 rounded-[28px] border border-border bg-card p-0 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:left-auto sm:right-4 sm:w-[calc(100%-2rem)]">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-xl font-black tracking-tight text-foreground">
              {copy.menuTitle}
            </DialogTitle>
            <DialogDescription>{copy.menuDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-5">
            <div className="grid gap-2">
              {copy.navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className="justify-start rounded-2xl px-4 py-6 text-left"
                >
                  <Link
                    href={buildNavigationHref(locale, item.href, isHomePage)}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>

            <div className="rounded-[24px] border border-border bg-muted/60 p-4">
              {showAccount ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-foreground">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{getRoleLabel(user.role, locale)}</p>
                  </div>
                  <div className="grid gap-2">
                    {isAdmin ? (
                      <Button
                        variant="outline"
                        asChild
                        className="justify-start rounded-2xl"
                      >
                        <Link
                          href={buildAdminRoute(locale)}
                          onClick={() => setMenuOpen(false)}
                        >
                          {copy.accountManage}
                        </Link>
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                      onClick={() => void handleLogout()}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {copy.logout}
                    </Button>
                  </div>
                </div>
              ) : showLoading ? (
                <p className="text-sm text-muted-foreground">{copy.loadingAccount}</p>
              ) : (
                <Button
                  type="button"
                  className="w-full rounded-2xl"
                  onClick={() => {
                    setMenuOpen(false);
                    setAuthOpen(true);
                  }}
                >
                  {copy.signIn}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={authOpen}
        onOpenChange={setAuthOpen}
      >
        <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{copy.accountTitle}</DialogTitle>
            <DialogDescription>{copy.accountDescription}</DialogDescription>
          </DialogHeader>
          <AuthPanel onSuccess={() => setAuthOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function AccountMenuLink({
  href,
  label,
  icon,
  onNavigate
}: {
  href: string;
  label: string;
  icon?: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Button
      variant="ghost"
      asChild
      className="justify-start rounded-2xl px-4 py-6 text-left"
    >
      <Link
        href={href}
        onClick={onNavigate}
      >
        {icon ? <span className="mr-2">{icon}</span> : null}
        {label}
      </Link>
    </Button>
  );
}
