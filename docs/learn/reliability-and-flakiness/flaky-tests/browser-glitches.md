# Browser Glitches

Eliminate browser-induced visual discrepancies: Ensure consistent environments and utilize Argos helpers to address properties like `border-radius` for glitch-free visual testing.

Glitches can occur when your tests are not running in the same environment. Be sure to run your E2E tests in the exact same environment (OS and Browser).

{% hint style="info" %}
The most common cross-environment glitch is text rendering. See [Stabilize Text Rendering](stabilize-text-rendering.md) for the launch options that make glyphs render identically everywhere.
{% endhint %}

### Border Radius

Sometimes, the `border-radius` property can cause screenshots to appear differently across different browsers or devices.

To address this, you can add the `data-visual-test-no-radius` Argos helper to remove the border radius while taking screenshots.

```html
<button className="rounded" data-visual-test-no-radius>My button</button>
```
