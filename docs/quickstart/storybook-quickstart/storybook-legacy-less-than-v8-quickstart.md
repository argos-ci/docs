---
description: Learn how to setup visual testing in a Storybook (<v8) using Argos.
---

# Storybook Legacy (\<v8) Quickstart

To integrate Argos with a legacy version of Storybook (`<v8`), you have to use [Storycap](https://github.com/reg-viz/storycap) to crawl your Storybook and capture screenshots of your components.

### Prerequisites

To get the most out of this guide, you'll need to:

* [Use Storybook < v8](https://storybook.js.org/docs/get-started/install)
* [Create your project in Argos](https://app.argos-ci.com/new)

{% hint style="info" %}
If use a recent version of Storybook (`>v8`), follow our [modern Storybook guide](./).
{% endhint %}

{% stepper %}
{% step %}
### Install

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

Read the [CLI documentation](../../sdks-reference/argos-command-line-interface-cli.md) if you need information about advanced usages.
{% endstep %}

{% step %}
### Capture screenshots

There are two ways to capture screenshots of your Storybook:

* If your Storybook is running and accessible via an URL, add this command to your CI pipeline to capture screenshots of your stories:

```sh
# Capture screenshots of your stories
npm exec -- storycap <STORYBOOK-URL> --outDir ./screenshots
```

* If your Storybook is not deployed, you need to serve your Storybook before capturing the screenshots. Use the following commands:

```sh
# Build Storybook
npm exec -- storybook build --output-dir ./storybook-static

# Screenshot Storybook with Storycap
npm exec -- storycap --serverCmd "npx http-server ./storybook-static --port 6006" http://127.0.0.1:6006/ --outDir ./screenshots
```

Read the [Storycap documentation](https://github.com/reg-viz/storycap) to learn more about the installation and advanced usages.

Add `./screenshots` to your `.gitignore` file, to avoid uploading screenshots to your Git repository.
{% endstep %}

{% step %}
### Upload screenshots on CI

Add this command to your CI pipeline to upload the screenshots to Argos.

```
npm exec -- argos upload --token <ARGOS_TOKEN> ./screenshots
```

Note: the value of `ARGOS_TOKEN` is available in your project settings on Argos.
{% endstep %}
{% endstepper %}

### Congratulations on installing Argos! 👏

After committing and pushing your changes, the Argos check status will appear on your pull request in GitHub (or GitLab).

**Note:** you need a reference build to compare your changes with. If you don't have one, builds will remain orphan until you run Argos on your reference branch.

You can now review changes of your app for each pull request, avoid visual bugs and merge with confidence. Welcome on board!

### Next step: keep your screenshots stable

Now that Argos is running, the next thing to learn is how to keep your screenshots free of flakiness. Read [Best practices for stable screenshots](../../learn/reliability-and-flakiness/flaky-tests/README.md) to avoid false positives before they reach your pull requests.

### Additional resources

* [Argos + Storybook legacy example](https://github.com/argos-ci/argos-javascript/tree/main/examples/storybook-legacy)
* [Storycap documentation](https://github.com/reg-viz/storycap)
* [Storybook documentation](https://storybook.js.org/docs)

***

[Join our Discord](https://argos-ci.com/discord), [submit an issue on GitHub](https://github.com/argos-ci/argos/issues) or just [send an email](mailto:contact@argos-ci.com) if you need help.
