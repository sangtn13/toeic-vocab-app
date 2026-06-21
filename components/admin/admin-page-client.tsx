"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { usePreferences } from "@/app/preferences-provider";
import { CatalogManagerSkeleton } from "@/components/admin/catalog-manager-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildHomeRoute } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { formatMessage } from "@/locales/format";

const CatalogManager = dynamic(
  () => import("@/components/admin/catalog-manager").then((module) => module.CatalogManager),
  {
    loading: () => <CatalogManagerSkeleton />
  }
);

const AuthPanel = dynamic(
  () => import("@/components/auth/auth-panel").then((module) => module.AuthPanel),
  {
    loading: () => (
      <Card className="app-surface">
        <CardContent className="p-8 text-sm text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    )
  }
);

export function AdminPageClient() {
  const { locale } = usePreferences();
  const adminMessages = useI18n("admin");
  const { bootstrapStatus, hasHydrated, isAdmin, isAuthenticated, user } = useAuth();
  const copy = adminMessages.page;

  return (
    <div className="container py-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            {copy.badge}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
            {copy.title}
          </h1>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto"
        >
          <Link href={buildHomeRoute(locale)}>{copy.backHome}</Link>
        </Button>
      </div>

      {!hasHydrated || bootstrapStatus === "loading" ? (
        <Card className="app-surface">
          <CardContent className="p-8 text-sm text-muted-foreground">
            {copy.bootstrapping}
          </CardContent>
        </Card>
      ) : !isAuthenticated ? (
        <AuthPanel
          title={copy.loginTitle}
          description={copy.loginDescription}
        />
      ) : !isAdmin ? (
        <Card className="app-surface">
          <CardContent className="space-y-4 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 text-amber-700">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                {formatMessage(copy.unauthorizedTitle, {
                  email: user?.email
                })}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {copy.unauthorizedBody}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <CatalogManager />
      )}
    </div>
  );
}
