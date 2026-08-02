# Tasks
- [x] Task 1: Replace the renderer dependency source.
  - [x] Update `package.json` to point `minecraft-renderer` at `https://github.com/hellios-12/minecraft-renderer-1`.
  - [x] Refresh `pnpm-lock.yaml` so installs resolve the requested repository.

- [x] Task 2: Restore compatibility with the new renderer package layout.
  - [x] Inspect build-time asset copying in `rsbuild.config.ts`.
  - [x] Inspect runtime asset serving in `server.js`.
  - [x] Update any code paths that assume the old package structure or exported files.

- [ ] Task 3: Validate the replacement with the project build check.
  - [ ] Run `pnpm check-build`.
  - [ ] Fix any renderer-related build or type errors caused by the dependency change.
  - [ ] Re-run `pnpm check-build` until it succeeds or remaining blockers are fully documented.

# Task Dependencies
- Task 2 depends on Task 1.
- Task 3 depends on Task 1 and Task 2.
