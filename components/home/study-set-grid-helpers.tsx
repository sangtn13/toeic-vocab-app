"use client";

import Link from "next/link";
import { BookCopy } from "lucide-react";
import { buildStudySetRoute } from "@/config/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/preferences";
import { formatMessage } from "@/locales/format";
import { cn } from "@/lib/utils";
import type { AppLocaleMessages } from "@/locales";

export type VisibleRange = {
  start: number;
  end: number;
};

export function StudySetCarouselCard({
  locale,
  studySet,
  isActive,
  studySetLearningStatusLabels,
  copy
}: {
  locale: Locale;
  studySet: {
    id: string | number;
    slug: string;
    title: string;
    description?: string | null;
    totalUnits: number;
    totalWords: number;
    learningStatus: string;
  };
  isActive: boolean;
  studySetLearningStatusLabels: AppLocaleMessages["common"]["labels"]["studySetLearningStatus"];
  copy: AppLocaleMessages["home"]["studySetGrid"];
}) {
  return (
    <Card
      data-study-set-card
      className={cn(
        "app-surface min-w-[min(86vw,22rem)] shrink-0 snap-start overflow-hidden transition-all duration-300 sm:min-w-[24rem] lg:min-w-[calc((100%-1rem)/2)] xl:min-w-[calc((100%-2rem)/3)]",
        isActive ? "translate-y-0 shadow-[0_24px_55px_rgba(15,23,42,0.14)]" : "shadow-glow",
        "hover:-translate-y-1"
      )}
    >
      <div className="h-32 bg-[linear-gradient(135deg,rgba(14,116,144,0.14),rgba(251,191,36,0.22),rgba(255,255,255,0.92))] p-5">
        <div className="flex h-full items-start justify-between gap-3 rounded-[24px] border border-border/70 bg-card/70 p-4 backdrop-blur">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className="w-fit rounded-full"
            >
              <BookCopy className="mr-2 h-3.5 w-3.5" />
              {studySet.totalUnits} {copy.unitSuffix}
            </Badge>
            <p className="text-sm font-medium text-muted-foreground">
              {studySet.totalWords} {copy.wordReadySuffix}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getLearningStatusToneClassName(
              studySet.learningStatus
            )}`}
          >
            {getLearningStatusLabel(studySet.learningStatus, studySetLearningStatusLabels)}
          </span>
        </div>
      </div>
      <CardHeader className="space-y-4 pt-5">
        <CardTitle className="text-xl font-black leading-tight sm:text-2xl md:text-balance">
          {studySet.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground sm:min-h-[4.5rem]">
          {studySet.description || copy.noDescription}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {copy.totalWords}
            </p>
            <p className="mt-2 text-lg font-black tracking-tight">{studySet.totalWords}</p>
          </div>
          <div className="rounded-2xl bg-muted/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {copy.totalUnits}
            </p>
            <p className="mt-2 text-lg font-black tracking-tight">{studySet.totalUnits}</p>
          </div>
        </div>
        <Button
          asChild
          className="w-full rounded-2xl"
        >
          <Link href={buildStudySetRoute(locale, studySet.slug)}>{copy.enterStudySet}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function getLearningStatusLabel(
  status: string,
  labels: AppLocaleMessages["common"]["labels"]["studySetLearningStatus"]
) {
  switch (status) {
    case "COMPLETED":
      return labels.COMPLETED;
    case "IN_PROGRESS":
      return labels.IN_PROGRESS;
    default:
      return labels.NOT_STARTED;
  }
}

export function formatVisibleRange(
  range: VisibleRange,
  total: number,
  copy: {
    visibleSingle: string;
    visibleRange: string;
  }
) {
  const start = Math.min(range.start + 1, total);
  const end = Math.min(range.end + 1, total);

  if (start === end) {
    return formatMessage(copy.visibleSingle, { start, total });
  }

  return formatMessage(copy.visibleRange, { start, end, total });
}

export function getIndicatorIndexes(total: number, activeIndex: number, maxVisibleIndicators: number) {
  if (total <= maxVisibleIndicators) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const half = Math.floor(maxVisibleIndicators / 2);
  let start = Math.max(0, activeIndex - half);
  let end = Math.min(total, start + maxVisibleIndicators);

  if (end - start < maxVisibleIndicators) {
    start = Math.max(0, end - maxVisibleIndicators);
  }

  return Array.from({ length: end - start }, (_, index) => start + index);
}

function getLearningStatusToneClassName(status: string) {
  switch (status) {
    case "COMPLETED":
      return "status-pill-success";
    case "IN_PROGRESS":
      return "status-pill-warning";
    default:
      return "bg-primary text-primary-foreground";
  }
}
