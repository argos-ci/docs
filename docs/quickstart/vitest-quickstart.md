---
description: Set up visual testing in your Vitest browser tests with the Argos Vitest SDK.
---

# Vitest browser mode visual testing quickstart

To add visual testing to [Vitest](https://vitest.dev/), install `@argos-ci/vitest`, add `argosVitestPlugin()` to your Vitest config, call `argosScreenshot()` in a [browser mode](https://vitest.dev/guide/browser/) test, and run `npx vitest run` in CI with the `ARGOS_TOKEN` environment variable set. Argos compares every screenshot with a [baseline build](../learn/platform-fundamentals/baseline-build.md) picked from your Git history and reports the changes as a check on your pull request.

The Argos Vitest SDK captures two kinds of files:

* **Screenshots** of your rendered components, captured from [Vitest browser tests](https://vitest.dev/guide/browser/).
* **Snapshots** of any value — objects, JSON, HTML, and more — captured from browser **or** plain Node tests. No browser required.

### What Argos adds over `toMatchScreenshot()`

Vitest's built-in `toMatchScreenshot()` already compares screenshots in browser mode. Argos keeps your Vitest tests and changes what happens around them:

* **No reference images in your repository.** `toMatchScreenshot()` stores references in `__screenshots__` folders that you commit, named per browser and platform (for example `button-chromium-darwin.png`), so references captured on macOS are not used on Linux CI. Argos picks the baseline from your Git history.
* **Review on the pull request.** A `toMatchScreenshot()` mismatch fails the test until you re-run with `--update`. Argos turns visual changes into a pull request check that your team [approves or rejects](../learn/review-workflow/review-a-build.md).
* **Diff more than pixels.** `argosSnapshot()` compares any value — API responses, generated HTML, Markdown — from browser or Node tests.

Already using `toMatchScreenshot()`? Follow [Migrate from Vitest toMatchScreenshot to Argos](../learn/how-to-guides/migrate-to-argos/from-vitest-native-screenshots.md).

{% hint style="info" %}
Using **Storybook**? Follow the [Storybook Quickstart](storybook-quickstart/README.md) instead — it builds on this same Vitest integration.
{% endhint %}

### Prerequisites

* Node.js 22 or later
* [Vitest](https://vitest.dev/) set up in your project
* [Vitest running on your CI](https://vitest.dev/guide/cli)
* [A project created in Argos](https://app.argos-ci.com/new)

Capturing **screenshots** additionally requires [Vitest browser mode](https://vitest.dev/guide/browser/) with the [Playwright provider](https://vitest.dev/guide/browser/playwright). **Snapshots** run in any Vitest test and need neither.

{% stepper %}
{% step %}
### Install

Install the Argos Vitest SDK:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/vitest
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/vitest
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/vitest
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/vitest
```
{% endtab %}
{% endtabs %}

To capture **screenshots**, also install the [Vitest browser mode](https://vitest.dev/guide/browser/) peer dependencies, plus [`vitest-browser-react`](https://www.npmjs.com/package/vitest-browser-react) to render the React component in the example below (skip this if you only need snapshots). On Vue or Svelte, install [`vitest-browser-vue`](https://www.npmjs.com/package/vitest-browser-vue) or [`vitest-browser-svelte`](https://www.npmjs.com/package/vitest-browser-svelte) instead:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev vitest @vitest/browser @vitest/browser-playwright playwright vitest-browser-react
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev vitest @vitest/browser @vitest/browser-playwright playwright vitest-browser-react
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev vitest @vitest/browser @vitest/browser-playwright playwright vitest-browser-react
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev vitest @vitest/browser @vitest/browser-playwright playwright vitest-browser-react
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Add the Argos plugin to your Vitest config

The Argos plugin registers the `argosScreenshot` browser command and, when `uploadToArgos` is enabled, uploads the captured screenshots to Argos at the end of the run:

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

{% hint style="success" %}
The `launchOptions` above disable subpixel text and font hinting, so glyphs render identically on your machine and on CI. This single change prevents one of the most common causes of flaky screenshots — learn why in [Stabilize text rendering](../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md).
{% endhint %}

{% hint style="info" %}
The `test.browser` block is only required for screenshots. If you only capture snapshots, you can omit it — the plugin still uploads your snapshots to Argos.
{% endhint %}
{% endstep %}

{% step %}
### Capture screenshots and snapshots

Use the `argosScreenshot` helper to capture a screenshot in a **browser** test:

{% code title="Button.test.tsx" %}
```tsx
import { test } from "vitest";
import { render } from "vitest-browser-react";
import { argosScreenshot } from "@argos-ci/vitest";
import { Button } from "./Button";

test("Button", async () => {
  render(<Button>Click me</Button>);
  await argosScreenshot("button");
});
```
{% endcode %}

{% hint style="info" %}
Unlike other Argos SDKs, `argosScreenshot` takes no `page` argument here — Vitest browser tests already run in the page context. The name is optional too: omit it and Argos derives one from the current test.
{% endhint %}

Use `argosSnapshot` to capture a snapshot of any value — it works in **browser and Node** tests, no browser required. The value comes first and the name is optional (omit it to auto-name from the current test, or pass `options.name`). Strings are written verbatim; any other value is serialized automatically:

{% code title="user.test.ts" %}
```ts
import { test } from "vitest";
import { argosSnapshot } from "@argos-ci/vitest";
import { fetchUser } from "./api";

test("API response", async () => {
  const user = await fetchUser();
  await argosSnapshot(user); // -> "src/user.test.ts > API response 1"
});
```
{% endcode %}

{% hint style="success" %}
`argosSnapshot` lets you visually diff **anything**, not just UI — API responses, generated HTML, config files, Markdown, and more. Pass the `extension` option (e.g. `.json`, `.html`, `.yml`) to control how Argos renders and diffs it. See the [SDK reference](../sdks-reference/vitest.md#capturing-snapshots) for details.
{% endhint %}

Both are written to the `./snapshots` directory by default. Add `./snapshots` to your `.gitignore` file to avoid committing them.

Tip: Check out our guides to [capture multiple viewports](../learn/how-to-guides/visual-coverage/responsive-viewports.md) or [add ARIA snapshots](../learn/how-to-guides/visual-coverage/adding-aria-snapshots-manually.md).
{% endstep %}

{% step %}
### Set up CI

Run your Vitest tests in CI with `ARGOS_TOKEN` set. The Argos plugin uploads screenshots automatically when `uploadToArgos` is enabled:

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
      - run: npx vitest run
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md) to avoid managing a secret. On other CI providers, pass the token with the `ARGOS_TOKEN` environment variable or the plugin's `token` option. For GitLab CI, CircleCI, Buildkite, and other providers, see [Run Argos in CI](../learn/how-to-guides/ci-pipelines/run-argos-in-ci.md).
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

Fonts, text rendering, and browser versions depend on the operating system, so the same page renders slightly differently on macOS and on a Linux CI runner. The Argos plugin uploads to Argos only from CI (`uploadToArgos: !!process.env.CI`), so Argos only compares screenshots captured on CI, and the `launchOptions` flags make text render the same way on every machine. See [Stabilize text rendering](../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md) and [Browser glitches](../learn/reliability-and-flakiness/flaky-tests/browser-glitches.md).

</details>

### Next steps

* [Stabilize screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [Vitest SDK reference](../sdks-reference/vitest.md) – All options, including `argosSnapshot`
* [Vitest browser mode documentation](https://vitest.dev/guide/browser/) – Vitest's own browser testing guide
* [Vitest visual testing](https://argos-ci.com/blog/vitest-visual-testing) – A guide to browser mode screenshots, on the Argos blog

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
