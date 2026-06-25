---
description: Disable subpixel text and font hinting in Chromium so glyphs render identically across macOS, Linux, and CI.
---

# Stabilize text rendering

Force consistent glyph rendering across operating systems: disable subpixel (LCD) text and font hinting so the same text looks identical on macOS, Linux, and CI—eliminating one of the most common sources of screenshot flakiness.

### Why text causes flaky screenshots

By default, Chromium renders text using two techniques that depend on the underlying operating system, GPU, and font stack:

* **Subpixel (LCD) antialiasing** uses the red, green, and blue subpixels of a screen to smooth glyph edges. It leaves faint red/blue color fringing that differs from one machine to another.
* **Font hinting** snaps glyphs to the pixel grid. The result varies between platforms, shifting antialiasing by a pixel here and there.

The consequence: a screenshot captured locally on macOS rarely matches the exact same screenshot captured on a Linux CI runner. Argos sees these sub-pixel differences as real changes and reports false positives, even though no code changed.

### The fix

Launch Chromium with two flags that make text rendering deterministic:

* `--disable-lcd-text` — forces **grayscale antialiasing** instead of subpixel rendering, removing the red/blue edge fringing.
* `--font-render-hinting=none` — disables font hinting so glyph rasterization is **platform-independent**.

{% tabs %}
{% tab title="Playwright" %}
Add the launch options to the `use` block of your Playwright configuration:

{% code title="playwright.config.ts" %}
```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    launchOptions: {
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  },
});
```
{% endcode %}
{% endtab %}

{% tab title="Storybook (Vitest)" %}
Pass the launch options to the Playwright provider in your Vitest configuration:

{% code title="vitest.config.ts" %}
```ts
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          args: ["--disable-lcd-text", "--font-render-hinting=none"],
        },
      }),
      instances: [{ browser: "chromium" }],
    },
  },
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="success" %}
These flags make text rendering consistent **across** environments, so screenshots captured on your machine match those captured on CI.
{% endhint %}

{% hint style="info" %}
Rendering flakiness is reduced even further when local and CI runs share the **exact same environment** (OS and browser). See [Browser Glitches](browser-glitches.md) for more on standardizing environments.
{% endhint %}
