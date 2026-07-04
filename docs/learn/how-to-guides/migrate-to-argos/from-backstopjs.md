---
description: >-
  Migrate visual testing from self-hosted BackstopJS to Argos. Turn backstop.json
  scenarios into Playwright screenshots with cloud baselines and pull request review.
---

# Migrate from BackstopJS to Argos

[BackstopJS](https://github.com/garris/BackstopJS) runs visual tests locally: you describe scenarios in `backstop.json`, capture baselines to a folder, and diff against them on your machine or CI. This guide moves that setup to Argos so baselines live in the cloud, comparisons are consistent across machines, and changes are reviewed on the pull request instead of in a local HTML report.

### Why teams move off BackstopJS

BackstopJS is a solid self-hosted tool, but running it as a team surfaces gaps:

* **Baselines are local files.** `bitmaps_reference/` is committed to Git or regenerated per machine — bloating the repo and drifting between environments.
* **Approval is manual and local.** `backstop approve` promotes images on one machine; there's no shared review, no history, and no per-change approval.
* **No pull request integration.** BackstopJS doesn't post a status or comment on your PR. You wire up reporting yourself.
* **You maintain the infrastructure.** Browsers, parallelization, storage, and flaky-content handling are all on you.

Argos keeps the same idea — visit a page, screenshot it, diff it — but selects baselines from your [Git history](../../platform-fundamentals/baseline-build.md), runs the comparison in the cloud, and turns each change into a [reviewable PR check](../../review-workflow/review-a-build.md).

### Concept mapping

| BackstopJS                                     | Argos                                                                             |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `backstop.json` `scenarios` (URL + selectors)  | A Playwright test that visits URLs and calls `argosScreenshot`                    |
| `viewports`                                    | [Responsive viewports](../visual-coverage/responsive-viewports.md)               |
| `backstop reference`                           | Run on your default branch (baseline is automatic)                                |
| `backstop test`                                | Run on your pull request branch                                                   |
| `backstop approve`                             | Approve in the [Argos review UI](../../review-workflow/review-a-build.md)          |
| `bitmaps_reference/` (local baselines)         | Cloud baselines from [Git history](../../platform-fundamentals/baseline-build.md) |
| Local HTML report                              | [Build review](../../review-workflow/review-a-build.md) + PR comment              |
| `hideSelectors` / `removeSelectors`            | [Injected CSS](../visual-coverage/injecting-css.md) / stabilization               |
| `misMatchThreshold`                            | [Diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md) |
| `clickSelector` / `hoverSelector` / `onReadyScript` | Playwright interactions before the screenshot                                |

## Migrate the project

Argos captures screenshots from a test framework rather than a JSON scenario file. Playwright is the closest match to BackstopJS's browser-driving model, so this guide translates scenarios into a small Playwright test. (If you drive a fully custom pipeline, you can also capture images yourself and upload them with [`argos upload`](../../../quickstart/any-test-framework.md).)

{% stepper %}
{% step %}
### Install Playwright and the Argos SDK

{% tabs %}
{% tab title="npm" %}
```bash
npm i --save-dev @playwright/test @argos-ci/playwright
```
{% endtab %}

{% tab title="yarn" %}
```bash
yarn add --dev @playwright/test @argos-ci/playwright
```
{% endtab %}

{% tab title="pnpm" %}
```bash
pnpm add --save-dev @playwright/test @argos-ci/playwright
```
{% endtab %}

{% tab title="bun" %}
```bash
bun add --dev @playwright/test @argos-ci/playwright
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Add the Argos reporter

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
### Translate scenarios into a test

Each BackstopJS scenario becomes a `goto` + `argosScreenshot`. Interaction fields map to Playwright actions before the screenshot.

{% columns %}
{% column %}
**Before (`backstop.json`)**

```json
{
  "scenarios": [
    {
      "label": "Homepage",
      "url": "http://localhost:3000/"
    },
    {
      "label": "Menu open",
      "url": "http://localhost:3000/",
      "clickSelector": ".menu-toggle"
    }
  ],
  "viewports": [
    { "label": "mobile", "width": 375, "height": 667 },
    { "label": "desktop", "width": 1280, "height": 800 }
  ]
}
```
{% endcolumn %}

{% column %}
**After (`tests/visual.spec.ts`)**

```ts
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

test("Homepage", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await argosScreenshot(page, "Homepage");
});

