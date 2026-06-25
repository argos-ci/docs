---
description: Run subset builds to upload a partial test run without affecting the baseline of screenshots it didn't cover.
---

# Subset builds

Subset builds are designed for CI runs that **don't execute the full E2E test suite** on a branch. When a build is marked as subset, Argos **ignores removed screenshots** and only notifies you about **changed and added screenshots** from the tests you did run.

This is helpful for speeding up feature-branch validation while still getting reliable visual feedback from the relevant tests.

{% hint style="info" %}
You still need to run your full test suite on your main branch to create and update **baseline builds**. Subset builds are not eligible as baselines. See [Baseline build](../../platform-fundamentals/baseline-build.md).
{% endhint %}

### Enable subset builds

You can enable subset builds in any Argos SDK or the CLI.

#### Environment variable

Set the environment variable `ARGOS_SUBSET` to `"true"` in your CI configuration.

```yml
steps:
  - name: Run tests
    run: npm test
    env:
      ARGOS_SUBSET: "true"
```

#### CLI

Use the `--subset` flag with the CLI.

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos upload --subset ./screenshots
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos upload --subset ./screenshots
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos upload --subset ./screenshots
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos upload --subset ./screenshots
```
{% endtab %}
{% endtabs %}

#### SDK option

Most SDKs expose a `subset` option on the upload configuration.

{% code title="upload.js" %}
```js
import { upload } from "@argos-ci/core";

await upload({
  root: "./screenshots",
  subset: true,
});
```
{% endcode %}

### Examples

#### Node.js

{% code title="scripts/argos-upload.js" %}
```js
import { upload } from "@argos-ci/core";

await upload({
  root: "./screenshots",
  subset: true,
});
```
{% endcode %}

#### Playwright

For Playwright, simply set `ARGOS_SUBSET=true` in your CI job. The reporter will mark the build as a subset build.

{% code title=".github/workflows/ci.yml" %}
```yml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
  - run: npm ci
  - name: Run Playwright tests
    env:
      ARGOS_SUBSET: "true"
    run: npx playwright test
```
{% endcode %}

#### Cypress

For Cypress, set `ARGOS_SUBSET=true` in your CI job that runs Cypress and uploads screenshots.

{% code title=".github/workflows/ci.yml" %}
```yml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
  - run: npm ci
  - name: Run Cypress tests
    env:
      ARGOS_SUBSET: "true"
    run: npx cypress run
```
{% endcode %}

### Troubleshooting / FAQ

<details>

<summary>Why are removed screenshots ignored?</summary>

Subset builds only include a portion of your test suite, so missing screenshots may simply be from skipped tests, not actual deletions. Ignoring removals avoids false positives.

</details>

<details>

<summary>Why can’t a subset build be a baseline?</summary>

Baselines must represent the full test suite. Subset builds are incomplete by design and would cause missing screenshots in comparisons.

</details>
