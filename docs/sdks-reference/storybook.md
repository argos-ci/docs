---
description: >-
  Reference for @argos-ci/storybook: capture stories with the Storybook Vitest
  addon or Test Runner, choose which stories are captured, set viewports,
  modes, and fit-to-content, and take screenshots in play functions.
---

# Storybook SDK reference (@argos-ci/storybook)

### Get started

To get started with Argos and Storybook, check out our Quickstart guides:

* [Storybook + Vitest](../quickstart/storybook-quickstart/)
* [Storybook + Test Runner](../quickstart/storybook-quickstart/storybook-test-runner-quickstart.md)
* [Storybook Legacy (\<v8)](../quickstart/storybook-quickstart/storybook-legacy-less-than-v8-quickstart.md)

### Compatibility

* **Storybook** 8 through 11, including the 11 pre-releases. The Vitest addon needs Storybook 9 or later; the Test Runner works from Storybook 8.
* **Vitest** 4 or later, with `@vitest/browser` and `@vitest/browser-playwright` 4 or later, when using the Vitest addon.
* **Node.js** 22 or later.

### Comparing Argos and Chromatic

While both Argos and Chromatic provide visual testing for Storybook, they take different approaches:

* **Argos** captures screenshots of your Storybook components **in your CI using Playwright**.
* **Chromatic** captures screenshots of your Storybook components **in the cloud**.

