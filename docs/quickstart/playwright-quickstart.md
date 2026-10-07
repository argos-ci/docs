---
description: Set up visual testing in your Playwright tests with the Argos Playwright SDK.
---

# Playwright visual testing quickstart

To add visual testing to [Playwright](https://playwright.dev/), install `@argos-ci/playwright`, add the Argos reporter to `playwright.config.ts`, call `argosScreenshot(page, "name")` in your tests, and run `npx playwright test` in CI with the `ARGOS_TOKEN` environment variable set. Argos compares every screenshot with a [baseline build](../learn/platform-fundamentals/baseline-build.md) picked from your Git history and reports the changes as a check on your pull request.

### What Argos adds over `toHaveScreenshot()`

Playwright's built-in `toHaveScreenshot()` already compares screenshots. Argos keeps your Playwright tests and changes what happens around them:

* **No baselines in your repository.** `toHaveScreenshot()` stores reference PNGs in `*-snapshots/` folders that you commit, with a separate image per platform. Argos picks the baseline from your Git history, so there are no images to commit or keep in sync.
* **Review on the pull request.** A `toHaveScreenshot()` mismatch fails the test until you re-run with `--update-snapshots` and commit new images. Argos turns visual changes into a pull request check that your team [approves or rejects](../learn/review-workflow/review-a-build.md).
* **Fewer flaky diffs.** `argosScreenshot` waits for fonts, images, and `aria-busy` loaders before capturing, and Argos [flags unstable tests](../learn/reliability-and-flakiness/flaky-test-detection.md) with a flaky badge and a stability score.

Already using `toHaveScreenshot()`? Follow [Migrate from Playwright toHaveScreenshot to Argos](../learn/how-to-guides/migrate-to-argos/from-playwright-native-screenshots.md), or read the [Argos vs Playwright screenshots](https://argos-ci.com/compare/playwright) comparison.

### Prerequisites

* Node.js 22 or later
* [Playwright](https://playwright.dev/docs/intro#installing-playwright) set up in your project
* [Playwright running on your CI](https://playwright.dev/docs/ci-intro#on-pushpull_request)
* [A project created in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Install the Argos Playwright SDK:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/playwright
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/playwright
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/playwright
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/playwright
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Add the Argos reporter to your Playwright config

The Argos reporter uploads screenshots and traces to Argos as your tests run:

{% code title="playwright.config.ts" %}
```js
import { defineConfig } from "@playwright/test";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({
  // ... other configuration

  // Reporter to use
  reporter: [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],
    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      }),
    ],
  ],

  // Start your app before the tests run, locally and on CI.
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },

  // Setup recording option to enable test debugging features.
  use: {
    // Resolve relative URLs like page.goto("/") against your app.
    baseURL: "http://localhost:3000",

    // Collect trace when retrying the failed test.
    trace: "on-first-retry",

    // Capture screenshot after each test failure.
    screenshot: "only-on-failure",

    // Reduce text rendering differences between machines.
    launchOptions: {
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  },
});
```
{% endcode %}

`webServer` starts your app before the tests run, on your machine and on CI, so `page.goto("/")` reaches it. Replace `npm run start` with the command that serves your app, and the URL with the one it listens on.

With `trace` and `screenshot` enabled, Playwright records failure screenshots and traces — the reporter uploads them to Argos automatically, so you can debug failed tests visually.

{% hint style="success" %}
The `launchOptions` above disable subpixel text and font hinting, which reduces text rendering differences between your machine and CI. This single change prevents one of the most common causes of flaky screenshots — learn why in [Stabilize text rendering](../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md).
{% endhint %}
{% endstep %}

{% step %}
### Capture screenshots

Use the `argosScreenshot` helper to capture stable screenshots in your tests:

{% code title="tests/example.spec.ts" %}
```js
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

test("screenshot homepage", async ({ page }) => {
  await page.goto("/");
  await argosScreenshot(page, "homepage");
});
```
{% endcode %}

Screenshots are written to the `./screenshots` directory by default. Add `./screenshots` to your `.gitignore` file to avoid committing them.

Tip: Check out our guides to [screenshot multiple pages](../learn/how-to-guides/visual-coverage/capture-screenshots-from-urls.md) or [capture multiple viewports](../learn/how-to-guides/visual-coverage/responsive-viewports.md).
{% endstep %}

{% step %}
### Set up CI

Run your Playwright tests in CI with `ARGOS_TOKEN` set. The Argos reporter uploads screenshots automatically when it detects a CI environment:

{% code title=".github/workflows/argos.yml" %}
```yaml
name: Argos

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  argos:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md) to avoid managing a secret. On other CI providers, pass the token with the `ARGOS_TOKEN` environment variable or the reporter's `token` option. For GitLab CI, CircleCI, Buildkite, and other providers, see [Run Argos in CI](../learn/how-to-guides/ci-pipelines/run-argos-in-ci.md).
{% endstep %}
{% endstepper %}

### You're all set

Push your changes and open a pull request — the Argos check appears on it once the build is uploaded. Review the visual changes, approve or reject them, and merge with confidence.

{% hint style="info" %}
Argos needs a baseline to compare against. Until a build runs on your default branch, pull request builds are marked as [orphan](../learn/platform-fundamentals/baseline-build.md#orphan-builds). Merge this setup or run the workflow once on your default branch to establish the baseline.
{% endhint %}

### Frequently asked questions

<details>

<summary>How do I update the baseline after an intended change?</summary>

You don't update any file. Review the build in Argos and [approve the changes](../learn/review-workflow/review-a-build.md): an approved build is eligible as a baseline. Once you merge, the build on your default branch, which Argos approves automatically by default, becomes the baseline for the pull requests that follow. See [Baseline build](../learn/platform-fundamentals/baseline-build.md).

</details>

<details>

<summary>Why do screenshots differ between my machine and CI?</summary>

Fonts, text rendering, and browser versions depend on the operating system, so the same page renders slightly differently on macOS and on a Linux CI runner. The Argos reporter uploads to Argos only from CI (`uploadToArgos: !!process.env.CI`), so Argos only compares screenshots captured on CI, and the `launchOptions` flags make text render the same way on every machine. See [Stabilize text rendering](../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md) and [Browser glitches](../learn/reliability-and-flakiness/flaky-tests/browser-glitches.md).

</details>

### Next steps

* [Stabilize screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [Playwright SDK reference](../sdks-reference/playwright.md) – All options and helpers
* [Playwright example](https://github.com/argos-ci/argos-javascript/tree/main/examples/playwright) – A complete working setup
* [Playwright visual regression testing in CI](https://argos-ci.com/blog/playwright-visual-regression-testing-ci) – The complete guide, on the Argos blog

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
