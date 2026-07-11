---
description: Set up visual testing in your Puppeteer scripts with the Argos Puppeteer SDK.
---

# Puppeteer Quickstart

Set up Argos with [Puppeteer](https://pptr.dev/) to run visual tests on every pull request: capture screenshots with the SDK, then upload them with the Argos CLI.

### Prerequisites

* [Puppeteer](https://pptr.dev/#getting-started) set up in your project
* [Puppeteer running on your CI](https://pptr.dev/guides/running-puppeteer-in-the-cloud)
* [A project created in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Install the Argos CLI and the Argos Puppeteer SDK:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/cli @argos-ci/puppeteer
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/cli @argos-ci/puppeteer
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/cli @argos-ci/puppeteer
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/cli @argos-ci/puppeteer
```
{% endtab %}
{% endtabs %}

No configuration is needed — the SDK works directly in your scripts.
{% endstep %}

{% step %}
### Capture screenshots

Use the `argosScreenshot` helper to capture stable screenshots in your tests:

{% code title="screenshot.mjs" %}
```js
import puppeteer from "puppeteer";
import { argosScreenshot } from "@argos-ci/puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000");
await argosScreenshot(page, "homepage");
await browser.close();
```
{% endcode %}

Screenshots are written to the `./screenshots/argos` directory. Add `screenshots/` to your `.gitignore` file to avoid committing them.

Tip: Check out our guides to [screenshot multiple pages](../learn/how-to-guides/visual-coverage/capture-screenshots-from-urls.md) or [capture multiple viewports](../learn/how-to-guides/visual-coverage/responsive-viewports.md).
{% endstep %}

{% step %}
### Set up CI

Run your Puppeteer tests in CI, then upload the screenshots to Argos with the CLI:

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
      - name: Run Puppeteer tests
        run: npm test

      - name: Upload screenshots to Argos
        run: npm exec -- argos upload ./screenshots/argos
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md) to avoid managing a secret.
{% endstep %}
{% endstepper %}

### You're all set

Push your changes and open a pull request — the Argos check appears on it once the build is uploaded. Review the visual changes, approve or reject them, and merge with confidence.

{% hint style="info" %}
Argos needs a baseline to compare against. Until a build runs on your default branch, pull request builds are marked as [orphan](../learn/platform-fundamentals/baseline-build.md#orphan-builds). Merge this setup or run the workflow once on your default branch to establish the baseline.
{% endhint %}

### Next steps

* [Stabilize screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [Puppeteer SDK reference](../sdks-reference/puppeteer.md) – All options and helpers
* [Puppeteer example](https://github.com/argos-ci/argos-javascript/tree/main/examples/puppeteer) – A complete working setup

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
