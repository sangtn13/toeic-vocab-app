"use client";

import type { ReactNode } from "react";
import {
  BadgeCheck,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  Headphones,
  NotebookTabs,
  ScanSearch,
  Target,
  Trophy,
  Volume2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import type { AppLocaleMessages } from "@/locales";

type LandingCopy = AppLocaleMessages["home"]["landing"];

export function getMarketingContent(copy: LandingCopy) {
  return {
    momentumCards: copy.momentumCards,
    methodSteps: copy.methodSteps.map((step, index) => ({
      ...step,
      icon: [
        <Headphones key="listen" className="h-5 w-5" />,
        <NotebookTabs key="meaning" className="h-5 w-5" />,
        <BrainCircuit key="recall" className="h-5 w-5" />,
        <BarChart3 key="progress" className="h-5 w-5" />
      ][index]
    })),
    featureStories: copy.featureStories,
    reasons: copy.reasons.map((reason, index) => ({
      ...reason,
      icon: [
        <Volume2 key="audio" className="h-5 w-5" />,
        <Target key="toeic" className="h-5 w-5" />,
        <ScanSearch key="review" className="h-5 w-5" />,
        <Trophy key="momentum" className="h-5 w-5" />
      ][index]
    })),
    testimonials: copy.testimonials,
    faqs: copy.faqs,
    labels: copy.labels
  };
}

export function FeatureStory({
  labels,
  story,
  reverse
}: {
  labels: ReturnType<typeof getMarketingContent>["labels"];
  story: ReturnType<typeof getMarketingContent>["featureStories"][number];
  reverse?: boolean;
}) {
  return (
    <ScrollReveal className="container">
      <div className="grid items-center gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <ScrollReveal
          direction={reverse ? "left" : "right"}
          className={cn(reverse && "lg:order-2")}
        >
          <Card className="app-surface overflow-hidden">
            <CardContent className="relative p-6 sm:p-8">
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-90",
                  story.previewAccent
                )}
              />
              <div className="relative space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge
                    variant="muted"
                    className="rounded-full border-0 bg-card/80 text-primary"
                  >
                    {story.previewLabel}
                  </Badge>
                  <span className="text-sm font-medium text-foreground/70">
                    {labels.previewApp}
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                  <div className="rounded-[28px] border border-border/70 bg-card/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                        {story.previewTitle}
                      </p>
                      <h3 className="text-2xl font-black tracking-tight">
                        {labels.featurePreviewTitle}
                      </h3>
                    </div>

                    <div className="mt-5 space-y-3">
                      {story.previewPoints.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-3 rounded-2xl bg-card px-4 py-3"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <BadgeCheck className="h-4 w-4" />
                          </div>
                          <span className="min-w-0 text-sm font-medium">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {story.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="surface-contrast rounded-[26px] border border-border/70 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.15)]"
                      >
                        <p className="surface-contrast-muted text-sm">{stat.label}</p>
                        <p className="mt-3 text-3xl font-black tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                    <div className="rounded-[26px] border border-border/70 bg-card/80 p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                          <BookOpenText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold">{labels.studySetReadyTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {labels.studySetReadyBody}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal
          direction={reverse ? "right" : "left"}
          delayMs={120}
          className={cn("space-y-5 min-w-0", reverse && "lg:order-1")}
        >
          <Badge
            variant="muted"
            className="rounded-full border-0 bg-secondary px-4 py-1.5 text-secondary-foreground"
          >
            {story.eyebrow}
          </Badge>
          <div className="space-y-4">
            <h2 className="max-w-xl text-3xl font-black tracking-tight md:text-balance sm:text-4xl">
              {story.title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {story.description}
            </p>
          </div>

          <div className="space-y-3">
            {story.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex gap-3"
              >
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-foreground/90">{bullet}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </ScrollReveal>
  );
}

export function SectionHeading({
  badge,
  title,
  description
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-6 max-w-3xl space-y-4 text-center md:mb-8">
      <Badge className="mx-auto rounded-full bg-primary px-4 py-1.5 text-primary-foreground">
        {badge}
      </Badge>
      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tight md:text-balance sm:text-4xl">
          {title}
        </h2>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

export function MiniMetric({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="surface-contrast-panel rounded-3xl border px-4 py-4 backdrop-blur">
      <p className="surface-contrast-muted text-sm">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

export function InfoTile({
  icon,
  title,
  description
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-primary/10 bg-card p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
