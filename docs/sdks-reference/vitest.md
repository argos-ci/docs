---
description: >-
  Integrate visual testing into your Vitest browser tests with Argos. Capture
  screenshots and snapshots and review visual changes directly within your CI.
---

# Vitest

The `@argos-ci/vitest` SDK captures Argos screenshots directly from your [Vitest browser tests](https://vitest.dev/guide/browser/), and snapshots of any serializable value from either browser or Node tests.

### Get started

To get started with Argos and Vitest, follow our [Vitest Quickstart](../quickstart/vitest-quickstart.md).

{% hint style="info" %}
Using **Storybook**? The [Storybook SDK](storybook.md) builds on this same Vitest integration. Follow the [Storybook Quickstart](../quickstart/storybook-quickstart/) instead.
{% endhint %}

### Requirements

Install `@argos-ci/vitest`:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/vitest
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/vitest
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/vitest
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/vitest
```
{% endtab %}
{% endtabs %}

Capturing **screenshots** requires [Vitest browser mode](https://vitest.dev/guide/browser/) with the [Playwright provider](https://vitest.dev/guide/browser/playwright). Install these peer dependencies as well:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev vitest @vitest/browser @vitest/browser-playwright playwright
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev vitest @vitest/browser @vitest/browser-playwright playwright
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev vitest @vitest/browser @vitest/browser-playwright playwright
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev vitest @vitest/browser @vitest/browser-playwright playwright
```
{% endtab %}
{% endtabs %}

**Snapshots** (`argosSnapshot`) run in any Vitest test—browser or Node—and require none of the browser-mode dependencies.

### Capturing screenshots

Use the `argosScreenshot` function to capture a screenshot during a browser test. It requires the Argos Vitest plugin to be registered in your config (see [`argosVitestPlugin`](#argosvitestplugin) below).

```ts
import { test } from "vitest";
import { render } from "vitest-browser-react";
import { argosScreenshot } from "@argos-ci/vitest";
import { Button } from "./Button";

test("Button", async () => {
  render(<Button>Click me</Button>);
  await argosScreenshot("button");
});
```

Screenshots are written to the `./screenshots` directory by default and uploaded by the plugin when `uploadToArgos` is enabled.

### Capturing snapshots

`argosSnapshot` captures a snapshot of **any value**—not just a screenshot—and uploads it to Argos to diff across builds, mimicking [Vitest snapshots](https://vitest.dev/guide/snapshot). Unlike `argosScreenshot`, it does **not** need a browser and works in **both** browser and Node tests.

Strings are written verbatim; any other value is serialized with [`@vitest/pretty-format`](https://www.npmjs.com/package/@vitest/pretty-format) (the serializer Vitest itself uses).

```ts
import { test } from "vitest";
import { argosSnapshot } from "@argos-ci/vitest";

test("API response", async () => {
  const user = await fetchUser();
  // Objects are serialized automatically.
  await argosSnapshot("user", user);
});
```

Use the `extension` option to control how Argos renders and diffs the snapshot, and `tag` to attach tags:

```ts
await argosSnapshot("config", JSON.stringify(config, null, 2), {
  extension: ".json",
  tag: "config",
});
```

Snapshots are written to the same folder as screenshots and uploaded by the plugin when `uploadToArgos` is enabled.

### API Overview

#### `argosVitestPlugin(options)`

Registers the `argosScreenshot`/`argosSnapshot` browser commands and, when `uploadToArgos` is enabled, the reporter that uploads captured files to Argos. Import it from `@argos-ci/vitest/plugin` and add it to your Vitest config.

```ts
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { argosVitestPlugin } from "@argos-ci/vitest/plugin";

export default defineConfig({
  plugins: [
    argosVitestPlugin({
      // Upload the captured files to Argos at the end of the run.
      uploadToArgos: process.env.CI === "true",
    }),
  ],
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
```

* **`uploadToArgos`**: Upload the captured files to Argos at the end of the run (default: `false`).
* **`root`**: Folder where screenshots and snapshots are written (default: `"./screenshots"`).

The plugin also accepts every option supported by the [Playwright `argosScreenshot` function](playwright.md#argosscreenshotpage-name-options)—including non-serializable ones like `beforeScreenshot` and `afterScreenshot`—and all [upload parameters](https://js-sdk-reference.argos-ci.com/interfaces/UploadParameters.html). These act as defaults for every screenshot and can be overridden per call.

#### `argosScreenshot(name, options?)`

Take a screenshot in a Vitest browser test. Import it from `@argos-ci/vitest`.

```ts
import { argosScreenshot } from "@argos-ci/vitest";

await argosScreenshot("button");
```

* **`name`**: A unique name for the screenshot.
* **`options`**: Serializable screenshot options (see below).

{% hint style="info" %}
Per-call options cross the Vitest browser/Node boundary, so they must be JSON-serializable. Non-serializable options (`beforeScreenshot`, `afterScreenshot`, a `Locator`/`ElementHandle` `element`, …) can only be set on the plugin.
{% endhint %}

Available options:

* **`element`**: String selector of the element to screenshot.
* **`viewports`**: Array of [viewports](../learn/how-to-guides/visual-coverage/responsive-viewports.md) to capture.
* **`fullPage`**: Capture the full page instead of fitting the screenshot to the content (default: `false`).
* **`argosCSS`**: Custom CSS evaluated during the screenshot process.
* **`threshold`**: Sensitivity threshold between `0` and `1`. The higher the threshold, the less sensitive the diff (default: `0.5`).
* **`tag`**: A [tag](../learn/review-workflow/tags.md) or array of tags to attach to the screenshot.
* **`ariaSnapshot`**: Capture an [ARIA snapshot](../learn/how-to-guides/visual-coverage/adding-aria-snapshots-manually.md) along with the screenshot (default: `false`).
* **`disableHover`**: Disable hover effects by moving the mouse to the top-left corner (default: `true`).
* **`stabilize`**: Wait for the UI to stabilize before taking the screenshot. Set to `false` to disable or pass an object to customize it (default: `true`).

#### `argosSnapshot(name, content, options?)`

Take a snapshot of any serializable value. Works in both browser and Node tests. Import it from `@argos-ci/vitest`.

```ts
import { argosSnapshot } from "@argos-ci/vitest";

await argosSnapshot("user", user);
```

* **`name`**: A unique name for the snapshot.
* **`content`**: The value to snapshot. Strings are written as-is; any other value is serialized.
* **`options`**: Snapshot options (see below).

Available options:

* **`root`**: Folder where the snapshot is written. In Node tests it defaults to `"./screenshots"`; in browser tests it defaults to the plugin `root`.
* **`extension`**: Extension of the snapshot file. It also determines how Argos renders and diffs the snapshot, e.g. `.txt`, `.json`, `.yml`, `.html`, `.md` (default: `".txt"`).
* **`tag`**: A [tag](../learn/review-workflow/tags.md) or array of tags to attach to the snapshot.
* **`serialize`**: Custom serializer used when `content` is not already a string. Defaults to `@vitest/pretty-format`.

### Additional Resources

* [Vitest Quickstart](../quickstart/vitest-quickstart.md)
* [@argos-ci/vitest on npm](https://www.npmjs.com/package/@argos-ci/vitest)
* [@argos-ci/vitest on GitHub](https://github.com/argos-ci/argos-javascript/tree/main/packages/vitest)
* [Vitest browser mode documentation](https://vitest.dev/guide/browser/)
