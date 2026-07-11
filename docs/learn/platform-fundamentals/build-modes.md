---
description: >-
  Compare Argos Continuous Integration mode and Monitoring mode to choose the
  right one for your workflow.
---

# Build modes

Argos provides two build modes: **Continuous Integration (CI) mode** and **Monitoring mode**. They differ in one thing — how the baseline is chosen. CI mode follows your Git history to review changes branch by branch; Monitoring mode ignores Git history and tracks drift against the latest approved state.

### CI mode

CI mode is the default. It is designed to review the visual changes introduced by a feature branch and prevent regressions from merging.

On each pull request and on your default branch, your tests capture screenshots and upload them to Argos. Argos compares them against the [baseline build](baseline-build.md) selected from your Git history, and reports the result on the pull request.

{% hint style="info" %}
Your CI pipeline must also run on the default branch (main, production, etc.) to keep the baseline up to date.
{% endhint %}

#### Workflow

{% stepper %}
{% step %}
### Develop

A developer creates a feature (or bugfix) branch, commits changes, and opens a pull request.
{% endstep %}

{% step %}
### Capture and upload

During CI, your test framework captures screenshots of the app. At the end of the tests, the [Argos SDK](../../sdks-reference/playwright.md) uploads them automatically — or you upload them with the [CLI](../../sdks-reference/argos-command-line-interface-cli.md).
{% endstep %}

{% step %}
### Compare

Argos determines the [baseline build](baseline-build.md) from your Git history and compares each new screenshot against it.
{% endstep %}

{% step %}
### Report

Once all screenshots are compared, the build concludes:

* **No changes detected** — the commit status passes.
* **Changes detected** — the commit status asks for review, and the diffs are ready in Argos.

Argos posts the status to your Git provider, along with a [pull request comment](../review-workflow/pull-request-comments.md) on GitHub. If your branch protection requires the Argos check, the pull request is blocked until the changes are reviewed.
{% endstep %}

{% step %}
### Review

The team [reviews the build](../review-workflow/review-a-build.md): approve intended changes or reject regressions. The commit status updates accordingly, and approved builds become eligible as future baselines.
{% endstep %}
{% endstepper %}

#### When to use CI mode

* **Pull request validation**: Block merging until visual changes are reviewed and approved.
* **Default branch verification**: Validate every merge so the baseline stays trustworthy.
* **Continuous feedback**: Surface regressions commit by commit, where developers work.

CI mode is enabled by default — follow the [Quickstart](../../quickstart/README.md) to set it up.

### Monitoring mode

Monitoring mode is **opt-in**. It is designed to track visual changes outside the standard CI flow — on a schedule, before a release, or after a deployment.

In this mode, your tests capture screenshots on a chosen branch (e.g., `main` or a release branch). Argos compares them **only against the latest approved build**: Git history is ignored, and the approval status alone defines the baseline.

#### Workflow

{% stepper %}
{% step %}
### Run on a schedule

Your tests capture screenshots on the target branch — daily, weekly, or before a release.
{% endstep %}

{% step %}
### Compare with the latest approved build

Argos compares the screenshots against the most recently approved monitoring build.
{% endstep %}

{% step %}
### Get notified and review

If differences are found, Argos notifies you — enable [Slack notifications](../integrations/slack-integration.md#set-up-slack-notifications) to alert your team immediately. Review the changes, then approve them or fix the regression.
{% endstep %}
{% endstepper %}

#### When to use Monitoring mode

* **Regular health checks**: Catch unexpected changes on a schedule when running CI on every change isn't practical.
* **Pre-release validation**: Confirm no regressions slipped in before a major release.
* **Post-deployment monitoring**: Detect environment-specific issues after staging or production deployments.
* **Third-party integrations**: Ensure external widgets or services that change independently remain visually stable.

#### Enable Monitoring mode

Set the mode in your SDK configuration or pass `--mode=monitoring` to the CLI:

{% tabs %}
{% tab title="CLI" %}
```bash
npm exec -- argos upload --mode=monitoring ./screenshots
```
{% endtab %}

{% tab title="Playwright" %}
{% code title="playwright.config.ts" %}
```ts
import { defineConfig } from "@playwright/test";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        uploadToArgos: !!process.env.CI,
        mode: "monitoring",
      }),
    ],
  ],
});
```
{% endcode %}
{% endtab %}

{% tab title="Cypress" %}
{% code title="cypress.config.js" %}
```js
const { defineConfig } = require("cypress");
const { registerArgosTask } = require("@argos-ci/cypress/task");

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      registerArgosTask(on, config, {
        uploadToArgos: !!process.env.CI,
        mode: "monitoring",
      });
    },
  },
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Builds in different modes never share baselines: a monitoring build is only ever compared against another monitoring build.
{% endhint %}
