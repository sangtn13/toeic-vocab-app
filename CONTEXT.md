# VocaSa Context

This file is the compact project memory for agents. Keep it current and small.

## Product

VocaSa is a TOEIC vocabulary learning frontend built with Next.js 14. It connects to the Spring Boot backend at `D:\toeic-vocab-api`.

The app supports:

- Public guest learning flow.
- Authenticated learning flow with JWT.
- Admin catalog management for study sets, units, and vocabulary.
- Locale-aware UI copy in English and Vietnamese.

## Domain glossary

- Study set: a vocabulary collection, addressed publicly by `slug` and internally by UUID.
- Study unit: an ordered group inside a study set.
- Vocabulary: one word or phrase in a unit.
- Practice mode: one of `GUESS_WORD`, `FLASHCARD`, `MULTIPLE_CHOICE`, `REVERSE_MULTIPLE_CHOICE`.
- Study activity: the payload used to render one learning mode for one unit.
- Study progress: current learner progress. Guests use stateless `progressToken`; authenticated users persist progress by `user_id`.
- Progress token: client-held guest progress token. It can refresh after progress mutations and must be saved after every submit/restart response.
- Unit completion: modal payload shown when a unit is complete, including next unit and vocabulary review data.
- Admin catalog: admin CRUD for study sets, units, and vocabulary.

## Frontend architecture

- `app/`: Next.js App Router routes, layouts, and providers.
- `components/`: UI components grouped by feature.
- `config/`: app constants, route constants, API endpoint builders.
- `hooks/`: React Query, mutations, bootstrap hooks, cache sync.
- `lib/`: app-level adapters and shared infrastructure, including Axios.
- `services/`: backend HTTP calls only.
- `store/`: Zustand stores for auth/progress.
- `types/`: DTOs and shared TypeScript contracts.
- `utils/`: pure reusable helpers.
- `locales/`: locale dictionaries and formatting helpers.

## Backend relationship

Backend path: `D:\toeic-vocab-api`.

Important backend files:

- `FRONTEND_API.md`: human-readable FE contract.
- `src/main/java/com/toeic/vocab/controller/**`: endpoint definitions.
- `src/main/java/com/toeic/vocab/dto/**`: response DTOs mirrored in FE `types/*`.
- `src/main/java/com/toeic/vocab/request/**`: request payloads mirrored in FE service payloads.
- `src/main/java/com/toeic/vocab/enums/**`: enum values mirrored in FE union types.
- `src/main/java/com/toeic/vocab/response/**`: response wrappers mirrored by `types/api.ts`.

The frontend calls same-origin `/api/v1/*`; Next rewrites/proxies to server-only `API_BASE_URL`.

## Durable invariants

- All API responses are wrapped as `ApiResponse<T>` with `success`, `message`, `data`, and `timestamp`.
- Paginated payloads use `PagedResponse<T>` with `items`, `page`, `size`, `totalElements`, `totalPages`, and `last`.
- All domain IDs in API payloads are UUID strings.
- Public study endpoints are open to guests.
- Admin endpoints require `Authorization: Bearer {accessToken}` and an admin user.
- `apiClient` owns auth header attachment and error normalization.
- `API_BASE_URL` is a server-only env used by Next rewrites; do not expose backend targets through `NEXT_PUBLIC_*` unless intentionally needed in the browser.
- `publicStudyService` normalizes progress percentages and learning/unit statuses for UI stability.
- Cache sync for submit/restart must update both old and refreshed progress tokens.
- Login/register should trigger progress bootstrap so guest progress can be imported after auth.

## Read next by task

- API or DTO change: `docs/ai/api-contract.md`, `config/api.ts`, `types/*`, `services/*`, relevant backend controller/DTO/request.
- Study flow change: `hooks/use-study.ts`, `hooks/study-cache.ts`, `store/progress-store.ts`, `services/public-study.service.ts`, `types/study.ts`.
- Auth change: `hooks/use-auth.ts`, `store/auth-store.ts`, `services/auth.service.ts`, backend `controller/auth` and security files.
- Admin change: `components/admin/**`, `hooks/use-admin-catalog.ts`, `services/admin-catalog.service.ts`, `types/admin.ts`, backend `controller/admin`.
- UI text change: `locales/messages/*`.
- Architecture or rule change: update this file, `AGENTS.md`, and possibly an ADR in `docs/adr/`.


