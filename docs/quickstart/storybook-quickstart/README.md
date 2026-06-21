# Storybook Quickstart

Learn how to set up Argos with Storybook to get **visual testing** and **live deployment URLs** on every pull request.

By the end of this guide, every pull request will:

* Run visual tests on your stories with Vitest.
* Deploy your Storybook to a unique URL you can share with your team.

{% hint style="info" %}
If you use Test Runner instead of Vitest, follow our [Storybook Test Runner quickstart](storybook-test-runner-quickstart.md).

If you use a legacy version of Storybook (\<v8), follow our [legacy Storybook quickstart](storybook-legacy-less-than-v8-quickstart.md).
{% endhint %}

### Prerequisites

To get the most out of this guide, you'll need to:

* [Use Storybook v8+](https://storybook.js.org/docs/get-started/install)
* [Install Storybook Vitest Addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)
* [Create your project in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

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

Read the [CLI documentation](../../sdks-reference/argos-command-line-interface-cli.md) if you need information about advanced usages.
{% endstep %}

{% step %}
### Add Argos plugin to your Vitest configuration

The Argos plugin for Vitest captures screenshots of your stories and uploads them to Argos. Add it to your Vitest or Vite configuration file (e.g., `vitest.config.ts` or `vite.config.ts`):

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

            // Set your Argos token (required if not using GitHub Actions).
            token: "<YOUR-ARGOS-TOKEN>",
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

{% hint style="info" %}
Be sure to have already installed the [Storybook Vitest Addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) in your project.
{% endhint %}

{% hint style="success" %}
The `launchOptions` above disable subpixel text and font hinting, so glyphs render identically on your machine and on CI. This single change prevents one of the most common causes of flaky screenshots—learn why in [Stabilize Text Rendering](../../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md).
{% endhint %}
{% endstep %}

{% step %}
### Capture screenshots

All your stories will be automatically captured when you run the tests.

You can also capture screenshots in the [play function](https://storybook.js.org/docs/writing-stories/play-function) by using the `argosScreenshot` function:

{% code title="example.stories.ts" %}
```ts
import { argosScreenshot } from "@argos-ci/storybook/vitest";

export const Example: Story = {
  play: async (ctx) => {
    // It captures a screenshot of the current story and uploads it to Argos
    // See options at: https://argos-ci.com/docs/storybook
    await argosScreenshot(ctx, "example-screenshot");
  },
};
```
{% endcode %}

It will capture screenshots of your stories in `./screenshots` directory.

Add `./screenshots` to your `.gitignore` file, to avoid uploading screenshots to your Git repository.
{% endstep %}

{% step %}
### Set up CI

Add a workflow that runs your visual tests **and** deploys your Storybook on every pull request. Argos serves the built Storybook on a unique URL—no extra hosting required.

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
      - run: npx vitest --project=storybook
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}

      # Build and deploy the Storybook
      - run: npm run build-storybook
      - run: npx --no-install argos deploy ./storybook-static
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC](../../learn/integrations/github-oidc-authentication.md) or [tokenless authentication](../../learn/integrations/github-tokenless-authentication.md) to avoid managing a secret.

For other CI providers, follow [Use deployments in CI](../../learn/deployments/).
{% endstep %}
{% endstepper %}

### Congratulations on installing Argos! 👏

After committing and pushing your changes, the Argos check status will appear on your pull request in GitHub (or GitLab).

**Note:** you need a reference build to compare your changes with. If you don't have one, builds will remain orphan until you run Argos on your reference branch.

You can now review changes of your app for each pull request, avoid visual bugs and merge with confidence. Welcome on board!

### Next step: keep your screenshots stable

Now that Argos is running, the next thing to learn is how to keep your screenshots free of flakiness. Read [Best practices for stable screenshots](../../learn/reliability-and-flakiness/flaky-tests/README.md) to avoid false positives before they reach your pull requests.

### Additional resources

* [Deployments overview](../../learn/deployments/)
* [Argos + Storybook + Vitest example](https://github.com/argos-ci/argos-javascript/tree/main/examples/storybook-vitest)
* [Argos Storybook SDK reference](../../sdks-reference/storybook.md)
* [Storybook documentation](https://storybook.js.org/docs)
* [Storybook Vitest addon documentation](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)

***

[Join our Discord](https://argos-ci.com/discord), [submit an issue on GitHub](https://github.com/argos-ci/argos/issues) or just [send an email](mailto:contact@argos-ci.com) if you need help.
