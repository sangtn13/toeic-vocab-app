"use client";

import { useState, type ReactNode } from "react";
import { Languages, LaptopMinimal, MoonStar, Settings2, SunMedium } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { usePreferences } from "@/app/preferences-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useI18n } from "@/hooks/use-i18n";
import { replaceLocaleInPathname } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { Locale, ThemeMode } from "@/lib/preferences";

const themeModes: ThemeMode[] = ["system", "light", "dark"];
const locales: Locale[] = ["vi", "en"];

export function PreferencesControls({
  compact = false,
  compactStyle = "icon",
  className
}: {
  compact?: boolean;
  compactStyle?: "icon" | "button" | "sidebar";
  className?: string;
}) {
  const { locale, resolvedTheme, setLocale, setThemeMode, themeMode } = usePreferences();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const copy = useI18n("preferences").controls;

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    setLocale(nextLocale);
    router.replace(replaceLocaleInPathname(pathname, nextLocale));
  };

  if (compact) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        {compactStyle === "button" ? (
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-12 w-full justify-start rounded-[18px] border-border bg-card px-4 text-sm font-semibold text-foreground shadow-none hover:bg-muted/60",
              className
            )}
            onClick={() => setOpen(true)}
          >
            <Settings2 className="mr-3 h-4 w-4 text-primary" />
            {copy.triggerLabel}
          </Button>
        ) : compactStyle === "sidebar" ? (
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-12 w-full justify-center rounded-[18px] border border-transparent bg-card px-3 text-foreground shadow-none transition-colors hover:bg-muted/70",
              className
            )}
            onClick={() => setOpen(true)}
          >
            <Settings2 className="h-5 w-5 text-primary" />
            <span className="sr-only">{copy.openSettings}</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-11 w-11 rounded-full border-border/80 bg-card/85 p-0 text-left shadow-sm backdrop-blur",
              "flex items-center justify-center hover:bg-muted/70",
              className
            )}
            onClick={() => setOpen(true)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Settings2 className="h-4 w-4" />
            </span>
            <span className="sr-only">{copy.openSettings}</span>
          </Button>
        )}

        <DialogContent className="max-w-md rounded-[28px] border border-border bg-card p-0 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-xl font-black tracking-tight">
              {copy.panelTitle}
            </DialogTitle>
            <DialogDescription>{copy.panelDescription}</DialogDescription>
          </DialogHeader>
          <div className="p-5">
            <PreferencesPanel
              locale={locale}
              resolvedTheme={resolvedTheme}
              themeMode={themeMode}
              copy={copy}
              onLocaleChange={handleLocaleChange}
              onThemeModeChange={setThemeMode}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div
      className={cn("w-full", className)}
    >
      <PreferencesPanel
        locale={locale}
        resolvedTheme={resolvedTheme}
        themeMode={themeMode}
        copy={copy}
        onLocaleChange={handleLocaleChange}
        onThemeModeChange={setThemeMode}
      />
    </div>
  );
}

function PreferencesPanel({
  locale,
  resolvedTheme,
  themeMode,
  copy,
  onLocaleChange,
  onThemeModeChange
}: {
  locale: Locale;
  resolvedTheme: "light" | "dark";
  themeMode: ThemeMode;
  copy: ReturnType<typeof useI18n<"preferences">>["controls"];
  onLocaleChange: (locale: Locale) => void;
  onThemeModeChange: (themeMode: ThemeMode) => void;
}) {
  return (
    <div className="grid gap-4">
      <PreferenceSection title={copy.languageLabel}>
        <div className="grid grid-cols-2 gap-2">
          {locales.map((item) => (
            <PreferenceButton
              key={item}
              active={locale === item}
              onClick={() => onLocaleChange(item)}
              icon={<Languages className="h-4 w-4" />}
            >
              {copy.locales[item]}
            </PreferenceButton>
          ))}
        </div>
      </PreferenceSection>

      <PreferenceSection title={copy.themeLabel}>
        <div className="grid grid-cols-3 gap-2">
          {themeModes.map((item) => (
            <PreferenceButton
              key={item}
              active={themeMode === item}
              onClick={() => onThemeModeChange(item)}
              icon={getThemeIcon(item, resolvedTheme)}
            >
              {copy.themeModes[item]}
            </PreferenceButton>
          ))}
        </div>
      </PreferenceSection>
    </div>
  );
}

function PreferenceSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-border/70 bg-muted/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      {children}
    </section>
  );
}

function PreferenceButton({
  active,
  onClick,
  icon,
  children
}: {
  active?: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(14,116,144,0.2)]"
          : "border-border bg-card text-muted-foreground hover:bg-background hover:text-foreground"
      )}
    >
      {icon}
      <span className="truncate">{children}</span>
    </button>
  );
}

function getThemeIcon(themeMode: ThemeMode, resolvedTheme: "light" | "dark") {
  if (themeMode === "system") {
    return <LaptopMinimal className="h-3.5 w-3.5" />;
  }

  if (themeMode === "dark" || resolvedTheme === "dark") {
    return <MoonStar className="h-3.5 w-3.5" />;
  }

  return <SunMedium className="h-3.5 w-3.5" />;
}
