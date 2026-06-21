"use client";

import { ListTree, PlusCircle } from "lucide-react";
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
import type { StudyUnitUpsertPayload } from "@/types/admin";
import type { EntityId } from "@/types/common";

export function UnitFormSection({
  copy,
  form,
  studySetOptions,
  selectedStudySetId,
  isPending,
  onSelectStudySet,
  onChange,
  onSubmit
}: {
  copy: CatalogCopy;
  form: StudyUnitUpsertPayload;
  studySetOptions: SelectOption[];
  selectedStudySetId: EntityId | null;
  isPending: boolean;
  onSelectStudySet: (value: string | null) => void;
  onChange: (updater: (current: StudyUnitUpsertPayload) => StudyUnitUpsertPayload) => void;
  onSubmit: () => void;
}) {
  return (
    <SectionCard
      title={copy.createUnitTitle}
      description={copy.createUnitDescription}
      icon={<ListTree className="h-5 w-5 text-primary" />}
    >
      <div className="space-y-4">
        <Field label={copy.selectedStudySetLabel}>
          <SelectField
            label=""
            value={selectedStudySetId ?? ""}
            onChange={(value) => onSelectStudySet(value || null)}
            options={studySetOptions}
            placeholder={copy.chooseStudySet}
          />
        </Field>
        <Field label={copy.unitName}>
          <Input
            value={form.title}
            onChange={(event) => onChange((current) => ({ ...current, title: event.target.value }))}
            placeholder="Unit 1"
          />
        </Field>
        <Field label={copy.shortDescription}>
          <Textarea
            value={form.description}
            onChange={(event) =>
              onChange((current) => ({ ...current, description: event.target.value }))
            }
            placeholder={copy.unitDescriptionPlaceholder}
          />
        </Field>
        <Field label={copy.unitOrder}>
          <Input
            type="number"
            min={1}
            value={form.unitOrder}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                unitOrder: Number(event.target.value)
              }))
            }
          />
        </Field>
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
          disabled={isPending || !selectedStudySetId || !form.title.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {copy.addUnit}
        </Button>
      </div>
    </SectionCard>
  );
}
