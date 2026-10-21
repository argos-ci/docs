---
description: >-
  Reference for @argos-ci/playwright: the Argos reporter, argosScreenshot
  options and stabilization, ARIA snapshots, sharding, and trace uploads for
  Playwright visual tests.
---

# Playwright SDK reference (@argos-ci/playwright)

### Get started

Please refer to our [Quickstart guide](../quickstart/playwright-quickstart.md) to get started with Argos and Playwright.

### Compatibility

* **Playwright**: `@argos-ci/playwright` declares no peer dependency on Playwright; it runs with the `@playwright/test` installed in your project.
* **Node.js** 22 or later.

### Setup Visual Testing

Argos presents a significant advantage over traditional Playwright visual tests with its streamlined approach to managing and reviewing test results:

* **Visual Testing on CI**: With Argos, there's no need to run tests locally or commit screenshots to your repository. This not only saves time but also keeps your repository clean and focused on code rather than binary assets.
* **Fluid UI for Comparison**: Argos intuitive interface makes it easy to spot discrepancies and understand visual changes without the need for cumbersome manual checks.
* **Enhanced Stabilization**: The Argos integration with Playwright takes visual testing to the next level by ensuring stability and consistency in the screenshots captured. Fonts, images, animations, loaders, everything is just stable.

To enable Visual Testing with Playwright, first you have to setup the Argos reporter in your Playwright config

{% code title="playwright.config.ts" %}
```ts
import { defineConfig } from "@playwright/test";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({
  // ... other configurations

  use: {
    // Reduce text rendering differences between machines.
    launchOptions: {
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  },

  // Setup Argos reporter to send screenshots and traces to Argos.
  reporter: [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],

    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      // Upload only on CI.
      createArgosReporterOptions({ uploadToArgos: !!process.env.CI }),
    ],
  ],
});
```
{% endcode %}

{% hint style="success" %}
The `launchOptions` above disable subpixel text and font hinting, which reduces text rendering differences between your machine and CI. This prevents one of the most common causes of flaky screenshots. The Argos reporter warns you at startup if these flags are missing from a Chromium project — learn why in [Stabilize text rendering](../learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering.md).
{% endhint %}

And use `argosScreenshot` helper to capture stable screenshots in your E2E tests:

{% code title="tests/example.spec.ts" %}
```ts
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

test("screenshot homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await argosScreenshot(page, "homepage");
});
```
{% endcode %}

### Setup Tests Debugging

The Argos Playwright reporter automatically reports failure screenshots and playwright traces. You can access them directly in Argos UI. If you are tired to download traces from artifact and run a command to see them, it is the solution for you.

* **Failure Screenshots**: View failure screenshots from your CI tests directly in Argos. No extra steps, just immediate clarity where you need it most.
* **Playwright Traces**: “Time travel” through your failing tests with remote Playwright traces. Gain a complete, step-by-step visual journey to the heart of any test issue.

