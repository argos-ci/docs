---
description: Set up visual testing with any test framework by uploading screenshots with the Argos CLI.
---

# Any test framework

Argos works with any tool that produces screenshots. If your framework has no dedicated Argos SDK, capture screenshots however you like and upload the folder with the Argos CLI.

### Prerequisites

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
      - run: npm ci
      - name: Run tests and capture screenshots
        run: npm test

      - name: Upload screenshots to Argos
        run: npm exec -- argos upload ./screenshots
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md) to avoid managing a secret. On other CI providers, set `ARGOS_TOKEN` as a secret environment variable.

The CLI detects your CI context (commit, branch, pull request) automatically. See the [CLI reference](../sdks-reference/argos-command-line-interface-cli.md) for all options.
{% endstep %}
{% endstepper %}

### You're all set

Push your changes and open a pull request — the Argos check appears on it once the build is uploaded. Review the visual changes, approve or reject them, and merge with confidence.

{% hint style="info" %}
Argos needs a baseline to compare against. Until a build runs on your default branch, pull request builds are marked as [orphan](../learn/platform-fundamentals/baseline-build.md#orphan-builds). Merge this setup or run the workflow once on your default branch to establish the baseline.
{% endhint %}

### Next steps

* [Stabilize screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [CLI reference](../sdks-reference/argos-command-line-interface-cli.md) – All upload options
* [Screenshot metadata](../sdks-reference/screenshot-metadata.md) – Enrich screenshots with context shown on the build page

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
