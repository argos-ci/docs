---
description: Learn how to setup visual testing using the Argos WebdriverIO SDK.
---

# WebdriverIO Quickstart

### Prerequisites

To get the most out of this guide, you’ll need to:

* [Use WebdriverIO](https://webdriver.io/)
* Run WebdriverIO on your CI/CD
* [Create your project in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

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

Read the [CLI documentation](../sdks-reference/argos-command-line-interface-cli.md) if you need information about advanced usages.
{% endstep %}

{% step %}
### Take screenshots

Use `argosScreenshot` helper to capture screenshots in your E2E tests.

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

Screenshots are stored in `screenshots/argos`, don't forget to add this folder to your `.gitignore`.
{% endstep %}

{% step %}
### Setup your CI

Add this command to your CI pipeline to upload the screenshots to Argos.

```
npm exec -- argos upload --token <ARGOS_TOKEN> screenshots
```

Note: The value of `ARGOS_TOKEN` is available your project settings on Argos.
{% endstep %}
{% endstepper %}

### Congratulations on installing Argos! 👏

After committing and pushing your changes, the Argos check status will appear on your pull request in GitHub (or GitLab).

**Note:** you need a reference build to compare your changes with. If you don't have one, builds will remain orphan until you run Argos on your reference branch.

You can now review changes of your app for each pull request, avoid visual bugs and merge with confidence. Welcome on board!

### Additional resources

* [Argos WebdriverIO SDK reference](../sdks-reference/webdriverio.md)

***

[Join our Discord](https://argos-ci.com/discord), [submit an issue on GitHub](https://github.com/argos-ci/argos/issues) or just [send an email](mailto:contact@argos-ci.com) if you need help.
