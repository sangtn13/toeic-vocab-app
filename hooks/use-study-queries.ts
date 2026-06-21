"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { studyKeys } from "@/hooks/study-cache";
import {
  recoverStudyProgress,
  shouldRecoverProgress
} from "@/hooks/study-progress-recovery";
import { publicStudyService } from "@/services/public-study.service";
import { useProgressStore } from "@/store/progress-store";
import type { EntityId } from "@/types/common";
import type { PracticeMode } from "@/types/study";

export const PUBLIC_STUDY_PAGE_SIZE = 10;

export function useStudySets() {
  const progressToken = useProgressStore((state) => state.progress?.progressToken);
  const progressHasHydrated = useProgressStore((state) => state.hasHydrated);
  const progressBootstrapStatus = useProgressStore((state) => state.bootstrapStatus);

  return useInfiniteQuery({
    queryKey: studyKeys.studySets(progressToken),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      try {
        return await publicStudyService.getStudySets({
          progressToken,
          page: pageParam,
          size: PUBLIC_STUDY_PAGE_SIZE
        });
      } catch (error) {
        if (progressToken && shouldRecoverProgress(error)) {
          recoverStudyProgress();
        }

        throw error;
      }
    },
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
    enabled: progressHasHydrated && progressBootstrapStatus !== "loading",
    retry: false,
    staleTime: 30_000
  });
}

export function useStudySetDetail(
  slug: string,
  progressToken?: string,
  enabled = true
) {
  return useQuery({
    queryKey: studyKeys.studySetDetail(slug, progressToken),
    queryFn: async () => {
      try {
        return await publicStudyService.getStudySetDetail(slug, progressToken);
      } catch (error) {
        if (progressToken && shouldRecoverProgress(error)) {
          recoverStudyProgress();
        }

        throw error;
      }
    },
    enabled: !!slug && enabled,
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 30_000
  });
}

export function useStudySetUnits(
  slug: string,
  progressToken?: string,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: studyKeys.studySetUnits(slug, progressToken),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      try {
        return await publicStudyService.getStudySetUnits(slug, {
          progressToken,
          page: pageParam,
          size: PUBLIC_STUDY_PAGE_SIZE
        });
      } catch (error) {
        if (progressToken && shouldRecoverProgress(error)) {
          recoverStudyProgress();
        }

        throw error;
      }
    },
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
    enabled: !!slug && enabled,
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 30_000
  });
}

export function useStudyActivity({
  slug,
  unitId,
  mode,
  progressToken,
  enabled = true
}: {
  slug: string;
  unitId: EntityId;
  mode: PracticeMode;
  progressToken?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: studyKeys.studyActivity({ slug, unitId, mode, progressToken }),
    queryFn: async () => {
      try {
        return await publicStudyService.getStudyActivity({
          slug,
          unitId,
          mode,
          progressToken
        });
      } catch (error) {
        if (progressToken && shouldRecoverProgress(error)) {
          recoverStudyProgress();
        }

        throw error;
      }
    },
    enabled: !!slug && !!unitId && enabled,
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 30_000
  });
}
