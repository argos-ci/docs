---
description: Upload and diff text-based artifacts like JSON, HTML, Markdown, and CSS in Argos using the CLI files option.
---

# Compare non-image files

Argos can compare more than screenshots. With the CLI, you can upload text-based artifacts such as API snapshots, generated HTML, Markdown files, CSS output, JavaScript bundles, XML documents, YAML files, or JSON fixtures and review their changes in Argos.

![Compare non-image files in Argos](<../../../.gitbook/assets/json comparison d95543132bde0693cbb86877d840113a.png>)

### Upload non-image files

Use the `-f` or `--files` option to tell the CLI which files to upload:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos upload -f "**/*.{txt,json,yaml,yml,xml,html,md,css,js}" ./snapshots
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos upload -f "**/*.{txt,json,yaml,yml,xml,html,md,css,js}" ./snapshots
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos upload -f "**/*.{txt,json,yaml,yml,xml,html,md,css,js}" ./snapshots
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos upload -f "**/*.{txt,json,yaml,yml,xml,html,md,css,js}" ./snapshots
```
{% endtab %}
{% endtabs %}

The `-f` option replaces the default screenshot glob. If you want to upload screenshots and non-image files in the same build, include both patterns:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos upload -f "**/*.{png,jpg,jpeg}" "**/*.{txt,json,yaml,yml,xml,html,md,css,js}" ./snapshots
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos upload -f "**/*.{png,jpg,jpeg}" "**/*.{txt,json,yaml,yml,xml,html,md,css,js}" ./snapshots
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos upload -f "**/*.{png,jpg,jpeg}" "**/*.{txt,json,yaml,yml,xml,html,md,css,js}" ./snapshots
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos upload -f "**/*.{png,jpg,jpeg}" "**/*.{txt,json,yaml,yml,xml,html,md,css,js}" ./snapshots
```
{% endtab %}
{% endtabs %}

Use stable file names and paths so Argos can match each uploaded file with its baseline on future builds.

### Supported content types

Argos currently supports these non-image content types:

* `text/plain`
* `application/json`
* `application/yaml`
* `text/yaml`
* `application/xml`
* `text/xml`
* `text/html`
* `text/markdown`
* `text/css`
* `application/javascript`
* `text/javascript`

### Framework support

Non-image comparisons are only supported through the CLI for now. [Contact us](https://argos-ci.com/contact) if you are interested in using this feature from a test framework like Vitest.
