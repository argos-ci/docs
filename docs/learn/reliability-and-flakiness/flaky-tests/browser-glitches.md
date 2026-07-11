---
description: >-
  Eliminate browser-induced visual discrepancies like border-radius differences
  with a consistent test environment.
---

# Browser glitches

The same page can render differently across operating systems and browser versions. Run your tests in the same environment everywhere — same OS, same browser version, locally and on CI — and smooth over the few properties that still render inconsistently.

{% hint style="info" %}
The most common cross-environment glitch is text rendering. See [Stabilize text rendering](stabilize-text-rendering.md) for the launch options that make glyphs render identically everywhere.
{% endhint %}

### Border radius

The `border-radius` property can render differently across browsers and devices. Add the `data-visual-test-no-radius` [Argos helper](argos-helpers.md) to remove the border radius in screenshots:

```html
<button className="rounded" data-visual-test-no-radius>My button</button>
```
