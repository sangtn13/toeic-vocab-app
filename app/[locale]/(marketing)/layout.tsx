import type { ReactNode } from "react";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { SiteHeader } from "@/components/app-shell/site-header";
import type { Locale } from "@/lib/preferences";

export default function MarketingLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={params.locale as Locale} />
    </div>
  );
}
