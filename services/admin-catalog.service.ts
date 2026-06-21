import { apiEndpoints } from "@/config/api";
import { unwrapApiResponse } from "@/lib/api-response";
import { apiClient } from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types/api";
import type { EntityId } from "@/types/common";
import type {
  AdminStudySet,
  AdminStudyUnit,
  AdminVocabulary,
  StudySetUpsertPayload,
  StudyUnitUpsertPayload,
  VocabularyUpsertPayload
} from "@/types/admin";

type PaginationParams = {
  page?: number;
  size?: number;
  keyword?: string;
};

export const adminCatalogService = {
  async getStudySets(params?: PaginationParams) {
    const response = await apiClient.get<ApiResponse<PagedResponse<AdminStudySet>>>(
      apiEndpoints.admin.studySets,
      { params }
    );
    return unwrapApiResponse(response.data);
  },

  async getStudySet(studySetId: EntityId) {
    const response = await apiClient.get<ApiResponse<AdminStudySet>>(
      apiEndpoints.admin.studySetDetail(studySetId)
    );
    return unwrapApiResponse(response.data);
  },

  async createStudySet(payload: StudySetUpsertPayload) {
    const response = await apiClient.post<ApiResponse<AdminStudySet>>(
      apiEndpoints.admin.studySets,
      payload
    );
    return unwrapApiResponse(response.data);
  },

  async updateStudySet(studySetId: EntityId, payload: StudySetUpsertPayload) {
    const response = await apiClient.put<ApiResponse<AdminStudySet>>(
      apiEndpoints.admin.studySetDetail(studySetId),
      payload
    );
    return unwrapApiResponse(response.data);
  },

  async deleteStudySet(studySetId: EntityId) {
    const response = await apiClient.delete<ApiResponse<void>>(
      apiEndpoints.admin.studySetDetail(studySetId)
    );
    return unwrapApiResponse(response.data);
  },

  async getUnits(studySetId: EntityId) {
    const response = await apiClient.get<ApiResponse<AdminStudyUnit[]>>(
      apiEndpoints.admin.units(studySetId)
    );
    return unwrapApiResponse(response.data);
  },

  async createUnit(studySetId: EntityId, payload: StudyUnitUpsertPayload) {
    const response = await apiClient.post<ApiResponse<AdminStudyUnit>>(
      apiEndpoints.admin.units(studySetId),
      payload
    );
    return unwrapApiResponse(response.data);
  },

  async updateUnit(unitId: EntityId, payload: StudyUnitUpsertPayload) {
    const response = await apiClient.put<ApiResponse<AdminStudyUnit>>(
      apiEndpoints.admin.unitDetail(unitId),
      payload
    );
    return unwrapApiResponse(response.data);
  },

  async deleteUnit(unitId: EntityId) {
    const response = await apiClient.delete<ApiResponse<void>>(
      apiEndpoints.admin.unitDetail(unitId)
    );
    return unwrapApiResponse(response.data);
  },

  async getVocabularies(unitId: EntityId, params?: PaginationParams) {
    const response = await apiClient.get<ApiResponse<PagedResponse<AdminVocabulary>>>(
      apiEndpoints.admin.vocabularies(unitId),
      { params }
    );
    return unwrapApiResponse(response.data);
  },

  async createVocabulary(unitId: EntityId, payload: VocabularyUpsertPayload) {
    const response = await apiClient.post<ApiResponse<AdminVocabulary>>(
      apiEndpoints.admin.vocabularies(unitId),
      payload
    );
    return unwrapApiResponse(response.data);
  },

  async updateVocabulary(vocabularyId: EntityId, payload: VocabularyUpsertPayload) {
    const response = await apiClient.put<ApiResponse<AdminVocabulary>>(
      apiEndpoints.admin.vocabularyDetail(vocabularyId),
      payload
    );
    return unwrapApiResponse(response.data);
  },

  async deleteVocabulary(vocabularyId: EntityId) {
    const response = await apiClient.delete<ApiResponse<void>>(
      apiEndpoints.admin.vocabularyDetail(vocabularyId)
    );
    return unwrapApiResponse(response.data);
  }
};
