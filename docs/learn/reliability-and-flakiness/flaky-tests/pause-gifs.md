---
description: >-
  Freeze animated GIFs on their first frame with the pauseGifs stabilization
  option so they no longer capture a random frame on each run.
---

# Pause animated GIFs

Animated GIFs keep playing while your test runs, so each screenshot captures whatever frame happens to be on screen at capture time. That frame is non-deterministic—it depends on network timing, CPU load, and how long stabilization took—so a GIF turns an otherwise-stable page into a flaky one.

The `pauseGifs` stabilization option removes that source of noise: it freezes every animated GIF on its **first frame** before the screenshot is taken, then restores the original animation afterwards.

{% hint style="info" %}
This is on by default. Setting `stabilize: true` (the default) already pauses GIFs—there's nothing to configure unless you want to turn it off.
{% endhint %}

### How it works

For each `<img>` that resolves to a GIF, the SDK loads a fresh copy of the image and draws its first decoded frame to a canvas—an already-rendered `<img>` has been animating since it loaded, so its current frame is unpredictable. The static frame is swapped in for the screenshot and the original GIF is put back once the capture is done.

A cross-origin GIF served without the right CORS headers taints the canvas and can't be frozen; those are left animating rather than blocking the screenshot.

### Disabling it

If you specifically want to capture the live animation, disable the plugin:

{% tabs %}
{% tab title="Playwright" %}
```ts
await argosScreenshot(page, "homepage", {
  stabilize: { pauseGifs: false },
});
```
{% endtab %}

{% tab title="Cypress" %}
```ts
cy.argosScreenshot("homepage", {
  stabilize: { pauseGifs: false },
});
```
{% endtab %}
{% endtabs %}

See the full [`stabilize` option reference](../../../sdks-reference/playwright.md) for every stabilization setting.
