---
description: >-
  Use data-visual-test attributes to hide, remove, or mask dynamic elements for
  consistent, flake-free screenshots.
---

# Argos helpers

Argos SDKs recognize `data-visual-test` attributes on your elements, giving you control over how dynamic content appears in screenshots. Use them for anything you can't stabilize at the source — dates, avatars, ads, or third-party widgets.

### Helpers

* `data-visual-test="transparent"`: Renders the element transparent (`visibility: hidden`), keeping its layout space.
* `data-visual-test="removed"`: Removes the element from view (`display: none`).
* `data-visual-test="blackout"`: Masks the element with a blackout effect (Storybook, Playwright, and Cypress SDKs only).
* `data-visual-test-no-radius`: Strips the border radius from the element. See [Browser glitches](browser-glitches.md).
* `data-visual-test-wait-bg-img`: Waits for the element's (and its descendants') CSS background images to load before capturing. See [Wait for background images](wait-for-background-images.md).
* `data-image-type="gif"`: Flags an image as a GIF so it's paused even when its URL has no `.gif` extension. See [Pause animated GIFs](pause-gifs.md).

For example, to hide a clock from the captured screenshot:

```html
<div id="clock" data-visual-test="transparent">...</div>
```
