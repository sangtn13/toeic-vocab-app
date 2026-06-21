"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AudioLabel,
  PracticeHeroTile,
  getPartOfSpeechLabel
} from "@/components/study/workspace/panel-shared";
import type {
  PartOfSpeechLabels,
  WorkspaceCopy
} from "@/components/study/workspace/types";
import { formatMessage } from "@/locales/format";
import type { StudyItem } from "@/types/study";

export function FlashcardPanel({
  item,
  flipped,
  copy,
  partOfSpeechLabels,
  onFlip,
  onPlayUs,
  onPlayUk,
  currentIndex,
  totalItems,
  onPrev,
  onNext
}: {
  item: StudyItem;
  flipped: boolean;
  copy: WorkspaceCopy;
  partOfSpeechLabels: PartOfSpeechLabels;
  onFlip: () => void;
  onPlayUs: () => void;
  onPlayUk: () => void;
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col rounded-[26px] border border-border bg-card p-3 sm:p-4 xl:p-5">
        <button
          type="button"
          onClick={onFlip}
          className="flex min-h-0 flex-1 items-center justify-center rounded-[24px] border border-border/70 px-3 py-4 text-center transition hover:bg-muted/40 sm:px-4 sm:py-5 xl:px-5 xl:py-6"
        >
          <div className="mx-auto flex h-full w-full max-w-none flex-col items-center justify-center gap-5 px-4 py-6 sm:px-6 sm:py-8">
            <PracticeHeroTile
              label={item.partOfSpeech}
              partOfSpeechLabels={partOfSpeechLabels}
              compact
            />

            {!flipped ? (
              <>
                <h2 className="break-words text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                  {item.word || copy.noWord}
                </h2>
                <Badge
                  variant="outline"
                  className="rounded-xl border-border bg-muted/60 px-4 py-1 text-foreground dark:border-slate-700 dark:bg-slate-800/64 dark:text-slate-100"
                >
                  {getPartOfSpeechLabel(item.partOfSpeech, partOfSpeechLabels)}
                </Badge>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                  <AudioLabel
                    label={item.phoneticUs ? `US: ${item.phoneticUs}` : copy.audioUsMissing}
                    onPlay={onPlayUs}
                  />
                  <AudioLabel
                    label={item.phoneticUk ? `UK: ${item.phoneticUk}` : copy.audioUkMissing}
                    onPlay={onPlayUk}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{copy.pressToFlip}</p>
              </>
            ) : (
              <div className="space-y-3 text-center">
                <h3 className="break-words text-3xl font-black tracking-tight text-sky-600 dark:text-sky-300 sm:text-4xl">
                  {item.meaning || copy.noMeaning}
                </h3>
                <p className="break-words text-base leading-7 text-muted-foreground">
                  {item.definition || copy.noDefinition}
                </p>
                <p className="break-words text-sm leading-7 text-muted-foreground">
                  {item.exampleSentence || copy.noExample}
                </p>
                <p className="break-words text-sm leading-7 text-muted-foreground">
                  {item.exampleTranslation || copy.noExampleTranslation}
                </p>
              </div>
            )}
          </div>
        </button>

        <div className="flex flex-col items-center justify-between gap-3 px-1 py-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {formatMessage(copy.cardProgress, {
              current: currentIndex + 1,
              total: totalItems
            })}
          </p>
          <div className="grid w-full max-w-[360px] grid-cols-2 gap-3 sm:w-[360px]">
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="h-11 w-full rounded-2xl border-border bg-card px-4"
            >
              <span className="grid w-full grid-cols-[16px_minmax(0,1fr)_16px] items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-center">{copy.previousCard}</span>
                <span aria-hidden="true" />
              </span>
            </Button>
            <Button
              type="button"
              onClick={onNext}
              disabled={currentIndex >= totalItems - 1}
              className="h-11 w-full rounded-2xl px-4"
            >
              <span className="grid w-full grid-cols-[16px_minmax(0,1fr)_16px] items-center gap-2">
                <span aria-hidden="true" />
                <span className="text-center">{copy.nextCardButton}</span>
                <ChevronRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
