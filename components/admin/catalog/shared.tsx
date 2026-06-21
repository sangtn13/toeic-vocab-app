"use client";

import type { ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudySetStatus } from "@/types/study";
import type { AppLocaleMessages } from "@/locales";

export type SelectOption = {
  label: string;
  value: string;
};

export function SectionCard({
  title,
  description,
  icon,
  children
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-border bg-card shadow-[0_20px_48px_rgba(148,163,184,0.16)]">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            {icon}
          </span>
          {title}
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-semibold text-foreground">{label}</span> : null}
      {children}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <Field label={label}>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="flex h-12 w-full appearance-none rounded-2xl border border-border bg-card px-4 pr-12 text-sm text-foreground outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-muted/60 disabled:text-muted-foreground"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </Field>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  activeText: _activeText,
  inactiveText: _inactiveText
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className="flex h-12 w-full items-center justify-between rounded-[18px] border border-border bg-card px-4 text-left shadow-[0_8px_18px_rgba(148,163,184,0.05)] transition hover:border-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-100"
    >
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span
        className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full border px-1 transition-colors duration-200 ${
          checked
            ? "border-primary bg-primary shadow-[0_8px_18px_rgba(14,116,144,0.16)]"
            : "border-border bg-muted/80"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-card shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export function StatCard({
  icon,
  label,
  value,
  helper
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-muted/60 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="truncate text-lg font-black tracking-tight text-foreground">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  );
}

export function PreviewCard({
  title,
  subtitle,
  items
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-border bg-card p-4">
      <p className="break-words font-bold text-foreground">{title}</p>
      <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{subtitle}</p>
      <div className="mt-4 space-y-2">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="min-w-0 break-words">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function getStudySetStatusLabel(
  status: StudySetStatus | null | undefined,
  labels: AppLocaleMessages["common"]["labels"]["studySetStatus"]
) {
  switch (status) {
    case "PUBLISHED":
      return labels.PUBLISHED;
    case "ARCHIVED":
      return labels.ARCHIVED;
    case "DRAFT":
      return labels.DRAFT;
    default:
      return labels.UNKNOWN;
  }
}

export function buildStudySetStatusOptions(
  commonLabels: AppLocaleMessages["common"]["labels"]["studySetStatus"]
): SelectOption[] {
  return [
    { label: commonLabels.PUBLISHED, value: "PUBLISHED" },
    { label: commonLabels.DRAFT, value: "DRAFT" },
    { label: commonLabels.ARCHIVED, value: "ARCHIVED" }
  ];
}

export function buildPartOfSpeechOptions(
  commonLabels: AppLocaleMessages["common"]["labels"]["partOfSpeech"]
): SelectOption[] {
  return [
    { label: commonLabels.NOUN, value: "NOUN" },
    { label: commonLabels.VERB, value: "VERB" },
    { label: commonLabels.PHRASAL_VERB, value: "PHRASAL_VERB" },
    { label: commonLabels.ADJECTIVE, value: "ADJECTIVE" },
    { label: commonLabels.ADVERB, value: "ADVERB" },
    { label: commonLabels.PHRASE, value: "PHRASE" },
    { label: commonLabels.OTHER, value: "OTHER" }
  ];
}

export function buildVocabularyLevelOptions(
  commonLabels: AppLocaleMessages["common"]["labels"]["vocabularyLevels"]
): SelectOption[] {
  return [
    { label: commonLabels.FOUNDATION, value: "FOUNDATION" },
    { label: commonLabels.CORE, value: "CORE" },
    { label: commonLabels.ADVANCED, value: "ADVANCED" }
  ];
}
