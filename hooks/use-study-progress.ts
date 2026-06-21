"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePreferences } from "@/app/preferences-provider";
import { useI18n } from "@/hooks/use-i18n";
import { studyKeys } from "@/hooks/study-cache";
import { publicStudyService } from "@/services/public-study.service";
import { useAuthStore } from "@/store/auth-store";
import { useProgressStore } from "@/store/progress-store";
import { getUserFacingErrorMessage } from "@/utils/error";

export function useStudyProgress(autoBootstrap = false) {
  const { locale } = usePreferences();
  const studyCopy = useI18n("hooks").study;
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const authHasHydrated = useAuthStore((state) => state.hasHydrated);
  const authBootstrapStatus = useAuthStore((state) => state.bootstrapStatus);
  const authUser = useAuthStore((state) => state.user);
  const ensureClientKey = useProgressStore((state) => state.ensureClientKey);
  const progress = useProgressStore((state) => state.progress);
  const hasHydrated = useProgressStore((state) => state.hasHydrated);
  const bootstrapStatus = useProgressStore((state) => state.bootstrapStatus);
  const bootstrapError = useProgressStore((state) => state.bootstrapError);
  const setProgress = useProgressStore((state) => state.setProgress);
  const setBootstrapState = useProgressStore((state) => state.setBootstrapState);
  const waitingForAuthenticatedBootstrap =
    !!accessToken &&
    !authUser &&
    authBootstrapStatus !== "ready" &&
    authBootstrapStatus !== "failed";
  const shouldUpgradeGuestProgress =
    !!accessToken && authBootstrapStatus === "ready" && !progress?.persistent;

  const mutation = useMutation({
    mutationFn: async () => {
      const clientKey = ensureClientKey();
      const displayName =
        authUser?.fullName ??
        progress?.displayName ??
        studyCopy.learnerDisplayName;

      try {
        return await publicStudyService.resolveStudyProgress({
          displayName,
          progressToken: progress?.progressToken,
          clientKey
        });
      } catch (error) {
        if (!progress?.progressToken) {
          throw error;
        }

        setProgress(null);
        return publicStudyService.resolveStudyProgress({
          displayName,
          clientKey
        });
      }
    },
    onMutate: () => {
      setBootstrapState("loading", null);
    },
    onSuccess: (data) => {
      setProgress(data.progress);
      setBootstrapState("ready", null);
      queryClient.setQueryData(studyKeys.progress, data.progress);
    },
    onError: (error) => {
      setBootstrapState(
        "failed",
        getUserFacingErrorMessage(
          error,
          studyCopy.continueLessonFailed,
          locale
        )
      );
    }
  });

  useEffect(() => {
    if (
      !autoBootstrap ||
      !authHasHydrated ||
      !hasHydrated ||
      waitingForAuthenticatedBootstrap ||
      mutation.isPending
    ) {
      return;
    }

    if (bootstrapStatus === "idle" || shouldUpgradeGuestProgress) {
      mutation.mutate();
    }
  }, [
    authHasHydrated,
    hasHydrated,
    bootstrapStatus,
    mutation,
    autoBootstrap,
    shouldUpgradeGuestProgress,
    waitingForAuthenticatedBootstrap
  ]);

  return {
    progress,
    hasHydrated,
    bootstrapStatus,
    bootstrapError,
    isResolving: mutation.isPending,
    refreshProgress: async () => {
      setBootstrapState("idle", null);
      return mutation.mutateAsync();
    }
  };
}
