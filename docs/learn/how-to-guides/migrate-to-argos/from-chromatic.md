---
description: >-
  Migrate visual testing from Chromatic to Argos. Move your Storybook,
  Playwright, or Cypress visual tests off the chromatic CLI to the Argos SDK.
---

# Migrate from Chromatic to Argos

This guide shows how to move a project from [Chromatic](https://www.chromatic.com/) to Argos. Chromatic is built around a hosted `chromatic` CLI that builds and uploads your Storybook (or an archive of your E2E runs). Argos plugs into the test runner you already use and, for Storybook, can also publish a live Storybook URL on every pull request.

### How Chromatic and Argos differ

* **Chromatic** builds your Storybook, uploads it, and captures every story **on Chromatic's infrastructure**. Cross-browser and multi-viewport coverage come from Chromatic's cloud and story **modes**.
* **Argos** captures your stories **locally with the Storybook Vitest addon** (a real Playwright browser) and uploads the images. It then deploys the built Storybook to an Argos URL so reviewers can open the live component next to the diff.

Both select baselines automatically and gate the pull request, so the review workflow feels similar. The main change is *where* rendering happens and how you scope large suites.

### Concept mapping

| Chromatic                                          | Argos                                                                             |
| -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `chromatic` CLI + `@chromatic-com/storybook`       | `@argos-ci/storybook` + `argos deploy`                                            |
| `npx chromatic --project-token=<token>`            | `npx vitest --project=storybook` + `npx argos deploy ./storybook-static`         |
| `CHROMATIC_PROJECT_TOKEN`                          | `ARGOS_TOKEN`                                                                      |
| TurboSnap (`--only-changed`)                       | [Subset builds](../ci-pipelines/subset-builds.md) / [sharding](../ci-pipelines/parallel-testing-sharding.md) |
| Modes (viewports, themes, globals)                 | [Storybook story modes](../visual-coverage/storybook-story-modes.md)             |
| `@chromatic-com/playwright` + `--playwright`       | `@argos-ci/playwright` reporter + `argosScreenshot`                              |
| `@chromatic-com/cypress` + `--cypress`             | `@argos-ci/cypress` + `cy.argosScreenshot`                                       |
| Chromatic web review                               | [Review a build](../../review-workflow/review-a-build.md) + PR comment            |

## Migrate a Storybook project

{% stepper %}
{% step %}
### Remove the Chromatic packages

```bash
npm uninstall chromatic @chromatic-com/storybook
```
{% endstep %}

{% step %}
### Install the Argos Storybook SDK

{% tabs %}
{% tab title="npm" %}
```bash
npm i --save-dev @argos-ci/storybook @argos-ci/cli
```
{% endtab %}

{% tab title="yarn" %}
```bash
yarn add --dev @argos-ci/storybook @argos-ci/cli
```
{% endtab %}

{% tab title="pnpm" %}
```bash
pnpm add --save-dev @argos-ci/storybook @argos-ci/cli
```
{% endtab %}

{% tab title="bun" %}
```bash
bun add --dev @argos-ci/storybook @argos-ci/cli
```
{% endtab %}
{% endtabs %}

Argos uses the [Storybook Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) to run your stories. If you're on Storybook v8+ and don't have it yet, install it before continuing. (On older Storybook, use the [Test Runner quickstart](../../../quickstart/storybook-quickstart/storybook-test-runner-quickstart.md) or the [legacy quickstart](../../../quickstart/storybook-quickstart/storybook-legacy-less-than-v8-quickstart.md).)
{% endstep %}

{% step %}
### Add the Argos plugin to your Vitest config

The Argos Vitest plugin captures a screenshot of every story and uploads it. Add it alongside the Storybook test plugin:

{% code title="vitest.config.ts" %}
```ts
import { argosVitestPlugin } from "@argos-ci/storybook/vitest-plugin";
// ...alongside storybookTest({ ... }) in your plugins array:

argosVitestPlugin({
  uploadToArgos: !!process.env.CI,
  // Required only if you are not using GitHub Actions.
  token: "<YOUR-ARGOS-TOKEN>",
}),
```
{% endcode %}

See the [Storybook quickstart](../../../quickstart/storybook-quickstart/) for the complete `vitest.config.ts`, including the browser provider and text-rendering flags.
{% endstep %}

{% step %}
### Replace the CI step

Swap the single `chromatic` command for two steps: run the visual tests, then deploy the built Storybook.

{% columns %}
{% column %}
**Before (Chromatic)**

```yaml
- run: npm ci
- run: npx chromatic
    --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```
{% endcolumn %}

{% column %}
**After (Argos)**

```yaml
- run: npm ci
- run: npx playwright install --with-deps chromium
- run: npx vitest --project=storybook
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
- run: npm run build-storybook
- run: npx --no-install argos deploy ./storybook-static
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcolumn %}
{% endcolumns %}

`ARGOS_TOKEN` comes from **Settings → General → Token**. On GitHub Actions you can use [OIDC](../../integrations/github-oidc-authentication.md) or [tokenless authentication](../../integrations/github-tokenless-authentication.md) instead of a secret.
{% endstep %}

{% step %}
### Remove Chromatic config

Delete `chromatic.config.json`, the `@chromatic-com/storybook` addon entry in `.storybook/main.ts`, and the `CHROMATIC_PROJECT_TOKEN` secret.
{% endstep %}
{% endstepper %}

## Migrate Playwright or Cypress E2E visual tests

Chromatic's E2E integrations (`@chromatic-com/playwright`, `@chromatic-com/cypress`) capture an **archive** during your test run, which you then upload with `npx chromatic --playwright` or `--cypress`. Argos captures screenshots inline instead — no archive step.

* **Playwright:** install `@argos-ci/playwright`, add the reporter to `playwright.config.ts`, and call `argosScreenshot(page, "Name")` where you want a snapshot. Then run `npx playwright test` directly (no `chromatic` command). See the [Playwright quickstart](../../../quickstart/playwright-quickstart.md).
* **Cypress:** install `@argos-ci/cypress`, register the Argos task, and call `cy.argosScreenshot("Name")`. See the [Cypress quickstart](../../../quickstart/cypress-quickstart.md).

## Migrating Chromatic features

<details>

<summary>TurboSnap (only test changed stories)</summary>

Argos doesn't use TurboSnap's git-diff story selection. Instead it runs your test runner, so you scope work with the tools you already have: [subset builds](../ci-pipelines/subset-builds.md) to run part of the suite, and [parallel testing and sharding](../ci-pipelines/parallel-testing-sharding.md) to spread it across CI machines.

</details>

<details>

<summary>Modes (viewports, themes, locales)</summary>

Chromatic modes map to [Storybook story modes](../visual-coverage/storybook-story-modes.md) in Argos, which capture the same story under multiple viewports, themes, or globals.

</details>

<details>

<summary>Interaction tests (play functions)</summary>

Your `play` functions keep working. Call `argosScreenshot(ctx, "name")` inside a play function to capture a specific interaction state. See the [Storybook quickstart](../../../quickstart/storybook-quickstart/).

</details>

## Frequently asked questions

<details>

<summary>Do I keep writing stories the same way?</summary>

Yes. Your stories, args, and play functions are unchanged. Argos runs them through Vitest and screenshots each one.

</details>

<details>

<summary>What replaces Chromatic's hosted Storybook?</summary>

`argos deploy ./storybook-static` publishes your built Storybook to a unique Argos [deployment URL](../../deployments/) on every pull request, so reviewers can open the live component.

</details>

<details>

<summary>What happens to my Chromatic baselines?</summary>

They don't transfer. The first Argos build on your reference branch establishes the baseline automatically. Run Argos on your default branch first so pull request builds have something to compare against.

</details>

<details>

<summary>Is there an open-source plan?</summary>

Yes — see [Open source](../../billing-and-subscription/subscription/open-source.md).

</details>

## Next steps

* [Storybook quickstart](../../../quickstart/storybook-quickstart/) — the full setup.
* [Storybook story modes](../visual-coverage/storybook-story-modes.md) — replace Chromatic modes.
* [Deployments](../../deployments/) — live Storybook URLs on every PR.
