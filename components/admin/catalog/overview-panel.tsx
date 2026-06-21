"use client";

import { BookCopy, LibraryBig, ListTree, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PreviewCard,
  SelectField,
  StatCard,
  getStudySetStatusLabel,
  type SelectOption
} from "@/components/admin/catalog/shared";
import type { CatalogCopy } from "@/components/admin/catalog/types";
import { formatMessage } from "@/locales/format";
import type { AdminStudySet, AdminStudyUnit, AdminVocabulary } from "@/types/admin";
import type { EntityId } from "@/types/common";
import type { AppLocaleMessages } from "@/locales";

export function CatalogOverviewPanel({
  copy,
  commonLabels,
  studySets,
  units,
  vocabularies,
  selectedStudySetId,
  selectedUnitId,
  selectedStudySet,
  selectedUnit,
  isLoadingStudySets,
  isLoadingUnits,
  isLoadingVocabularies,
  onSelectStudySet,
  onSelectUnit
}: {
  copy: CatalogCopy;
  commonLabels: AppLocaleMessages["common"]["labels"];
  studySets: AdminStudySet[];
  units: AdminStudyUnit[];
  vocabularies: AdminVocabulary[];
  selectedStudySetId: EntityId | null;
  selectedUnitId: EntityId | null;
  selectedStudySet: AdminStudySet | null;
  selectedUnit: AdminStudyUnit | null;
  isLoadingStudySets: boolean;
  isLoadingUnits: boolean;
  isLoadingVocabularies: boolean;
  onSelectStudySet: (value: string | null) => void;
  onSelectUnit: (value: string | null) => void;
}) {
  const studySetOptions: SelectOption[] = studySets.map((item) => ({
    label: item.title,
    value: String(item.id)
  }));
  const unitOptions: SelectOption[] = units.map((item) => ({
    label: formatMessage(copy.unitOptionLabel, {
      title: item.title,
      count: item.vocabularyCount
    }),
    value: String(item.id)
  }));

  return (
    <Card className="overflow-hidden rounded-[28px] border-border bg-card shadow-[0_20px_48px_rgba(148,163,184,0.16)]">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-primary px-4 py-1.5 text-primary-foreground">
            {copy.quickControl}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full border border-border bg-muted/60 px-4 py-1.5 text-muted-foreground"
          >
            {copy.quickControlHint}
          </Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            {copy.quickControlTitle}
          </CardTitle>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {copy.quickControlDescription}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {isLoadingStudySets ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-24 rounded-[24px]" />
            <Skeleton className="h-24 rounded-[24px]" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label={copy.currentStudySet}
                value={selectedStudySetId ?? ""}
                onChange={(value) => onSelectStudySet(value || null)}
                options={studySetOptions}
                placeholder={copy.chooseStudySet}
              />

              <SelectField
                label={copy.currentUnit}
                value={selectedUnitId ?? ""}
                onChange={(value) => onSelectUnit(value || null)}
                options={unitOptions}
                placeholder={selectedStudySetId ? copy.chooseUnit : copy.selectStudySetFirst}
                disabled={!selectedStudySetId || isLoadingUnits}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                icon={<LibraryBig className="h-5 w-5" />}
                label={copy.selectedStudySet}
                value={selectedStudySet?.title ?? copy.notSelected}
                helper={
                  selectedStudySet
                    ? formatMessage(copy.studySetSummary, {
                        unitCount: selectedStudySet.unitCount,
                        vocabularyCount: selectedStudySet.vocabularyCount
                      })
                    : copy.chooseStudySetToPreview
                }
              />
              <StatCard
                icon={<ListTree className="h-5 w-5" />}
                label={copy.selectedUnit}
                value={selectedUnit?.title ?? copy.notSelected}
                helper={
                  selectedUnit
                    ? formatMessage(copy.unitSummary, {
                        vocabularyCount: selectedUnit.vocabularyCount
                      })
                    : copy.chooseUnitToContinue
                }
              />
              <StatCard
                icon={<BookCopy className="h-5 w-5" />}
                label={copy.recentVocabulary}
                value={String(vocabularies.length)}
                helper={selectedUnit ? copy.quickPreviewDescription : copy.chooseUnitToPreview}
              />
            </div>

            <Card className="rounded-[24px] border-border bg-muted/60 shadow-none">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{copy.quickPreviewTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {copy.quickPreviewDescription}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <PreviewCard
                    title={selectedStudySet?.title ?? copy.noStudySetTitle}
                    subtitle={selectedStudySet?.description || copy.noStudySetDescription}
                    items={[
                      formatMessage(copy.displayOrderLabel, {
                        value: selectedStudySet?.displayOrder ?? 0
                      }),
                      formatMessage(copy.statusLabel, {
                        value: getStudySetStatusLabel(
                          selectedStudySet?.status,
                          commonLabels.studySetStatus
                        )
                      }),
                      formatMessage(copy.unitCountLabel, {
                        count: selectedStudySet?.unitCount ?? 0
                      })
                    ]}
                  />
                  <PreviewCard
                    title={selectedUnit?.title ?? copy.noUnitTitle}
                    subtitle={selectedUnit?.description || copy.noUnitDescription}
                    items={
                      selectedUnit
                        ? [
                            formatMessage(copy.unitOrderLabel, {
                              value: selectedUnit.unitOrder
                            }),
                            formatMessage(copy.vocabularyCountLabel, {
                              count: selectedUnit.vocabularyCount
                            }),
                            selectedUnit.active ? copy.activeState : copy.inactiveState
                          ]
                        : [copy.selectPreviewFallback, " ", " "]
                    }
                  />
                </div>

                <div className="grid gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy.latestVocabulary}
                  </p>
                  {isLoadingVocabularies ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Skeleton className="h-20 rounded-[22px]" />
                      <Skeleton className="h-20 rounded-[22px]" />
                    </div>
                  ) : vocabularies.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {vocabularies.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-[22px] border border-border bg-card p-4"
                        >
                          <p className="font-bold text-foreground">{item.word}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{item.meaning}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{copy.noVocabulary}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  );
}
