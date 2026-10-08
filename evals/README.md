# Executed recipe checks

Verified 2026-10-08 on Node 26.3.0 and Playwright 1.64.0, with bundled Chromium headless shell revision 1248, using the committed npm lockfile.

```sh
cd evals
npm ci --ignore-scripts
npx playwright install chromium --only-shell
npm test
```

Five tests pass, including one declared expected failure. Checks cover enabled-state readiness while background HTTP requests continue, detection of a visible but permanently disabled control, separate browser storage with shared backend state, and API fixture cleanup after a deliberately failed assertion. The final test checks the worker-owned backend has no leaked records. `npm audit` reported no vulnerabilities for the fixture lockfile at review time.

These verify representative corrected recipes on Chromium. They do not certify every upstream example, Firefox/WebKit, production backend isolation or model task completion. Use each target project's installed Playwright version and actual data isolation mechanism.
