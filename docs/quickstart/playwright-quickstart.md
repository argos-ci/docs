---
description: Learn how to setup visual testing using the Argos Playwright SDK.
---

# Playwright Quickstart

### Prerequisites

To get the most out of this guide, you’ll need to:

* [Use Playwright](https://playwright.dev/docs/intro#installing-playwright)
* [Run Playwright on your CI/CD](https://playwright.dev/docs/ci-intro#on-pushpull_request)
* [Create your project in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Get the Argos Playwright SDK.

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
### Setup Argos in your Playwright config

The Argos reporter seamlessly uploads screenshots and traces to Argos in real-time.

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

        // Set your Argos token (required if not using GitHub Actions).
        token: "<YOUR-ARGOS-TOKEN>",
      }),
    ],
  ],

  // Setup recording option to enable test debugging features.
  use: {
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',

    // Capture screenshot after each test failure.
    screenshot: "only-on-failure",

    // Stabilize text rendering so screenshots match across macOS and CI.
    launchOptions: {
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  },
});
```
{% endcode %}

Playwright's [recording options](https://playwright.dev/docs/test-use-options#recording-options) facilitate the automated capture of screenshots upon test failures. Notably, these captured screenshots and traces are then automatically uploaded to Argos.

{% hint style="success" %}
The `launchOptions` above disable subpixel text and font hinting, so glyphs render identically on your machine and on CI. This single change prevents one of the most common causes of flaky screenshots—learn why in [Stabilize Text Rendering](../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md).
{% endhint %}
{% endstep %}

{% step %}
### Take screenshots

Use `argosScreenshot` helper to capture stable screenshots in your E2E tests.

{% code title="tests/example.spec.ts" %}
```js
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

test("screenshot homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await argosScreenshot(page, "homepage");
});
```
{% endcode %}

Tip: Check out our guides to [screenshot multiple pages](../learn/how-to-guides/visual-coverage/capture-screenshots-from-urls.md) or [capture multiple viewports](../learn/how-to-guides/visual-coverage/responsive-viewports.md).
{% endstep %}

{% step %}
### Set up CI

Run your Playwright tests in CI with `ARGOS_TOKEN` set. The Argos reporter uploads screenshots automatically when it detects a CI environment.

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
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md) to avoid managing a secret.
{% endstep %}
{% endstepper %}

### Congratulations on installing Argos! 👏

After committing and pushing your changes, the Argos check status will appear on your pull request in GitHub (or GitLab).

**Note:** you need a reference build to compare your changes with. If you don't have one, builds will remain orphan until you run Argos on your reference branch.

You can now review changes of your app for each pull request, avoid visual bugs and merge with confidence. Welcome on board!

### Next step: keep your screenshots stable

Now that Argos is running, the next thing to learn is how to keep your screenshots free of flakiness. Read [Best practices for stable screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) to avoid false positives before they reach your pull requests.

### Additional resources

* [Playwright example](https://github.com/argos-ci/argos-javascript/tree/main/examples/playwright)
* [Argos Playwright SDK reference](../sdks-reference/playwright.md)

***

[Join our Discord](https://argos-ci.com/discord), [submit an issue on GitHub](https://github.com/argos-ci/argos/issues) or just [send an email](mailto:contact@argos-ci.com) if you need help.
