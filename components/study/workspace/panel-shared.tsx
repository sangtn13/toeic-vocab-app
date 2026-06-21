"use client";

import { Headphones, Volume2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AnswerFeedback,
  PartOfSpeechLabels,
  WorkspaceCopy
} from "@/components/study/workspace/types";

export function InlineAnswerFeedback({
  correctAnswer,
  copy,
  onRetry,
  onNext
}: {
  correctAnswer: string;
  copy: WorkspaceCopy;
  onRetry: () => void;
  onNext?: () => void;
}) {
  const visibleCorrectAnswer = correctAnswer.trim() || "—";

  return (
    <div className="mx-auto max-w-[560px] rounded-[28px] border border-rose-200 bg-card p-5 shadow-[0_16px_32px_rgba(244,63,94,0.08)] dark:border-rose-400/24 dark:bg-slate-950/92 dark:shadow-[0_18px_36px_rgba(2,8,23,0.42)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-300/40 dark:bg-rose-950 dark:text-white">
            <XCircle className="h-5 w-5 stroke-[2.4]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-foreground">{copy.incorrectTitle}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {copy.incorrectDescription}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 sm:min-w-[190px] dark:border-emerald-300/40 dark:bg-emerald-950">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-200">
            {copy.correctAnswer}
          </p>
          <p className="mt-1 break-words text-lg font-black tracking-tight text-emerald-950 dark:text-white">
            {visibleCorrectAnswer}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="rounded-2xl border-border bg-card text-foreground hover:bg-muted/60 hover:text-foreground dark:border-slate-700 dark:bg-slate-900/76 dark:text-slate-100 dark:hover:bg-slate-800/82"
        >
          {copy.retryQuestion}
        </Button>
        {onNext ? (
          <Button
            type="button"
            onClick={onNext}
            className="rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90 dark:shadow-[0_12px_28px_rgba(34,211,238,0.16)]"
          >
            {copy.skipAndContinue}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function PracticeHeroTile({
  label,
  partOfSpeechLabels,
  compact
}: {
  label: string;
  partOfSpeechLabels: PartOfSpeechLabels;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[26px] border border-border bg-[linear-gradient(180deg,#dff4ff_0%,#bfe6ff_100%)] shadow-[0_10px_18px_rgba(148,163,184,0.18)] dark:border-slate-600/70 dark:bg-[linear-gradient(180deg,rgba(44,67,92,0.92)_0%,rgba(29,46,68,0.96)_100%)] dark:shadow-[0_14px_28px_rgba(2,8,23,0.32)]",
        compact ? "h-36 w-36" : "mx-auto h-32 w-32 sm:h-36 sm:w-36"
      )}
    >
      <div className="absolute inset-3 rounded-[20px] border border-border/70 bg-[radial-gradient(circle_at_50%_20%,rgba(255,229,122,0.9),transparent_18%),radial-gradient(circle_at_50%_65%,rgba(255,255,255,0.7),transparent_58%)] dark:border-slate-500/70 dark:bg-[radial-gradient(circle_at_50%_18%,rgba(250,204,21,0.42),transparent_16%),radial-gradient(circle_at_50%_65%,rgba(226,232,240,0.12),transparent_56%)]" />
      <div className="relative flex flex-col items-center gap-2 text-foreground dark:text-slate-100">
        <Headphones className="h-8 w-8 opacity-95" />
        <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] dark:bg-slate-800/88 dark:text-slate-100">
          {getPartOfSpeechLabel(label, partOfSpeechLabels)}
        </span>
      </div>
    </div>
  );
}

export function AudioLabel({
  label,
  onPlay
}: {
  label: string;
  onPlay: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onPlay();
      }}
      className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-2 hover:bg-card dark:border-slate-700 dark:bg-slate-800/62 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      <span className="min-w-0 break-words text-left">{label}</span>
      <Volume2 className="h-4 w-4 shrink-0" />
    </button>
  );
}

export function InfoLine({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}:</p>
      <p className="break-words">{value}</p>
    </div>
  );
}

export function getChoiceToneClassName(
  choiceValue: string,
  feedback: AnswerFeedback | null,
  selectedValue?: string | null
) {
  if (!feedback || feedback.correct) {
    if (choiceValue === selectedValue) {
      return "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/45 dark:bg-[rgba(14,116,144,0.22)] dark:text-sky-50";
    }

    return "border-border bg-card text-foreground";
  }

  if (choiceValue === selectedValue || choiceValue === feedback.submittedAnswer) {
    return "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/45 dark:bg-[rgba(159,18,57,0.22)] dark:text-rose-50";
  }

  return "border-border bg-card text-foreground";
}

export function getChoiceBadgeToneClassName(
  choiceValue: string,
  feedback: AnswerFeedback | null,
  selectedValue?: string | null
) {
  if (!feedback || feedback.correct) {
    if (choiceValue === selectedValue) {
      return "border-sky-300 bg-white text-sky-700 dark:border-sky-400/45 dark:bg-[rgba(14,116,144,0.28)] dark:text-sky-50";
    }

    return "border-border text-muted-foreground";
  }

  if (choiceValue === selectedValue || choiceValue === feedback.submittedAnswer) {
    return "border-rose-300 bg-card text-rose-600 dark:border-rose-400/45 dark:bg-[rgba(159,18,57,0.28)] dark:text-rose-50";
  }

  return "border-border text-muted-foreground";
}

export function getPartOfSpeechLabel(partOfSpeech: string, labels: PartOfSpeechLabels) {
  switch (partOfSpeech) {
    case "NOUN":
      return labels.NOUN;
    case "VERB":
      return labels.VERB;
    case "PHRASAL_VERB":
      return labels.PHRASAL_VERB;
    case "ADJECTIVE":
      return labels.ADJECTIVE;
    case "ADVERB":
      return labels.ADVERB;
    case "PHRASE":
      return labels.PHRASE;
    default:
      return labels.DEFAULT;
  }
}
