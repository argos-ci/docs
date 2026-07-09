---
description: Learn how to set up visual testing in your Vitest browser tests with the Argos Vitest SDK.
---

# Vitest Quickstart

Learn how to set up Argos with [Vitest](https://vitest.dev/) to run **visual tests** on every pull request.

The Argos Vitest SDK adds visual testing to Vitest in two ways:

* **Screenshots** of your rendered components, captured from [Vitest browser tests](https://vitest.dev/guide/browser/).
* **Snapshots** of any value—objects, JSON, HTML, and more—captured from browser **or** plain Node tests. No browser required.

{% hint style="info" %}
Using **Storybook**? Follow the [Storybook Quickstart](storybook-quickstart/) instead—it builds on this same Vitest integration.
{% endhint %}

### Prerequisites

To get the most out of this guide, you'll need to:

* [Use Vitest](https://vitest.dev/)
* [Run Vitest on your CI/CD](https://vitest.dev/guide/cli)
* [Create your project in Argos](https://app.argos-ci.com/new)

Capturing **screenshots** additionally requires [Vitest browser mode](https://vitest.dev/guide/browser/) with the [Playwright provider](https://vitest.dev/guide/browser/playwright). **Snapshots** run in any Vitest test and need neither.

{% stepper %}
{% step %}
### Install

Install the Argos Vitest SDK.

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

To capture **screenshots**, also install the [Vitest browser mode](https://vitest.dev/guide/browser/) peer dependencies (skip this if you only need snapshots):

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
### Add the Argos plugin to your Vitest configuration

The Argos plugin registers the `argosScreenshot` browser command and, when `uploadToArgos` is enabled, uploads the captured screenshots to Argos at the end of the run. Add it to your Vitest configuration file (e.g., `vitest.config.ts`):

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

      // Set your Argos token (required if not using GitHub Actions).
      token: "<YOUR-ARGOS-TOKEN>",
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
The `launchOptions` above disable subpixel text and font hinting, so glyphs render identically on your machine and on CI. This single change prevents one of the most common causes of flaky screenshots—learn why in [Stabilize Text Rendering](../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md).
{% endhint %}

{% hint style="info" %}
The `test.browser` block is only required for screenshots. If you only capture snapshots, you can omit it—the plugin still uploads your snapshots to Argos.
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

Use `argosSnapshot` to capture a snapshot of any value—it works in **browser and Node** tests, no browser required. Strings are written verbatim; any other value is serialized automatically.

{% code title="user.test.ts" %}
```ts
import { test } from "vitest";
import { argosSnapshot } from "@argos-ci/vitest";
import { fetchUser } from "./api";

test("API response", async () => {
  const user = await fetchUser();
  await argosSnapshot("user", user);
});
```
{% endcode %}

Both are written to the `./screenshots` directory by default. Add `./screenshots` to your `.gitignore` file to avoid committing them to your Git repository.

Tip: Check out our guides to [capture multiple viewports](../learn/how-to-guides/visual-coverage/responsive-viewports.md) or [add ARIA snapshots](../learn/how-to-guides/visual-coverage/adding-aria-snapshots-manually.md), and the [SDK reference](../sdks-reference/vitest.md) for all `argosSnapshot` options.
{% endstep %}

{% step %}
### Set up CI

Run your Vitest tests in CI with `ARGOS_TOKEN` set. The Argos plugin uploads screenshots automatically when `uploadToArgos` is enabled.

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
      - run: npx vitest run
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC](../learn/integrations/github-oidc-authentication.md) or [tokenless authentication](../learn/integrations/github-tokenless-authentication.md) to avoid managing a secret.
{% endstep %}
{% endstepper %}

### Congratulations on installing Argos! 👏

After committing and pushing your changes, the Argos check status will appear on your pull request in GitHub (or GitLab).

**Note:** you need a reference build to compare your changes with. If you don't have one, builds will remain orphan until you run Argos on your reference branch.

You can now review changes of your app for each pull request, avoid visual bugs and merge with confidence. Welcome on board!

### Next step: keep your screenshots stable

Now that Argos is running, the next thing to learn is how to keep your screenshots free of flakiness. Read [Best practices for stable screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) to avoid false positives before they reach your pull requests.

### Additional resources

* [Argos Vitest SDK reference](../sdks-reference/vitest.md)
* [@argos-ci/vitest on npm](https://www.npmjs.com/package/@argos-ci/vitest)
* [Vitest browser mode documentation](https://vitest.dev/guide/browser/)

***

[Join our Discord](https://argos-ci.com/discord), [submit an issue on GitHub](https://github.com/argos-ci/argos/issues) or just [send an email](mailto:contact@argos-ci.com) if you need help.
