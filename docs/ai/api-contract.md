# FE-BE API Contract

Backend source of truth: `D:\toeic-vocab-api\FRONTEND_API.md`.

This file is the frontend navigation snapshot. If it disagrees with backend docs/controllers, treat backend docs/controllers as source of truth and update this file.

## Base

- Public browser base: `/api/v1`
- Target backend base: server-only `API_BASE_URL`, normalized by `next.config.mjs` to include `/api/v1`
- Response wrapper: `ApiResponse<T>`
- Pagination wrapper: `PagedResponse<T>`
- IDs: UUID strings

## Auth

| Method | Path | FE owner |
| --- | --- | --- |
| POST | `/auth/register` | `services/auth.service.ts`, `types/auth.ts` |
| POST | `/auth/login` | `services/auth.service.ts`, `types/auth.ts` |
| GET | `/auth/me` | `services/auth.service.ts`, `hooks/use-auth.ts` |
| POST | `/auth/logout` | `services/auth.service.ts`, `hooks/use-auth.ts` |

Auth invariant: `lib/axios.ts` attaches `Authorization: Bearer {accessToken}` from `useAuthStore`.

## Public study

| Method | Path | FE owner |
| --- | --- | --- |
| POST | `/public/progress` | `publicStudyService.resolveStudyProgress`, `useStudyProgress` |
| GET | `/public/study-sets` | `publicStudyService.getStudySets`, `useStudySets` |
| GET | `/public/study-sets/{slug}` | `publicStudyService.getStudySetDetail`, `useStudySetDetail` |
| GET | `/public/study-sets/{slug}/units` | `publicStudyService.getStudySetUnits`, `useStudySetUnits` |
| GET | `/public/study-sets/{slug}/units/{unitId}/activities/{mode}` | `publicStudyService.getStudyActivity`, `useStudyActivity` |
| POST | `/public/progress/{progressToken}/answers` | `publicStudyService.submitAnswer`, `useSubmitAnswer`, `study-cache.ts` |
| POST | `/public/progress/{progressToken}/study-sets/{slug}/units/{unitId}/restart` | `publicStudyService.restartUnit`, `useRestartUnit`, `study-cache.ts` |

Public-study payload ownership:

- `GET /public/study-sets` rows expose `id`, `title`, `slug`, `description`, `learningStatus`, `totalUnits`, `totalWords`.
- `GET /public/study-sets/{slug}` exposes only study-set metadata plus aggregate `progress`: `title`, `description`, `progress`.
- `GET /public/study-sets/{slug}/units` is the only public source for paginated unit rows and per-unit progress/status in the workspace sidebar.
- `GET /public/study-sets/{slug}/units/{unitId}/activities/{mode}` exposes `mode`, `studySetTitle`, `unitTitle`, `studySetProgress`, `unitProgress`, and `items`.
- `POST /public/progress/{progressToken}/answers` exposes `vocabularyId`, `practiceMode`, `correct`, `correctAnswer`, `unitCompleted`, `studySetProgress`, `unitProgress`, `progress`, optional `studyActivity`, and optional `unitCompletion`.
- `POST /public/progress/{progressToken}/study-sets/{slug}/units/{unitId}/restart` exposes `unitProgress`, `studySetProgress`, and `progress`.
- `unitCompletion.vocabularies` only needs `vocabularyId`, `word`, and `meaning` for the completion dialog.

Practice modes:

- `GUESS_WORD`
- `FLASHCARD`
- `MULTIPLE_CHOICE`
- `REVERSE_MULTIPLE_CHOICE`

Progress invariant: submit/restart responses include `progress`; FE must save the newest `progress.progressToken`.

Submit-answer invariant: when `correct = true` and `unitCompleted = false`, `/public/progress/{progressToken}/answers` embeds `studyActivity` for the next in-unit state so the workspace does not immediately refetch `/activities` after a token refresh.

Submit-answer invariant: when `unitCompleted = true`, `/public/progress/{progressToken}/answers` embeds `unitCompletion`; the completion dialog no longer depends on a dedicated `/completion` endpoint.

## Admin catalog

| Method | Path | FE owner |
| --- | --- | --- |
| GET | `/admin/study-sets` | `adminCatalogService.getStudySets` |
| GET | `/admin/study-sets/{studySetId}` | `adminCatalogService.getStudySet` |
| POST | `/admin/study-sets` | `adminCatalogService.createStudySet` |
| PUT | `/admin/study-sets/{studySetId}` | `adminCatalogService.updateStudySet` |
| DELETE | `/admin/study-sets/{studySetId}` | `adminCatalogService.deleteStudySet` |
| GET | `/admin/study-sets/{studySetId}/units` | `adminCatalogService.getUnits` |
| POST | `/admin/study-sets/{studySetId}/units` | `adminCatalogService.createUnit` |
| PUT | `/admin/units/{unitId}` | `adminCatalogService.updateUnit` |
| DELETE | `/admin/units/{unitId}` | `adminCatalogService.deleteUnit` |
| GET | `/admin/units/{unitId}/vocabularies` | `adminCatalogService.getVocabularies` |
| POST | `/admin/units/{unitId}/vocabularies` | `adminCatalogService.createVocabulary` |
| PUT | `/admin/vocabularies/{vocabularyId}` | `adminCatalogService.updateVocabulary` |
| DELETE | `/admin/vocabularies/{vocabularyId}` | `adminCatalogService.deleteVocabulary` |

Admin invariant: endpoints require a JWT for an admin user.
