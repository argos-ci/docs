---
description: >-
  Migrate visual testing from Lost Pixel to Argos. Map the Storybook, Ladle,
  Histoire, page, and custom shots of lostpixel.config.ts to the Argos
  Storybook SDK, Playwright, or argos upload.
---

# Migrate from Lost Pixel to Argos

To migrate from [Lost Pixel](https://lost-pixel.com/) to Argos, replace each shot mode of `lostpixel.config.ts` with its Argos equivalent: `@argos-ci/storybook` for `storybookShots`, a Playwright test with `@argos-ci/playwright` for `pageShots`, `ladleShots`, and `histoireShots`, and `argos upload` for `customShots`. Then delete the `.lostpixel/` folder and the Lost Pixel GitHub Action. Argos picks baselines from your Git history and reports visual changes as a check on your pull request.

{% hint style="info" %}
On April 22, 2026, the Lost Pixel team [announced](https://lost-pixel.com/blog/lost-pixel-team-is-joining-figma) that it is joining Figma and sunsetting Lost Pixel, and the [lost-pixel repository](https://github.com/lost-pixel/lost-pixel) was archived. The announcement gives no shutdown date for the hosted Lost Pixel Platform.
{% endhint %}

### How Lost Pixel and Argos differ

* **Lost Pixel** is a separate runner: it opens your built Storybook, Ladle, or Histoire, or a list of pages, in its own browser and captures every shot. In open-source mode, baselines are images committed under `.lostpixel/baseline/` and refreshed with `npx lost-pixel docker update`. In Platform mode, shots go to the Lost Pixel Platform for review.
* **Argos** captures screenshots in the test runner you already use, such as the Storybook Vitest addon or Playwright, or uploads a folder of images you captured yourself. Baselines are selected from your [Git history](../../platform-fundamentals/baseline-build.md), and changes are approved or rejected on the pull request.

### Concept mapping

| Lost Pixel                                          | Argos                                                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `storybookShots` (`storybookUrl`)                   | `@argos-ci/storybook` — see the [Storybook quickstart](../../../quickstart/storybook-quickstart/)             |
| `pageShots` (`pages`, `baseUrl`)                    | A Playwright test per page — see [Capture screenshots from URLs](../visual-coverage/capture-screenshots-from-urls.md) |
| `ladleShots` / `histoireShots`                      | A Playwright test that visits each story — see [Ladle and Histoire](#ladle-and-histoire)                      |
| `customShots` (`currentShotsPath`)                  | `npm exec -- argos upload <folder>` — see [Any test framework](../../../quickstart/any-test-framework.md)     |
| `lostPixelProjectId` + `LOST_PIXEL_API_KEY`         | `ARGOS_TOKEN`                                                                                                  |
| `.lostpixel/baseline/` (open-source mode)           | Baselines from [Git history](../../platform-fundamentals/baseline-build.md)                                   |
| `npx lost-pixel docker update`                      | Approve in the [Argos review UI](../../review-workflow/review-a-build.md)                                     |
| `failOnDifference`                                  | The Argos commit status on your pull request                                                                  |
| `breakpoints`                                       | The `viewports` option — see [Responsive viewports](../visual-coverage/responsive-viewports.md)               |
| `mask`                                              | [`data-visual-test` helpers](../../reliability-and-flakiness/flaky-tests/argos-helpers.md), or Playwright's `mask` screenshot option |
| `threshold`                                         | The `threshold` option of `argosScreenshot` (a sensitivity between 0 and 1)                                   |
| `waitBeforeScreenshot` / `waitForSelector`          | Argos [stabilization](../../reliability-and-flakiness/flaky-tests/README.md), plus Playwright waits before `argosScreenshot` |
| `lost-pixel/lost-pixel` GitHub Action               | Your test command in CI, with `ARGOS_TOKEN` set                                                               |

## Migrate the project

{% stepper %}
{% step %}
### Pick the Argos setup for each shot mode

Look at the shot modes enabled in your `lostpixel.config.ts` and set up the matching Argos integration:

* **`storybookShots`**: follow the [Storybook quickstart](../../../quickstart/storybook-quickstart/) (Storybook 9 or later, with the Vitest addon). On Storybook 8, use the [Test Runner quickstart](../../../quickstart/storybook-quickstart/storybook-test-runner-quickstart.md); on older versions, the [legacy quickstart](../../../quickstart/storybook-quickstart/storybook-legacy-less-than-v8-quickstart.md). Every story is captured, as with Lost Pixel.
* **`pageShots`**: follow the [Playwright quickstart](../../../quickstart/playwright-quickstart.md), then turn your `pages` list into tests as shown in [Capture screenshots from URLs](../visual-coverage/capture-screenshots-from-urls.md).
* **`ladleShots`** or **`histoireShots`**: follow the [Playwright quickstart](../../../quickstart/playwright-quickstart.md) and add the test from [Ladle and Histoire](#ladle-and-histoire).
* **`customShots`**: keep capturing screenshots as you do today, and upload the folder you passed as `currentShotsPath` with the [Argos CLI](../../../quickstart/any-test-framework.md).
{% endstep %}

{% step %}
### Translate page shots into a Playwright test

Each entry of `pageShots.pages` becomes a `page.goto` followed by `argosScreenshot`:

{% columns %}
{% column %}
**Before (`lostpixel.config.ts`)**

```ts
import { CustomProjectConfig } from "lost-pixel";

export const config: CustomProjectConfig = {
  pageShots: {
    pages: [
      { path: "/", name: "home" },
      { path: "/pricing", name: "pricing" },
    ],
    baseUrl: "http://localhost:3000",
  },
  generateOnly: true,
  failOnDifference: true,
};
```
{% endcolumn %}

{% column %}
**After (`tests/pages.spec.ts`)**

```ts
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

const pages = [
  { path: "/", name: "home" },
  { path: "/pricing", name: "pricing" },
];

for (const { path, name } of pages) {
  test(name, async ({ page }) => {
    await page.goto(path);
    await argosScreenshot(page, name);
  });
}
```
{% endcolumn %}
{% endcolumns %}

Set `baseURL` and `webServer` in `playwright.config.ts` so `page.goto(path)` reaches your app, as in the [Playwright quickstart](../../../quickstart/playwright-quickstart.md). To keep your `breakpoints`, pass them as [viewports](../visual-coverage/responsive-viewports.md).
{% endstep %}

{% step %}
### Replace the CI step

Swap the Lost Pixel action for your test command, with `ARGOS_TOKEN` set:

{% columns %}
{% column %}
**Before (Lost Pixel)**

```yaml
- run: npm ci
- uses: lost-pixel/lost-pixel@v3.22.0
  env:
    LOST_PIXEL_API_KEY: ${{ secrets.LOST_PIXEL_API_KEY }}
```
{% endcolumn %}

{% column %}
**After (Argos, Playwright)**

```yaml
- run: npm ci
- run: npx playwright install --with-deps chromium
- run: npx playwright test
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcolumn %}
{% endcolumns %}

For Storybook, use the workflow from the [Storybook quickstart](../../../quickstart/storybook-quickstart/). For custom shots, run `npm exec -- argos upload <folder>` after your tests. `ARGOS_TOKEN` comes from **Settings → General → Token**; on GitHub Actions you can use [OIDC or tokenless authentication](../../integrations/github-actions-authentication.md) instead of a secret.
{% endstep %}

{% step %}
### Seed the baseline

Run the new workflow on your default branch first. That build becomes the baseline; until it exists, pull request builds are marked as [orphan](../../platform-fundamentals/baseline-build.md#orphan-builds).
{% endstep %}

{% step %}
### Remove Lost Pixel

Delete `lostpixel.config.ts`, the `.lostpixel/` folder (`baseline/`, `current/`, `difference/`), the `lost-pixel` dependency, and the `LOST_PIXEL_API_KEY` secret.
{% endstep %}
{% endstepper %}

## Ladle and Histoire

Argos has no dedicated Ladle or Histoire SDK. A short Playwright test reproduces what Lost Pixel did: read the list of stories that Ladle or Histoire publishes, open each one, and capture it with `argosScreenshot`. Serve your Ladle or Histoire build first, for example from the `webServer` option of `playwright.config.ts`.

{% tabs %}
{% tab title="Ladle" %}
{% code title="tests/ladle.spec.ts" %}
```ts
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

// URL of your running Ladle instance.
const LADLE_URL = "http://localhost:61000";

test("Ladle stories", async ({ page, request }) => {
  // Ladle lists every story in meta.json, the file Lost Pixel read.
  const response = await request.get(`${LADLE_URL}/meta.json`);
  const { stories } = await response.json();

  for (const id of Object.keys(stories)) {
    await page.goto(`${LADLE_URL}/?story=${id}&mode=preview`);
    // Lost Pixel waited for this attribute before each Ladle shot.
    await page.waitForSelector("[data-storyloaded]");
    await argosScreenshot(page, id);
  }
});
```
{% endcode %}
{% endtab %}

{% tab title="Histoire" %}
{% code title="tests/histoire.spec.ts" %}
```ts
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

// URL where your Histoire build is served.
const HISTOIRE_URL = "http://localhost:6006";

test("Histoire stories", async ({ page, request }) => {
  // Histoire lists stories and variants in histoire.json, the file Lost Pixel read.
  const response = await request.get(`${HISTOIRE_URL}/histoire.json`);
  const { stories } = await response.json();

  for (const story of stories) {
    for (const variant of story.variants ?? [story]) {
      await page.goto(
        `${HISTOIRE_URL}/__sandbox.html?storyId=${story.id}&variantId=${variant.id}`,
      );
      await argosScreenshot(page, `${story.id}_${variant.id}`);
    }
  }
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

## Migrating Lost Pixel options

<details>

<summary>Breakpoints (<code>breakpoints</code>)</summary>

Pass the widths to the `viewports` option of `argosScreenshot`, or add one Playwright project per viewport. See [Responsive viewports](../visual-coverage/responsive-viewports.md). For Storybook, use [story modes](../visual-coverage/storybook-story-modes.md).

</details>

<details>

<summary>Masks (<code>mask</code>)</summary>

Add a [`data-visual-test` helper](../../reliability-and-flakiness/flaky-tests/argos-helpers.md) to the element: `data-visual-test="blackout"` masks it (Storybook, Playwright, and Cypress SDKs), `transparent` hides it and keeps its space, and `removed` takes it out of the layout. In Playwright tests, you can also pass Playwright's `mask` option, which `argosScreenshot` forwards to the screenshot call.

</details>

<details>

<summary>Waits (<code>waitBeforeScreenshot</code> / <code>waitForSelector</code>)</summary>

`argosScreenshot` already waits for fonts, images, and `aria-busy` elements before capturing. For anything else, wait in your test before the screenshot, for example with `await page.waitForSelector(...)`. See [Wait for loading](../../reliability-and-flakiness/flaky-tests/wait-for-loading.md).

</details>

<details>

<summary>Threshold (<code>threshold</code>)</summary>

Lost Pixel's `threshold` is the share or number of pixels allowed to differ. Argos's `threshold` option is different: it sets the sensitivity of the [diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md), between 0 and 1, and defaults to 0.5. Start without it, and only raise it for a screenshot that needs it.

</details>

<details>

<summary>Story parameters (<code>parameters.lostpixel</code>)</summary>

Argos doesn't read `parameters.lostpixel`. Remove those parameters, and use [story modes](../visual-coverage/storybook-story-modes.md) and the [Argos helpers](../../reliability-and-flakiness/flaky-tests/argos-helpers.md) for the per-story settings you need.

</details>

## Frequently asked questions

<details>

<summary>What happens to my Lost Pixel baselines?</summary>

They don't transfer. Lost Pixel and Argos capture screenshots differently, so Argos starts from its own baseline: the first build on your default branch. Delete `.lostpixel/baseline/` once the migration is merged.

</details>

<details>

<summary>Is Argos open source, like Lost Pixel?</summary>

Yes. The whole platform, diff engine included, is MIT-licensed in the [argos-ci/argos](https://github.com/argos-ci/argos) repository. Argos runs as a managed cloud service; self-hosting is not officially supported.

</details>

<details>

<summary>How do I approve changes without <code>lost-pixel update</code>?</summary>

Open the build in the [Argos review UI](../../review-workflow/review-a-build.md) and approve or reject the changes. The pull request check updates automatically, and there are no images to commit.

</details>

<details>

<summary>Is there a free plan?</summary>

Yes, the Hobby plan is free. See [Argos pricing plans](../../billing-and-subscription/pricing-plans.md) for what each plan includes.

</details>

## Next steps

* [Storybook quickstart](../../../quickstart/storybook-quickstart/) — replaces `storybookShots`.
* [Capture screenshots from URLs](../visual-coverage/capture-screenshots-from-urls.md) — replaces `pageShots`.
* [Stabilize screenshots](../../reliability-and-flakiness/flaky-tests/) — keep your new suite free of flaky diffs.
