# Engineering Rules

These rules make the codebase easier for both humans and AI agents to change safely.

## Module boundaries

- If logic is reusable and pure, put it in `utils/*`.
- If logic adapts external infrastructure, put it in `lib/*`.
- If logic calls the backend, put it in `services/*`.
- If logic coordinates server state, put it in `hooks/*`.
- If logic stores cross-feature client state, put it in `store/*`.
- If logic is only presentational for one component, keep it near that component.
- Do not hide domain/API behavior in UI components.

## API changes

For any endpoint, request, response, enum, or auth behavior change:

1. Update backend controller/service/DTO/request/enum.
2. Update `D:\toeic-vocab-api\FRONTEND_API.md`.
3. Update FE `config/api.ts`.
4. Update FE `types/*`.
5. Update FE `services/*`.
6. Update hooks/cache behavior if the shape or mutation side effect changed.
7. Update `docs/ai/api-contract.md` if the durable contract changed.

## Progress flow

- Never drop the latest `progress.progressToken` from mutation responses.
- Submit/restart cache sync must consider both the old progress token and the refreshed token.
- If progress recovery clears a stale token, it must be followed by a fresh progress resolution.
- Auth bootstrap and progress bootstrap are coupled: after login/register, progress bootstrap should run again to import guest progress.

## UI and copy

- New user-facing text goes through `locales/messages/*`.
- Components should receive typed data and render it; they should not normalize backend DTOs.
- Prefer small feature components over one large component, but do not split into pass-through files that add no leverage.

## Testing and verification

- Prefer testing through durable seams: services, hooks, cache helpers, backend services/controllers.
- After API changes, run or at least reason through one complete FE-BE path.
- If a verification command fails because dependencies or services are missing, report that clearly.

