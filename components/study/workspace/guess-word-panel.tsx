"use client";

import { CircleHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InfoLine,
  InlineAnswerFeedback,
  PracticeHeroTile,
  getPartOfSpeechLabel
} from "@/components/study/workspace/panel-shared";
import type {
  AnswerFeedback,
  PartOfSpeechLabels,
  WorkspaceCopy
} from "@/components/study/workspace/types";
import { formatMessage } from "@/locales/format";
import type { StudyItem } from "@/types/study";

export function GuessWordPanel({
  item,
  answer,
  copy,
  partOfSpeechLabels,
  onAnswerChange,
  onSubmit,
  showHint,
  onToggleHint,
  feedback,
  onRetry,
  onNext,
  isSubmitting
}: {
  item: StudyItem;
  answer: string;
  copy: WorkspaceCopy;
  partOfSpeechLabels: PartOfSpeechLabels;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  showHint: boolean;
  onToggleHint: () => void;
  feedback: AnswerFeedback | null;
  onRetry: () => void;
  onNext?: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="space-y-6">
      <PracticeHeroTile
        label={item.partOfSpeech}
        partOfSpeechLabels={partOfSpeechLabels}
      />

      <div className="space-y-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <h2 className="break-words text-4xl font-black tracking-tight text-sky-600 dark:text-sky-300 sm:text-5xl">
            {item.meaning || copy.noMeaning}
          </h2>
          <Badge
            variant="outline"
            className="max-w-full rounded-xl border-border bg-muted/60 px-3 py-1 text-center text-muted-foreground dark:border-slate-700 dark:bg-slate-800/64 dark:text-slate-200"
          >
            {getPartOfSpeechLabel(item.partOfSpeech, partOfSpeechLabels)}
          </Badge>
        </div>

        <div className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
          <InfoLine
            label={copy.englishDefinition}
            value={item.definition || copy.noContent}
          />
          <InfoLine
            label={copy.meaningLabel}
            value={item.meaning || copy.noContent}
          />
          <InfoLine
            label={copy.exampleLabel}
            value={item.exampleSentenceMasked || item.exampleSentence || copy.noContent}
          />
          <InfoLine
            label={copy.translationLabel}
            value={item.exampleTranslation || copy.noContent}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-[460px] flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onToggleHint}
          className="rounded-full border-amber-300 bg-amber-50 px-5 text-amber-700 hover:bg-amber-100 dark:border-amber-500/35 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/16"
        >
          <CircleHelp className="mr-2 h-4 w-4" />
          {copy.guessHint}
        </Button>
      </div>

      {showHint ? (
        <div className="mx-auto max-w-[560px] rounded-[22px] border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm leading-7 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          {item.hint ||
            formatMessage(copy.sampleAnswer, {
              word: item.word || copy.noWord
            })}
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[560px] flex-col gap-3">
        <Input
          value={answer}
          onChange={(event) => {
            onRetry();
            onAnswerChange(event.target.value);
          }}
          placeholder={copy.answerPlaceholder}
          className="h-14 rounded-2xl border-border px-5 text-center text-lg dark:border-slate-700 dark:bg-slate-950/84 dark:text-slate-50 dark:placeholder:text-slate-400"
        />
        <div className="grid gap-3">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-14 rounded-2xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
          >
            {copy.checkAnswer}
          </Button>
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
