"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StudyProgress } from "@/types/study";

type ProgressBootstrapStatus = "idle" | "loading" | "ready" | "failed";

type ProgressState = {
  clientKey: string | null;
  progress: StudyProgress | null;
  bootstrapStatus: ProgressBootstrapStatus;
  bootstrapError: string | null;
  hasHydrated: boolean;
  ensureClientKey: () => string;
  setProgress: (progress: StudyProgress | null) => void;
  setBootstrapState: (
    bootstrapStatus: ProgressBootstrapStatus,
    bootstrapError?: string | null
  ) => void;
  clearProgress: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const storageKey = "vocasa-study-progress";

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      clientKey: null,
      progress: null,
      bootstrapStatus: "idle",
      bootstrapError: null,
      hasHydrated: false,
      ensureClientKey: () => {
        const existingClientKey = get().clientKey;
        if (existingClientKey) {
          return existingClientKey;
        }

        const nextClientKey =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `client-${Date.now()}`;

        set({ clientKey: nextClientKey });
        return nextClientKey;
      },
      setProgress: (progress) =>
        set({
          progress,
          bootstrapStatus: progress?.progressToken ? "ready" : "idle",
          bootstrapError: null
        }),
      setBootstrapState: (bootstrapStatus, bootstrapError = null) =>
        set({ bootstrapStatus, bootstrapError }),
      clearProgress: () =>
        set({
          progress: null,
          bootstrapStatus: "idle",
          bootstrapError: null
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated })
    }),
    {
      name: storageKey,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        clientKey: state.clientKey,
        progress: state.progress
      }),
      onRehydrateStorage: () => (state) => {
        state?.setBootstrapState("idle", null);
        state?.setHasHydrated(true);
      }
    }
  )
);
