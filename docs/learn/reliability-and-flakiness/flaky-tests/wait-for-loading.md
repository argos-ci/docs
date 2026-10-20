---
description: >-
  Use aria-busy so argosScreenshot waits for full page load before capturing,
  and see what Argos waits for before each screenshot, in Storybook too.
---

# Wait for loading

A screenshot taken while the page is still loading produces a different image on every run. Mark your loading states with `aria-busy`, and `argosScreenshot()` waits until they are gone before capturing.

### Usage

Add `aria-busy` to your loader components:

```jsx
<Loader aria-busy={true} />
```

`argosScreenshot()` delays the capture until no visible element has `aria-busy="true"`, so the screenshot always shows the fully loaded state. Make sure your app removes the attribute, sets it to `false`, or hides the loader once loading completes.

{% hint style="info" %}
Waiting for `aria-busy` is part of the SDK's default stabilization (the `stabilize.waitForAriaBusy` option), so you only need to mark your loaders. Storybook is the exception: see below.
{% endhint %}

### Storybook

In `@argos-ci/storybook`, the screenshots Argos takes automatically of each story don't wait for `aria-busy` by default. Turn it on with the `stabilize` option:

{% tabs %}
{% tab title="Vitest plugin" %}
{% code title="vitest.config.ts" %}
```ts
argosVitestPlugin({
  uploadToArgos: !!process.env.CI,
  stabilize: { waitForAriaBusy: true },
}),
```
{% endcode %}
{% endtab %}

{% tab title="Test Runner" %}
{% code title=".storybook/test-runner.ts" %}
```ts
const config: TestRunnerConfig = {
  async postVisit(page, context) {
    await argosScreenshot(page, context, {
      stabilize: { waitForAriaBusy: true },
    });
  },
};
```
{% endcode %}
{% endtab %}
{% endtabs %}

Any `stabilize` object you pass replaces the Storybook default as a whole, so it turns `aria-busy` waiting back on unless it sets `waitForAriaBusy: false`. Screenshots you take with `argosScreenshot` in a play function use the SDK default and wait for `aria-busy`.

### What Argos waits for

Before each capture, Argos waits until:

* no visible element has `aria-busy="true"`,
* fonts are loaded,
* `<img>` elements, including lazy-loaded ones, have finished loading (a broken image doesn't block),
* CSS background images of elements flagged with `data-visual-test-wait-bg-img` are loaded. See [Wait for background images](wait-for-background-images.md).

Argos doesn't wait for network requests to finish: there is no equivalent of Playwright's `networkidle`. If your page fetches data, mark its loading state with `aria-busy`.

With the Playwright and Storybook SDKs, a page that doesn't settle in time fails the screenshot instead of producing a half-loaded capture. The Playwright SDK waits up to the test timeout. The error lists the checks that did not pass:

```
Failed to stabilize screenshot, found the following issues:
- Some elements still have `aria-busy='true'`
```
