---
description: >-
  Move from Vitest's built-in toMatchScreenshot() to Argos. Stop committing
  __screenshots__ reference images and review visual changes on the pull
  request.
---

# Migrate from Vitest toMatchScreenshot to Argos

To migrate from Vitest's built-in [`toMatchScreenshot()`](https://vitest.dev/api/browser/assertions#tomatchscreenshot) to Argos, install `@argos-ci/vitest`, add `argosVitestPlugin()` to your Vitest config, replace each `toMatchScreenshot()` assertion with `await argosScreenshot("name")`, and delete the committed `__screenshots__` folders. Your browser mode tests stay the same; Argos picks baselines from your Git history and reports visual changes as a check on your pull request.

### Why teams move off `toMatchScreenshot()`

`toMatchScreenshot()` works, but it puts three problems on your team:

* **References are committed images.** Vitest stores reference screenshots in `__screenshots__` folders next to your tests, and you commit them. Screenshots of deleted or renamed tests aren't removed automatically.
* **References are platform-specific.** File names include the browser and the platform, for example `button-chromium-darwin.png`, so references captured on macOS are not used on Linux CI. Vitest recommends a controlled environment, such as Docker or CI-only runs, to keep them consistent.
* **There is no review step.** A mismatch fails the test. To accept an intended change, you re-run with `--update` and commit the new images, and the diff image is written to `.vitest/attachments/` on the machine that ran the test.

Argos keeps your Vitest tests but removes all three: baselines are selected from your [Git history](../../platform-fundamentals/baseline-build.md), screenshots are captured on CI, and changes are reviewed and approved on the pull request.

### What changes semantically

With `toMatchScreenshot()`, a visual difference **fails the test**. With Argos, `argosScreenshot` saves the screenshot and the comparison runs in Argos once the files are uploaded: the visual result becomes a [commit status](../../platform-fundamentals/build-modes.md) that you review and approve, independent of whether the test passed.

### Concept mapping

| Vitest `toMatchScreenshot()`                                         | Argos                                                                                   |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `await expect(page.getByRole("button")).toMatchScreenshot("button")` | `await argosScreenshot("button")`                                                       |
| A screenshot of one element                                          | `await argosScreenshot("button", { element: "button" })` (a CSS selector)                |
| `__screenshots__/` folders committed to Git                          | Baselines from [Git history](../../platform-fundamentals/baseline-build.md)             |
| `vitest --update`                                                    | Approve in the [Argos review UI](../../review-workflow/review-a-build.md)               |
| `comparatorOptions` (`threshold`, `allowedMismatchedPixelRatio`, …) | The `threshold` option of `argosScreenshot`, and the [diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md) |
| `screenshotOptions.mask`                                             | The `argosCSS` option, for example `visibility: hidden` on dynamic elements             |
| `timeout` (retries until the screenshot is stable)                   | Argos stabilization: waits for fonts, images, and `aria-busy` elements                  |
| Diff images in `.vitest/attachments/`                                | The [build page](../../review-workflow/review-a-build.md) and the pull request comment  |
| A mismatch fails the test                                            | A pull request check to review and approve                                              |

## Migrate the project

{% stepper %}
{% step %}
### Install the Argos Vitest SDK

{% tabs %}
{% tab title="npm" %}
```bash
npm i --save-dev @argos-ci/vitest
```
{% endtab %}

{% tab title="yarn" %}
```bash
yarn add --dev @argos-ci/vitest
```
{% endtab %}

{% tab title="pnpm" %}
```bash
pnpm add --save-dev @argos-ci/vitest
```
{% endtab %}

{% tab title="bun" %}
```bash
bun add --dev @argos-ci/vitest
```
{% endtab %}
{% endtabs %}

