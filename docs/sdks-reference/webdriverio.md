---
description: >-
  Reference for @argos-ci/webdriverio: capture screenshots in WebdriverIO tests
  with argosScreenshot, mask dynamic areas, and upload them to Argos with the
  CLI.
---

# WebdriverIO SDK reference (@argos-ci/webdriverio)

[WebdriverIO](https://webdriver.io/) is a Node.js test automation framework for web and mobile applications, built on the WebDriver and WebDriver BiDi protocols. The `@argos-ci/webdriverio` SDK captures screenshots from your WebdriverIO tests so Argos can detect visual changes on every pull request.

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
