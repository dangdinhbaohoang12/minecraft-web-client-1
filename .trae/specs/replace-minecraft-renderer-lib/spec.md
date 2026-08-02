# Replace Minecraft Renderer Spec

## Why
The project currently depends on the published `minecraft-renderer` package, but the requested source of truth is the GitHub repository at `https://github.com/hellios-12/minecraft-renderer-1`. Replacing the dependency may affect build-time asset copying and runtime package-resolution assumptions, so the change needs explicit verification.

## What Changes
- Replace the `minecraft-renderer` dependency source with the requested GitHub repository.
- Update dependency resolution artifacts so installs use the new source consistently.
- Review build-time and runtime code paths that resolve files from the installed `minecraft-renderer` package and adjust them if the new package layout differs.
- Run `pnpm check-build` after the replacement and capture any resulting errors that must be fixed for the change to be considered complete.

## Impact
- Affected specs: dependency management, build verification, renderer asset packaging
- Affected code: `package.json`, `pnpm-lock.yaml`, `rsbuild.config.ts`, `server.js`, any source files that rely on `minecraft-renderer` exports or package assets

## ADDED Requirements
### Requirement: Renderer Dependency Replacement
The system SHALL install the renderer library from `https://github.com/hellios-12/minecraft-renderer-1` instead of the current published `minecraft-renderer` package source.

#### Scenario: Install uses requested repository
- **WHEN** project dependencies are installed after the change
- **THEN** the resolved renderer dependency comes from `https://github.com/hellios-12/minecraft-renderer-1`
- **AND** the workspace lockfile reflects the new source

### Requirement: Renderer Build Compatibility
The system SHALL keep build-time and runtime renderer asset resolution working after the dependency source is replaced.

#### Scenario: Build scripts resolve renderer assets
- **WHEN** build preparation or production runtime resolves files from the installed renderer package
- **THEN** required files such as version metadata and mesher assets are still found
- **AND** any package-layout differences are handled in project code

### Requirement: Replacement Verification
The system SHALL validate the dependency replacement by running `pnpm check-build` and reporting the outcome.

#### Scenario: Verification succeeds
- **WHEN** `pnpm check-build` runs after the renderer replacement
- **THEN** the command completes successfully without new renderer-related failures

#### Scenario: Verification finds breakage
- **WHEN** `pnpm check-build` runs after the renderer replacement
- **THEN** any errors are identified
- **AND** the project is updated as needed so the replacement can pass verification
