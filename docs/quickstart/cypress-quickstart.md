---
description: Set up visual testing in your Cypress tests with the Argos Cypress SDK.
---

# Cypress Quickstart

Set up Argos with [Cypress](https://www.cypress.io/) to run visual tests on every pull request: install the SDK, register the command and task, capture screenshots, and run it in CI.

### Prerequisites

* [Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress) set up in your project
* [Cypress running on your CI](https://learn.cypress.io/advanced-cypress-concepts/running-cypress-in-ci)
* [A project created in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Install the Argos Cypress SDK:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/cypress
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/cypress
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/cypress
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/cypress
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Set up Argos in your Cypress config

Two pieces wire Argos into Cypress: the support file adds the `cy.argosScreenshot` command, and the task uploads the captured screenshots.

Add the command to your `cypress/support/e2e.js` file:

{% code title="cypress/support/e2e.js" %}
```js
import "@argos-ci/cypress/support";
```
{% endcode %}

If you use TypeScript, add the types to your `tsconfig.json`:

{% code title="tsconfig.json" %}
```json
{
  "compilerOptions": {
    "types": ["cypress", "@argos-ci/cypress/support"]
  }
}
```
{% endcode %}

Then register the Argos task in your Cypress config:

{% code title="cypress.config.js" %}
```js
const { defineConfig } = require("cypress");
const { registerArgosTask } = require("@argos-ci/cypress/task");

module.exports = defineConfig({
  // setupNodeEvents can also be defined in "component"
  e2e: {
    async setupNodeEvents(on, config) {
      registerArgosTask(on, config, {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      });

      // include any other plugin code...
    },
  },
});
```
{% endcode %}
{% endstep %}

{% step %}
### Capture screenshots

Use the `cy.argosScreenshot` command to capture stable screenshots in your tests:

{% code title="cypress/e2e/homepage.cy.js" %}
```js
it("screenshot homepage", () => {
  cy.visit("http://localhost:3000/");
  cy.argosScreenshot("homepage");
});
```
{% endcode %}

Screenshots are written to the `/cypress/screenshots` directory. Add `/cypress/screenshots` to your `.gitignore` file to avoid committing them.

Tip: Check out our guides to [screenshot multiple pages](../learn/how-to-guides/visual-coverage/capture-screenshots-from-urls.md) or [capture multiple viewports](../learn/how-to-guides/visual-coverage/responsive-viewports.md).
{% endstep %}

{% step %}
### Set up CI

Run your Cypress tests in CI with `ARGOS_TOKEN` set. The Argos task uploads screenshots automatically when it detects a CI environment:

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
      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          start: npm start # command that serves your app
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md) to avoid managing a secret. On other CI providers, pass the token with the `ARGOS_TOKEN` environment variable or the task's `token` option.
{% endstep %}
{% endstepper %}

### You're all set

Push your changes and open a pull request — the Argos check appears on it once the build is uploaded. Review the visual changes, approve or reject them, and merge with confidence.

{% hint style="info" %}
Argos needs a baseline to compare against. Until a build runs on your default branch, pull request builds are marked as [orphan](../learn/platform-fundamentals/baseline-build.md#orphan-builds). Merge this setup or run the workflow once on your default branch to establish the baseline.
{% endhint %}

### Next steps

* [Stabilize screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [Cypress SDK reference](../sdks-reference/cypress.md) – All options and helpers
* [Cypress example](https://github.com/argos-ci/argos-javascript/tree/main/examples/cypress) – A complete working setup

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
