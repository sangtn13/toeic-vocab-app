"use client";

import { useEffect } from "react";
import { usePreferences } from "@/app/preferences-provider";
import { useI18n } from "@/hooks/use-i18n";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { useProgressStore } from "@/store/progress-store";
import { getUserFacingErrorMessage, isApiClientError } from "@/utils/error";

export function useAuthBootstrap() {
  const { locale } = usePreferences();
  const authCopy = useI18n("hooks").auth;
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const bootstrapStatus = useAuthStore((state) => state.bootstrapStatus);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setBootstrapState = useAuthStore((state) => state.setBootstrapState);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!accessToken) {
      setUser(null);
      setBootstrapState("idle", null);
      return;
    }

    if (user) {
      if (bootstrapStatus !== "ready") {
        setBootstrapState("ready", null);
      }
      return;
    }

    if (bootstrapStatus === "loading") {
      return;
    }

    let cancelled = false;

    setBootstrapState("loading", null);
    authService
      .me()
      .then((nextUser) => {
        if (cancelled) {
          return;
        }

        setUser(nextUser);
        setBootstrapState("ready", null);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        if (isApiClientError(error) && error.status === 401) {
          clearAuth();
          useProgressStore.getState().setBootstrapState("idle", null);
          return;
        }

        setBootstrapState(
          "failed",
          getUserFacingErrorMessage(
            error,
            authCopy.restoreAuthFailed,
            locale
          )
        );
      });

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    bootstrapStatus,
    clearAuth,
    hasHydrated,
    locale,
    authCopy.restoreAuthFailed,
    setBootstrapState,
    setUser,
    user
  ]);
}
