# Spec-Driven Workflow

Use specs to keep large changes coherent without rereading the whole repo.

## When to create a spec

Create or update a spec under `docs/specs/` when a change:

- Touches both FE and BE.
- Changes API contract, DTOs, auth, progress, or cache behavior.
- Adds a feature with more than one component/hook/service.
- Refactors module ownership or durable architecture.
- Has risk of breaking an existing flow.

For tiny copy/style changes, a spec is optional.

## Workflow

1. Name the spec: `docs/specs/YYYY-MM-DD-short-feature-name.md`.
2. Write the problem, goals, non-goals, touched modules, and FE-BE contract impact.
3. List invariants that must not break.
4. Implement the smallest vertical slice first.
5. Update the spec as decisions change.
6. Before finishing, mark verification and remaining risks.

## Required sections

Use `docs/specs/_template.md` as the starting point.

Keep specs concise. A useful spec is a map, not a novel.

