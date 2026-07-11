---
description: >-
  Migrate visual testing from Percy (BrowserStack) to Argos. Replace the Percy
  SDK and percy exec with the Argos reporter for Playwright, Cypress, or Storybook.
---

# Migrate from Percy to Argos

This guide shows how to move a project from [Percy](https://percy.io/) (now part of BrowserStack) to Argos. You keep your existing tests. The migration is three edits: swap the SDK package, rename the snapshot call, and drop `percy exec` from your CI command.

### How Percy and Argos differ

Both tools catch visual regressions on every pull request, but the capture model is different, and it changes a few steps below:

* **Percy** captures the **DOM, CSS, and assets** in your test, uploads them, and re-renders each snapshot **in Percy's cloud** across the widths and browsers you configure in `.percy.yml`.
* **Argos** captures the **rendered screenshot in the real browser your test already runs** and uploads the image. Extra viewports and browsers come from your test framework (for example [Playwright projects](../visual-coverage/responsive-viewports.md)), not from a server-side re-render.

The practical upshot: with Argos, what you see in your test is exactly what gets diffed, and there is no separate rendering configuration to maintain. Baselines are selected automatically from your [Git history](../../platform-fundamentals/baseline-build.md) — there is no equivalent of managing them per branch in a dashboard.

### Concept mapping

| Percy                                   | Argos                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `@percy/cli` + `@percy/playwright`      | `@argos-ci/playwright`                                                    |
| `percySnapshot(page, "Name")`           | `argosScreenshot(page, "Name")`                                          |
| `cy.percySnapshot("Name")` (Cypress)    | `cy.argosScreenshot("Name")`                                            |
| `percy exec -- <test command>`          | `<test command>` (the reporter uploads automatically)                    |
| `PERCY_TOKEN`                           | `ARGOS_TOKEN`                                                             |
| `.percy.yml` → `snapshot.widths`        | [Responsive viewports](../visual-coverage/responsive-viewports.md)       |
| `.percy.yml` → `percy-css` / `percyCSS` | [Injecting CSS](../visual-coverage/injecting-css.md)                     |
| Percy project + browsers dashboard      | Argos project ([Settings → General → Token](https://app.argos-ci.com/)) |
| Percy build review                      | [Review a build](../../review-workflow/review-a-build.md) + PR comment   |

## Migrate a Playwright project

{% stepper %}
{% step %}
### Remove the Percy packages

```bash
npm uninstall @percy/cli @percy/playwright
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
### Add the Argos reporter to your Playwright config

Percy hooks in by wrapping your test command with `percy exec`. Argos hooks in through a Playwright reporter instead, so there is no wrapper command to run.

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
    // Stabilize text rendering so screenshots match across macOS and CI.
    launchOptions: {
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  },
});
```
{% endcode %}
{% endstep %}

{% step %}
### Replace `percySnapshot` with `argosScreenshot`

The call signature is nearly identical — swap the import and the function name.

{% columns %}
{% column %}
**Before (Percy)**

```ts
import { test } from "@playwright/test";
import { percySnapshot } from "@percy/playwright";

test("homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await percySnapshot(page, "Homepage");
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
{% endstep %}

{% step %}
### Update the CI command

Drop `percy exec --` and run your tests directly. Rename the token secret from `PERCY_TOKEN` to `ARGOS_TOKEN`.

{% columns %}
{% column %}
**Before (Percy)**

```yaml
- run: npx percy exec -- npx playwright test
  env:
    PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```
{% endcolumn %}

{% column %}
**After (Argos)**

```yaml
- run: npx playwright test
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcolumn %}
{% endcolumns %}

`ARGOS_TOKEN` comes from **Settings → General → Token** in your Argos project. On GitHub Actions you can skip the secret entirely with [OIDC or tokenless authentication](../../integrations/github-actions-authentication.md).
{% endstep %}

{% step %}
### Delete Percy configuration

Remove `.percy.yml` / `percy.config.js` and the `PERCY_TOKEN` secret. See the notes below for where its options map in Argos.
{% endstep %}
{% endstepper %}

## Migrate a Cypress project

Cypress follows the same pattern. Replace `@percy/cypress` with [`@argos-ci/cypress`](../../../quickstart/cypress-quickstart.md), swap the import in `cypress/support/e2e.js`, register the Argos task in `cypress.config.js`, and rename `cy.percySnapshot("Name")` to `cy.argosScreenshot("Name")`. Then remove `percy exec` from your test command. Full steps are in the [Cypress quickstart](../../../quickstart/cypress-quickstart.md).

## Migrate a Storybook project

If you used `@percy/storybook` (`percy storybook`), Argos captures stories with the [Storybook SDK](../../../quickstart/storybook-quickstart/) and can also deploy a live Storybook URL on every PR. Follow the [Storybook quickstart](../../../quickstart/storybook-quickstart/).

## Migrating Percy configuration

<details>

<summary>Responsive widths (<code>snapshot.widths</code>)</summary>

Percy re-renders each width in the cloud. In Argos you capture each viewport in the browser. The cleanest approach is a Playwright project per viewport, or the responsive-viewport helper. See [Responsive viewports](../visual-coverage/responsive-viewports.md).

</details>

<details>

<summary>Snapshot-time CSS (<code>percy-css</code> / <code>percyCSS</code>)</summary>

Percy lets you inject CSS to hide dynamic content at render time. Argos supports the same idea — hide or neutralize dynamic elements with injected CSS. See [Injecting CSS](../visual-coverage/injecting-css.md).

</details>

<details>

<summary>Cross-browser rendering</summary>

Percy renders one DOM snapshot across multiple browsers server-side. Argos screenshots the real browser your test runs in, so to cover multiple browsers you add [Playwright projects](https://playwright.dev/docs/test-projects) for `chromium`, `firefox`, and `webkit`. Each becomes its own set of screenshots in the build.

</details>

<details>

<summary>Ignoring regions</summary>

Percy uses `data-percy-hide` / percy-specific CSS. In Argos, mark elements you want excluded or stabilized before the screenshot. See the [flaky test playbook](../../reliability-and-flakiness/flaky-tests/) and [Argos helpers](../../reliability-and-flakiness/flaky-tests/argos-helpers.md).

</details>

## Frequently asked questions

<details>

<summary>Do I have to rewrite my tests?</summary>

No. Your test files, selectors, and navigation stay the same. You only change the import, the snapshot function name, and the CI command.

</details>

<details>

<summary>What happens to my Percy baselines?</summary>

They don't transfer, and they don't need to. The first Argos build on your reference branch becomes the baseline automatically. Until that build exists, pull request builds stay [orphan](../../platform-fundamentals/baseline-build.md) — so run Argos on your default branch first.

</details>

<details>

<summary>Do I still need a separate <code>percy exec</code> step?</summary>

No. The Argos reporter uploads screenshots as part of your normal test run when it detects CI. There is no wrapper command.

</details>

<details>

<summary>Is Argos open-source friendly?</summary>

Yes. Argos has a [free plan for open-source projects](../../billing-and-subscription/open-source.md).

</details>

## Next steps

* [Keep your screenshots stable](../../reliability-and-flakiness/flaky-tests/) — avoid false positives after you switch.
* [Responsive viewports](../visual-coverage/responsive-viewports.md) — reproduce Percy's multi-width coverage.
* [Playwright SDK reference](../../../sdks-reference/playwright.md)
