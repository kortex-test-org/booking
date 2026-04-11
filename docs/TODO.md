# Project Refactoring & Alignment Checklist

This checklist tracks the effort to align the existing codebase with the new Agent rules.

## Phase 1: Establish Lazy Context Documentation
- [x] Analyze the entire project (`src/`, `pocketbase_schema.md`, etc.).
- [x] Write `docs/architecture.md` (detailing Next.js routing, Atomic Design breakdown, PocketBase connection).
- [x] Write `docs/state.md` (detailing `@tanstack/react-query` usage, local state patterns).

## Phase 2: Alignment with Code-Style and Patterns Rules
- [x] Enforce TypeScript `import type` across `src/` (Rule: `general/code-style.md`).
- [x] Verify `src/components/` structural boundaries strictly adhere to Atomic Design rules without skipping levels.
- [x] Ensure all file names follow the `kebab-case` or Next.js predefined conventions.

## Phase 3: Cleanup and Tooling
- [x] Run `bun run lint` and `bun run format` (Biome) to conform to code-style formatting globally.
- [x] Address any identified typecheck errors (`bun run typecheck`).
