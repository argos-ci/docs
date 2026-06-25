---
description: >-
  Integrating Argos with your WebdriverIO tests to enable visual testing on your
  application.
---

# WebdriverIO

### Get started

Please refer to our [Quickstart guide](../quickstart/webdriverio-quickstart.md) to get started with Argos and WebdriverIO.

### API Overview

#### argosScreenshot(browser, name\[, options])

* `browser` - A `WebdriverIO.Browser` instance
* `name` - The screenshot name; must be unique. If ends by `.png` we treat it as a path.
* `options` - Options
* `options.mask` - Specify areas that should be masked when the screenshot is taken. Masked elements will be overlaid with a pink box #FF00FF (customized by `maskColor`) that completely covers its bounding box.
* `options.maskColor` - Specify the color of the overlay box for masked elements, in CSS color format. Default color is pink #FF00FF.

### Helper Attributes for Visual Testing

For tailored visual testing, the `data-visual-test` attributes provide control over how elements appear in Argos screenshots. This can be especially useful for obscuring or modifying elements with dynamic content, like dates.

* `[data-visual-test="transparent"]`: Renders the element transparent (`visibility: hidden`).
* `[data-visual-test="removed"]`: Removes the element from view (`display: none`).
* `[data-visual-test="blackout"]`: Masks the element with a blackout effect.
* `[data-visual-test-no-radius]`: Strips the border radius from the element.

**Example: Using a helper attribute to hide a div from the captured screenshot:**

```html
<div id="clock" data-visual-test="transparent">...</div>
```

### Additional Resources

* [Quickstart with Argos + WebdriverIO](../quickstart/webdriverio-quickstart.md)
* [@argos-ci/webdriverio on GitHub](https://github.com/argos-ci/argos-javascript/tree/main/packages/webdriverio)
* [@argos-ci/webdriverio on npm](https://www.npmjs.com/package/@argos-ci/webdriverio)
