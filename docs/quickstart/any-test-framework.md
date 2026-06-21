---
description: Learn how to setup visual testing using Argos SDK.
---

# Any test framework

### Prerequisites

To get the most out of this guide, you’ll need to:

* Take screenshots while your E2E tests are running
* Run your E2E tests on CI
* [Create your project in Argos](https://app.argos-ci.com/new)

{% stepper %}
{% step %}
### Install

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

Read the [CLI documentation](../sdks-reference/argos-command-line-interface-cli.md) if you need information about advanced usages.
{% endstep %}

{% step %}
### Upload screenshots on CI

Add this command to your CI pipeline to upload the screenshots to Argos.

```
npm exec -- argos upload --token <ARGOS_TOKEN> ./screenshots
```

Note: The value of `ARGOS_TOKEN` is available your project settings on Argos.
{% endstep %}
{% endstepper %}

### Congratulations on installing Argos! 👏

After committing and pushing your changes, the Argos check status will appear on your pull request in GitHub (or GitLab).

**Note:** you need a reference build to compare your changes with. If you don't have one, builds will remain orphan until you run Argos on your reference branch.

You can now review changes of your app for each pull request, avoid visual bugs and merge with confidence. Welcome on board!

### Next step: keep your screenshots stable

Now that Argos is running, the next thing to learn is how to keep your screenshots free of flakiness. Read [Best practices for stable screenshots](../learn/reliability-and-flakiness/flaky-tests/README.md) to avoid false positives before they reach your pull requests.

### Additional resources

* [Argos CLI reference](../sdks-reference/argos-command-line-interface-cli.md)
* [Enrich screenshots with metadata](../learn/how-to-guides/visual-coverage/adding-screenshot-metadata.md)

[Join our Discord](https://argos-ci.com/discord), [submit an issue on GitHub](https://github.com/argos-ci/argos/issues) or just [send an email](mailto:contact@argos-ci.com) if you need help.
