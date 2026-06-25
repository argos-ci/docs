---
description: Compare Argos Continuous Integration mode and Monitoring mode to choose the right one for your workflow.
---

# Build modes

Argos provides two build modes for visual testing: **Continuous Integration (CI) mode** and **Monitoring mode**. This page explains how each mode works, their key differences, and when to use them to best fit your workflow.

### Continuous Integration Mode

Continuous Integration (CI) mode is the default in Argos. It is designed to review the visual changes introduced by a feature branch and prevent regressions.

During your CI pipeline, screenshots of the application are captured on each pull request and on the default branch (main, production, etc.). These screenshots are uploaded to Argos, where they are compared against a [baseline build](baseline-build.md).

The [baseline build](baseline-build.md) represents the most recent approved state of your application and is automatically selected based on Git history analysis and [other criteria](baseline-build.md).

In the Argos app, you can review highlighted differences, approve intended updates, and block regressions before merging.

{% hint style="info" %}
Your CI pipeline must also run on the default branch (main, production, etc.) to keep the baseline build up to date.
{% endhint %}

#### Workflow

{% stepper %}
{% step %}
### Feature Development

* A developer creates a feature (or bugfix) branch and commits changes.
* Optionally, a pull request (PR) is opened.
{% endstep %}

{% step %}
### Visual Tests in CI

* During these tests, your test framework (Playwright, Cypress, etc.) captures screenshots of the app. Argos offers [SDKs](https://app.gitbook.com/s/0slCNmeVzY3qdh0I85HX/sdks-reference) for easy integration with popular frameworks.
* At the end of the tests, screenshots are uploaded to Argos automatically with the SDK, or manually using the Argos CLI.
{% endstep %}

{% step %}
### Comparison with Baseline

* Argos receives the build containing screenshots and metadata.
* It automatically determines the [baseline build](baseline-build.md) using Git history analysis and other criteria.
* The new screenshots are compared against the baseline.
{% endstep %}

{% step %}
### Results & Notifications

* The build is complete once all screenshots have been compared:
  * ✅ No differences → commit status set to _success_.
  * ❌ Differences found → commit status set to _failed_. The changes are visible in the Argos app for review and approval.
* Argos notifies the Git providers (GitHub, GitLab, etc.) about the build status.
* On GitHub, Argos also posts a summary comment with a link to the dashboard.
* On Git providers, if branch protection rules require Argos checks to pass, pull requests will be blocked from merging until all visual changes are reviewed and approved in Argos.
{% endstep %}

{% step %}
### Approval Process

* The team reviews the changes in the Argos app:
  * Each screenshot change can be approved or rejected.
  * The build as a whole must then be approved or rejected. The check status on Git providers (GitHub, GitLab, etc.) is automatically updated accordingly.
{% endstep %}
{% endstepper %}

#### Notifications

In CI mode, Argos integrates directly with your Git provider to surface results where developers work:

* **Commit status updates**: Each build sets the commit status to ✅ success or ❌ failed.
* **Pull request comments**: On GitHub, Argos posts a summary comment with a link to the Argos dashboard.
* **Slack notifications**: Enable [Slack notifications](../integrations/slack-integration.md) to alert your team immediately when visual differences are detected.

#### Use Cases

CI mode is designed to be the primary workflow for preventing regressions during development. Common scenarios include:

**1. Pull Request Validation**

* **When:** A developer opens a PR with UI changes.
* **How:** Argos runs during CI, compares screenshots with the baseline, and blocks merging until visual changes are reviewed and approved.

**2. Default Branch Verification**

* **When:** Code is merged into the main/reference branch.
* **How:** Argos runs on the default branch to ensure the new baseline is validated and ready for future comparisons.

**3. Continuous Feedback Loop**

* **When:** Teams want fast feedback on every commit.
* **How:** CI mode surfaces results directly in GitHub, ensuring regressions are caught early in the workflow.

#### Usage

CI mode is enabled by default.

Follow the [Get Started guide](../../quickstart/) to integrate Argos into your CI pipeline.

### Monitoring Mode

Monitoring mode is an **opt-in feature** in Argos. It is designed to track visual changes outside the standard CI flow, either on a schedule or before a release.

In this mode, your tests capture screenshots on the chosen branch (e.g., main or a release branch). The screenshots are uploaded to Argos and compared only against the **latest approved build**. Git history is ignored. The approval status alone defines the baseline.

#### Workflow

{% stepper %}
{% step %}
### Enable Monitoring Mode

* Activate monitoring for periodic checks or pre-release validation.
{% endstep %}

{% step %}
### Run Periodic Visual Tests

* Your tests capture screenshots on the target branch (daily, weekly, or before a release).
{% endstep %}

{% step %}
### Compare with Latest Approved Build

* Screenshots are compared only with the most recently approved build.
{% endstep %}

{% step %}
### Notify on Differences

* If differences are found, notifications are sent.
* Changes must then be reviewed, approved, or corrected.
{% endstep %}
{% endstepper %}

#### Notifications

[Set up **Slack notifications**](../integrations/slack-integration.md#set-up-slack-notifications) to be alerted immediately when visual differences are detected, so your team can review and act quickly.

#### Use Cases

Monitoring mode is useful when you need oversight beyond standard CI/CD pipelines:

**1. Regular Health Checks**

* **When:** Your project changes frequently (content or style tweaks) but running CI on every change isn't practical.
* **How:** Schedule monitoring on the main branch (e.g., daily/weekly) to catch unexpected changes early.

**2. Pre-release Validation**

* **When:** Before a major release, you need to confirm no regressions slipped in.
* **How:** Run monitoring on the release branch and compare with the last approved build before deployment.

**3. Post-deployment Monitoring**

* **When:** After staging or production deployments, you want to detect environment-specific visual issues.
* **How:** Run monitoring after each deployment to catch discrepancies not visible in development.

**4. Third-party Integrations**

* **When:** Your app depends on external widgets or services that can change independently.
* **How:** Use monitoring to ensure third-party visuals remain stable over time.

#### Usage

Enable Monitoring mode by setting `mode: "monitoring"` in your SDK configuration.

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos upload --mode=monitoring components ./screenshots
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos upload --mode=monitoring components ./screenshots
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos upload --mode=monitoring components ./screenshots
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos upload --mode=monitoring components ./screenshots
```
{% endtab %}
{% endtabs %}

**Playwright**

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
        // Set your Argos token (required if not using GitHub Actions).
        token: "<YOUR-ARGOS-TOKEN>",
        mode: "monitoring",
      }),
    ],
  ],
});
```
{% endcode %}

**Cypress**

{% code title="cypress.config.js" %}
```js
const { defineConfig } = require("cypress");
const { registerArgosTask } = require("@argos-ci/cypress/task");

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      registerArgosTask(on, config, {
        uploadToArgos: !!process.env.CI,
        // Set your Argos token (required if not using GitHub Actions).
        token: "<YOUR-ARGOS-TOKEN>",
        mode: "monitoring",
      });
    },
  },
});
```
{% endcode %}
