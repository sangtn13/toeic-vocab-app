"use client";

import dynamic from "next/dynamic";
import { Trophy } from "lucide-react";
import { MetricSummary } from "@/components/study/workspace/shared";
import type { WorkspaceCopy } from "@/components/study/workspace/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { formatMessage } from "@/locales/format";
import type { EntityId } from "@/types/common";
import type { UnitCompletion } from "@/types/study";

const AuthPanel = dynamic(
  () => import("@/components/auth/auth-panel").then((module) => module.AuthPanel)
);

export function WorkspaceDialogs({
  copy,
  completionOpen,
  completionData,
  authOpen,
  restartConfirmOpen,
  restartPending,
  onCompletionOpenChange,
  onAuthOpenChange,
  onRequestRestart,
  onRestartConfirmOpenChange,
  onRestart,
  onSelectNextUnit
}: {
  copy: WorkspaceCopy;
  completionOpen: boolean;
  completionData?: UnitCompletion;
  authOpen: boolean;
  restartConfirmOpen: boolean;
  restartPending: boolean;
  onCompletionOpenChange: (open: boolean) => void;
  onAuthOpenChange: (open: boolean) => void;
  onRequestRestart: () => void;
  onRestartConfirmOpenChange: (open: boolean) => void;
  onRestart: () => void;
  onSelectNextUnit: (unitId: EntityId) => void;
}) {
  return (
    <>
      <Dialog
        open={completionOpen}
        onOpenChange={onCompletionOpenChange}
      >
        <DialogContent className="max-w-2xl rounded-[28px] border-border bg-card dark:border-slate-700 dark:bg-slate-950/96">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-8 text-xl sm:text-2xl">
              <Trophy className="h-6 w-6 text-amber-500 dark:text-amber-300" />
              {copy.completionTitle}
            </DialogTitle>
            <DialogDescription>{copy.completionDescription}</DialogDescription>
          </DialogHeader>

          {completionData ? (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <MetricSummary
                  title={copy.unitProgressTitle}
                  value={completionData.unitProgress.percentage}
                  helper={formatMessage(copy.learnedWords, {
                    learned: completionData.unitProgress.learnedWords,
                    total: completionData.unitProgress.totalWords
                  })}
                />
                <MetricSummary
                  title={copy.studySetProgressTitle}
                  value={completionData.studySetProgress.percentage}
                  helper={formatMessage(copy.learnedWords, {
                    learned: completionData.studySetProgress.learnedWords,
                    total: completionData.studySetProgress.totalWords
                  })}
                />
              </div>

              <div className="rounded-[24px] border border-border bg-muted/60 p-4 dark:border-slate-700 dark:bg-slate-900/72">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-300">
                  {copy.reviewWords}
                </p>
                <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1">
                  {completionData.vocabularies.map((vocabulary) => (
                    <div
                      key={vocabulary.vocabularyId}
                      className="rounded-2xl border border-border bg-card p-4 dark:border-slate-700 dark:bg-slate-950/92"
                    >
                      <p className="text-lg font-bold">{vocabulary.word}</p>
                      <p className="mt-1 text-sm text-muted-foreground dark:text-slate-300">{vocabulary.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={onRequestRestart}
                  className="rounded-2xl border-border dark:border-slate-700 dark:bg-slate-900/76 dark:text-slate-100 dark:hover:bg-slate-800/82"
                >
                  {copy.restartFromBeginning}
                </Button>
                {completionData.nextUnit ? (
                  <Button
                    className="rounded-2xl dark:shadow-[0_12px_28px_rgba(34,211,238,0.16)]"
                    onClick={() => onSelectNextUnit(completionData.nextUnit!.unitId)}
                  >
                    {copy.nextUnit}
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={authOpen}
        onOpenChange={onAuthOpenChange}
      >
        <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{copy.authDialogTitle}</DialogTitle>
            <DialogDescription>{copy.authDialogDescription}</DialogDescription>
          </DialogHeader>
          <AuthPanel
            title={copy.authPanelTitle}
            description={copy.authPanelDescription}
            onSuccess={() => onAuthOpenChange(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={restartConfirmOpen}
        onOpenChange={onRestartConfirmOpenChange}
      >
        <DialogContent className="max-w-[28rem] rounded-[28px] border-border/80 bg-card/98 p-5 sm:max-w-[32rem] sm:p-6 dark:border-slate-700 dark:bg-slate-950/96">
          <DialogHeader className="space-y-3 pr-8">
            <DialogTitle className="text-xl font-black tracking-tight sm:text-2xl">
              {copy.restartConfirmTitle}
            </DialogTitle>
            <DialogDescription className="text-sm leading-7 dark:text-slate-300">
              {copy.restartConfirmDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 grid gap-3 sm:grid-cols-2 [&>*]:w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onRestartConfirmOpenChange(false)}
              disabled={restartPending}
              className="h-11 rounded-2xl border-border dark:border-slate-700 dark:bg-slate-900/76 dark:text-slate-100 dark:hover:bg-slate-800/82"
            >
              {copy.restartConfirmCancel}
            </Button>
            <Button
              type="button"
              onClick={onRestart}
              disabled={restartPending}
              className="h-11 rounded-2xl bg-destructive text-destructive-foreground shadow-[0_16px_36px_rgba(239,68,68,0.24)] hover:bg-destructive/90"
            >
              {copy.restartConfirmAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

