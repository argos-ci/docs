---
description: >-
  Migrate visual testing from Applitools Eyes to Argos. Replace the eyes.check()
  lifecycle and the Ultrafast Grid with Argos screenshots for Playwright or Cypress.
---

# Migrate from Applitools to Argos

This guide shows how to move a project from [Applitools Eyes](https://applitools.com/) to Argos. The biggest change is the API shape: Applitools uses an `open` / `check` / `close` lifecycle per test, while Argos captures a screenshot with a single call.

### How Applitools and Argos differ

* **Applitools** captures the DOM in your test and renders it in the **Ultrafast Grid** across the browsers and viewports you configure, then compares with **Visual AI** using match levels (Strict, Layout, Content, Exact).
* **Argos** captures the **rendered screenshot in the browser your test runs** and compares it with a [pixel diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md) tuned to ignore anti-aliasing and sub-pixel noise. Cross-browser and multi-viewport coverage comes from your test framework (for example [Playwright projects](../visual-coverage/responsive-viewports.md)).

If you leaned heavily on Applitools' Layout match level and cloud grid, plan for two things in Argos: cover extra browsers/viewports by running your tests in them, and [stabilize dynamic content](../../reliability-and-flakiness/flaky-tests/) so the pixel diff stays clean.

### Concept mapping

| Applitools                                        | Argos                                                                             |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `@applitools/eyes-playwright`                     | `@argos-ci/playwright`                                                             |
| `eyes.open()` / `eyes.check()` / `eyes.close()`   | `argosScreenshot(page, "Name")`                                                  |
| `cy.eyesOpen` / `cy.eyesCheckWindow` / `cy.eyesClose` | `cy.argosScreenshot("Name")`                                                 |
| `APPLITOOLS_API_KEY`                              | `ARGOS_TOKEN`                                                                      |
| Ultrafast Grid (browsers & viewports)             | [Playwright projects](https://playwright.dev/docs/test-projects) / [responsive viewports](../visual-coverage/responsive-viewports.md) |
| Match levels (Strict, Layout, Content)            | [Diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md) + [flaky-test stabilization](../../reliability-and-flakiness/flaky-tests/) |
| Batches                                           | [Builds](../../platform-fundamentals/build-modes.md)                              |
| `applitools.config.js`                            | Argos reporter options in `playwright.config.ts`                                  |
| Eyes dashboard                                    | [Review a build](../../review-workflow/review-a-build.md) + PR comment            |

## Migrate a Playwright project

{% stepper %}
{% step %}
### Remove the Applitools packages

```bash
npm uninstall @applitools/eyes-playwright
```
{% endstep %}

{% step %}
### Install the Argos Playwright SDK

{% tabs %}
{% tab title="npm" %}
```bash
npm i --save-dev @argos-ci/playwright
```
{% endtab %}

{% tab title="yarn" %}
```bash
yarn add --dev @argos-ci/playwright
```
{% endtab %}

{% tab title="pnpm" %}
```bash
pnpm add --save-dev @argos-ci/playwright
```
{% endtab %}

{% tab title="bun" %}
```bash
bun add --dev @argos-ci/playwright
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Add the Argos reporter

Applitools is configured through `applitools.config.js` and custom fixtures. In Argos, configuration lives in the Playwright reporter:

{% code title="playwright.config.ts" %}
```ts
import { defineConfig } from "@playwright/test";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        uploadToArgos: !!process.env.CI,
        // Required only if you are not using GitHub Actions.
        token: "<YOUR-ARGOS-TOKEN>",
      }),
    ],
  ],
  use: {
    launchOptions: {
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  },
});
```
{% endcode %}
{% endstep %}

{% step %}
### Collapse the Eyes lifecycle into one call

Replace each `open` → `check` → `close` sequence with a single `argosScreenshot` call. There is no per-test session to open or close.

{% columns %}
{% column %}
**Before (Applitools)**

```ts
import { test } from "@applitools/eyes-playwright/fixture";