{% hint style="info" %}
Each uploaded snapshot — including screenshots and Playwright traces — is limited to 50 MB. See [Snapshot size limit](argos-command-line-interface-cli.md#snapshot-size-limit).
{% endhint %}

To enable Test Debugging, you have to add Argos reporter and to turn on [Playwright test use options](https://playwright.dev/docs/test-use-options) in your Playwright config:

{% code title="playwright.config.ts" %}
```ts
import { defineConfig } from "@playwright/test";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({
  // ... other configurations

  // Setup Argos reporter to send screenshots and traces to Argos.
  reporter: [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],

    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      // Upload only on CI.
      createArgosReporterOptions({ uploadToArgos: !!process.env.CI }),
    ],
  ],

  // Setup recording option to enable test debugging features.
  use: {
    // Collect trace when retrying the failed test.
    trace: "on-first-retry",

    // Capture screenshot after each test failure.
    screenshot: "only-on-failure",
  },
});
```
{% endcode %}

### Tests Sharding

Argos integrates with [Playwright test sharding](https://playwright.dev/docs/test-sharding), enabling efficient test distribution without the need for manual configuration. [Argos Sharding/Parallel mode](../learn/how-to-guides/ci-pipelines/parallel-testing-sharding.md) is automatically configured for you.

Argos also supports [Currents orchestration](https://currents.dev/) using [Argos parallel + finalize](../learn/how-to-guides/ci-pipelines/parallel-testing-sharding.md).

### Where screenshots are saved

* **With the Argos reporter**, `argosScreenshot` writes each screenshot to an `argos` folder inside the test's Playwright output directory (`test-results/` by default). At the end of the run, the reporter uploads them to Argos, unless `uploadToArgos` is `false`.
* **Without the reporter**, screenshots are written to `./screenshots`, or to the folder set with the `root` option. Upload that folder with the [Argos CLI](argos-command-line-interface-cli.md): `argos upload ./screenshots`.

Taking screenshots never needs an Argos token. Only the upload authenticates, with `ARGOS_TOKEN` or, on GitHub Actions, with [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md).

### Helper Attributes for Visual Testing

For tailored visual testing, the `data-visual-test` attributes provide control over how elements appear in Argos screenshots. This can be especially useful for obscuring or modifying elements with dynamic content, like dates.

* `[data-visual-test="transparent"]`: Renders the element transparent (`opacity: 0`), keeping its layout space.
* `[data-visual-test="removed"]`: Removes the element from view (`display: none`).
* `[data-visual-test="blackout"]`: Covers the element with Playwright's screenshot mask. See [Mask elements](#mask-elements).
* `[data-visual-test-no-radius]`: Strips the border radius from the element.

**Example: Using a helper attribute to hide a div from the captured screenshot:**

```html
<div id="clock" data-visual-test="transparent">...</div>
```

**Example: Using the `hide` and `remove` options, without changing the markup:**

```ts
await argosScreenshot(page, "dashboard", {
  hide: ["#clock", page.getByTestId("avatar")],
  remove: [".cookie-banner"],
});
```

`hide` works like `transparent` and `remove` like `removed`. Selectors that match nothing are ignored, and an element in both lists is removed. Argos restores the elements after the screenshot and applies the options again for each viewport. To apply `blackout` from the test, use [`mask`](#mask-elements).

### Mask elements

Playwright's [`mask` and `maskColor`](https://playwright.dev/docs/api/class-page#page-screenshot-option-mask) screenshot options pass through `argosScreenshot`. Each masked element is covered with a solid box:

```ts
await argosScreenshot(page, "dashboard", {
  mask: [page.getByTestId("live-chart")],
  maskColor: "#000000",
});
```

The `data-visual-test="blackout"` helper uses the same `mask` option:

* Blacked-out elements take the `maskColor`, which is Playwright's pink (`#FF00FF`) unless you set it.
* The elements you pass in `mask` are masked in addition to the ones with the `blackout` helper.

### Animations

`argosScreenshot` takes the screenshot with Playwright's [`animations: "disabled"`](https://playwright.dev/docs/api/class-page#page-screenshot-option-animations) option. Playwright stops CSS animations, CSS transitions and Web Animations while the screenshot is taken: finite ones are fast-forwarded to their end, infinite ones are reset to their initial state. Pass `animations: "allow"` to turn this off.

Argos stabilization covers two kinds of motion that this option doesn't reach:

* **SVG animations that repeat forever**, such as a spinning loader (`repeatCount="indefinite"` or `repeatDur="indefinite"`), are paused on their first frame. SVG animations that end are left alone. Disable this with `stabilize: { pauseSvgAnimations: false }`.
* **Animated GIFs** are paused on their first frame. See [Pause animated GIFs](../learn/reliability-and-flakiness/flaky-tests/pause-gifs.md).

Argos has no specific handling for scroll-driven animations and view transitions. Neutralize them with [`argosCSS`](../learn/how-to-guides/visual-coverage/injecting-css.md):

```ts
await argosScreenshot(page, "homepage", {
  argosCSS: `
    /* Your elements animated with animation-timeline: scroll() or view() */
    .reveal-on-scroll { animation: none !important; }
    /* View transition pseudo-elements */
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) { animation: none !important; }
  `,
});
```

### Screenshots inside iframes

Pass a Playwright [`Frame`](https://playwright.dev/docs/api/class-frame) as the handler to work inside an iframe's document:

```ts
const frame = page.frame({ url: /\/embed\// });
if (!frame) throw new Error("iframe not found");
await argosScreenshot(frame, "embedded-widget");
```

With a `Frame`:

* Stabilization, `argosCSS` and the `data-visual-test` helpers run inside the frame's document.
* The screenshot captures the frame's `<body>`, or the `element` you pass.
* The `viewports` option isn't supported and throws an error. Use one [Playwright project per viewport](../learn/how-to-guides/visual-coverage/responsive-viewports.md#troubleshooting-and-best-practices) instead.

If you pass the `page` with an `element` that lives inside an iframe, such as `page.frameLocator("iframe").locator(".widget")`, Argos captures that element, but stabilization, `argosCSS` and the helpers only apply to the top-level document.

### Create multiple Argos builds from a single suite of tests

To generate multiple Argos builds from a single suite of Playwright tests, use a dynamic `buildName`. This object contains two properties:

* `values`: An array of possible values returned by the `get` function.
* `get`: A function that takes a [test case](https://playwright.dev/docs/api/class-testcase) as an argument and returns the build name.

{% code title="playwright.config.ts" %}
```ts
import { defineConfig } from "@playwright/test";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({
  // ... other configurations

  reporter: [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],

    // Argos reporter
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        uploadToArgos: !!process.env.CI,
        buildName: {
          values: ["app", "website"],
          // Split Argos build based on Playwright tags
          // Learn more about Playwright tags: https://playwright.dev/docs/test-annotations#tag-tests
          get: (test) => (test.tags.includes("@website") ? "website" : "app"),
        },
      }),
    ],
  ],
});
```
{% endcode %}

### Capture light and dark mode

To capture every page in both color schemes, run your tests in two [Playwright projects](https://playwright.dev/docs/test-projects) that set [`colorScheme`](https://playwright.dev/docs/api/class-testoptions#test-options-color-scheme):

{% code title="playwright.config.ts" %}
```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  // ... other configurations

  projects: [
    { name: "light", use: { colorScheme: "light" } },
    { name: "dark", use: { colorScheme: "dark" } },
  ],
});
```
{% endcode %}

`argosScreenshot` prefixes each screenshot name with the project name, so `argosScreenshot(page, "homepage")` produces `light/homepage` and `dark/homepage`, each with its own baseline. Without projects, names get no prefix.

To switch schemes inside a single test instead, call `page.emulateMedia({ colorScheme: "dark" })` and give the second screenshot a different name.

### Debug flaky tests

To debug flaky tests, Argos supports using the [Playwright --repeat-each option](https://playwright.dev/docs/test-cli#reference). This runs each test multiple times to detect discrepancies.

```bash
npm exec -- playwright test --repeat-each 5
```

### Configure Content-Security-Policy (CSP)

To stabilize tests, Argos injects a script before taking screenshots. This script may conflict with your CSP settings. To resolve this issue, you have two options:

#### 1. Allow the Argos script in your CSP

The `@argos-ci/playwright` package provides a `getCSPScriptHash` method to retrieve the hash of the script injected by Argos. Additionally, Argos requires the `'unsafe-eval'` directive to function properly.

To use this method, you need to be able to inject CSP headers into your server. Here's an example in a Playwright configuration:

```ts
import { defineConfig } from "@playwright/test";
import { getCSPScriptHash } from "@argos-ci/playwright";

export default defineConfig({
  webServer: {
    command: "node my-app.js",
    port: 3000,
    env: {
      CSP_SCRIPT_SRC: `${getCSPScriptHash()},'unsafe-eval'`,
    },
  },
});
```

#### 2. Configure Playwright to bypass CSP

If you do not have the flexibility to add custom CSP headers for Playwright test execution, you can [configure Playwright to bypass CSP](https://playwright.dev/docs/api/class-testoptions#test-options-bypass-csp) in your Playwright configuration:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    bypassCSP: true,
  },
});
```

### Set a Preview URL

Argos displays the URL of the page when a screenshot is taken, helping you understand the screenshot’s context in the Argos UI. If you run tests locally and deploy your pull requests (PRs) to a preview URL, you can link the two by setting the `ARGOS_PREVIEW_BASE_URL` environment variable or configuring the `previewUrl` option in the Argos reporter.

#### Example Configuration

```ts
import { defineConfig } from "@playwright/test";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({
  reporter: [
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        previewUrl: {
          baseUrl: "https://my-site.com", // Use a dynamic value here for different environments if needed.
        },
      }),
    ],
  ],
});
```

### Test annotations

Argos supports [annotations](https://playwright.dev/docs/test-annotations) added to your tests, providing additional context and information. All annotations are displayed in Argos Build UI, except those where type starts with \_ symbol.

#### Example Usage

```ts
import { test, expect } from "@playwright/test";

test(
  "test login page",
  {
    annotation: {
      type: "visual-test",
      description:
        "Critical UI path – ensures login form fields and CTA button align correctly on desktop viewport. Related to regression #1423.",
    },
  },
  async ({ page }) => {
    // ...
  },
);
```

### ARIA Snapshots

Argos allows you to capture ARIA snapshots alongside your screenshots, enhancing accessibility testing. ARIA snapshots provide a structured representation of the page's accessible elements, which can be invaluable for identifying accessibility issues.

#### Capture alongside screenshots

You can set `ariaSnapshot: true` in the `argosScreenshot` options to capture an ARIA snapshot along with the screenshot.

{% code title="tests/example.spec.ts" %}
```ts
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

test("screenshot homepage with ARIA snapshot", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await argosScreenshot(page, "homepage", { ariaSnapshot: true });
});
```
{% endcode %}

{% hint style="info" %}
When using the `viewports` option, an ARIA snapshot is captured for each viewport.
{% endhint %}

#### Capture only ARIA snapshot

It is also possible to capture only an ARIA snapshot without a screenshot using the `argosAriaSnapshot` function:

<pre class="language-ts" data-title="tests/example.spec.ts"><code class="lang-ts"><strong>import { test } from "@playwright/test";
</strong>import { argosAriaSnapshot } from "@argos-ci/playwright";

test("capture ARIA snapshot of homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await argosAriaSnapshot(page, "homepage-aria-snapshot");
});
</code></pre>

#### Billing

Each ARIA snapshot counts as an additional screenshot for billing.

### API Overview

#### argosScreenshot(handler, name\[, options])

* `handler`: Instance of the [Playwright Page](https://playwright.dev/docs/api/class-page) or [Playwright Frame](https://playwright.dev/docs/api/class-frame). More on [screenshots inside iframes](#screenshots-inside-iframes).
* `name`: Unique name for the screenshot.
* `options`: Explore [`Page.screenshot` command options](https://playwright.dev/docs/api/class-page#page-screenshot) for details.
* `options.element`: Use a [`Locator`](https://playwright.dev/docs/api/class-locator) or a string selector to capture a specific element's screenshot.
* `options.viewports`: Define specific viewports for capturing screenshots. More on [viewports configuration](../learn/how-to-guides/visual-coverage/responsive-viewports.md).
* `options.ariaSnapshot`: Capture an ARIA snapshot along with the screenshot. More on [ARIA snapshots](playwright.md#aria-snapshots).
* `options.argosCSS`: Specific CSS applied during the screenshot process. More on [injecting CSS](../learn/how-to-guides/visual-coverage/injecting-css.md)
* `options.hide`: Array of [`Locator`](https://playwright.dev/docs/api/class-locator)s or string selectors of elements to hide. Hidden elements keep their space in the layout, like with `data-visual-test="transparent"`. Selectors that match nothing are ignored. More on [helpers](#helper-attributes-for-visual-testing).
* `options.remove`: Array of `Locator`s or string selectors of elements to remove. Removed elements no longer take space in the layout, like with `data-visual-test="removed"`. Selectors that match nothing are ignored. An element in both `hide` and `remove` is removed.
* `options.mask`: Array of `Locator`s to cover with a box, in addition to the elements with `data-visual-test="blackout"`. More on [masking elements](#mask-elements).
* `options.disableHover`: Disable hover effects by moving the mouse to the top-left corner of the page. Defaults to `true`.
* `options.threshold`: Sensitivity threshold between 0 and 1. The higher the threshold, the less sensitive the diff will be. Defaults to `0.5`. More on [how the threshold works](../learn/platform-fundamentals/how-argos-detects-visual-differences.md#sensitivity-threshold).
* `options.baseName`: Name, or list of names, to compare this screenshot against instead of its own name. Useful to compare a variant against an existing screenshot. More on [fallback baselines](../learn/how-to-guides/visual-coverage/fallback-baselines.md).
* `options.root`: Folder where the screenshots will be saved if not using the Argos reporter. Defaults to `./screenshots`.
* `options.stabilize`: Wait for the UI to stabilize before taking the screenshot. Set to `false` to disable stabilization. Pass an object to customize the stabilization. Defaults to `true`.
* `options.stabilize.disableSpellCheck`: Disable spell check before taking the screenshot. Defaults to `true`.
* `options.stabilize.fontAntialiasing`: Force font antialiasing. Defaults to `true`.
* `options.stabilize.hideCarets`: Hide text carets before taking the screenshot. Defaults to `true`.
* `options.stabilize.hideScrollbars`: Hide scrollbars before taking the screenshot. Defaults to `true`.
* `options.stabilize.loadImageSrcset`: Force the loading of images with `srcset` attributes when the viewport changes. Defaults to `true`.
* `options.stabilize.pauseGifs`: Pause animated GIFs on their first frame so they don't capture a random frame on each run. Defaults to `true`. Flag GIFs served from extension-less URLs with `data-image-type="gif"` so they're detected too.
* `options.stabilize.pauseSvgAnimations`: Pause SVG animations that repeat forever (`repeatCount="indefinite"` or `repeatDur="indefinite"`), such as spinners, on their first frame. Defaults to `true`.
* `options.stabilize.roundImageSize`: Round image sizes to the nearest integer. Defaults to `true`.
* `options.stabilize.stabilizeSticky`: Stabilize sticky and fixed elements by switching to `position: absolute`. Defaults to `true`.
* `options.stabilize.waitForAriaBusy`: Wait for the `aria-busy` attribute to be removed from the document. Defaults to `true`.
* `options.stabilize.waitForFonts`: Wait for fonts to be loaded. Defaults to `true`.
* `options.stabilize.waitForImages`: Wait for images to be loaded. Defaults to `true`.
* `options.stabilize.waitForBackgroundImages`: Wait for CSS background images (including `::before`/`::after`) to load before taking the screenshot. Enabled by default, scoped to elements flagged with the `data-visual-test-wait-bg-img` attribute (and their descendants). Pass `true` to scan the whole document, `{ selector: string }` to target a custom selector, or `false` to disable it. A failed image (e.g. a 404) is treated as loaded so it never blocks stabilization.
* `options.beforeScreenshot`: Run a function before taking the screenshot. When using viewports, this function will run before taking screenshots on each viewport.
* `options.afterScreenshot`: Run a function after taking the screenshot. When using viewports, this function will run after taking screenshots on each viewport.
* `options.tag`: Tag or array of tags to attach to the screenshot for filtering in Argos.

Playwright test tags (from `test.describe` or `test` annotations) are automatically captured in the metadata.

Unlike [Playwright's `screenshot` method](https://playwright.dev/docs/api/class-page#page-screenshot), set `fullPage` option to `true` by default. Feel free to override this option if you prefer partial screenshots of your pages.

#### argosAriaSnapshot(handler, name\[, options])

* `handler`: Instance of the [Playwright Page](https://playwright.dev/docs/api/class-page) or [Playwright Frame](https://playwright.dev/docs/api/class-frame).
* `name`: Unique name for the screenshot.
* `options.element`: Use a [`Locator`](https://playwright.dev/docs/api/class-locator) or a string selector to capture a specific element's screenshot.
* `options.root`: Folder where the screenshots will be saved if not using the Argos reporter. Defaults to `./screenshots`.
* `options.timeout`: Maximum time in milliseconds. Defaults to `0` - no timeout.
* `options.stabilize`: Wait for the UI to stabilize before taking the screenshot. Set to `false` to disable stabilization. Pass an object to customize the stabilization. Defaults to `true`.
* `options.stabilize.disableSpellCheck`: Disable spell check before taking the screenshot. Defaults to `true`.
* `options.stabilize.fontAntialiasing`: Force font antialiasing. Defaults to `true`.
* `options.stabilize.hideCarets`: Hide text carets before taking the screenshot. Defaults to `true`.
* `options.stabilize.hideScrollbars`: Hide scrollbars before taking the screenshot. Defaults to `true`.
* `options.stabilize.loadImageSrcset`: Force the loading of images with `srcset` attributes when the viewport changes. Defaults to `true`.
* `options.stabilize.pauseGifs`: Pause animated GIFs on their first frame so they don't capture a random frame on each run. Defaults to `true`. Flag GIFs served from extension-less URLs with `data-image-type="gif"` so they're detected too.
* `options.stabilize.pauseSvgAnimations`: Pause SVG animations that repeat forever (`repeatCount="indefinite"` or `repeatDur="indefinite"`), such as spinners, on their first frame. Defaults to `true`.
* `options.stabilize.roundImageSize`: Round image sizes to the nearest integer. Defaults to `true`.
* `options.stabilize.stabilizeSticky`: Stabilize sticky and fixed elements by switching to `position: absolute`. Defaults to `true`.
* `options.stabilize.waitForAriaBusy`: Wait for the `aria-busy` attribute to be removed from the document. Defaults to `true`.
* `options.stabilize.waitForFonts`: Wait for fonts to be loaded. Defaults to `true`.
* `options.stabilize.waitForImages`: Wait for images to be loaded. Defaults to `true`.
* `options.stabilize.waitForBackgroundImages`: Wait for CSS background images (including `::before`/`::after`) to load before taking the screenshot. Enabled by default, scoped to elements flagged with the `data-visual-test-wait-bg-img` attribute (and their descendants). Pass `true` to scan the whole document, `{ selector: string }` to target a custom selector, or `false` to disable it. A failed image (e.g. a 404) is treated as loaded so it never blocks stabilization.

#### getCSPScriptHash()

Returns the Content-Security-Policy script hash used by Argos (ex: `'sha256-xaC9wWpMVRiAXSfhxhP+Wyqkw0mgO+MIrHuzmMPIxEI='`).

#### Playwright reporter

The Argos reporter offers extensive configuration options. Specifically, all [upload parameters](https://js-sdk-reference.argos-ci.com/interfaces/UploadParameters.html) are available for customizing the reporter.

The reporter also has its own options:

* `uploadToArgos`: Upload the screenshots to Argos at the end of the run. Defaults to `true`.
* `ignoreUploadFailures`: When `true`, an upload error is logged and doesn't fail the test run. Defaults to `false`: a failed upload marks the run as failed.
* `buildName`: Name of the Argos build, or a dynamic name to [create multiple builds](#create-multiple-argos-builds-from-a-single-suite-of-tests).

The `createArgosReporterOptions` ensures that your options are correctly typed.

<pre class="language-ts" data-title="playwright.config.ts"><code class="lang-ts"><strong>import { defineConfig } from "@playwright/test";
</strong>import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({
  // ... other configurations

  reporter: [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],

    // Argos reporter
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        uploadToArgos: !!process.env.CI,
        buildName: "custom-build-name",
      }),
    ],
  ],
});
</code></pre>

### Frequently asked questions

<details>

<summary>Can I add padding around an element screenshot?</summary>

No, there is no padding option. Capture a wrapper element that includes the space you want instead:

```ts
await argosScreenshot(page, "card", {
  element: page.getByTestId("card-wrapper"),
});
```

</details>

<details>

<summary>Can I take screenshots of an Electron app?</summary>

Not with `argosScreenshot`. A window launched with Playwright's `_electron.launch()` has no default viewport and no browser instance, so `argosScreenshot` throws `Snapshots can't be taken without a viewport.` or `Can't take screenshots without a browser.`

Save the screenshots with Playwright instead, then upload the folder with the [Argos CLI](argos-command-line-interface-cli.md):

```ts
import { test, _electron as electron } from "@playwright/test";

test("main window", async () => {
  const app = await electron.launch({ args: ["main.js"] });
  const window = await app.firstWindow();
  await window.screenshot({ path: "screenshots/main-window.png" });
  await app.close();
});
```

```bash
npx argos upload ./screenshots
```

These screenshots don't go through Argos stabilization.

</details>

### Additional Resources

* [Quickstart with Argos + Playwright](../quickstart/playwright-quickstart.md)
* [Argos + Playwright example](https://github.com/argos-ci/argos-javascript/tree/main/examples/playwright)
* [@argos-ci/playwright on GitHub](https://github.com/argos-ci/argos-javascript/tree/main/packages/playwright)
* [@argos-ci/playwright on npm](https://www.npmjs.com/package/@argos-ci/playwright)
