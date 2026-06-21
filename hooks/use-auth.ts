"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePreferences } from "@/app/preferences-provider";
import { studyKeys } from "@/hooks/study-cache";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { useProgressStore } from "@/store/progress-store";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

const publicStudyQueryPrefixes = [
  ["public-study-sets"],
  ["public-study-set-detail"],
  ["public-study-set-units"],
  ["public-study-activity"],
  ["public-unit-completion"]
] as const;

function invalidatePublicStudyQueries(queryClient: ReturnType<typeof useQueryClient>) {
  publicStudyQueryPrefixes.forEach((queryKey) => {
    void queryClient.invalidateQueries({ queryKey });
  });
}

function cancelPublicStudyQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all(
    publicStudyQueryPrefixes.map((queryKey) => queryClient.cancelQueries({ queryKey }))
  );
}

function removePublicStudyQueries(queryClient: ReturnType<typeof useQueryClient>) {
  publicStudyQueryPrefixes.forEach((queryKey) => {
    queryClient.removeQueries({ queryKey });
  });
}

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const user = useAuthStore((state) => state.user);
  const bootstrapStatus = useAuthStore((state) => state.bootstrapStatus);
  const bootstrapError = useAuthStore((state) => state.bootstrapError);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return {
    accessToken,
    expiresAt,
    user,
    bootstrapStatus,
    bootstrapError,
    hasHydrated,
    isAuthenticated: !!accessToken && !!user,
    isAdmin: user?.role === "ADMIN"
  };
}

export function useLogin() {
  const { locale } = usePreferences();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    meta: {
      locale
    },
    onSuccess: (data) => {
      setAuth(data);
      useProgressStore.getState().setBootstrapState("idle", null);
      invalidatePublicStudyQueries(queryClient);
    }
  });
}

export function useRegister() {
  const { locale } = usePreferences();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    meta: {
      locale
    },
    onSuccess: (data) => {
      setAuth(data);
      useProgressStore.getState().setBootstrapState("idle", null);
      invalidatePublicStudyQueries(queryClient);
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    onMutate: async () => {
      await cancelPublicStudyQueries(queryClient);
    },
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      useProgressStore.getState().clearProgress();
      queryClient.removeQueries({ queryKey: studyKeys.progress });
      removePublicStudyQueries(queryClient);
    }
  });
}