test("homepage", async ({ page, eyes }) => {
  await page.goto("http://localhost:3000");
  await eyes.check("Homepage", Target.window().fully());
  // eyes.open()/close() handled by the fixture
});
```
{% endcolumn %}

{% column %}
**After (Argos)**

```ts
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

test("homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await argosScreenshot(page, "Homepage");
});
```
{% endcolumn %}
{% endcolumns %}

If you used the plain (non-fixture) API — `const eyes = new Eyes(runner); await eyes.open(...); await eyes.check(...); await eyes.close();` — remove all three lifecycle calls and keep one `argosScreenshot` per checkpoint.
{% endstep %}

{% step %}
### Update the CI command

Rename the secret from `APPLITOOLS_API_KEY` to `ARGOS_TOKEN` and run your tests directly.

```yaml
- run: npx playwright test
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```

On GitHub Actions you can use [OIDC](../../integrations/github-oidc-authentication.md) or [tokenless authentication](../../integrations/github-tokenless-authentication.md) instead of a secret.
{% endstep %}

{% step %}
### Delete Applitools config

Remove `applitools.config.js`, any Eyes fixtures/imports, and the `APPLITOOLS_API_KEY` secret.
{% endstep %}
{% endstepper %}

## Migrate a Cypress project

Replace `@applitools/eyes-cypress` with [`@argos-ci/cypress`](../../../quickstart/cypress-quickstart.md). The three-call lifecycle collapses the same way:

{% columns %}
{% column %}
**Before (Applitools)**

```js
cy.eyesOpen({ appName: "App", testName: "Homepage" });
cy.eyesCheckWindow("Homepage");
cy.eyesClose();
```
{% endcolumn %}

{% column %}
**After (Argos)**

```js
cy.argosScreenshot("Homepage");
```
{% endcolumn %}
{% endcolumns %}

Full setup is in the [Cypress quickstart](../../../quickstart/cypress-quickstart.md).

## Migrating Applitools features

<details>

<summary>Match levels (Layout / Content / Strict)</summary>

Argos uses a single [pixel diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md) with tolerance for anti-aliasing and rendering noise, rather than selectable match levels. To handle content that legitimately changes (dates, avatars, ads), stabilize it before the screenshot — see the [flaky test playbook](../../reliability-and-flakiness/flaky-tests/) and [Argos helpers](../../reliability-and-flakiness/flaky-tests/argos-helpers.md).

</details>

<details>

<summary>Ultrafast Grid (many browsers & viewports)</summary>

Argos captures the real browser your test runs in. Reproduce grid coverage by adding [Playwright projects](https://playwright.dev/docs/test-projects) for `chromium`, `firefox`, and `webkit`, and by capturing multiple [responsive viewports](../visual-coverage/responsive-viewports.md).

</details>

<details>

<summary>Regions to ignore / floating regions</summary>

Instead of ignore regions defined in the check call, hide or neutralize dynamic elements before the screenshot with [injected CSS](../visual-coverage/injecting-css.md) or the stabilization helpers.

</details>

## Frequently asked questions

<details>

<summary>Does Argos use AI to compare screenshots?</summary>

Argos compares with a pixel diff algorithm tuned to ignore anti-aliasing and sub-pixel differences. It also offers [AI-assisted review](../../review-workflow/review-builds-with-ai-agents.md) to help triage changes, but the diff itself is deterministic. See [how Argos detects visual differences](../../platform-fundamentals/how-argos-detects-visual-differences.md).

</details>

<details>

<summary>Do I need to open and close a session per test?</summary>

No. There is no session lifecycle. Call `argosScreenshot` wherever you want a checkpoint and the reporter handles the upload.

</details>

<details>

<summary>What happens to my Applitools baselines?</summary>

They don't transfer. The first Argos build on your reference branch becomes the baseline automatically, so run Argos on your default branch first.

</details>

## Next steps

* [How Argos detects visual differences](../../platform-fundamentals/how-argos-detects-visual-differences.md)
* [Keep your screenshots stable](../../reliability-and-flakiness/flaky-tests/)
* [Responsive viewports](../visual-coverage/responsive-viewports.md) — reproduce Ultrafast Grid coverage.
