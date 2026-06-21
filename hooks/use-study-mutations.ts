"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  studyKeys,
  syncRestartUnitCaches,
  syncSubmitAnswerCaches
} from "@/hooks/study-cache";
import { publicStudyService } from "@/services/public-study.service";
import { useProgressStore } from "@/store/progress-store";
import type { EntityId } from "@/types/common";
import type {
  PracticeMode,
  SubmitAnswerPayload
} from "@/types/study";

export function useSubmitAnswer() {
  const queryClient = useQueryClient();
  const setProgress = useProgressStore((state) => state.setProgress);

  return useMutation({
    mutationFn: ({
      progressToken,
      payload
    }: {
      progressToken: string;
      slug: string;
      unitId: EntityId;
      payload: SubmitAnswerPayload;
    }) => publicStudyService.submitAnswer(progressToken, payload),
    onSuccess: (data, variables) => {
      syncSubmitAnswerCaches(queryClient, data, variables);
      queryClient.setQueryData(studyKeys.progress, data.progress);
      setProgress(data.progress);
    }
  });
}

export function useRestartUnit() {
  const queryClient = useQueryClient();
  const setProgress = useProgressStore((state) => state.setProgress);

  return useMutation({
    mutationFn: ({
      progressToken,
      slug,
      unitId,
    }: {
      progressToken: string;
      slug: string;
      unitId: EntityId;
      mode?: PracticeMode;
    }) => publicStudyService.restartUnit(progressToken, slug, unitId),
    onSuccess: (data, variables) => {
      setProgress(data.progress);
      queryClient.setQueryData(studyKeys.progress, data.progress);
      syncRestartUnitCaches(queryClient, data, variables);
    }
  });
}