For a deeper comparison, see our [Argos vs Chromatic guide](https://argos-ci.com/compare/chromatic).

### Vitest vs Test Runner

Argos supports both [Vitest](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) and [Test Runner](https://storybook.js.org/docs/writing-tests/integrations/test-runner) for visual testing in Storybook.

Storybook recommends using Vitest for testing and Argos experience is also better if you use it. To learn more about the differences, see [Vitest vs Test Runner comparison guide](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon#comparison-to-the-test-runner).

### Interactions using the play function

The `play` function in Storybook lets you define interactions for your components, ensuring they are in a specific state before capturing a screenshot.

When running tests, either [Vitest](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) or [Test Runner](https://storybook.js.org/docs/writing-tests/integrations/test-runner) **automatically executes the `play` function** before taking a screenshot.

If you use Vitest, you can also take custom screenshots in your tests using the `argosScreenshot` function:

```ts
import { argosScreenshot } from "@argos-ci/storybook/vitest";

export const FormStory: Story = {
  play: async (ctx) => {
    const { canvasElement } = ctx;

    // Take a screenshot before filling the form
    await argosScreenshot(ctx, "before-fill");

    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByLabelText("Email", { selector: "input" }),
      "example-email@email.com",
      { delay: 100 },
    );

    // Take a screenshot after filling the form
    await argosScreenshot(ctx, "after-fill");

    await userEvent.click(canvas.getByRole("button"));
  },
};
```

### Story Modes

Argos supports Story modes to capture different states of your components. Read our [Story modes guide](../learn/how-to-guides/visual-coverage/storybook-story-modes.md) for more details.

### Viewports

Argos captures a story at the viewport selected by its `viewport` global, whether the global comes from a [story mode](../learn/how-to-guides/visual-coverage/storybook-story-modes.md) or from the story’s own `globals`. The value is resolved against `parameters.viewport.options` (`parameters.viewport.viewports` on Storybook 8):

* `"compact"`: a key of the viewport options.
* `{ value: "compact", isRotated: true }`: Storybook’s global format, where `isRotated` swaps the width and height.
* `800`: a number is used as the width.

When no viewport matches, the story is captured at the test browser’s default size.

### Fit to Content vs Page

By default, Argos screenshots are cropped to fit the rendered component (`fitToContent: true`). You can capture the entire page instead by setting `argos.parameters.fitToContent` to `false`.

#### Per Story

`src/components/ProductPage/ProductPage.stories.js`

```ts
import { ProductPage } from "./ProductPage";

export default {
  title: "Pages/ProductPage",
  component: ProductPage,
  parameters: {
    argos: {
      fitToContent: false,
    },
  },
};
```

#### Project-Wide Setting

`.storybook/preview.js`

```ts
const preview = {
  parameters: {
    argos: {
      fitToContent: false,
    },
  },
};

export default preview;
```

#### Options

* **`fitToContent`**: Adjusts the screenshot to the content size (default: `true`).
* **`fitToContent.padding`**: Sets padding around the content in pixels (default: `16`).
* **`fitToContent.zoom`**: Specifies the zoom level (default: `2`).

### Choose which stories are captured

With the Vitest addon, Argos takes a screenshot after each story test that `@storybook/addon-vitest` runs. A story that doesn't run as a test is not captured. Argos has no parameter of its own to skip a story: `parameters.argos` only reads `modes` and `fitToContent`, and Chromatic's `disableSnapshot` is not supported. Use Storybook's test filters instead.

#### Exclude stories with tags

Remove the built-in `test` tag from a story with `tags: ["!test"]`, or give it a custom tag and exclude that tag in `storybookTest()`:

{% code title="Button.stories.ts" %}
```ts
export const Playground: Story = {
  tags: ["no-visual"],
};
```
{% endcode %}

{% code title="vitest.config.ts" %}
```ts
storybookTest({
  configDir: path.join(dirname, ".storybook"),
  tags: { include: ["test"], exclude: ["no-visual"] },
}),
```
{% endcode %}

An excluded story is not tested at all, so it also loses its smoke test and its `play` function assertions. See [Including, excluding, or skipping tests](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon#including-excluding-or-skipping-tests) in the Storybook docs.

#### Skip the screenshot but keep the test

To keep testing every story, run Argos in a Vitest project of its own. One project runs every story test, the other runs the stories you want captured, with the Argos plugin:

{% code title="vitest.config.ts" %}
```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { argosVitestPlugin } from "@argos-ci/storybook/vitest-plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Browser settings from the quickstart, as a fresh object for each project.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright({
    launchOptions: {
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  }),
  instances: [{ browser: "chromium" as const }],
});

export default defineConfig({
  test: {
    projects: [
      {
        // Every story test, no screenshots.
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: { name: "storybook", browser: browser() },
      },
      {
        // Screenshots of the stories without the `no-visual` tag.
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
            tags: { include: ["test"], exclude: ["no-visual"] },
          }),
          argosVitestPlugin({ uploadToArgos: !!process.env.CI }),
        ],
        test: { name: "storybook-visual", browser: browser() },
      },
    ],
  },
});
```
{% endcode %}

Run `npx vitest run --project=storybook-visual` to capture the screenshots. When you run both projects, the captured stories render twice, once per project.

If your stories use [modes](../learn/how-to-guides/visual-coverage/storybook-story-modes.md), a story whose modes are all disabled is not captured either, and its test still runs.

#### Capture one folder

Vitest only runs the test files whose path contains the filter you pass on the command line, and with the Vitest addon your story files are the test files:

```bash
npx vitest run --project=storybook src/components
```

To narrow a project for good, point `storybookTest({ configDir })` at a Storybook configuration whose `stories` globs only cover that folder. The addon tests the stories listed there and ignores Vitest's `test.include`.

If only some runs capture part of your stories, for example on pull requests, mark those builds as [subset builds](../learn/how-to-guides/ci-pipelines/subset-builds.md) so the stories you didn't capture are not reported as removed.

#### With Test Runner

`argosScreenshot` only runs where you call it, so return early in `postVisit` for the stories you don't want captured. Their tests still run:

{% code title=".storybook/test-runner.ts" %}
```ts
import { getStoryContext, type TestRunnerConfig } from "@storybook/test-runner";
import { argosScreenshot } from "@argos-ci/storybook/test-runner";

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    if (storyContext.tags.includes("no-visual")) {
      return;
    }
    await argosScreenshot(page, context);
  },
};

export default config;
```
{% endcode %}

To leave stories out of the test run entirely, use the Test Runner's `tags` option or its `--includeTags`, `--excludeTags` and `--skipTags` flags. See [Filter tests](https://storybook.js.org/docs/writing-tests/integrations/test-runner#experimental-filter-tests) in the Storybook docs.

### Where screenshots are saved and uploaded

The Vitest plugin writes every screenshot to `./screenshots`, relative to the directory you run Vitest from. Change it with the `root` option. Screenshots are written whether or not they are uploaded, so you can open them locally.

The plugin uploads them to Argos at the end of the run only when `uploadToArgos` is `true`. If you leave it out, nothing is uploaded. The quickstart sets `uploadToArgos: !!process.env.CI` to upload from CI only. A few more rules:

* Nothing is uploaded in watch mode.
* The upload includes every screenshot in the directory. The plugin doesn't empty it between runs, so files left by an earlier run are uploaded too.
* A failed upload fails the run (exit code 1). Set `ignoreUploadFailures: true` to keep the run passing when the upload fails.

With Test Runner, `argosScreenshot` also writes to `./screenshots`, and you upload the directory with `argos upload ./screenshots`. See the [Test Runner quickstart](../quickstart/storybook-quickstart/storybook-test-runner-quickstart.md).

### Capture several browsers

Screenshot names come from the story ID (and the mode), not from the browser. If one Vitest project lists several browser `instances`, they write the same files and overwrite each other, so capturing several browsers in one build is not supported.

Run Vitest once per browser instead, and give each run its own `buildName` and `root`. Each browser then gets its own Argos build and baseline, and no run uploads another one's files:

{% code title="vitest.config.ts" %}
```ts
// BROWSER=firefox npx vitest run --project=storybook
const browserName = (process.env.BROWSER ?? "chromium") as
  | "chromium"
  | "firefox"
  | "webkit";

// In the Storybook project:
argosVitestPlugin({
  uploadToArgos: !!process.env.CI,
  buildName: `storybook-${browserName}`,
  root: `./screenshots/${browserName}`,
}),
// and in its browser settings:
// instances: [{ browser: browserName }],
```
{% endcode %}

See [Monorepos setup](../learn/how-to-guides/ci-pipelines/monorepos-setup.md) for how build names split builds.

### Troubleshooting

#### My addon is not working with Vitest

To be sure that your addons are properly loaded when running Vitest, be sure to specify your addon annotations in `setProjectAnnotations`:

**Example for `storybook-addon-pseudo-states`**:

```ts
import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";
import * as addonAnnotations from "storybook-addon-pseudo-states/preview";

setProjectAnnotations([projectAnnotations, addonAnnotations]);
```

Read more in the [Storybook documentation](https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations).

### API Overview

#### `@argos-ci/storybook/vitest-plugin`

Exposes the Vitest plugin to capture screenshots of your Storybook stories during tests.

```ts
import { argosVitestPlugin } from "@argos-ci/storybook/vitest-plugin";
import { defineConfig } from "vitest/config";
export default defineConfig({
  plugins: [
    argosVitestPlugin({
      uploadToArgos: !!process.env.CI, // Upload from CI only
      buildName: "My Build Name", // Optional build name
    }),
  ],
});
```

* **`uploadToArgos`**: Upload the screenshots to Argos at the end of the run. Nothing is uploaded unless you set it to `true`.
* **`root`**: Directory where screenshots are written, relative to the working directory. Defaults to `./screenshots`.
* **`buildName`**: Name of the Argos build, to [split builds](../learn/how-to-guides/ci-pipelines/monorepos-setup.md).
* **`ignoreUploadFailures`**: Don't fail the run when the upload fails. Defaults to `false`.
* **`stabilize`**: Same as in Playwright, except that the automatic screenshots of your stories don't wait for `aria-busy` unless you set `stabilize: { waitForAriaBusy: true }`. See [Wait for loading](../learn/reliability-and-flakiness/flaky-tests/wait-for-loading.md#storybook).

Also supports all options from the [Playwright `argosScreenshot` function](playwright.md#argosscreenshothandler-name-options) except `viewports` (use [viewports](#viewports) and [modes](../learn/how-to-guides/visual-coverage/storybook-story-modes.md) instead), and all [upload parameters](https://js-sdk-reference.argos-ci.com/interfaces/UploadParameters.html). See [Where screenshots are saved and uploaded](#where-screenshots-are-saved-and-uploaded).

#### `@argos-ci/storybook/vitest`

Take a screenshot of the Story inside the `play` function of a Storybook story (only available when using Vitest).

```ts
import { argosScreenshot } from "@argos-ci/storybook/vitest";

export const Example: Story = {
  play: async (ctx) => {
    // Take a screenshot of the story
    await argosScreenshot(ctx, "example-screenshot");
  },
};
```

* **`ctx`**: The Storybook context provided to the `play` function.
* **`name`**: A name for the screenshot.

#### `@argos-ci/storybook/test-runner`

#### argosScreenshot(page, context\[, options])

Take a screenshot of the Story inside the `postVisit` hook of the Storybook Test Runner.

```ts
import { type TestRunnerConfig } from "@storybook/test-runner";
import { argosScreenshot } from "@argos-ci/storybook/test-runner";

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    await argosScreenshot(page, context);
  },
};

export default config;
```

* **`page`**: The [Playwright Page](https://playwright.dev/docs/api/class-page) instance.
* **`context`**: The test context provided by the Storybook test runner.
* **`options`**: Customizable options for `argosScreenshot`. Explore [available options](playwright.md#argosscreenshothandler-name-options); `viewports` is not supported. As with the Vitest plugin, waiting for `aria-busy` is off unless you set `stabilize: { waitForAriaBusy: true }`.

### Additional Resources

* [Quickstart with Argos + Storybook + Vitest](../quickstart/storybook-quickstart/)
* [Quickstart with Argos + Storybook Test Runner](../quickstart/storybook-quickstart/storybook-test-runner-quickstart.md)
* [Quickstart with Argos + Storybook Legacy (\<v8)](../quickstart/storybook-quickstart/storybook-legacy-less-than-v8-quickstart.md)
* [Argos + Storybook Test Runner example](https://github.com/argos-ci/argos-javascript/tree/main/examples/storybook-test-runner)
* [Argos + Storybook Vitest example](https://github.com/argos-ci/argos-javascript/tree/main/examples/storybook-vitest)
* [@argos-ci/storybook on GitHub](https://github.com/argos-ci/argos-javascript/tree/main/packages/storybook)
* [@argos-ci/storybook on npm](https://www.npmjs.com/package/@argos-ci/storybook)
