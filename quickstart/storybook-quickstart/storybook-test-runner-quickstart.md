---
description: Learn how to setup visual testing in a Storybook using Test Runner
---

# Storybook Test Runner Quickstart

## Prerequisites

To get the most out of this guide, you'll need to:

* [Use Storybook v8+](https://storybook.js.org/docs/get-started/install)
* [Create your project in Argos](https://app.argos-ci.com/new)

{% hint style="info" %}
If use Vitest and not Test Runner, follow our [Storybook Vitest quickstart](./).

If use a legacy version of Storybook (\<v8), follow our [legacy Storybook quickstart](storybook-legacy-less-than-v8-quickstart.md).
{% endhint %}

{% stepper %}
{% step %}
### Install

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

Read the [CLI documentation](../../sdks-reference/argos-command-line-interface-cli.md) if you need information about advanced usages.
{% endstep %}

{% step %}
### Update your package.json

Add the following scripts to your `package.json`:

package.json

```json
{
  "scripts": {
    "test-storybook": "NODE_NO_WARNINGS=1 NODE_OPTIONS=--experimental-vm-modules test-storybook"
  }
}
```

{% hint style="info" %}
`NODE_OPTIONS=--experimental-vm-modules` is required because Storybook uses Jest that requires this flag to run modern packages like Argos Storybook SDK.
{% endhint %}
{% endstep %}

{% step %}
### Capture screenshots

Add `.storybook/test-runner.ts` file to your project:

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

It will capture screenshots of your stories in `./screenshots` directory.

Add `./screenshots` to your `.gitignore` file, to avoid uploading screenshots to your Git repository.
{% endstep %}

{% step %}
### Setup CI to run tests and upload screenshots

Below is a complete GitHub Actions workflow to build your Storybook, run tests, capture screenshots, and upload them to Argos. If you use another CI provider, adapt the steps accordingly.

{% code title=".github/workflows/storybook-test.yml" %}
```yml
name: Storybook Test

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

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
        # 👇 Replace `<ARGOS_TOKEN>` with your project token, available in your Argos project settings.
        run: npm exec -- argos upload --token <ARGOS_TOKEN> ./screenshots
```
{% endcode %}

To learn how to run tests on a deployed Storybook, refer to the [Storybook test runner documentation](https://storybook.js.org/docs/writing-tests/test-runner#set-up-ci-to-run-tests).
{% endstep %}
{% endstepper %}

## Congratulations on installing Argos! 👏

After committing and pushing your changes, the Argos check status will appear on your pull request in GitHub (or GitLab).

**Note:** you need a reference build to compare your changes with. If you don't have one, builds will remain orphan until you run Argos on your reference branch.

You can now review changes of your app for each pull request, avoid visual bugs and merge with confidence. Welcome on board!

## Additional resources

* [Argos + Storybook + Test Runner example](https://github.com/argos-ci/argos-javascript/tree/main/examples/storybook-test-runner)
* [Argos Storybook SDK reference](../../sdks-reference/storybook.md)
* [Storybook documentation](https://storybook.js.org/docs)
* [Storybook test runner documentation](https://storybook.js.org/docs/writing-tests/test-runner)

***

[Join our Discord](https://argos-ci.com/discord), [submit an issue on GitHub](https://github.com/argos-ci/argos/issues) or just [send an email](mailto:contact@argos-ci.com) if you need help.
