---
description: Learn how to setup visual testing using the Argos Cypress SDK.
---

# Cypress Quickstart

### Prerequisites

To get the most out of this guide, you’ll need to:

* [Use Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)
* [Run Cypress on your CI/CD](https://learn.cypress.io/advanced-cypress-concepts/running-cypress-in-ci)
* [Create your project in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Get the Argos Cypress SDK.

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

Read the [CLI documentation](../sdks-reference/argos-command-line-interface-cli.md) if you need information about advanced usages.
{% endstep %}

{% step %}
### Add `cy.argosScreenshot` command

Add this line to your `cypress/support/e2e.js` file:

```js
import "@argos-ci/cypress/support";
```

If you use TypeScript, update your `tsconfig.json`:

```js
{
  "compilerOptions": {
    "types": ["cypress", "@argos-ci/cypress/support"]
  }
}
```
{% endstep %}

{% step %}
### Register Argos in Cypress config

```js
const { defineConfig } = require("cypress");
const { registerArgosTask } = require("@argos-ci/cypress/task");

module.exports = defineConfig({
  // setupNodeEvents can also be defined in "component"
  e2e: {
    async setupNodeEvents(on, config) {
      registerArgosTask(on, config, {
        // Enable upload to Argos only when it runs on CI.
        uploadToArgos: !!process.env.CI,
        // Set your Argos token (required only if you don't use GitHub Actions).
        token: "<YOUR-ARGOS-TOKEN>",
      });

      // include any other plugin code...
    },
  },
});
```
{% endstep %}

{% step %}
### Take screenshots

Use `argosScreenshot` helper to capture stable screenshots in your E2E tests.

{% code title="cypress/e2e/homepage.cy.js" %}
```js
it("screenshot homepage", async ({ page }) => {
  cy.visit("https://localhost:3000/");
  cy.argosScreenshot("homepage");
});
```
{% endcode %}

Add `/cypress/screenshots` to your `.gitignore` file, to avoid uploading screenshots to your Git repository.

{% hint style="info" %}
Check out our guides to [screenshot multiple pages](../learn/how-to-guides/visual-coverage/capture-screenshots-from-urls.md) or [capture multiple viewports](../learn/how-to-guides/visual-coverage/responsive-viewports.md).
{% endhint %}
{% endstep %}
{% endstepper %}

### Congratulations on installing Argos! 👏

After committing and pushing your changes, the Argos check status will appear on your pull request in GitHub (or GitLab).

**Note:** you need a reference build to compare your changes with. If you don't have one, builds will remain orphan until you run Argos on your reference branch.

You can now review changes of your app for each pull request, avoid visual bugs and merge with confidence. Welcome on board!

### Next step: keep your screenshots stable

Now that Argos is running, the next thing to learn is how to keep your screenshots free of flakiness. Read [Best practices for stable screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) to avoid false positives before they reach your pull requests.

### Additional resources

* [Cypress example](https://github.com/argos-ci/argos-javascript/tree/main/examples/cypress)
* [Argos Cypress SDK reference](../sdks-reference/cypress.md)

***

[Join our Discord](https://argos-ci.com/discord), [submit an issue on GitHub](https://github.com/argos-ci/argos/issues) or just [send an email](mailto:contact@argos-ci.com) if you need help.
