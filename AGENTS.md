# VocaSa Agent Guide

This is the required entry point for AI work in this repo. Read it before editing.

## Read protocol

Use the smallest context slice that can safely answer the task:

1. Read `AGENTS.md` and `CONTEXT.md`.
2. Read `docs/ai/module-map.md` to find the owning module before opening code.
3. For API, DTO, auth, progress, or admin changes, read `docs/ai/api-contract.md` and the backend contract at `D:\toeic-vocab-api\FRONTEND_API.md`.
4. For non-trivial features or refactors, read `docs/ai/spec-driven-workflow.md` and create/update a spec under `docs/specs/`.
5. Only then inspect the exact files listed by the module map or spec.

Do not read the whole project by default. Start from the map, then drill down.

## Hard rules

- Components render UI and wire user events. They must not call `fetch`, `axios`, or backend URLs directly.
- API paths live in `config/api.ts`. HTTP calls live in `services/*`. React Query and mutation behavior live in `hooks/*`.
- Shared reusable logic belongs in `utils/*` or `lib/*`, not inside components. Component-local helpers are allowed only when they are purely presentational and not reused.
- DTO and API response shapes belong in `types/*`. Do not invent ad hoc response types inside hooks or components.
- Cross-feature client state belongs in `store/*`. Keep Zustand stores small and focused.
- Public study cache keys and cache patching belong in `hooks/study-cache.ts`.
- Guest progress is token based. After submit answer or restart unit, always persist the latest `response.data.progress.progressToken`.
- Auth is JWT based. `lib/axios.ts` owns the Authorization header via `useAuthStore`; do not duplicate token header logic elsewhere.
- Backend targets for FE proxying must stay in server-only `API_BASE_URL`; do not move deploy backend URLs into `NEXT_PUBLIC_*` unless the browser truly needs them.
- User-facing copy belongs in `locales/messages/*` and is read through the i18n helpers. Do not hardcode new UI text in feature components unless the file already intentionally does so.
- Use the `@/` import alias for app imports.
- Preserve Next.js App Router boundaries: server routes/pages stay server unless a client hook/browser API is needed; client components start with `"use client"`.
- If backend controllers, DTOs, requests, enums, or response wrappers change, update the FE types/services/hooks and the contract docs in the same change.
- Keep docs updated when a change alters domain language, API contract, module ownership, or a durable architecture rule.

## Verification

Before finishing code changes, run the narrowest useful checks:

- Frontend: `npm run lint` for TypeScript/Next lint issues.
- Frontend build-sensitive work: `npm run build`.
- Backend touched: run Maven tests from `D:\toeic-vocab-api` with `.\mvnw.cmd test`.
- API contract touched: manually compare `docs/ai/api-contract.md`, `D:\toeic-vocab-api\FRONTEND_API.md`, backend controllers/DTOs, and FE `types/*` + `services/*`.

If a check cannot run, report why and what risk remains.

## Agent skills

### Issue tracker

Work is tracked in GitHub Issues for `https://github.com/sangtn13/toeic-vocab-app`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default triage vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single frontend context plus an external backend contract reference. See `docs/agents/domain.md`.


