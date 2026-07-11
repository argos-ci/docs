---
description: >-
  Set up Argos with Storybook and Vitest to get visual testing and live
  deployment URLs on every pull request.
---

# Storybook Quickstart

Set up Argos with [Storybook](https://storybook.js.org/) to get **visual testing** and **live deployment URLs** on every pull request. By the end of this guide, every pull request will:

* Run visual tests on your stories with Vitest.
* Deploy your Storybook to a unique URL you can share with your team.

{% hint style="info" %}
If you use Test Runner instead of Vitest, follow the [Storybook Test Runner Quickstart](storybook-test-runner-quickstart.md).

If you use a legacy version of Storybook (\<v8), follow the [legacy Storybook Quickstart](storybook-legacy-less-than-v8-quickstart.md).
{% endhint %}

### Prerequisites

* [Storybook v8+](https://storybook.js.org/docs/get-started/install) set up in your project
* [The Storybook Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) installed
* [A project created in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Install the Argos Storybook SDK:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/storybook
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/storybook
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/storybook
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/storybook
```
{% endtab %}
{% endtabs %}

If they are not already part of your Storybook Vitest addon setup, also install the browser-mode peer dependencies the configuration below relies on:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev vitest @vitest/browser @vitest/browser-playwright playwright
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev vitest @vitest/browser @vitest/browser-playwright playwright
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev vitest @vitest/browser @vitest/browser-playwright playwright
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev vitest @vitest/browser @vitest/browser-playwright playwright
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Add the Argos plugin to your Vitest config

The Argos plugin captures screenshots of your stories and uploads them to Argos. Add it to your Vitest or Vite configuration file (e.g., `vitest.config.ts` or `vite.config.ts`):

{% code title="vitest.config.ts" %}
```ts
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { playwright } from "@vitest/browser-playwright";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { argosVitestPlugin } from "@argos-ci/storybook/vitest-plugin";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),

          // The plugin will capture screenshots of your stories and upload them to Argos.
          // See options at: https://argos-ci.com/docs/storybook
          argosVitestPlugin({
            // Upload to Argos on CI only.
            uploadToArgos: !!process.env.CI,
          }),
        ],
        test: {
          name: "storybook",
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
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
```
{% endcode %}

{% hint style="success" %}
The `launchOptions` above disable subpixel text and font hinting, so glyphs render identically on your machine and on CI. This single change prevents one of the most common causes of flaky screenshots — learn why in [Stabilize text rendering](../../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md).
{% endhint %}
{% endstep %}

{% step %}
### Capture screenshots

All your stories are captured automatically when the tests run — no code change required.

You can also capture additional screenshots in a [play function](https://storybook.js.org/docs/writing-stories/play-function) with the `argosScreenshot` helper, for example after an interaction:

{% code title="example.stories.ts" %}
```ts
import { argosScreenshot } from "@argos-ci/storybook/vitest";

export const Example: Story = {
  play: async (ctx) => {
    // Captures a screenshot of the current story and uploads it to Argos
    await argosScreenshot(ctx, "example-screenshot");
  },
};
```
{% endcode %}

Screenshots are written to the `./screenshots` directory. Add `./screenshots` to your `.gitignore` file to avoid committing them.
{% endstep %}

{% step %}
### Set up CI

Add a workflow that runs your visual tests **and** deploys your Storybook on every pull request. Argos serves the built Storybook on a unique URL — no extra hosting required:

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

      # Run visual tests
      - run: npx playwright install --with-deps chromium
      - run: npx vitest run --project=storybook
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}

      # Build and deploy the Storybook
      - run: npm run build-storybook
      - run: npx --no-install argos deploy ./storybook-static
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../../learn/integrations/github-actions-authentication.md) to avoid managing a secret.

For other CI providers, follow [Use deployments in CI](../../learn/deployments/use-deployments-in-ci.md).
{% endstep %}
{% endstepper %}

### You're all set

Push your changes and open a pull request — the Argos check appears on it once the build is uploaded, along with a link to your deployed Storybook. Review the visual changes, approve or reject them, and merge with confidence.

{% hint style="info" %}
Argos needs a baseline to compare against. Until a build runs on your default branch, pull request builds are marked as [orphan](../../learn/platform-fundamentals/baseline-build.md#orphan-builds). Merge this setup or run the workflow once on your default branch to establish the baseline.
{% endhint %}

### Next steps

* [Stabilize screenshots](../../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [Storybook story modes](../../learn/how-to-guides/visual-coverage/storybook-story-modes.md) – Capture stories in multiple themes and viewports
* [Storybook SDK reference](../../sdks-reference/storybook.md) – All options and helpers
* [Storybook + Vitest example](https://github.com/argos-ci/argos-javascript/tree/main/examples/storybook-vitest) – A complete working setup

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
