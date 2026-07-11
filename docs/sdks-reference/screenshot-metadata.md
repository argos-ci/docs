---
description: >-
  Attach metadata to screenshots with a companion JSON file to add context on
  the Argos build page.
---

# Screenshot metadata

Enrich your screenshots in Argos with metadata by adding a companion JSON file. This metadata appears on the build page and helps contextualize how and why a screenshot was generated.

### How it works

For each screenshot file, create a metadata file with the same name and the `.argos.json` suffix:

```
myscreenshot.png
myscreenshot.png.argos.json
```

The `.argos.json` file must be valid JSON following the Argos metadata schema.

{% hint style="info" %}
If you use an official Argos SDK like `@argos-ci/playwright`, `@argos-ci/cypress`, `@argos-ci/puppeteer`, or `@argos-ci/storybook`, the SDK generates and uploads this metadata for you. If you don't use an SDK, generate the metadata yourself and upload it with [`@argos-ci/cli`](argos-command-line-interface-cli.md) or [`@argos-ci/core`](node.js-sdk.md).
{% endhint %}

### Schema autocomplete

To enable autocompletion, type checking, and schema validation in editors like VS Code, add a `$schema` field at the top of your `.argos.json` file:

```json
{
  "$schema": "https://api.argos-ci.com/v2/screenshot-metadata.json"
}
```

### Top-level fields

| Field               | Type                                                            | Description                                                                             |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `$schema`           | `string?`                                                       | Ignored. Can be set to get completions, validations, and documentation in some editors. |
| `url`               | `string?`                                                       | The URL of the page that was screenshotted.                                             |
| `previewUrl`        | `string?`                                                       | A URL to an accessible preview of the screenshot.                                       |
| `viewport`          | [Viewport](screenshot-metadata.md#viewport)?                    | The viewport dimensions when the screenshot was taken.                                  |
| `colorScheme`       | `"light" \| "dark"`                                             | The color scheme when the screenshot was taken.                                         |
| `mediaType`         | `"screen" \| "print"`                                           | The media type when the screenshot was taken.                                           |
| `test`              | [Test](screenshot-metadata.md#test)?                            | Information about the test that generated the screenshot.                               |
| `browser`           | [Browser](screenshot-metadata.md#browser)?                      | The browser that generated the screenshot.                                              |
| `automationLibrary` | [Automation library](screenshot-metadata.md#automation-library) | The automation library that generated the screenshot. _(Required)_                      |
| `sdk`               | [SDK](screenshot-metadata.md#sdk)                               | The Argos SDK that generated the screenshot. _(Required)_                               |
| `story`             | [Story](screenshot-metadata.md#story)?                          | Storybook story metadata.                                                               |
| `tags`              | `string[]?`                                                     | Custom tags to categorize the screenshot.                                               |
| `transient`         | [Transient](screenshot-metadata.md#transient)?                  | Upload-time instructions, removed from the stored metadata.                             |

### Viewport

```json
{
  "width": 1280,
  "height": 720
}
```

* `width` (number): Width of the viewport.
* `height` (number): Height of the viewport.

### Test

```json
{
  "id": "test-id",
  "title": "should render homepage correctly",
  "titlePath": ["E2E", "Homepage"],
  "retries": 1,
  "retry": 0,
  "repeat": 0,
  "location": { "file": "tests/homepage.spec.ts", "line": 42, "column": 3 },
  "tags": ["@slow", "@regression"],
  "annotations": [
    {
      "type": "slow",
      "description": "Known performance issue",
      "location": { "file": "tests/homepage.spec.ts", "line": 40, "column": 1 }
    }
  ]
}
```

* `id` (string?): The unique identifier of the test.
* `title` (string): The title of the test.
* `titlePath` (string\[]): The hierarchy of titles leading to the test.
* `retries` (number?): Number of retries for the test.
* `retry` (number?): The current retry count.
* `repeat` (number?): The repeat count for the test.
* `location` ([Location](screenshot-metadata.md#location)?): Where the test is located in the source code.
* `tags` (string\[]?): Tags associated with the test (e.g. Playwright's [test tags](https://playwright.dev/docs/test-annotations#tag-tests)).
* `annotations` ([Test annotation](screenshot-metadata.md#test-annotation)\[]?): Extra information about the test.

### Location

```json
{
  "file": "src/components/Button.tsx",
  "line": 10,
  "column": 5
}
```

* `file` (string): The source file.
* `line` (number): The line number.
* `column` (number): The column number.

### Test annotation

```json
{
  "type": "skip",
  "description": "Flaky test",
  "location": { "file": "tests/button.spec.ts", "line": 12, "column": 1 }
}
```

* `type` (string): Type of annotation.
* `description` (string?): Optional explanation.
* `location` ([Location](screenshot-metadata.md#location)?): Where the annotation is located in the source code.

### Browser

```json
{
  "name": "chromium",
  "version": "112.0.0"
}
```

* `name` (string): Browser name.
* `version` (string): Browser version.

### Automation library

```json
{
  "name": "playwright",
  "version": "1.45.0"
}
```

* `name` (string): The name of the automation library (e.g. `playwright`, `cypress`).
* `version` (string): The version of the automation library.

### SDK

```json
{
  "name": "@argos-ci/playwright",
  "version": "2.0.0"
}
```

* `name` (string): The name of the Argos SDK.
* `version` (string): The version of the Argos SDK.

### Story

Storybook story metadata, set by the [Argos Storybook SDK](storybook.md).

```json
{
  "id": "button--primary",
  "tags": ["autodocs"],
  "mode": "dark",
  "play": true
}
```

* `id` (string): Unique ID of the story.
* `tags` (string\[]?): Tags attached to the story.
* `mode` (string?): The [story mode](../learn/how-to-guides/visual-coverage/storybook-story-modes.md) used for the capture.
* `play` (boolean?): True if the story has a play function.

### Transient

Upload-time instructions consumed by the Argos CLI and SDKs. Unlike the other fields, `transient` is not stored with the screenshot — the uploader reads it, applies it, and removes it from the metadata.

```json
{
  "transient": {
    "threshold": 0.8,
    "parentName": "folder/my-screenshot.png"
  }
}
```

* `threshold` (number?): Sensitivity threshold for this screenshot's comparison, between `0` and `1`.
* `baseName` (string?): Override the name used to find the comparison baseline.
* `parentName` (string?): Name of the parent snapshot — used to attach a file to another snapshot, for example an [ARIA snapshot](../learn/how-to-guides/visual-coverage/adding-aria-snapshots-manually.md) to its screenshot.

### Complete example

Here's a full example of `myscreenshot.png.argos.json`:

```json
{
  "url": "https://example.com/home",
  "viewport": { "width": 1280, "height": 720 },
  "colorScheme": "light",
  "mediaType": "screen",
  "tags": ["homepage", "desktop"],
  "test": {
    "title": "renders homepage correctly",
    "titlePath": ["E2E", "Homepage"],
    "tags": ["@regression"],
    "location": { "file": "tests/homepage.spec.ts", "line": 42, "column": 3 }
  },
  "browser": { "name": "chromium", "version": "112.0.0" },
  "automationLibrary": { "name": "playwright", "version": "1.45.0" },
  "sdk": { "name": "@argos-ci/playwright", "version": "2.0.0" }
}
```

### Notes

* Fields marked as **required** must be included.
* Unknown fields are ignored.
* Each screenshot can have its own metadata file.
