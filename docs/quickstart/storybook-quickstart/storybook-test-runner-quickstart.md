---
description: Set up visual testing in Storybook with Test Runner and the Argos CLI.
---

# Storybook Test Runner Quickstart

Set up Argos with [Storybook Test Runner](https://storybook.js.org/docs/writing-tests/integrations/test-runner) to run visual tests on every pull request: capture a screenshot of each story during the test run, then upload them with the Argos CLI.

{% hint style="info" %}
If you use Vitest instead of Test Runner, follow the [Storybook Quickstart](README.md).

If you use a legacy version of Storybook (\<v8), follow the [legacy Storybook Quickstart](storybook-legacy-less-than-v8-quickstart.md).
{% endhint %}

### Prerequisites

* [Storybook v8+](https://storybook.js.org/docs/get-started/install) set up in your project
* [A project created in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Install the Argos CLI, the Argos Storybook SDK, and Storybook Test Runner:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/cli @argos-ci/storybook @storybook/test-runner
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/cli @argos-ci/storybook @storybook/test-runner
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/cli @argos-ci/storybook @storybook/test-runner
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/cli @argos-ci/storybook @storybook/test-runner
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Add a test script

Add the following script to your `package.json`:

{% code title="package.json" %}
```json
{
  "scripts": {
    "test-storybook": "NODE_NO_WARNINGS=1 NODE_OPTIONS=--experimental-vm-modules test-storybook"
  }
}
```
{% endcode %}

{% hint style="info" %}
`NODE_OPTIONS=--experimental-vm-modules` is required because Storybook Test Runner uses Jest, which needs this flag to run modern packages like the Argos Storybook SDK.
{% endhint %}
{% endstep %}

{% step %}
### Capture screenshots

Add a `.storybook/test-runner.ts` file to your project. The `postVisit` hook captures a screenshot of every story:

{% code title=".storybook/test-runner.ts" %}
```ts
import type { TestRunnerConfig } from "@storybook/test-runner";
import { argosScreenshot } from "@argos-ci/storybook/test-runner";

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    await argosScreenshot(page, context);
  },
};

export default config;
```
{% endcode %}

Screenshots are written to the `./screenshots` directory. Add `./screenshots` to your `.gitignore` file to avoid committing them.
{% endstep %}

{% step %}
### Set up CI

Add a workflow that builds your Storybook, runs the tests, and uploads the screenshots to Argos. If you use another CI provider, adapt the steps accordingly:

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
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Install Playwright dependencies
        run: npx playwright install --with-deps chromium

      - name: Run Storybook tests and capture screenshots
        run: |
          npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
            "npx http-server ./storybook-static --port 6006 --silent" \
            "npx wait-on tcp:127.0.0.1:6006 && npm run test-storybook"

      - name: Upload screenshots to Argos
        run: npm exec -- argos upload ./screenshots
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../../learn/integrations/github-actions-authentication.md) to avoid managing a secret.

To learn how to run tests on a deployed Storybook, refer to the [Storybook Test Runner documentation](https://storybook.js.org/docs/writing-tests/integrations/test-runner).
{% endstep %}
{% endstepper %}

### You're all set

Push your changes and open a pull request — the Argos check appears on it once the build is uploaded. Review the visual changes, approve or reject them, and merge with confidence.

{% hint style="info" %}
Argos needs a baseline to compare against. Until a build runs on your default branch, pull request builds are marked as [orphan](../../learn/platform-fundamentals/baseline-build.md#orphan-builds). Merge this setup or run the workflow once on your default branch to establish the baseline.
{% endhint %}

### Next steps

* [Stabilize screenshots](../../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [Storybook SDK reference](../../sdks-reference/storybook.md) – All options and helpers
* [Storybook + Test Runner example](https://github.com/argos-ci/argos-javascript/tree/main/examples/storybook-test-runner) – A complete working setup

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
