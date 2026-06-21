"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { usePreferences } from "@/app/preferences-provider";
import { CatalogOverviewPanel } from "@/components/admin/catalog/overview-panel";
import {
  buildPartOfSpeechOptions,
  buildStudySetStatusOptions,
  buildVocabularyLevelOptions
} from "@/components/admin/catalog/shared";
import { StudySetFormSection } from "@/components/admin/catalog/study-set-form-section";
import { UnitFormSection } from "@/components/admin/catalog/unit-form-section";
import { VocabularyFormSection } from "@/components/admin/catalog/vocabulary-form-section";
import { ApiWarning } from "@/components/shared/api-warning";
import { useI18n } from "@/hooks/use-i18n";
import {
  useAdminStudySetsQuery,
  useAdminUnitsQuery,
  useAdminVocabulariesQuery,
  useCreateStudySet,
  useCreateUnit,
  useCreateVocabulary
} from "@/hooks/use-admin-catalog";
import type {
  AdminStudySet,
  AdminStudyUnit,
  AdminVocabulary,
  StudySetUpsertPayload,
  StudyUnitUpsertPayload,
  VocabularyUpsertPayload
} from "@/types/admin";
import type { EntityId } from "@/types/common";
import type {
  PartOfSpeech,
  StudySetStatus,
  VocabularyLevel
} from "@/types/study";
import { formatMessage } from "@/locales/format";
import { getUserFacingErrorMessage } from "@/utils/error";

const emptyStudySetForm: StudySetUpsertPayload = {
  title: "",
  description: "",
  thumbnailUrl: "",
  displayOrder: 0,
  status: "PUBLISHED"
};

const emptyUnitForm: StudyUnitUpsertPayload = {
  title: "",
  description: "",
  unitOrder: 1,
  active: true
};

const emptyVocabularyForm: VocabularyUpsertPayload = {
  word: "",
  meaning: "",
  definition: "",
  exampleSentence: "",
  exampleTranslation: "",
  phoneticUs: "",
  phoneticUk: "",
  pronunciationUsUrl: "",
  pronunciationUkUrl: "",
  hint: "",
  partOfSpeech: "NOUN",
  difficultyLevel: "FOUNDATION",
  displayOrder: 0,
  active: true
};

const emptyStudySets: AdminStudySet[] = [];
const emptyUnits: AdminStudyUnit[] = [];
const emptyVocabularies: AdminVocabulary[] = [];

