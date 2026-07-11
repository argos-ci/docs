---
description: Use build splitting to run separate Argos visual tests for each package or app in your monorepo within one commit.
---

# Monorepos setup

In a monorepo, several packages or apps produce screenshots on the same commit. **Build splitting** keeps them apart: give each test suite its own build name, and Argos creates a separate build — with its own baseline and its own status check — for each name.

Build splitting works across all SDKs and the CLI. Set a unique build name per suite with the `--build-name` CLI flag or the `buildName` SDK option.

### Example

Say your monorepo has a component library and an app with end-to-end (E2E) tests. Give each suite its own build name:

**For components:**

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos upload --build-name components ./screenshots/components
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos upload --build-name components ./screenshots/components
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos upload --build-name components ./screenshots/components
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos upload --build-name components ./screenshots/components
```
{% endtab %}
{% endtabs %}

**For E2E tests with Playwright:**

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
        buildName: "e2e",
      }),
    ],
  ],
  // Other config
});
```
{% endcode %}

Each build appears separately in Argos — `components` and `e2e` are compared against their own baselines and report their own status checks, so a visual change in one suite never blocks the other.

{% hint style="info" %}
If your monorepo uses a task cache like Turborepo or Nx that decides which test suites actually run, see [Cached CI pipelines (Turborepo, Nx)](cached-pipelines.md) — it covers aggregating packages into a single build and keeping baselines and required checks reliable when suites are skipped.
{% endhint %}
