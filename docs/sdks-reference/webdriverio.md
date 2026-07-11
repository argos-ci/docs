---
description: >-
  Integrating Argos with your WebdriverIO tests to enable visual testing on
  your application.
---

# WebdriverIO

### Get started

Follow the [WebdriverIO Quickstart](../quickstart/webdriverio-quickstart.md) to set up Argos with WebdriverIO.

### API overview

#### argosScreenshot(browser, name\[, options])

* `browser` - A `WebdriverIO.Browser` instance.
* `name` - The screenshot name; must be unique. If it ends with `.png`, it is treated as a path.
* `options.mask` - Areas to mask when the screenshot is taken, as an array of rectangles (`{ x, y, width, height }`). Masked areas are overlaid with a box that completely covers them.
* `options.maskColor` - The color of the overlay box for masked areas, in CSS color format. Defaults to `#FF00FF`.

{% hint style="info" %}
Unlike the Playwright, Cypress, and Puppeteer SDKs, the WebdriverIO SDK captures the screenshot as-is: it does not apply Argos stabilization (waiting for loading, pausing GIFs, `data-visual-test` helper attributes). Stabilize the page in your test before calling `argosScreenshot`.
{% endhint %}

### Additional resources

* [WebdriverIO Quickstart](../quickstart/webdriverio-quickstart.md)
* [@argos-ci/webdriverio on GitHub](https://github.com/argos-ci/argos-javascript/tree/main/packages/webdriverio)
* [@argos-ci/webdriverio on npm](https://www.npmjs.com/package/@argos-ci/webdriverio)
