---
description: Set up visual testing in a legacy Storybook (<v8) with Storycap and the Argos CLI.
---

# Storybook Legacy (\<v8) Quickstart

Set up Argos with a legacy version of Storybook (\<v8) using [Storycap](https://github.com/reg-viz/storycap): Storycap crawls your Storybook and captures a screenshot of each story, then the Argos CLI uploads them.

{% hint style="info" %}
If you use Storybook v8 or later, follow the [Storybook Quickstart](README.md) instead.
{% endhint %}

### Prerequisites

* [Storybook \<v8](https://storybook.js.org/docs/get-started/install) set up in your project
* [A project created in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

Install the Argos CLI and Storycap:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/cli storycap
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/cli storycap
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/cli storycap
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/cli storycap
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Capture screenshots

There are two ways to capture screenshots of your Storybook.

If your Storybook is already running and accessible via a URL, point Storycap at it:

```bash
npm exec -- storycap <STORYBOOK-URL> --outDir ./screenshots
```

If it isn't deployed, build and serve it before capturing:

```bash
# Build Storybook
npm exec -- storybook build --output-dir ./storybook-static

# Screenshot Storybook with Storycap
npm exec -- storycap --serverCmd "npx http-server ./storybook-static --port 6006" http://127.0.0.1:6006/ --outDir ./screenshots
```

Read the [Storycap documentation](https://github.com/reg-viz/storycap) for advanced usage.

Screenshots are written to the `./screenshots` directory. Add `./screenshots` to your `.gitignore` file to avoid committing them.
{% endstep %}

{% step %}
### Set up CI

Add a workflow that captures the screenshots and uploads them to Argos. If you use another CI provider, adapt the steps accordingly:

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

      - name: Build Storybook
        run: npm exec -- storybook build --output-dir ./storybook-static

      - name: Capture screenshots with Storycap
        run: npm exec -- storycap --serverCmd "npx http-server ./storybook-static --port 6006" http://127.0.0.1:6006/ --outDir ./screenshots

      - name: Upload screenshots to Argos
        run: npm exec -- argos upload ./screenshots
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

`ARGOS_TOKEN` is the project token from **Settings → General → Token**. On GitHub Actions, you can also use [OIDC or tokenless authentication](../../learn/integrations/github-actions-authentication.md) to avoid managing a secret.
{% endstep %}
{% endstepper %}

### You're all set

Push your changes and open a pull request — the Argos check appears on it once the build is uploaded. Review the visual changes, approve or reject them, and merge with confidence.

{% hint style="info" %}
Argos needs a baseline to compare against. Until a build runs on your default branch, pull request builds are marked as [orphan](../../learn/platform-fundamentals/baseline-build.md#orphan-builds). Merge this setup or run the workflow once on your default branch to establish the baseline.
{% endhint %}

### Next steps

* [Stabilize screenshots](../../learn/reliability-and-flakiness/flaky-tests/README.md) – Prevent flaky diffs before they reach your pull requests
* [CLI reference](../../sdks-reference/argos-command-line-interface-cli.md) – All upload options
* [Storybook legacy example](https://github.com/argos-ci/argos-javascript/tree/main/examples/storybook-legacy) – A complete working setup

***

Need help? [Join our Discord](https://argos-ci.com/discord), [open an issue on GitHub](https://github.com/argos-ci/argos/issues), or [send us an email](mailto:contact@argos-ci.com).
