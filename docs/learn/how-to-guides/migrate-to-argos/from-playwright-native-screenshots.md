---
description: >-
  Move from Playwright's built-in toHaveScreenshot() snapshots to Argos. Stop
  committing PNG baselines to Git and review visual changes on the pull request.
---

# Migrate from Playwright native screenshots to Argos

If you use Playwright's built-in [`toHaveScreenshot()`](https://playwright.dev/docs/test-snapshots), you already have visual tests — you're just storing the baselines in your repository and diffing them on the CI machine. This guide moves those tests to Argos so baselines live in the cloud, review happens on the pull request, and you stop fighting cross-platform PNG mismatches.

### Why teams move off native snapshots

Playwright's snapshots work, but they push three problems onto your team:

* **Baselines are committed PNGs.** Every screenshot lives in a `*-snapshots/` folder in Git. They bloat the repo, clutter diffs, and cause merge conflicts.
* **Snapshots are platform-specific.** A baseline captured on macOS won't match Linux CI (`-darwin` vs `-linux` suffixes), so teams end up running snapshots only in Docker or CI to stay consistent.
* **There is no review UI.** A failing `toHaveScreenshot()` is a red test. To accept an intended change you re-run with `--update-snapshots` and commit new PNGs — there's no place to *see* the before/after or have a teammate approve it.

Argos keeps your Playwright tests but removes all three: baselines are selected from your [Git history](../../platform-fundamentals/baseline-build.md) in the cloud, rendering happens the same way every run, and changes are reviewed and approved on the pull request.

### What changes semantically

With native snapshots, a visual difference **fails the test**. With Argos, `argosScreenshot` uploads the image and the comparison runs in Argos — the visual result becomes a [commit status and PR check](../../platform-fundamentals/build-modes.md) you review and approve, decoupled from whether the test itself passed. This is what lets you approve intended changes without editing files.

### Concept mapping

| Playwright native                                  | Argos                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| `expect(page).toHaveScreenshot("name.png")`        | `argosScreenshot(page, "name")`                                         |
| `expect(locator).toHaveScreenshot()`               | `argosScreenshot(locator, "name")`                                      |
| Committed `*-snapshots/` PNG folders               | Cloud baselines from [Git history](../../platform-fundamentals/baseline-build.md) |
| `--update-snapshots`                               | Approve in the [Argos review UI](../../review-workflow/review-a-build.md) |
| `maxDiffPixels` / `threshold`                      | [Diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md) |
| Diff fails the test                                | Diff becomes a PR check to review + approve                              |

## Migrate the project

{% stepper %}
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
    // No longer needed to match CI, but still good for stable text.
    launchOptions: {
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  },
});
```
{% endcode %}
{% endstep %}

{% step %}
### Replace `toHaveScreenshot()` with `argosScreenshot()`

{% columns %}
{% column %}
**Before (native)**

```ts
import { test, expect } from "@playwright/test";

test("homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveScreenshot("homepage.png");
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
  await argosScreenshot(page, "homepage");
});
```
{% endcolumn %}
{% endcolumns %}

To screenshot a single element, pass a locator: `await argosScreenshot(page.getByRole("dialog"), "dialog")`.
{% endstep %}

{% step %}
### Delete committed baselines

Remove the snapshot folders Playwright generated and stop tracking them:

```bash
git rm -r "**/*-snapshots"
```

If you set a custom `snapshotPathTemplate`, remove it too. You no longer commit baseline images — Argos stores them.
{% endstep %}

{% step %}
### Seed the baseline and wire up CI

Run your tests in CI with `ARGOS_TOKEN` set. **Run on your default branch first** so Argos has a baseline; until then, pull request builds stay [orphan](../../platform-fundamentals/baseline-build.md).

```yaml
- run: npx playwright install --with-deps chromium
- run: npx playwright test
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```

`ARGOS_TOKEN` comes from **Settings → General → Token**. On GitHub Actions you can use [OIDC](../../integrations/github-oidc-authentication.md) or [tokenless authentication](../../integrations/github-tokenless-authentication.md) instead.
{% endstep %}
{% endstepper %}

## Frequently asked questions

<details>

<summary>Can I keep some <code>toHaveScreenshot()</code> assertions?</summary>

Yes — the two can coexist during migration. But the whole point is to stop committing and diffing PNGs locally, so we recommend converting each `toHaveScreenshot()` to `argosScreenshot` and deleting the committed baselines.

</details>

<details>

<summary>Do I still need Docker to keep screenshots consistent?</summary>

No. Because comparison happens in Argos against a baseline captured the same way, you don't need to render locally in the same OS as CI just to match committed PNGs. You still want [stable rendering](../../reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md), which the `launchOptions` flags above handle.

</details>

<details>

<summary>How do I accept an intended visual change now?</summary>

Open the build in Argos and approve it in the [review UI](../../review-workflow/review-a-build.md). No `--update-snapshots`, no committing new images.

</details>

<details>

<summary>What about <code>maxDiffPixels</code> and <code>threshold</code>?</summary>

Argos applies its own [diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md) with tolerance for anti-aliasing and sub-pixel noise, so you don't tune per-assertion pixel thresholds.

</details>

## Next steps

* [Playwright quickstart](../../../quickstart/playwright-quickstart.md)
* [Keep your screenshots stable](../../reliability-and-flakiness/flaky-tests/)
* [Responsive viewports](../visual-coverage/responsive-viewports.md)
