---
description: Set up visual testing in your WebdriverIO tests with the Argos WebdriverIO SDK.
---

# WebdriverIO Quickstart

Set up Argos with [WebdriverIO](https://webdriver.io/), the Node.js test automation framework for web and mobile applications, to run visual tests on every pull request: capture screenshots with the SDK, then upload them with the Argos CLI.

### Prerequisites

* [WebdriverIO](https://webdriver.io/) set up in your project
* [WebdriverIO running on your CI](https://webdriver.io/docs/automationProtocols/)
* [A project created in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Install the Argos CLI and the Argos WebdriverIO SDK:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/cli @argos-ci/webdriverio
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/cli @argos-ci/webdriverio
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/cli @argos-ci/webdriverio
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/cli @argos-ci/webdriverio
```
{% endtab %}
{% endtabs %}

No configuration is needed — the SDK works directly in your tests.
{% endstep %}

{% step %}
### Capture screenshots

Use the `argosScreenshot` helper to capture screenshots in your tests:

{% code title="test/specs/homepage.e2e.js" %}
```js
import { browser } from "@wdio/globals";
import { argosScreenshot } from "@argos-ci/webdriverio";

describe("Integration test with visual testing", () => {
  it("covers homepage", async () => {
    await browser.url("http://localhost:3000");
    await argosScreenshot(browser, "homepage");
  });
});
```
{% endcode %}

Screenshots are written to the `./screenshots/argos` directory. Add `screenshots/` to your `.gitignore` file to avoid committing them.
{% endstep %}

{% step %}
### Set up CI

Run your WebdriverIO tests in CI, then upload the screenshots to Argos with the CLI:

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
      - name: Run WebdriverIO tests
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
* [WebdriverIO SDK reference](../sdks-reference/webdriverio.md) – All options
* [CLI reference](../sdks-reference/argos-command-line-interface-cli.md) – All upload options

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
