# Spec: Study Set Detail Units Contract Cleanup

Date: 2026-06-20
Owner: Codex
Status: Implemented

## Problem

`GET /public/study-sets/{slug}` used to overlap with `GET /public/study-sets/{slug}/units`, and several public-study mutation responses also returned fields that the frontend did not read. That increased payload size, blurred endpoint ownership, and made cache syncing more fragile than necessary.

## Goals

- Make `GET /public/study-sets/{slug}` return only study-set metadata and aggregate progress.
- Keep unit listing and unit progress owned by `GET /public/study-sets/{slug}/units`.
- Slim public-study DTOs so FE only receives fields it actually consumes in the workspace flow.
- Update FE types, services, cache syncing, and workspace flow to stop depending on removed fields.
- Update FE and BE contract docs together.
- Keep `/answers` as the single mutation response for in-unit progression and unit-completion dialog data.
- Remove the dedicated `/completion` endpoint and its FE dependency.

## Non-goals

- Changing endpoint paths.
- Reworking infinite scroll UX.
- Refactoring admin or auth contracts in this change.

## Context to read

- `AGENTS.md`
- `CONTEXT.md`
- `docs/ai/module-map.md`
- `docs/ai/api-contract.md`
- `D:\toeic-vocab-api\FRONTEND_API.md`
- `types/study.ts`
- `services/public-study.service.ts`
- `hooks/use-study.ts`
- `hooks/study-cache.ts`
- `components/study/vocabulary-workspace.tsx`

## Touched modules

- Frontend:
  - `docs/ai/api-contract.md`
  - `docs/specs/2026-06-20-study-set-detail-units-contract-cleanup.md`
  - `types/study.ts`
  - `services/public-study.service.ts`
  - `hooks/study-cache.ts`
  - `components/study/vocabulary-workspace.tsx`
- Backend:
  - `D:\toeic-vocab-api\FRONTEND_API.md`
  - `D:\toeic-vocab-api\docs\ai\api-contract.md`
  - `D:\toeic-vocab-api\src\main\java\com\toeic\vocab\dto\study\*.java`
  - `D:\toeic-vocab-api\src\main\java\com\toeic\vocab\service\study\PublicStudyServiceImpl.java`
  - `D:\toeic-vocab-api\src\main\java\com\toeic\vocab\service\study\StudyItemFactory.java`
  - `D:\toeic-vocab-api\src\test\java\com\toeic\vocab\service\study\PublicStudyServiceTest.java`

## Contract impact

Yes. Public-study responses were slimmed to match actual FE usage:

- `StudySetDetail` now returns `title`, `description`, and `progress` only.
- Study-set list rows no longer expose unused `status` and `thumbnailUrl` in the FE-facing public contract.
- `StudyProgressContext` now returns `progressToken`, `displayName`, and `persistent` only.
- `StudyActivity` no longer duplicates `studySetId` or `unitId`.
- `StudyItem` no longer includes unused `displayOrder` or `difficultyLevel` in the public-study flow.
- `AnswerResult` no longer exposes duplicate or unused `submittedAnswer`, attempt counters, `mastered`, or top-level `nextUnit`.
- `UnitCompletion` now returns `unitProgress`, `studySetProgress`, `nextUnit`, and slim word-review rows only.
- `RestartUnitResult` now returns `unitProgress`, `studySetProgress`, and `progress` only.
- `/public/study-sets/{slug}/units/{unitId}/completion` is removed from the contract.

## Invariants

- Public study detail remains the owner of study-set metadata and aggregate progress only.
- Public unit list remains the single source of truth for unit rows and per-unit progress/status.
- Guest progress token refresh behavior after submit/restart remains unchanged.
- FE cache sync after submit/restart must keep study-set summary and unit list consistent without a follow-up `/completion` or duplicate `/activities` fetch.
- Completion dialog data comes from `/answers` when a unit finishes.

## Implementation plan

1. Remove `units` from FE/BE study-set detail DTOs and contract docs.
2. Refactor FE workspace and cache syncing to rely on the paginated units query for unit metadata/progress.
3. Slim public-study DTOs to the fields actually consumed by FE.
4. Keep `/answers` embedding `studyActivity` for correct in-unit progression and `unitCompletion` for finished units.
5. Remove the obsolete `/completion` contract and stop using its FE cache/query path.
6. Run the narrowest useful verification and record remaining risk.

## Verification

- Frontend: `npm run lint` passed.
- Frontend: `npm run build` passed.
- Backend: `.\mvnw.cmd test` passed.
- Manual flow:
  - Not run in browser during this change.

## Risks

- Manual browser verification is still recommended to confirm the live payloads no longer include the removed fields and that the workspace no longer triggers duplicate network calls in the scenarios you reported.
- This cleanup focused on the public-study flow. Admin/auth responses were not deeply audited for payload slimming in the same pass.