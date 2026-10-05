---
description: Set up visual testing with any test framework by uploading screenshots with the Argos CLI.
---

# Visual testing with any test framework

To add visual testing to any test framework, save your screenshots to a folder, install `@argos-ci/cli`, and run `npm exec -- argos upload ./screenshots` in CI with the `ARGOS_TOKEN` environment variable set. Argos compares every screenshot with a [baseline build](../learn/platform-fundamentals/baseline-build.md) picked from your Git history and reports the changes as a check on your pull request.

Argos works with any tool that produces screenshots. If your framework has no dedicated Argos SDK, capture screenshots however you like and upload the folder with the Argos CLI.

### What Argos adds

* **Baselines from your Git history.** There are no reference images to commit or update.
* **Review on the pull request.** Visual changes become a pull request check that your team [approves or rejects](../learn/review-workflow/review-a-build.md).
* **Diff more than images.** The CLI also uploads text files such as JSON, HTML, or Markdown with `--files` — see [Compare non-image files](../learn/how-to-guides/visual-coverage/compare-non-image-files.md).

### Prerequisites

* Node.js 22 or later
* Your tests capture screenshots into a folder (e.g. `./screenshots`)
* Your tests run on CI
* [A project created in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Install the Argos CLI:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/cli
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/cli
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/cli
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/cli
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Set up CI

Run your tests, then upload the screenshots folder to Argos with the CLI:

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
        with:
          node-version: 22
      - run: npm ci
      - name: Run tests and capture screenshots
        run: npm test

      - name: Upload screenshots to Argos
        run: npm exec -- argos upload ./screenshots
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md) to avoid managing a secret. On other CI providers, set `ARGOS_TOKEN` as a secret environment variable. For GitLab CI, CircleCI, Buildkite, and other providers, see [Run Argos in CI](../learn/how-to-guides/ci-pipelines/run-argos-in-ci.md).

The CLI detects your CI context (commit, branch, pull request) automatically. See the [CLI reference](../sdks-reference/argos-command-line-interface-cli.md) for all options.
{% endstep %}
{% endstepper %}

### You're all set

Push your changes and open a pull request — the Argos check appears on it once the build is uploaded. Review the visual changes, approve or reject them, and merge with confidence.

{% hint style="info" %}
Argos needs a baseline to compare against. Until a build runs on your default branch, pull request builds are marked as [orphan](../learn/platform-fundamentals/baseline-build.md#orphan-builds). Merge this setup or run the workflow once on your default branch to establish the baseline.
{% endhint %}

### Frequently asked questions

<details>

<summary>How do I update the baseline after an intended change?</summary>

You don't update any file. Review the build in Argos and [approve the changes](../learn/review-workflow/review-a-build.md): an approved build is eligible as a baseline. Once you merge, the build on your default branch, which Argos approves automatically by default, becomes the baseline for the pull requests that follow. See [Baseline build](../learn/platform-fundamentals/baseline-build.md).

</details>

<details>

<summary>Why do screenshots differ between my machine and CI?</summary>

Fonts, text rendering, and browser versions depend on the operating system, so the same page renders slightly differently on macOS and on a Linux CI runner. The workflow above uploads screenshots only from CI, so Argos only compares screenshots captured on CI. Keep your CI on the same image and browser version from one run to the next. See [Browser glitches](../learn/reliability-and-flakiness/flaky-tests/browser-glitches.md) and [Stabilize screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md).

</details>

### Next steps

* [Stabilize screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [CLI reference](../sdks-reference/argos-command-line-interface-cli.md) – All upload options
* [Screenshot metadata](../sdks-reference/screenshot-metadata.md) – Enrich screenshots with context shown on the build page

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