test("Menu open", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.click(".menu-toggle");
  await argosScreenshot(page, "Menu open");
});
```
{% endcolumn %}
{% endcolumns %}

To reproduce `viewports`, add a [Playwright project per viewport](../visual-coverage/responsive-viewports.md). If your scenarios are just a list of URLs with no interactions, the [Capture screenshots from URLs](../visual-coverage/capture-screenshots-from-urls.md) guide shows a compact loop.
{% endstep %}

{% step %}
### Seed the baseline and wire up CI

There's no `backstop reference` step — run the tests on your default branch and Argos captures the baseline automatically. Until that build exists, pull request builds stay [orphan](../../platform-fundamentals/baseline-build.md).

```yaml
- run: npx playwright install --with-deps chromium
- run: npx playwright test
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```

`ARGOS_TOKEN` comes from **Settings → General → Token**. On GitHub Actions you can use [OIDC](../../integrations/github-oidc-authentication.md) or [tokenless authentication](../../integrations/github-tokenless-authentication.md) instead of a secret.
{% endstep %}

{% step %}
### Remove BackstopJS

Delete `backstop.json`, the `backstop_data/` directory (`bitmaps_reference/`, `bitmaps_test/`, `html_report/`), and the `backstopjs` dependency. Baselines and reports now live in Argos.
{% endstep %}
{% endstepper %}

## Migrating BackstopJS options

<details>

<summary>Hiding or removing elements (<code>hideSelectors</code> / <code>removeSelectors</code>)</summary>

Neutralize dynamic content before the screenshot with [injected CSS](../visual-coverage/injecting-css.md) (for example `visibility: hidden`) or the [stabilization helpers](../../reliability-and-flakiness/flaky-tests/argos-helpers.md), rather than per-scenario selector lists.

</details>

<details>

<summary>Ready scripts and delays (<code>onReadyScript</code> / <code>delay</code>)</summary>

Replace these with normal Playwright waits — `await page.waitForSelector(...)`, `await expect(locator).toBeVisible()` — before calling `argosScreenshot`. See [Wait for loading](../../reliability-and-flakiness/flaky-tests/wait-for-loading.md).

</details>

<details>

<summary>Mismatch threshold (<code>misMatchThreshold</code>)</summary>

Argos uses its own [diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md) with anti-aliasing tolerance, so you don't set a per-scenario threshold.

</details>

## Frequently asked questions

<details>

<summary>Do I have to use Playwright?</summary>

No. Playwright is the closest match to how BackstopJS drives a browser, but Argos also works with [Cypress, WebdriverIO, Puppeteer](../../../quickstart/), or [any pipeline](../../../quickstart/any-test-framework.md) via `argos upload`. If you already capture images, you can skip the framework and just upload them.

</details>

<details>

<summary>Where do baselines and reports live now?</summary>

In Argos. Baselines are selected from your [Git history](../../platform-fundamentals/baseline-build.md), and every run produces a [reviewable build](../../review-workflow/review-a-build.md) with a PR status and comment — no committed `bitmaps_reference/` or local HTML report.

</details>

<details>

<summary>How do I approve changes without <code>backstop approve</code>?</summary>

Open the build in the [Argos review UI](../../review-workflow/review-a-build.md) and approve or request changes. The PR check updates automatically.

</details>

## Next steps

* [Playwright quickstart](../../../quickstart/playwright-quickstart.md)
* [Capture screenshots from URLs](../visual-coverage/capture-screenshots-from-urls.md) — closest to a scenario list.
* [Keep your screenshots stable](../../reliability-and-flakiness/flaky-tests/)
