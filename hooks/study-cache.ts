import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { PagedResponse } from "@/types/api";
import {
  getStudySetLearningStatus,
  getUnitStatus
} from "@/utils/study-progress";
import type { EntityId, ProgressSummary } from "@/types/common";
import type {
  AnswerResult,
  PracticeMode,
  RestartUnitResult,
  StudyActivity,
  StudySetCard,
  StudySetDetail,
  StudyUnitProgress,
  SubmitAnswerPayload,
  UnitCompletion
} from "@/types/study";

export const studyKeys = {
  progress: ["study-progress"] as const,
  studySets: (progressToken?: string) => ["public-study-sets", progressToken] as const,
  studySetDetail: (slug: string, progressToken?: string) =>
    ["public-study-set-detail", slug, progressToken] as const,
  studySetUnits: (slug: string, progressToken?: string) =>
    ["public-study-set-units", slug, progressToken] as const,
  studyActivity: ({
    slug,
    unitId,
    mode,
    progressToken
  }: {
    slug: string;
    unitId: EntityId;
    mode: PracticeMode;
    progressToken?: string;
  }) => ["public-study-activity", slug, unitId, mode, progressToken] as const
};

function getEmbeddedStudyActivity(payload: {
  studyActivity?: StudyActivity | null;
}) {
  return payload.studyActivity ?? null;
}

function getEmbeddedUnitCompletion(payload: {
  unitCompletion?: UnitCompletion | null;
}) {
  return payload.unitCompletion ?? null;
}

function getUniqueProgressTokens(...tokens: Array<string | undefined>) {
  return Array.from(new Set(tokens.filter(Boolean))) as string[];
}

function patchStudyUnitProgress(
  unit: StudyUnitProgress,
  {
    unitId,
    unitProgress
  }: {
    unitId: EntityId;
    unitProgress: ProgressSummary;
  }
) {
  if (unit.id === unitId) {
    return {
      ...unit,
      learnedWords: unitProgress.learnedWords,
      masteredWords: unitProgress.masteredWords,
      percentage: unitProgress.totalWords > 0
        ? Math.min(100, Math.max(0, Math.round((unitProgress.learnedWords / unitProgress.totalWords) * 100)))
        : 0,
      status: getUnitStatus(unitProgress)
    };
  }

  return unit;
}

function updateStudySetsCache(
  queryClient: QueryClient,
  progressTokens: string[],
  slug: string,
  progress: ProgressSummary
) {
  const learningStatus = getStudySetLearningStatus(progress);

  progressTokens.forEach((progressToken) => {
    queryClient.setQueryData<InfiniteData<PagedResponse<StudySetCard>> | undefined>(
      studyKeys.studySets(progressToken),
      (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) => ({
                ...page,
                items: page.items.map((studySet) =>
                  studySet.slug === slug
                    ? {
                        ...studySet,
                        learningStatus
                      }
                    : studySet
                )
              }))
            }
          : current
    );
  });
}

function patchStudySetDetail(
  current: StudySetDetail,
  studySetProgress: ProgressSummary
): StudySetDetail {
  return {
    ...current,
    progress: studySetProgress
  };
}

function updateStudySetDetailCache(
  queryClient: QueryClient,
  progressTokens: string[],
  slug: string,
  studySetProgress: ProgressSummary
) {
  progressTokens.forEach((progressToken) => {
    queryClient.setQueryData<StudySetDetail | undefined>(
      studyKeys.studySetDetail(slug, progressToken),
      (current) => {
        if (!current) {
          return current;
        }

        return patchStudySetDetail(current, studySetProgress);
      }
    );
  });
}

function updateStudySetUnitsCache(
  queryClient: QueryClient,
  progressTokens: string[],
  slug: string,
  {
    unitId,
    unitProgress
  }: {
    unitId: EntityId;
    unitProgress: ProgressSummary;
  }
) {
  progressTokens.forEach((progressToken) => {
    queryClient.setQueryData<InfiniteData<PagedResponse<StudyUnitProgress>> | undefined>(
      studyKeys.studySetUnits(slug, progressToken),
      (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) => ({
                ...page,
                items: page.items.map((unit) =>
                  patchStudyUnitProgress(unit, {
                    unitId,
                    unitProgress
                  })
                )
              }))
            }
          : current
    );
  });
}

function updateStudyActivityCache(
  queryClient: QueryClient,
  progressTokens: string[],
  {
    slug,
    unitId,
    practiceMode,
    activity
  }: {
    slug: string;
    unitId: EntityId;
    practiceMode: PracticeMode;
    activity: StudyActivity;
  }
) {
  progressTokens.forEach((progressToken) => {
    queryClient.setQueryData(
      studyKeys.studyActivity({
        slug,
        unitId,
        mode: practiceMode,
        progressToken
      }),
      activity
    );
  });
}

export function syncSubmitAnswerCaches(
  queryClient: QueryClient,
  result: AnswerResult,
  variables: {
    progressToken: string;
    slug: string;
    unitId: EntityId;
    payload: SubmitAnswerPayload;
  }
) {
  const progressTokens = getUniqueProgressTokens(
    variables.progressToken,
    result.progress.progressToken
  );
  const embeddedActivity = getEmbeddedStudyActivity(result);
  const embeddedUnitCompletion = getEmbeddedUnitCompletion(result);
  const resolvedUnitProgress =
    result.unitCompleted && embeddedUnitCompletion
      ? embeddedUnitCompletion.unitProgress
      : result.unitProgress;
  const resolvedStudySetProgress =
    result.unitCompleted && embeddedUnitCompletion
      ? embeddedUnitCompletion.studySetProgress
      : result.studySetProgress;

  updateStudySetUnitsCache(queryClient, progressTokens, variables.slug, {
    unitId: variables.unitId,
    unitProgress: resolvedUnitProgress
  });

  updateStudySetsCache(queryClient, progressTokens, variables.slug, resolvedStudySetProgress);
  updateStudySetDetailCache(queryClient, progressTokens, variables.slug, resolvedStudySetProgress);

  if (embeddedActivity) {
    updateStudyActivityCache(queryClient, progressTokens, {
      slug: variables.slug,
      unitId: variables.unitId,
      practiceMode: variables.payload.practiceMode,
      activity: embeddedActivity
    });
  }
}

export function syncRestartUnitCaches(
  queryClient: QueryClient,
  result: RestartUnitResult,
  variables: {
    progressToken: string;
    slug: string;
    unitId: EntityId;
    mode?: PracticeMode;
  }
) {
  const progressTokens = getUniqueProgressTokens(
    variables.progressToken,
    result.progress.progressToken
  );

  updateStudySetsCache(queryClient, progressTokens, variables.slug, result.studySetProgress);
  updateStudySetDetailCache(queryClient, progressTokens, variables.slug, result.studySetProgress);
  updateStudySetUnitsCache(queryClient, progressTokens, variables.slug, {
    unitId: variables.unitId,
    unitProgress: result.unitProgress
  });
}