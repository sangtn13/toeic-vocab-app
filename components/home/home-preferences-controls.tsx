"use client";

import { useEffect, useState, type ComponentType } from "react";

type PreferencesControlsProps = {
  compact?: boolean;
  compactStyle?: "icon" | "button" | "sidebar";
  className?: string;
};

const preferencesControlsClassName =
  "fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-[calc(env(safe-area-inset-right)+1rem)] z-40 h-14 w-14 rounded-full border-border bg-card/95 shadow-[0_18px_40px_rgba(15,23,42,0.2)] backdrop-blur supports-[backdrop-filter]:bg-card/88 sm:bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:right-[calc(env(safe-area-inset-right)+1.5rem)]";

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: () => void) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function HomePreferencesControls() {
  const [PreferencesControls, setPreferencesControls] = useState<ComponentType<PreferencesControlsProps> | null>(null);

  useEffect(() => {
    const currentWindow = window as WindowWithIdleCallback;
    let cancelled = false;

    const loadPreferencesControls = () => {
      void import("@/components/app-shell/preferences-controls").then((module) => {
        if (!cancelled) {
          setPreferencesControls(() => module.PreferencesControls);
        }
      });
    };

    const idleHandle = currentWindow.requestIdleCallback?.(loadPreferencesControls);

    if (idleHandle === undefined) {
      const timeoutHandle = window.setTimeout(loadPreferencesControls, 1);

      return () => {
        cancelled = true;
        window.clearTimeout(timeoutHandle);
      };
    }

    return () => {
      cancelled = true;
      currentWindow.cancelIdleCallback?.(idleHandle);
    };
  }, []);

  if (!PreferencesControls) {
    return null;
  }

  return (
    <PreferencesControls
      compact
      className={preferencesControlsClassName}
    />
  );
}
