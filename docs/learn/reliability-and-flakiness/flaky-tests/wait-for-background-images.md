---
description: >-
  Wait for CSS background images to load before capturing with the
  waitForBackgroundImages stabilization option.
---

# Wait for background images

CSS background images have no native load event, so the SDK can't wait for them the way it waits for `<img>` elements. When a background image is still loading—or re-fetches on a viewport change, as responsive backgrounds often do—the screenshot can capture a half-painted element and turn flaky.

The `waitForBackgroundImages` stabilization option closes that gap: it discovers background image URLs (including those set on `::before` and `::after`), preloads them, and waits for them to finish before the screenshot is taken.

{% hint style="info" %}
A full-document scan for background images is expensive, so by default the scan is limited to the elements you flag with the `data-visual-test-wait-bg-img` attribute. This keeps stabilization fast while still covering the elements that need it.
{% endhint %}

### Flagging elements

Add the `data-visual-test-wait-bg-img` attribute to an element to wait for its background image—and the background images of everything nested inside it—before capturing. This works out of the box with the default `stabilize: true`:

```html
<section class="hero" data-visual-test-wait-bg-img>…</section>
```

### Scanning the whole document

Pass `true` to scan every element instead of only the flagged ones:

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

On large pages, narrow the scan to the elements that actually use background images by passing a selector instead:

```ts
await argosScreenshot(page, "homepage", {
  stabilize: { waitForBackgroundImages: { selector: ".hero, [data-bg]" } },
});
```

### Disabling it

To turn the scan off entirely, pass `false`:

```ts
await argosScreenshot(page, "homepage", {
  stabilize: { waitForBackgroundImages: false },
});
```

A failed background image (for example a 404) is treated as loaded, so a broken URL never blocks stabilization.

{% hint style="info" %}
The scan runs once per viewport before the wait begins, so background images added to the DOM _during_ the wait window aren't picked up. For the common responsive-viewport case this is exactly what you want; for `<img>` elements added later, the default `waitForImages` already re-reads the DOM live.
{% endhint %}

See the full [`stabilize` option reference](../../../sdks-reference/playwright.md) for every stabilization setting.
