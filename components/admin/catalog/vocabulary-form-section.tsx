"use client";

import { PlusCircle, Shapes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  SectionCard,
  SelectField,
  ToggleField,
  type SelectOption
} from "@/components/admin/catalog/shared";
import type { CatalogCopy } from "@/components/admin/catalog/types";
import type { VocabularyUpsertPayload } from "@/types/admin";
import type { EntityId } from "@/types/common";

export function VocabularyFormSection({
  copy,
  form,
  unitOptions,
  partOfSpeechOptions,
  difficultyOptions,
  selectedStudySetId,
  selectedUnitId,
  isPending,
  onSelectUnit,
  onChange,
  onSubmit
}: {
  copy: CatalogCopy;
  form: VocabularyUpsertPayload;
  unitOptions: SelectOption[];
  partOfSpeechOptions: SelectOption[];
  difficultyOptions: SelectOption[];
  selectedStudySetId: EntityId | null;
  selectedUnitId: EntityId | null;
  isPending: boolean;
  onSelectUnit: (value: string | null) => void;
  onChange: (updater: (current: VocabularyUpsertPayload) => VocabularyUpsertPayload) => void;
  onSubmit: () => void;
}) {
  return (
    <SectionCard
      title={copy.createVocabularyTitle}
      description={copy.createVocabularyDescription}
      icon={<Shapes className="h-5 w-5 text-primary" />}
    >
      <div className="space-y-4">
        <Field label={copy.selectedUnitLabel}>
          <SelectField
            label=""
            value={selectedUnitId ?? ""}
            onChange={(value) => onSelectUnit(value || null)}
            options={unitOptions}
            placeholder={selectedStudySetId ? copy.chooseUnit : copy.selectStudySetFirst}
            disabled={!selectedStudySetId}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.wordToAdd}>
            <Input
              value={form.word}
              onChange={(event) => onChange((current) => ({ ...current, word: event.target.value }))}
              placeholder="abide by"
            />
          </Field>
          <Field label={copy.meaning}>
            <Input
              value={form.meaning}
              onChange={(event) => onChange((current) => ({ ...current, meaning: event.target.value }))}
              placeholder={copy.meaningPlaceholder}
            />
          </Field>
        </div>
        <Field label={copy.shortDefinition}>
          <Textarea
            value={form.definition}
            onChange={(event) => onChange((current) => ({ ...current, definition: event.target.value }))}
            placeholder={copy.definitionPlaceholder}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.example}>
            <Textarea
              value={form.exampleSentence}
              onChange={(event) =>
                onChange((current) => ({ ...current, exampleSentence: event.target.value }))
              }
              className="min-h-[84px]"
              placeholder="Please abide by the rules."
            />
          </Field>
          <Field label={copy.exampleTranslation}>
            <Textarea
              value={form.exampleTranslation}
              onChange={(event) =>
                onChange((current) => ({ ...current, exampleTranslation: event.target.value }))
              }
              className="min-h-[84px]"
              placeholder={copy.exampleTranslationPlaceholder}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.phoneticUs}>
            <Input
              value={form.phoneticUs}
              onChange={(event) => onChange((current) => ({ ...current, phoneticUs: event.target.value }))}
              placeholder="/əˈbaɪd baɪ/"
            />
          </Field>
          <Field label={copy.phoneticUk}>
            <Input
              value={form.phoneticUk}
              onChange={(event) => onChange((current) => ({ ...current, phoneticUk: event.target.value }))}
              placeholder="/əˈbaɪd baɪ/"
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.pronunciationUs}>
            <Input
              value={form.pronunciationUsUrl}
              onChange={(event) =>
                onChange((current) => ({ ...current, pronunciationUsUrl: event.target.value }))
              }
              placeholder="https://.../us.mp3"
            />
          </Field>
          <Field label={copy.pronunciationUk}>
            <Input
              value={form.pronunciationUkUrl}
              onChange={(event) =>
                onChange((current) => ({ ...current, pronunciationUkUrl: event.target.value }))
              }
              placeholder="https://.../uk.mp3"
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.hint}>
            <Input
              value={form.hint}
              onChange={(event) => onChange((current) => ({ ...current, hint: event.target.value }))}
              placeholder={copy.hintPlaceholder}
            />
          </Field>
          <Field label={copy.displayOrder}>
            <Input
              type="number"
              min={0}
              value={form.displayOrder}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  displayOrder: Number(event.target.value)
                }))
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label={copy.partOfSpeech}
            value={form.partOfSpeech}
            onChange={(value) =>
              onChange((current) => ({
                ...current,
                partOfSpeech: value as VocabularyUpsertPayload["partOfSpeech"]
              }))
            }
            options={partOfSpeechOptions}
            placeholder={copy.selectPlaceholder}
          />
          <SelectField
            label={copy.difficultyLevel}
            value={form.difficultyLevel}
            onChange={(value) =>
              onChange((current) => ({
                ...current,
                difficultyLevel: value as VocabularyUpsertPayload["difficultyLevel"]
              }))
            }
            options={difficultyOptions}
            placeholder={copy.selectPlaceholder}
          />
        </div>
        <div className="w-full">
          <ToggleField
            label={copy.activeLabel}
            checked={form.active}
            onChange={(checked) => onChange((current) => ({ ...current, active: checked }))}
            activeText={copy.activeState}
            inactiveText={copy.inactiveState}
          />
        </div>
        <Button
          type="button"
          className="w-full rounded-2xl"
          onClick={onSubmit}
          disabled={
            isPending ||
            !selectedStudySetId ||
            !selectedUnitId ||
            !form.word.trim() ||
            !form.meaning.trim()
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {copy.addVocabulary}
        </Button>
      </div>
    </SectionCard>
  );
}
