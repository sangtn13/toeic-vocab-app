"use client";

import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, BookOpenText, Headphones, Sparkles, Volume2 } from "lucide-react";
import { usePreferences } from "@/app/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { getRoleLabel } from "@/utils/user-copy";

export function HeroSection() {
  const { locale } = usePreferences();
  const homeMessages = useI18n("home");
  const { isAuthenticated, user } = useAuth();
  const copy = homeMessages.hero;

  return (
    <section className="relative overflow-hidden">
      <div className="container grid gap-8 py-7 sm:py-8 md:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <ScrollReveal
          direction="left"
          className="space-y-5 md:space-y-6"
        >
          <Badge className="w-fit rounded-full bg-secondary px-4 py-1.5 text-secondary-foreground">
            {copy.badge}
          </Badge>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-3xl font-black leading-[0.98] tracking-tight sm:text-5xl md:text-6xl md:text-balance">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base md:text-lg">
              {copy.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full px-7 sm:w-auto"
            >
              <a href="#study-sets">
                {copy.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full rounded-full px-7 sm:w-auto"
            >
              <a href="#phuong-phap">{copy.secondaryCta}</a>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {copy.stats.map((stat) => (
              <ScrollReveal
                key={stat.label}
                delayMs={80}
                distance={18}
              >
                <HeroStat
                  label={stat.label}
                  value={stat.value}
                />
              </ScrollReveal>
            ))}
          </div>

          <div className="grid gap-3 md:auto-rows-fr md:grid-cols-2">
            {copy.highlights.map((highlight, index) => (
              <ScrollReveal
                key={highlight}
                delayMs={index * 90}
                distance={18}
                className="h-full"
              >
                <HighlightPill
                  icon={[
                    <Volume2 key="volume" className="h-4 w-4" />,
                    <BadgeCheck key="badge" className="h-4 w-4" />,
                    <Sparkles key="sparkles" className="h-4 w-4" />
                  ][index]}
                  text={highlight}
                />
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="right"
          delayMs={120}
        >
          <Card className="app-surface overflow-hidden">
            <CardContent className="relative p-5 sm:p-6 md:p-8">
              <div className="hero-preview-shell absolute inset-0" />

              <div className="relative grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="min-w-0 space-y-4">
                  <div className="hero-preview-card rounded-[28px] border p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary">{copy.todayTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {copy.todaySubtitle}
                        </p>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <BookOpenText className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {copy.previewWords.map(([word, meaning, phonetic]) => (
                        <div
                          key={word}
                          className="hero-preview-item rounded-2xl border px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">{word}</p>
                            <span className="shrink-0 text-xs font-medium text-primary">{phonetic}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FloatingInsight
                      icon={<Headphones className="h-4 w-4" />}
                      title={copy.insights[0].title}
                      description={copy.insights[0].description}
                    />
                    <FloatingInsight
                      icon={<Sparkles className="h-4 w-4" />}
                      title={copy.insights[1].title}
                      description={copy.insights[1].description}
                    />
                  </div>
                </div>

                <div className="grid min-w-0 gap-4">
                  <div className="surface-contrast hero-preview-dark-card rounded-[28px] border p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="surface-contrast-muted text-sm">{copy.lessonOverviewLabel}</p>
                        <p className="mt-1 text-xl font-black tracking-tight">
                          {copy.lessonOverviewTitle}
                        </p>
                      </div>
                      <div className="surface-contrast-chip shrink-0 rounded-full px-3 py-1 text-xs font-semibold">
                        {copy.opened}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {copy.lessonPoints.map((item) => (
                        <div
                          key={item}
                          className="hero-preview-dark-item rounded-2xl border px-4 py-3 text-sm"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <FloatingMetric
                      label={copy.accountStatus}
                      value={
                        isAuthenticated && user
                          ? `${getRoleLabel(user.role, locale)} • ${user.fullName}`
                          : copy.guest
                      }
                    />
                    <FloatingMetric
                      label={copy.lessonProgress}
                      value={copy.stepByStep}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-border/70 bg-card/80 px-4 py-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-black tracking-tight">{value}</p>
    </div>
  );
}

function HighlightPill({
  icon,
  text
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-[24px] border border-primary/10 bg-card/78 px-5 py-4 text-sm shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:min-h-[7.75rem]">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="min-w-0 pt-0.5 leading-6 text-foreground/90 md:min-h-[4.5rem]">
        {text}
      </p>
    </div>
  );
}

function FloatingInsight({
  icon,
  title,
  description
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="hero-preview-card rounded-[24px] border p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function FloatingMetric({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="hero-preview-metric rounded-[26px] border p-5">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-black tracking-tight text-foreground sm:text-xl">{value}</p>
    </div>
  );
}
