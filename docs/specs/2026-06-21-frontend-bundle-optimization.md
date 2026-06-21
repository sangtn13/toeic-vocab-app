# Spec: Frontend Bundle Optimization

Date: 2026-06-21
Owner: Codex
Status: Draft

## Problem

Shared client code is pulling study-related logic into routes that do not need it. The global bootstrap path imports study progress hooks, and the auth hook depends on the study hook entrypoint, which increases shared bundle size and weakens route-level code splitting.

## Goals

- Reduce shared client JavaScript by moving study bootstrap back to study-facing routes.
- Remove avoidable cross-feature imports that block effective tree shaking.
- Keep auth bootstrap, study progress bootstrap, and existing guest progress behavior working exactly as before.

## Non-goals

- No API contract changes.
- No UI redesign or copy rewrite.
- No backend changes.

## Context to read

- `AGENTS.md`
- `CONTEXT.md`
- `docs/ai/module-map.md`
- `docs/ai/spec-driven-workflow.md`
- `app/providers.tsx`
- `components/app-shell/app-bootstrap.tsx`
- `hooks/use-auth.ts`
- `hooks/use-study.ts`
- `app/[locale]/(marketing)/page.tsx`
- `app/[locale]/study-sets/[slug]/page.tsx`
- `app/[locale]/study-sets/[slug]/units/[unitId]/page.tsx`

## Touched modules

- Frontend: `app/**`, `components/app-shell/**`, `components/study/**`, `hooks/**`, `next.config.mjs`
- Backend: none

## Contract impact

No API paths, request payloads, response DTOs, auth contract, or progress contract change. This is a frontend bundle-organization refactor only.

## Invariants

- Auth bootstrap must still restore the signed-in user after hydration.
- Guest study progress must still auto-bootstrap on the home page and study pages.
- Submit, restart, and progress token persistence behavior must remain unchanged.
- Components must keep using services and hooks through the existing ownership boundaries.

## Implementation plan

1. Split auth bootstrap into a dedicated lightweight hook/module.
2. Move study progress bootstrap to route-level client components used only on home and study routes.
3. Remove the auth hook dependency on the `use-study` entrypoint so logout only imports the study cache key module it actually needs.
4. Tighten production build config and re-run lint/build to compare route output.

## Verification

- Frontend: `npm run lint`, `npm run build`
- Backend: not touched
- Manual flow:
  - Load home page and confirm study sets still bootstrap for guest users.
  - Load study set and unit practice pages and confirm progress auto-restores.
  - Open auth dialog, login/logout, and confirm admin/home navigation still works.

## Risks

- Moving bootstrap boundaries can cause hydration-only state to initialize later if a route misses the new bootstrap component.
- Auth and study routes share stores, so import cleanup must not break query invalidation on logout.
