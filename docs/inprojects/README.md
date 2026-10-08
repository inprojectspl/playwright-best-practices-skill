# inprojects distribution

This GitHub fork preserves [currents-dev/playwright-best-practices-skill](https://github.com/currents-dev/playwright-best-practices-skill) history. The maintained distribution is **playwright-best-practices 1.0.0** at `plugin/`, tagged `inprojects-v1.0.0`. The repository root remains the upstream authoring repository, not the installable plugin.

## Provenance and scope

- Upstream baseline: `283d5cbc5d11aac1abda058b16ad22c317d54dc0`.
- Canonical skill: `playwright-best-practices/`.
- MIT license: `LICENSE.md`, copied verbatim to `plugin/LICENSE`.
- The package contains only `playwright-best-practices` and its references. It includes no hooks, MCP servers or other upstream skills.
- Fork versioning is independent of upstream and of the framework version documented by the skill.

## Authoring and validation

Edit the canonical skill, run `python3 scripts/package_plugin.py`, and commit the generated package. Run `python3 scripts/package_plugin.py --check` to detect drift. See [example checks](../../evals/README.md) for executed checks and limits. Regeneration of upstream skill content requires reapplying and reviewing our corrections.

## Installation

Install `playwright-best-practices@inprojects-ai-tools` from the team marketplace, which selects `plugin/` at a reviewed release tag. Do not install a second standalone copy of the same skill. In Claude Code prefer `claude plugin install playwright-best-practices@inprojects-ai-tools --scope project` from the intended project.

## Updating upstream

Fetch `upstream`, review changes since `283d5cbc5d11aac1abda058b16ad22c317d54dc0`, and merge only after evaluating affected guidance. Re-run examples, package drift and client validation. Publish a new immutable `inprojects-vX.Y.Z` tag and update the marketplace explicitly. Do not move published tags or blindly regenerate from newer framework docs.
