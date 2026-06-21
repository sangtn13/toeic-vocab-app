"use client";

import { cn } from "@/lib/utils";
import {
  InlineAnswerFeedback,
  getChoiceBadgeToneClassName,
  getChoiceToneClassName
} from "@/components/study/workspace/panel-shared";
import type { AnswerFeedback, WorkspaceCopy } from "@/components/study/workspace/types";
import type { StudyItem } from "@/types/study";

export function ChoicePanel({
  item,
  title,
  subtitle,
  prompt,
  copy,
  feedback,
  selectedValue,
  onRetry,
  onNext,
  onSelect
}: {
  item: StudyItem;
  title: string;
  subtitle: string;
  prompt: string;
  copy: WorkspaceCopy;
  feedback: AnswerFeedback | null;
  selectedValue?: string | null;
  onRetry: () => void;
  onNext?: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <h2 className="break-words text-4xl font-black tracking-tight text-sky-600 dark:text-sky-300 sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto max-w-3xl break-words text-base leading-8 text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-center text-base font-medium text-muted-foreground">{prompt}</p>
        <div className="mx-auto grid max-w-[560px] gap-3">
          {item.choices?.map((choice, index) => {
            const isAnswerLocked = feedback?.correct === false;
            const isSelectedWrongChoice =
              !!feedback &&
              !feedback.correct &&
              (choice.value === selectedValue || choice.value === feedback.submittedAnswer);
            const isSelectedPending = !feedback && choice.value === selectedValue;

            return (
              <button
                key={choice.value}
                type="button"
                aria-disabled={isAnswerLocked}
                onClick={() => {
                  if (!isAnswerLocked) {
                    onSelect(choice.value);
                  }
                }}
                className={cn(
                  "flex items-center gap-4 rounded-[22px] border px-4 py-4 text-left text-lg font-bold shadow-[0_8px_18px_rgba(148,163,184,0.12)] transition",
                  getChoiceToneClassName(choice.value, feedback, selectedValue),
                  !feedback &&
                    !isSelectedPending &&
                    "hover:border-sky-300 hover:bg-sky-50 dark:hover:border-sky-400/40 dark:hover:bg-sky-500/10",
                  isAnswerLocked && "pointer-events-none",
                  isSelectedWrongChoice && "ring-2 ring-rose-200 ring-offset-2 dark:ring-rose-400/40 dark:ring-offset-slate-950",
                  isSelectedPending && "ring-2 ring-sky-200 ring-offset-2 dark:ring-sky-400/30 dark:ring-offset-slate-950"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-base",
                    getChoiceBadgeToneClassName(choice.value, feedback, selectedValue)
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="min-w-0 break-words leading-7">{choice.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && !feedback.correct ? (
        <InlineAnswerFeedback
          correctAnswer={feedback.correctAnswer}
          copy={copy}
          onRetry={onRetry}
          onNext={onNext}
        />
      ) : null}
    </div>
  );
}