You keep `vitest`, `@vitest/browser`, `@vitest/browser-playwright`, and `playwright`: the SDK requires Vitest 4 or later and captures screenshots with the Playwright provider. If your browser mode uses another provider, switch to [`@vitest/browser-playwright`](https://vitest.dev/guide/browser/playwright).
{% endstep %}

{% step %}
### Add the Argos plugin

Add `argosVitestPlugin()` to your Vitest config, next to your existing browser mode settings:

{% code title="vitest.config.ts" %}
```ts
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { argosVitestPlugin } from "@argos-ci/vitest/plugin";

export default defineConfig({
  plugins: [
    argosVitestPlugin({
      // Upload to Argos on CI only.
      uploadToArgos: !!process.env.CI,
    }),
  ],
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        // Stabilize text rendering so screenshots match across macOS and CI.
        launchOptions: {
          args: ["--disable-lcd-text", "--font-render-hinting=none"],
        },
      }),
      instances: [{ browser: "chromium" }],
    },
  },
});
```
{% endcode %}

You can remove the `browser.expect.toMatchScreenshot` settings once every assertion is migrated.
{% endstep %}

{% step %}
### Replace `toMatchScreenshot()` with `argosScreenshot()`

{% columns %}
{% column %}
**Before (Vitest)**

```tsx
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Button } from "./Button";

test("button", async () => {
  render(<Button>Click me</Button>);
  await expect(page.getByRole("button")).toMatchScreenshot("button");
});
```
{% endcolumn %}

{% column %}
**After (Argos)**

```tsx
import { test } from "vitest";
import { render } from "vitest-browser-react";
import { argosScreenshot } from "@argos-ci/vitest";
import { Button } from "./Button";

test("button", async () => {
  render(<Button>Click me</Button>);
  await argosScreenshot("button");
});
```
{% endcolumn %}
{% endcolumns %}

By default, `argosScreenshot` captures the rendered output of the test. To capture a single element, pass a CSS selector: `await argosScreenshot("button", { element: "button" })`. Per-call options must be serializable, so pass a selector string, not a locator. The name is optional: omit it and Argos derives one from the current test.
{% endstep %}

{% step %}
### Delete the committed references

Remove the reference folders and stop tracking them:

```bash
git rm -r "**/__screenshots__"
```

If you set a custom `screenshotDirectory` or `resolveScreenshotPath`, remove it too. You no longer commit reference images: Argos stores the baselines.
{% endstep %}

{% step %}
### Seed the baseline and wire up CI

Run your tests in CI with `ARGOS_TOKEN` set. **Run on your default branch first** so Argos has a baseline; until then, pull request builds are marked as [orphan](../../platform-fundamentals/baseline-build.md#orphan-builds).

```yaml
- run: npx playwright install --with-deps chromium
- run: npx vitest run
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```

`ARGOS_TOKEN` comes from **Settings → General → Token**. On GitHub Actions you can use [OIDC or tokenless authentication](../../integrations/github-actions-authentication.md) instead of a secret.
{% endstep %}
{% endstepper %}

## Frequently asked questions

<details>

<summary>Can I keep some <code>toMatchScreenshot()</code> assertions?</summary>

Yes. `argosScreenshot` is a separate command and doesn't change `toMatchScreenshot()`, so both can run in the same suite while you migrate. Once every assertion is converted, delete the `__screenshots__` folders.

</details>

<details>

<summary>Do I still need Docker to keep screenshots consistent?</summary>

No. Argos compares each screenshot with a baseline captured on CI, so you don't need to render locally in the same environment as CI to match committed images. Keep the text-rendering `launchOptions` above: they make glyphs render the same way on every machine. See [Stabilize text rendering](../../reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md).

</details>

<details>

<summary>How do I accept an intended visual change now?</summary>

Open the build in Argos and approve it in the [review UI](../../review-workflow/review-a-build.md). There is no `--update` run and no image to commit.

</details>

<details>

<summary>What about <code>threshold</code> and <code>allowedMismatchedPixelRatio</code>?</summary>

Argos applies its own [diff algorithm](../../platform-fundamentals/how-argos-detects-visual-differences.md), so you rarely need per-assertion tuning. If a screenshot needs a different sensitivity, pass the `threshold` option to `argosScreenshot`: a value between 0 and 1, where higher is less sensitive. It defaults to 0.5 and doesn't use the same scale as the pixelmatch `threshold`.

</details>

<details>

<summary>Can I diff things that aren't screenshots?</summary>

Yes. `argosSnapshot()` captures any value — an API response, generated HTML, Markdown — in browser or Node tests, and Argos diffs it as text. See the [Vitest SDK reference](../../../sdks-reference/vitest.md#capturing-snapshots).

</details>

## Next steps

* [Vitest quickstart](../../../quickstart/vitest-quickstart.md) — the full setup, including `argosSnapshot`.
* [Vitest SDK reference](../../../sdks-reference/vitest.md) — every option of `argosScreenshot` and the plugin.
* [Stabilize screenshots](../../reliability-and-flakiness/flaky-tests/) — keep your screenshots free of flaky diffs.
