# Changelog

All notable changes to the inprojects distribution will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this distribution follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-10-08

### Changed

- Rewrote the skill description with concrete trigger situations and Polish request phrases, so agents that route by description alone, such as Claude Code, select the skill reliably.

### Fixed

- Replaced fixed sleeps and `networkidle` waits in the mobile, service worker, performance and canvas examples with explicit readiness conditions, matching the entrypoint rules.
- Made the long-press example hold the press under a controlled clock; the previous tap released immediately.

## [1.0.0] - 2026-10-08

### Added

- Added a focused Claude Code, Codex and portable plugin package with preserved upstream MIT license.
- Added reproducible evaluation examples and source provenance.

### Fixed

- Corrected readiness waiting, backend transaction boundaries, parallel data identifiers and broken reference links.

### Changed

- Shortened the entrypoint and made test scope, credentials handling and failure diagnosis explicit.

[Unreleased]: https://github.com/inprojectspl/playwright-best-practices-skill/compare/inprojects-v1.0.1...main
[1.0.1]: https://github.com/inprojectspl/playwright-best-practices-skill/compare/inprojects-v1.0.0...inprojects-v1.0.1
[1.0.0]: https://github.com/inprojectspl/playwright-best-practices-skill/releases/tag/inprojects-v1.0.0
