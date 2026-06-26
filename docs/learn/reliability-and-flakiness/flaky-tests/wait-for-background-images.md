---
description: >-
  Wait for CSS background images to load before capturing with the opt-in
  waitForBackgroundImages stabilization option.
---

# Wait for background images

CSS background images have no native load event, so the SDK can't wait for them the way it waits for `<img>` elements. When a background image is still loading—or re-fetches on a viewport change, as responsive backgrounds often do—the screenshot can capture a half-painted element and turn flaky.

The `waitForBackgroundImages` stabilization option closes that gap: it discovers background image URLs (including those set on `::before` and `::after`), preloads them, and waits for them to finish before the screenshot is taken.

{% hint style="warning" %}
Unlike the rest of stabilization, `waitForBackgroundImages` is **disabled by default**. Setting `stabilize: true` does _not_ enable it—you must opt in explicitly. This keeps the extra DOM scan off the path of tests that don't need it.
{% endhint %}

### Usage

Pass `true` to scan the whole document:

{% tabs %}
{% tab title="Playwright" %}
```ts
await argosScreenshot(page, "homepage", {
  stabilize: { waitForBackgroundImages: true },
});
```
{% endtab %}

{% tab title="Cypress" %}
```ts
cy.argosScreenshot("homepage", {
  stabilize: { waitForBackgroundImages: true },
});
```
{% endtab %}
{% endtabs %}

On large pages, narrow the scan to the elements that actually use background images by passing a selector:

```ts
await argosScreenshot(page, "homepage", {
  stabilize: { waitForBackgroundImages: { selector: ".hero, [data-bg]" } },
});
```

A failed background image (for example a 404) is treated as loaded, so a broken URL never blocks stabilization.

{% hint style="info" %}
The scan runs once per viewport before the wait begins, so background images added to the DOM _during_ the wait window aren't picked up. For the common responsive-viewport case this is exactly what you want; for `<img>` elements added later, the default `waitForImages` already re-reads the DOM live.
{% endhint %}

See the full [`stabilize` option reference](../../../sdks-reference/playwright.md) for every stabilization setting.
