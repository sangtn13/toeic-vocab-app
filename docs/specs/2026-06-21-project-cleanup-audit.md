# Spec: Project Cleanup Audit

Date: 2026-06-21
Owner: Codex
Status: Complete

## Problem

The frontend has accumulated a small amount of dead code and redundant public exports after recent refactors. That extra surface area makes navigation noisier and increases the chance that future changes keep depending on obsolete entrypoints.

## Goals

- Remove files that are no longer referenced anywhere in the app.
- Shrink redundant public exports to the symbols the project actually consumes.
- Keep route behavior, API behavior, auth bootstrap, and study progress behavior unchanged.

## Non-goals

- No API contract changes.
- No backend changes.
- No UI redesign.

## Context to read

- `AGENTS.md`
- `CONTEXT.md`
- `docs/ai/module-map.md`
- `docs/ai/spec-driven-workflow.md`
- `hooks/use-study.ts`
- `app/i18n-provider.tsx`
- `config/routes.ts`
- `types/study.ts`
- `utils/error.ts`
- `utils/study-progress.ts`
- `components/ui/**`

## Touched modules

- Frontend: `hooks/**`, `app/**`, `config/**`, `types/**`, `utils/**`, `components/ui/**`, `locales/**`
- Backend: none

## Contract impact

No API paths, request payloads, response DTOs, auth contract, or progress contract change. This is a frontend-only cleanup refactor.

## Invariants

- Next.js route and middleware entrypoints must stay intact.
- Dynamic imports used by route-level code splitting must keep working.
- Auth, study bootstrap, submit answer, and restart unit flows must behave exactly as before.
- Shared UI primitives must keep their current runtime behavior.

## Implementation plan

1. Confirm dead files and redundant exports with import-graph and symbol-usage checks.
2. Delete the obsolete study hook barrel and trim unused exported helpers, types, and UI primitive exports.
3. Run `npm run lint` and `npm run build`, then record verification and residual risks.

## Verification

- Frontend: `npm run lint`, `npm run build`
- Backend: not touched
- Manual flow: not run in this cleanup pass; build validation passed for routes and dynamic imports

## Risks

- Static cleanup can misclassify symbols used through dynamic imports if each export is not verified individually.
- Removing public exports must not break future intended imports hidden behind barrel files or type-only imports.
