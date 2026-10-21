---
description: >-
  Reference for @argos-ci/webdriverio: capture screenshots in WebdriverIO tests
  with argosScreenshot, hide, remove, or mask dynamic elements, and upload them
  to Argos with the CLI.
---

# WebdriverIO SDK reference (@argos-ci/webdriverio)

[WebdriverIO](https://webdriver.io/) is a Node.js test automation framework for web and mobile applications, built on the WebDriver and WebDriver BiDi protocols. The `@argos-ci/webdriverio` SDK captures screenshots from your WebdriverIO tests so Argos can detect visual changes on every pull request.

### Get started

Follow the [WebdriverIO Quickstart](../quickstart/webdriverio-quickstart.md) to set up Argos with WebdriverIO.

### Compatibility

* **WebdriverIO** 6, 7, 8, or 9.
* **Node.js** 22 or later.

### API overview

#### argosScreenshot(browser, name\[, options])

* `browser` - A `WebdriverIO.Browser` instance.
* `name` - The screenshot name; must be unique. If it ends with `.png`, it is treated as a path.
* `options.hide` - Array of WebdriverIO selectors of elements to hide. Hidden elements keep their space in the layout, like with `data-visual-test="transparent"`. Selectors that match nothing are ignored. More on [helpers](#helper-attributes-for-visual-testing).
* `options.remove` - Array of WebdriverIO selectors of elements to remove. Removed elements no longer take space in the layout, like with `data-visual-test="removed"`. Selectors that match nothing are ignored. An element in both `hide` and `remove` is removed.
* `options.mask` - Areas to mask when the screenshot is taken, as an array of WebdriverIO selectors or rectangles (`{ x, y, width, height }`, in pixels of the screenshot). Masked areas are overlaid with a box that completely covers them. Elements with `data-visual-test="blackout"` are always masked. Selectors that match nothing are ignored.
* `options.maskColor` - The color of the overlay box for masked areas, in CSS color format. Defaults to `#FF00FF`.
* `options.argosCSS` - Specific CSS applied during the screenshot process. More on [injecting CSS](../learn/how-to-guides/visual-coverage/injecting-css.md).

{% hint style="info" %}
The WebdriverIO SDK applies the `data-visual-test` helpers and `argosCSS`, but not the rest of Argos stabilization: unlike the Playwright, Cypress, and Puppeteer SDKs, it doesn't wait for loading, fonts, or images, pause GIFs, or hide scrollbars and carets. Stabilize the page in your test before calling `argosScreenshot`.

In an Appium native app context, `argosScreenshot` captures the screen as is: the helpers don't apply, `mask` only accepts rectangles, and passing `hide`, `remove`, `argosCSS`, or a selector in `mask` throws an error.
{% endhint %}

### Helper Attributes for Visual Testing

The `data-visual-test` attributes control how elements appear in Argos screenshots. Use them for elements with dynamic content, like dates.

* `[data-visual-test="transparent"]`: Renders the element transparent (`opacity: 0`), keeping its layout space.
* `[data-visual-test="removed"]`: Removes the element from view (`display: none`).
* `[data-visual-test="blackout"]`: Covers the element with a box in `maskColor`.
* `[data-visual-test-no-radius]`: Strips the border radius from the element.

**Example: Using a helper attribute to hide a div from the captured screenshot:**

```html
<div id="clock" data-visual-test="transparent">...</div>
```

**Example: Using the `hide`, `remove` and `mask` options, without changing the markup:**

```js
await argosScreenshot(browser, "dashboard", {
  hide: ["#clock", ".avatar"],
  remove: [".cookie-banner"],
  mask: ["#map"],
});
```

`hide` works like `transparent`, `remove` like `removed`, and `mask` like `blackout`. Selectors that match nothing are ignored, and an element in both `hide` and `remove` is removed. Argos restores the page after the screenshot.

{% hint style="warning" %}
Earlier versions of the SDK ignored the `data-visual-test` attributes. If your pages use them, their screenshots change after you upgrade: review the changes in the first Argos build that follows.
{% endhint %}

### Additional resources

* [WebdriverIO Quickstart](../quickstart/webdriverio-quickstart.md)
* [@argos-ci/webdriverio on GitHub](https://github.com/argos-ci/argos-javascript/tree/main/packages/webdriverio)
* [@argos-ci/webdriverio on npm](https://www.npmjs.com/package/@argos-ci/webdriverio)