export function CatalogManager() {
  const { locale } = usePreferences();
  const copy = useI18n("admin").catalog;
  const commonLabels = useI18n("common").labels;
  const partOfSpeechOptions = buildPartOfSpeechOptions(commonLabels.partOfSpeech) as Array<{
    label: string;
    value: PartOfSpeech;
  }>;
  const vocabularyLevelOptions = buildVocabularyLevelOptions(
    commonLabels.vocabularyLevels
  ) as Array<{ label: string; value: VocabularyLevel }>;
  const studySetStatusOptions = buildStudySetStatusOptions(
    commonLabels.studySetStatus
  ) as Array<{ label: string; value: StudySetStatus }>;
  const [selectedStudySetId, setSelectedStudySetId] = useState<EntityId | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<EntityId | null>(null);
  const [studySetForm, setStudySetForm] = useState<StudySetUpsertPayload>(emptyStudySetForm);
  const [unitForm, setUnitForm] = useState<StudyUnitUpsertPayload>(emptyUnitForm);
  const [vocabularyForm, setVocabularyForm] =
    useState<VocabularyUpsertPayload>(emptyVocabularyForm);

  const studySetsQuery = useAdminStudySetsQuery();
  const unitsQuery = useAdminUnitsQuery(selectedStudySetId);
  const vocabulariesQuery = useAdminVocabulariesQuery(selectedUnitId);

  const createStudySet = useCreateStudySet();
  const createUnit = useCreateUnit();
  const createVocabulary = useCreateVocabulary();

  const studySets = studySetsQuery.data?.items ?? emptyStudySets;
  const units = unitsQuery.data ?? emptyUnits;
  const vocabularies = vocabulariesQuery.data?.items ?? emptyVocabularies;

  const selectedStudySet = useMemo(
    () => studySets.find((item) => item.id === selectedStudySetId) ?? null,
    [selectedStudySetId, studySets]
  );
  const selectedUnit = useMemo(
    () => units.find((item) => item.id === selectedUnitId) ?? null,
    [selectedUnitId, units]
  );

  useEffect(() => {
    if (!selectedStudySetId && studySets.length) {
      setSelectedStudySetId(studySets[0].id);
    }
  }, [selectedStudySetId, studySets]);

  useEffect(() => {
    if (!selectedStudySetId) {
      setSelectedUnitId(null);
      return;
    }

    const stillExists = units.some((item) => item.id === selectedUnitId);
    if (!selectedUnitId || !stillExists) {
      setSelectedUnitId(units[0]?.id ?? null);
    }
  }, [selectedStudySetId, selectedUnitId, units]);

  const handleCreateStudySet = async () => {
    try {
      const created = await createStudySet.mutateAsync({
        ...studySetForm,
        description: studySetForm.description?.trim() || undefined,
        thumbnailUrl: studySetForm.thumbnailUrl?.trim() || undefined
      });
      toast.success(copy.createStudySetSuccess);
      setSelectedStudySetId(created.id);
      setStudySetForm({
        ...emptyStudySetForm,
        displayOrder: studySetForm.displayOrder + 1
      });
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, copy.createStudySetFailed, locale));
    }
  };

  const handleCreateUnit = async () => {
    if (!selectedStudySetId) {
      toast.error(copy.selectStudySetFirst);
      return;
    }

    try {
      const created = await createUnit.mutateAsync({
        studySetId: selectedStudySetId,
        payload: {
          ...unitForm,
          description: unitForm.description?.trim() || undefined
        }
      });
      toast.success(copy.createUnitSuccess);
      setSelectedUnitId(created.id);
      setUnitForm({
        ...emptyUnitForm,
        unitOrder: unitForm.unitOrder + 1
      });
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, copy.createUnitFailed, locale));
    }
  };

  const handleCreateVocabulary = async () => {
    if (!selectedStudySetId || !selectedUnitId) {
      toast.error(copy.selectUnitFirst);
      return;
    }

    try {
      await createVocabulary.mutateAsync({
        unitId: selectedUnitId,
        studySetId: selectedStudySetId,
        payload: {
          ...vocabularyForm,
          definition: vocabularyForm.definition?.trim() || undefined,
          exampleSentence: vocabularyForm.exampleSentence?.trim() || undefined,
          exampleTranslation: vocabularyForm.exampleTranslation?.trim() || undefined,
          phoneticUs: vocabularyForm.phoneticUs?.trim() || undefined,
          phoneticUk: vocabularyForm.phoneticUk?.trim() || undefined,
          pronunciationUsUrl: vocabularyForm.pronunciationUsUrl?.trim() || undefined,
          pronunciationUkUrl: vocabularyForm.pronunciationUkUrl?.trim() || undefined,
          hint: vocabularyForm.hint?.trim() || undefined
        }
      });
      toast.success(copy.createVocabularySuccess);
      setVocabularyForm({
        ...emptyVocabularyForm,
        displayOrder: vocabularyForm.displayOrder + 1,
        partOfSpeech: vocabularyForm.partOfSpeech,
        difficultyLevel: vocabularyForm.difficultyLevel
      });
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, copy.createVocabularyFailed, locale));
    }
  };

  return (
    <div className="space-y-6">
      {studySetsQuery.isError ? (
        <ApiWarning
          title={copy.loadFailedTitle}
          message={copy.loadFailedMessage}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <CatalogOverviewPanel
          copy={copy}
          commonLabels={commonLabels}
          studySets={studySets}
          units={units}
          vocabularies={vocabularies}
          selectedStudySetId={selectedStudySetId}
          selectedUnitId={selectedUnitId}
          selectedStudySet={selectedStudySet}
          selectedUnit={selectedUnit}
          isLoadingStudySets={studySetsQuery.isLoading}
          isLoadingUnits={unitsQuery.isLoading}
          isLoadingVocabularies={vocabulariesQuery.isLoading}
          onSelectStudySet={setSelectedStudySetId}
          onSelectUnit={setSelectedUnitId}
        />

        <div className="space-y-6">
          <StudySetFormSection
            copy={copy}
            form={studySetForm}
            statusOptions={studySetStatusOptions}
            isPending={createStudySet.isPending}
            onChange={setStudySetForm}
            onSubmit={() => void handleCreateStudySet()}
          />

          <UnitFormSection
            copy={copy}
            form={unitForm}
            studySetOptions={studySets.map((item) => ({
              label: item.title,
              value: String(item.id)
            }))}
            selectedStudySetId={selectedStudySetId}
            isPending={createUnit.isPending}
            onSelectStudySet={setSelectedStudySetId}
            onChange={setUnitForm}
            onSubmit={() => void handleCreateUnit()}
          />

          <VocabularyFormSection
            copy={copy}
            form={vocabularyForm}
            unitOptions={units.map((item) => ({
              label: formatMessage(copy.unitOptionLabel, {
                title: item.title,
                count: item.vocabularyCount
              }),
              value: String(item.id)
            }))}
            partOfSpeechOptions={partOfSpeechOptions}
            difficultyOptions={vocabularyLevelOptions}
            selectedStudySetId={selectedStudySetId}
            selectedUnitId={selectedUnitId}
            isPending={createVocabulary.isPending}
            onSelectUnit={setSelectedUnitId}
            onChange={setVocabularyForm}
            onSubmit={() => void handleCreateVocabulary()}
          />
        </div>
      </div>
    </div>
  );
}


