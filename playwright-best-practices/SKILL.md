---
name: playwright-best-practices
description: Plan, implement and review Playwright browser E2E and HTTP API tests, including locators, waits, authentication, data isolation, traces and CI. Use when the project uses Playwright or the user asks for end-to-end tests, a flaky Playwright test fix, authenticated test setup or a Playwright CI job; component, visual and accessibility testing are optional task-specific modes. Also use for Polish requests such as "testy E2E", "testy Playwright", "niestabilny test E2E" or "logowanie w testach E2E".
license: MIT
metadata:
  author: currents.dev
  adapted-by: inprojects
  version: "1.0.1"
---

# Playwright testing

Match the task to the project's installed Playwright version, existing test architecture and package manager. Preserve the selected browser projects, authentication mechanism and CI provider. Do not introduce a service, reporter, new test framework or broad test run merely because a reference mentions it.

## Work contract

1. Inspect test scripts, Playwright config, fixtures, relevant application behavior and the requested scope. Identify the target environment and the owner of any test data before API writes or cleanup.
2. Derive expected results from requirements, known examples or an independent contract. Cover the meaningful failure path as well as success. A locator count, status code or mocked response alone may not establish the requested business outcome.
3. Prefer accessible locators and web-first assertions. Await interactions and assert the actual ready state. Subscribe to responses/downloads/popups before the action that triggers them. Avoid arbitrary sleeps and `networkidle` as a test-readiness signal.
4. Isolate browser context and backend state separately. Browser storage isolation does not reset a database. Use test-owned accounts/data, account for parallel workers and shards, and clean only resources created by the test. A transaction on the test process's DB connection cannot roll back a separate application's writes.
5. Keep stored authentication files and traces containing credentials out of version control. Use independent accounts for parallel tests that modify shared server state. Test the real login flow separately from scenarios that reuse authenticated state.
6. Run the smallest relevant command. On failure, use the error and trace to distinguish product defects, test defects and environment failures. Preserve independent expectations; do not weaken assertions, add sleeps, increase retries or update snapshots merely to obtain green results. Stop when a missing prerequisite or authorization prevents meaningful progress and report it.

For planning, return scenarios and assumptions without claiming execution. For review, provide evidence and prioritized fixes. For implementation, report changed behavior, the actual command and pass/fail/skip results. Use repeated runs only when investigating stability or validating a critical flow; report the repetition count and observed failures.

## Read by task

| Task | References |
| --- | --- |
| Browser tests | [Locators](core/locators.md), [assertions and waiting](core/assertions-waiting.md), [structure](core/test-suite-structure.md) |
| HTTP/API tests | [API testing](testing-patterns/api-testing.md) |
| Fixtures and backend isolation | [Fixtures](core/fixtures-hooks.md), [test data](core/test-data.md) |
| Authentication | [Authentication](advanced/authentication.md), [multi-user flows](advanced/multi-user.md) |
| Flaky failures | [Flaky tests](debugging/flaky-tests.md), [debugging and traces](debugging/debugging.md) |
| React integration | [React](frameworks/react.md), [component testing](testing-patterns/component-testing.md) |
| CI | [GitLab](infrastructure-ci-cd/gitlab.md), [GitHub Actions](infrastructure-ci-cd/github-actions.md), [sharding](infrastructure-ci-cd/parallel-sharding.md) |
| Visual or accessibility checks | [Visual regression](testing-patterns/visual-regression.md), [accessibility](testing-patterns/accessibility.md) |
| Less common tasks | [Extended reference index](reference-index.md) |

References are examples to adapt, not proof of compatibility with every project. Load only the relevant material. Automated accessibility checks cover selected detectable issues and do not establish complete WCAG conformance.
