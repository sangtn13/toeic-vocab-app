"use client";

import { LibraryBig, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  SectionCard,
  SelectField,
  type SelectOption
} from "@/components/admin/catalog/shared";
import type { CatalogCopy } from "@/components/admin/catalog/types";
import type { StudySetUpsertPayload } from "@/types/admin";

export function StudySetFormSection({
  copy,
  form,
  statusOptions,
  isPending,
  onChange,
  onSubmit
}: {
  copy: CatalogCopy;
  form: StudySetUpsertPayload;
  statusOptions: SelectOption[];
  isPending: boolean;
  onChange: (updater: (current: StudySetUpsertPayload) => StudySetUpsertPayload) => void;
  onSubmit: () => void;
}) {
  return (
    <SectionCard
      title={copy.createStudySetTitle}
      description={copy.createStudySetDescription}
      icon={<LibraryBig className="h-5 w-5 text-primary" />}
    >
      <div className="space-y-4">
        <Field label={copy.studySetName}>
          <Input
            value={form.title}
            onChange={(event) => onChange((current) => ({ ...current, title: event.target.value }))}
            placeholder={copy.studySetTitlePlaceholder}
          />
        </Field>
        <Field label={copy.shortDescription}>
          <Textarea
            value={form.description}
            onChange={(event) =>
              onChange((current) => ({ ...current, description: event.target.value }))
            }
            placeholder={copy.studySetDescriptionPlaceholder}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.thumbnail}>
            <Input
              value={form.thumbnailUrl}
              onChange={(event) =>
                onChange((current) => ({ ...current, thumbnailUrl: event.target.value }))
              }
              placeholder="https://..."
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
        <SelectField
          label={copy.studySetStatus}
          value={form.status}
          onChange={(value) =>
            onChange((current) => ({
              ...current,
              status: value as StudySetUpsertPayload["status"]
            }))
          }
          options={statusOptions}
          placeholder={copy.selectPlaceholder}
        />
        <Button
          type="button"
          className="w-full rounded-2xl"
          onClick={onSubmit}
          disabled={isPending || !form.title.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {copy.addStudySet}
        </Button>
      </div>
    </SectionCard>
  );
}
