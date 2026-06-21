# ADR 0001: Add an AI Operating Layer

Date: 2026-06-20
Status: Accepted

## Context

As the project grows, agents can break unrelated behavior when they edit from incomplete context or reread too much code inefficiently. The app also spans a Next.js frontend and a Spring Boot backend, so FE-BE contract drift is a recurring risk.

## Decision

Add a small AI operating layer:

- `AGENTS.md` for required agent rules.
- `CONTEXT.md` for compact project memory.
- `docs/agents/*` for engineering-skill configuration.
- `docs/ai/*` for module maps, contract snapshots, and durable rules.
- `docs/specs/*` for spec-driven changes.

## Consequences

Agents should read less code but read better context first. Any durable change to domain language, API contract, module ownership, or rules must update the relevant docs. The backend remains in a separate repo, so the frontend docs reference `D:\toeic-vocab-api` and its `FRONTEND_API.md`.

