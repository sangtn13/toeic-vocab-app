import Link from "next/link";
import { buildHomeRoute } from "@/config/routes";
import type { Locale } from "@/lib/preferences";
import { getLocaleNamespace } from "@/locales/get-locale-namespace";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = getLocaleNamespace(locale, "app").footer;

  return (
    <footer className="footer-surface border-t border-border/40">
      <div className="container grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xl font-black tracking-tight">
            VocaSa
          </p>
          <p className="footer-copy max-w-md text-sm leading-7">
            {copy.description}
          </p>
        </div>

        <div className="space-y-3">
          <p className="footer-heading text-sm font-semibold uppercase tracking-[0.22em]">
            {copy.nav}
          </p>
          <div className="footer-copy flex flex-col gap-2 text-sm">
            {copy.navItems.map((item) => (
              <Link
                key={item.href}
                href={`${buildHomeRoute(locale)}${item.href}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="footer-heading text-sm font-semibold uppercase tracking-[0.22em]">
            {copy.highlights}
          </p>
          <div className="footer-copy space-y-2 text-sm">
            {copy.highlightItems.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-divider border-t">
        <div className="footer-heading container flex flex-col gap-2 py-4 text-sm md:flex-row md:flex-wrap md:items-center md:justify-between">
          {copy.bottomLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}
