"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCatalogService } from "@/services/admin-catalog.service";
import type { EntityId } from "@/types/common";
import type {
  StudySetUpsertPayload,
  StudyUnitUpsertPayload,
  VocabularyUpsertPayload
} from "@/types/admin";

const adminKeys = {
  studySets: ["admin-study-sets"] as const,
  units: (studySetId: EntityId | null) => ["admin-units", studySetId] as const,
  vocabularies: (unitId: EntityId | null) => ["admin-vocabularies", unitId] as const
};

export function useAdminStudySetsQuery() {
  return useQuery({
    queryKey: adminKeys.studySets,
    queryFn: () =>
      adminCatalogService.getStudySets({
        page: 0,
        size: 100
      })
  });
}

export function useAdminUnitsQuery(studySetId: EntityId | null) {
  return useQuery({
    queryKey: adminKeys.units(studySetId),
    queryFn: () => adminCatalogService.getUnits(studySetId as EntityId),
    enabled: !!studySetId
  });
}

export function useAdminVocabulariesQuery(unitId: EntityId | null) {
  return useQuery({
    queryKey: adminKeys.vocabularies(unitId),
    queryFn: () =>
      adminCatalogService.getVocabularies(unitId as EntityId, {
        page: 0,
        size: 12
      }),
    enabled: !!unitId
  });
}

export function useCreateStudySet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StudySetUpsertPayload) =>
      adminCatalogService.createStudySet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.studySets });
    }
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studySetId,
      payload
    }: {
      studySetId: EntityId;
      payload: StudyUnitUpsertPayload;
    }) => adminCatalogService.createUnit(studySetId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.studySets });
      queryClient.invalidateQueries({
        queryKey: adminKeys.units(variables.studySetId)
      });
    }
  });
}

export function useCreateVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      unitId,
      payload
    }: {
      unitId: EntityId;
      studySetId: EntityId;
      payload: VocabularyUpsertPayload;
    }) => adminCatalogService.createVocabulary(unitId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.studySets });
      queryClient.invalidateQueries({
        queryKey: adminKeys.units(variables.studySetId)
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.vocabularies(variables.unitId)
      });
    }
  });
}
