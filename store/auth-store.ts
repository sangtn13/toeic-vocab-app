"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthResponse, AuthUser } from "@/types/auth";

type AuthBootstrapStatus = "idle" | "loading" | "ready" | "failed";

type AuthState = {
  accessToken: string | null;
  expiresAt: string | null;
  user: AuthUser | null;
  bootstrapStatus: AuthBootstrapStatus;
  bootstrapError: string | null;
  setAuth: (payload: AuthResponse) => void;
  setUser: (user: AuthUser | null) => void;
  setBootstrapState: (
    bootstrapStatus: AuthBootstrapStatus,
    bootstrapError?: string | null
  ) => void;
  clearAuth: () => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      expiresAt: null,
      user: null,
      bootstrapStatus: "idle",
      bootstrapError: null,
      hasHydrated: false,
      setAuth: (payload) =>
        set({
          accessToken: payload.accessToken,
          expiresAt: payload.expiresAt,
          user: payload.user,
          bootstrapStatus: "ready",
          bootstrapError: null
        }),
      setUser: (user) =>
        set((state) => ({
          user,
          bootstrapStatus: state.accessToken ? "ready" : "idle",
          bootstrapError: null
        })),
      setBootstrapState: (bootstrapStatus, bootstrapError = null) =>
        set({ bootstrapStatus, bootstrapError }),
      clearAuth: () =>
        set({
          accessToken: null,
          expiresAt: null,
          user: null,
          bootstrapStatus: "idle",
          bootstrapError: null
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated })
    }),
    {
      name: "vocasa-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
        user: state.user
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
