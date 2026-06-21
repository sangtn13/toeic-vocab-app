"use client";

import { useStudyProgress } from "@/hooks/use-study-progress";

export function StudyProgressBootstrap() {
  useStudyProgress(true);

  return null;
}

