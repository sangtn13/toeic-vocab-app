# Module Map

Use this file to find the smallest safe context slice.

## Frontend ownership

| Area | Owner files | Rules |
| --- | --- | --- |
| Routes and layouts | `app/**` | Keep route/page logic thin. Use feature components and hooks for behavior. |
| UI components | `components/**` | Render UI only. No direct HTTP calls. Feature-local presentational helpers may stay nearby. |
| UI primitives | `components/ui/**` | Reusable primitives only. Keep product behavior out. |
| Endpoint builders | `config/api.ts` | Add or edit backend paths here before touching services. |
| HTTP adapter | `lib/axios.ts` | Owns base URL, auth header, and error normalization. |
| API unwrap | `lib/api-response.ts` | Owns `ApiResponse<T>` unwrapping. |
| Services | `services/**` | Only layer that calls `apiClient`. Mirrors backend contract. |
| Data hooks | `hooks/**` | React Query, mutations, bootstrap, and cache invalidation/sync. |
| Persistent state | `store/**` | Zustand auth/progress state only. |
| DTOs | `types/**` | Mirror backend DTOs/enums/request payloads. |
| Pure helpers | `utils/**` | Pure reusable functions, no React hooks, no browser-only side effects unless named clearly. |
| Copy and locale | `locales/**` | All user-facing strings and formatting. |

## Backend ownership

Backend repo: `D:\toeic-vocab-api`

| Area | Backend files |
| --- | --- |
| Endpoints | `src/main/java/com/toeic/vocab/controller/**` |
| Business logic | `src/main/java/com/toeic/vocab/service/**` |
| Persistence | `src/main/java/com/toeic/vocab/repository/**`, `model/**`, `db/migration/**` |
| DTO mapping | `src/main/java/com/toeic/vocab/mapper/**`, `dto/**` |
| Request payloads | `src/main/java/com/toeic/vocab/request/**` |
| Response wrappers | `src/main/java/com/toeic/vocab/response/**` |
| Auth/security | `src/main/java/com/toeic/vocab/security/**` |
| Tests | `src/test/java/com/toeic/vocab/**` |

## Task slices

Public study UI:

- Start with `hooks/use-study.ts`, `hooks/study-cache.ts`, `services/public-study.service.ts`, `types/study.ts`.
- Then open the exact component under `components/study/**` or route under `app/[locale]/study-sets/**`.

Admin catalog:

- Start with `hooks/use-admin-catalog.ts`, `services/admin-catalog.service.ts`, `types/admin.ts`.
- Then open `components/admin/**`.

Auth:

- Start with `hooks/use-auth.ts`, `store/auth-store.ts`, `services/auth.service.ts`, `types/auth.ts`.
- Then open `components/auth/**` or app shell files.

i18n/copy:

- Start with `locales/types.ts`, `locales/scoped.ts`, and the exact namespace under `locales/messages/{locale}/`.

API contract:

- Start with `docs/ai/api-contract.md`.
- Then compare backend `FRONTEND_API.md`, controller, request, DTO, enum, FE `config/api.ts`, FE `types/*`, and FE `services/*`.

