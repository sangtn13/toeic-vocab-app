"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMessage } from "@/locales/format";
import { cn } from "@/lib/utils";
import type { EntityId } from "@/types/common";
import type { StudyUnitProgress } from "@/types/study";
import type { WorkspaceCopy } from "@/components/study/workspace/types";

export const UnitCard = memo(function UnitCard({
  unit,
  isSelected,
  copy,
  onSelectUnit
}: {
  unit: StudyUnitProgress;
  isSelected: boolean;
  copy: WorkspaceCopy;
  onSelectUnit: (unitId: EntityId) => void;
}) {
  const toneClassName = getUnitToneClasses(unit.status, isSelected);

  return (
    <button
      type="button"
      data-unit-id={unit.id}
      aria-current={isSelected ? "page" : undefined}
      onClick={() => onSelectUnit(unit.id)}
      className={cn(
        "block w-full rounded-[22px] border px-4 py-4 text-left transition-transform duration-200",
        toneClassName
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-current dark:text-inherit">
            {formatMessage(copy.unitLabel, {
              unitOrder: unit.unitOrder
            })}
          </p>
          <p
            className={cn(
              "mt-1 text-sm",
              isSelected
                ? "text-white/90 dark:text-slate-950/88"
                : "text-current/88 dark:text-inherit"
            )}
          >
            {formatMessage(copy.cardCount, {
              learned: unit.learnedWords,
              total: unit.totalWords
            })}
          </p>
        </div>
        <div
          className={cn(
            "flex h-8 min-w-8 items-center justify-center rounded-xl border px-2 text-xs font-bold",
            isSelected
              ? "border-white/28 bg-white/16 text-white shadow-[0_10px_24px_rgba(8,47,73,0.14)] backdrop-blur dark:border-slate-950/22 dark:bg-slate-950/20 dark:text-slate-950 dark:shadow-none"
              : "border-current/20 bg-card/70 text-current dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-100"
          )}
        >
          {unit.status === "COMPLETED" ? (
            <Check className="h-4 w-4" />
          ) : (
            `${unit.percentage}%`
          )}
        </div>
      </div>
    </button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.copy === nextProps.copy &&
    prevProps.unit.id === nextProps.unit.id &&
    prevProps.unit.title === nextProps.unit.title &&
    prevProps.unit.unitOrder === nextProps.unit.unitOrder &&
    prevProps.unit.totalWords === nextProps.unit.totalWords &&
    prevProps.unit.learnedWords === nextProps.unit.learnedWords &&
    prevProps.unit.masteredWords === nextProps.unit.masteredWords &&
    prevProps.unit.percentage === nextProps.unit.percentage &&
    prevProps.unit.status === nextProps.unit.status
  );
});

UnitCard.displayName = "UnitCard";

export function MetricSummary({
  title,
  value,
  helper
}: {
  title: string;
  value: number;
  helper: string;
}) {
  return (
    <Card className="border-border bg-muted/60 shadow-none dark:border-slate-700 dark:bg-slate-900/72">
      <CardContent className="space-y-3 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-300">
          {title}
        </p>
        <Progress value={value} />
        <p className="text-sm text-muted-foreground dark:text-slate-300">{helper}</p>
      </CardContent>
    </Card>
  );
}

export function EmptyWorkspace({
  message,
  className
}: {
  message: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[30px] border-border bg-card shadow-[0_18px_40px_rgba(148,163,184,0.16)]",
        className
      )}
    >
      <CardContent className="flex min-h-[280px] items-center justify-center p-6 text-center text-sm leading-7 text-muted-foreground sm:min-h-[360px] sm:p-8 lg:min-h-[640px] lg:p-10 xl:min-h-[760px]">
        {message}
      </CardContent>
    </Card>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <Skeleton className="h-[520px] rounded-[30px]" />
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-[30px]" />
        <Skeleton className="h-[520px] rounded-[30px]" />
      </div>
    </div>
  );
}

export function getResolvedUnit(units?: StudyUnitProgress[], unitId?: EntityId) {
  if (!units?.length) {
    return undefined;
  }

  if (unitId) {
    return units.find((unit) => unit.id === unitId) || units[0];
  }

  return (
    units.find((unit) => unit.status === "IN_PROGRESS") ||
    units.find((unit) => unit.status === "AVAILABLE") ||
    units.find((unit) => unit.status === "COMPLETED") ||
    units[0]
  );
}

function getUnitToneClasses(status: StudyUnitProgress["status"], isSelected: boolean) {
  if (isSelected) {
    return "border-primary/35 bg-primary text-primary-foreground shadow-[0_16px_28px_rgba(14,116,144,0.24)] dark:text-slate-950";
  }

  switch (status) {
    case "COMPLETED":
      return "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-100";
    case "IN_PROGRESS":
      return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-100";
    default:
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-500/10 dark:text-sky-100";
  }
}
