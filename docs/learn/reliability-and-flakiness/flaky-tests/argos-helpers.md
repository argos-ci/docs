---
description: >-
  Use data-visual-test attributes or SDK options to hide, remove, or mask dynamic
  elements for consistent, flake-free screenshots.
---

# Argos helpers

Every Argos SDK recognizes `data-visual-test` attributes on your elements, giving you control over how dynamic content appears in screenshots. Use them for anything you can't stabilize at the source — dates, avatars, ads, or third-party widgets.

### Helpers

* `data-visual-test="transparent"`: Makes the element invisible with `opacity: 0` and transparent text, and switches its font to monospace. Unlike `removed`, the element keeps a place in the layout.
* `data-visual-test="removed"`: Removes the element from view (`display: none`).
* `data-visual-test="blackout"`: Masks the element with a blackout effect.
* `data-visual-test-no-radius`: Strips the border radius from the element. See [Browser glitches](browser-glitches.md).
* `data-visual-test-wait-bg-img`: Waits for the element's (and its descendants') CSS background images to load before capturing. See [Wait for background images](wait-for-background-images.md).
* `data-image-type="gif"`: Flags an image as a GIF so it's paused even when its URL has no `.gif` extension. See [Pause animated GIFs](pause-gifs.md).

For example, to hide a clock from the captured screenshot:

```html
<div id="clock" data-visual-test="transparent">...</div>
```

The WebdriverIO SDK applies the `transparent`, `removed`, `blackout`, and `no-radius` helpers, but not the rest of Argos stabilization, so `data-visual-test-wait-bg-img` and `data-image-type="gif"` have no effect there. In an Appium native app context, no helper applies.

### Apply helpers from your tests

When you can't or don't want to change the markup, pass the elements to `argosScreenshot` instead. They get the same treatment as with the attribute, for that screenshot only: Argos restores the page afterwards.

| Helper        | `argosScreenshot` option             |
| ------------- | ------------------------------------ |
| `transparent` | `hide`                               |
| `removed`     | `remove`                             |
| `blackout`    | `mask` (`blackout` in Cypress)       |

For example, with Playwright:

```ts
await argosScreenshot(page, "dashboard", {
  hide: ["#clock", page.getByTestId("avatar")],
  remove: [".cookie-banner"],
  mask: ["#map"],
});
```

Selectors that match nothing are ignored, and an element in both `hide` and `remove` is removed. With [viewports](../../how-to-guides/visual-coverage/responsive-viewports.md), the options apply to each viewport.

These options are available in every SDK: [Playwright](../../../sdks-reference/playwright.md#helper-attributes-for-visual-testing), [Puppeteer](../../../sdks-reference/puppeteer.md#helper-attributes-for-visual-testing), [Cypress](../../../sdks-reference/cypress.md#helper-attributes-for-visual-testing), [WebdriverIO](../../../sdks-reference/webdriverio.md#helper-attributes-for-visual-testing), [Vitest](../../../sdks-reference/vitest.md), and [Storybook](../../../sdks-reference/storybook.md). See each SDK reference for what the options accept.
