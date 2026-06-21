import { apiEndpoints } from "@/config/api";
import { unwrapApiResponse } from "@/lib/api-response";
import { apiClient } from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types/api";
import { getUnitStatus } from "@/utils/study-progress";
import type { EntityId, ProgressSummary } from "@/types/common";
import type {
  AnswerResult,
  PracticeMode,
  StudyProgressResolution,
  RestartUnitResult,
  StudyActivity,
  StudySetCard,
  StudySetDetail,
  StudyUnitProgress,
  SubmitAnswerPayload,
  UnitCompletion
} from "@/types/study";

function getNormalizedPercentage(progress: Pick<ProgressSummary, "totalWords" | "learnedWords">) {
  if (progress.totalWords <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((progress.learnedWords / progress.totalWords) * 100)));
}

function normalizeProgressSummary(progress: ProgressSummary): ProgressSummary {
  return {
    ...progress,
    percentage: getNormalizedPercentage(progress)
  };
}

function normalizeStudyUnitProgress(unit: StudyUnitProgress): StudyUnitProgress {
  const normalizedProgress = normalizeProgressSummary(unit);

  return {
    ...unit,
    ...normalizedProgress,
    status: getUnitStatus(normalizedProgress)
  };
}

function normalizeStudySetDetail(detail: StudySetDetail): StudySetDetail {
  return {
    ...detail,
    progress: normalizeProgressSummary(detail.progress)
  };
}

function normalizeStudyActivity(activity: StudyActivity): StudyActivity {
  return {
    ...activity,
    studySetProgress: normalizeProgressSummary(activity.studySetProgress),
    unitProgress: normalizeProgressSummary(activity.unitProgress)
  };
}

function normalizeUnitCompletion(completion: UnitCompletion): UnitCompletion {
  return {
    ...completion,
    unitProgress: normalizeProgressSummary(completion.unitProgress),
    studySetProgress: normalizeProgressSummary(completion.studySetProgress)
  };
}

function normalizeAnswerResult(result: AnswerResult): AnswerResult {
  return {
    ...result,
    studySetProgress: normalizeProgressSummary(result.studySetProgress),
    unitProgress: normalizeProgressSummary(result.unitProgress),
    studyActivity: result.studyActivity ? normalizeStudyActivity(result.studyActivity) : result.studyActivity,
    unitCompletion: result.unitCompletion ? normalizeUnitCompletion(result.unitCompletion) : result.unitCompletion
  };
}

function normalizeRestartUnitResult(result: RestartUnitResult): RestartUnitResult {
  return {
    ...result,
    studySetProgress: normalizeProgressSummary(result.studySetProgress),
    unitProgress: normalizeProgressSummary(result.unitProgress)
  };
}

function normalizePagedStudyUnits(payload: PagedResponse<StudyUnitProgress>) {
  return {
    ...payload,
    items: payload.items.map(normalizeStudyUnitProgress)
  };
}

export const publicStudyService = {
  async resolveStudyProgress(payload?: {
    displayName?: string;
    progressToken?: string;
    clientKey?: string;
  }) {
    const response = await apiClient.post<ApiResponse<StudyProgressResolution>>(
      apiEndpoints.public.progress,
      payload ?? {}
    );
    return unwrapApiResponse(response.data);
  },

  async getStudySets(payload?: {
    progressToken?: string;
    page?: number;
    size?: number;
  }) {
    const response = await apiClient.get<ApiResponse<PagedResponse<StudySetCard>>>(
      apiEndpoints.public.studySets,
      {
        params: {
          page: payload?.page ?? 0,
          size: payload?.size ?? 10,
          ...(payload?.progressToken ? { progressToken: payload.progressToken } : {})
        }
      }
    );
    return unwrapApiResponse(response.data);
  },

  async getStudySetDetail(slug: string, progressToken?: string) {
    const response = await apiClient.get<ApiResponse<StudySetDetail>>(
      apiEndpoints.public.studySetDetail(slug),
      {
        params: progressToken ? { progressToken } : undefined
      }
    );
    return normalizeStudySetDetail(unwrapApiResponse(response.data));
  },

  async getStudySetUnits(
    slug: string,
    payload?: {
      progressToken?: string;
      page?: number;
      size?: number;
    }
  ) {
    const response = await apiClient.get<ApiResponse<PagedResponse<StudyUnitProgress>>>(
      apiEndpoints.public.studySetUnits(slug),
      {
        params: {
          page: payload?.page ?? 0,
          size: payload?.size ?? 10,
          ...(payload?.progressToken ? { progressToken: payload.progressToken } : {})
        }
      }
    );
    return normalizePagedStudyUnits(unwrapApiResponse(response.data));
  },

  async getStudyActivity({
    slug,
    unitId,
    mode,
    progressToken
  }: {
    slug: string;
    unitId: EntityId;
    mode: PracticeMode;
    progressToken?: string;
  }) {
    const response = await apiClient.get<ApiResponse<StudyActivity>>(
      apiEndpoints.public.studyActivity(slug, unitId, mode),
      {
        params: progressToken ? { progressToken } : undefined
      }
    );
    return normalizeStudyActivity(unwrapApiResponse(response.data));
  },

  async submitAnswer(progressToken: string, payload: SubmitAnswerPayload) {
    const response = await apiClient.post<ApiResponse<AnswerResult>>(
      apiEndpoints.public.submitAnswer(progressToken),
      payload
    );
    return normalizeAnswerResult(unwrapApiResponse(response.data));
  },

  async restartUnit(progressToken: string, slug: string, unitId: EntityId) {
    const response = await apiClient.post<ApiResponse<RestartUnitResult>>(
      apiEndpoints.public.restartUnit(progressToken, slug, unitId)
    );
    return normalizeRestartUnitResult(unwrapApiResponse(response.data));
  }
};