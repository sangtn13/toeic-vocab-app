import type { EntityId } from "@/types/common";
import type { PracticeMode } from "@/types/study";

export const apiConfig = {
  browserBaseUrl: "/api/v1",
  timeout: 15000
} as const;

export const apiEndpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout"
  },
  public: {
    progress: "/public/progress",
    studySets: "/public/study-sets",
    studySetDetail: (slug: string) => `/public/study-sets/${slug}`,
    studySetUnits: (slug: string) => `/public/study-sets/${slug}/units`,
    studyActivity: (slug: string, unitId: EntityId, mode: PracticeMode) =>
      `/public/study-sets/${slug}/units/${unitId}/activities/${mode}`,
    submitAnswer: (progressToken: string) => `/public/progress/${progressToken}/answers`,
    restartUnit: (progressToken: string, slug: string, unitId: EntityId) =>
      `/public/progress/${progressToken}/study-sets/${slug}/units/${unitId}/restart`
  },
  admin: {
    studySets: "/admin/study-sets",
    studySetDetail: (studySetId: EntityId) => `/admin/study-sets/${studySetId}`,
    units: (studySetId: EntityId) => `/admin/study-sets/${studySetId}/units`,
    unitDetail: (unitId: EntityId) => `/admin/units/${unitId}`,
    vocabularies: (unitId: EntityId) => `/admin/units/${unitId}/vocabularies`,
    vocabularyDetail: (vocabularyId: EntityId) => `/admin/vocabularies/${vocabularyId}`
  }
} as const;
