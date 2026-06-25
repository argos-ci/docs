---
description: A playbook for tackling visual flakiness, with detection, ignoring noisy changes, and stabilization strategies.
---

# Flaky tests

Flaky tests fail or change without a meaningful code change, eroding trust in your test suite. Argos tackles flakiness from two angles: it **detects** unstable tests so you can decide with confidence, and it gives you **tools and strategies** to address the root causes.

### How Argos helps

* **Flaky test detection**: Argos flags unstable tests with a flaky badge, a stability score, and a detailed history view. See [Flaky Test Detection](../flaky-test-detection.md) for details.
* **Ignore noisy changes**: Dismiss a specific change directly from the build or test page so the same change is no longer reported.
* **Auto-ignore recurring flaky changes**: Configure Argos to automatically ignore changes that recur over the last 7 days, filtering out noise while keeping real regressions visible.

These features let you separate signal from noise without losing the ability to catch real regressions.

### Common causes

Visual flakiness usually stems from one of the following:

* **Dynamic content**: Ads, user-generated content, or other data that changes between runs.
* **Asynchronous loading**: Elements or styles that render at inconsistent times.
* **Rendering differences**: Browser, OS, or device variations that alter visual output.
* **External dependencies**: Reliance on third-party systems that introduce variability.
* **Animations and transitions**: Unhandled motion captured mid-frame.
* **Resolution and scaling**: Screen size or pixel density differences between environments.

### Best practices for stable screenshots

Ignoring noise is useful, but the most reliable suite is one where flakiness is addressed at the source. Follow these practices—each one targets a common cause above:

{% hint style="info" %}
Most stabilization is automatic. The Argos SDK stabilizes every screenshot by default—waiting for `aria-busy`, fonts, and images to settle, forcing font antialiasing, hiding carets and scrollbars, and more. You can customize or disable any of it through the [`stabilize` option](../../../sdks-reference/playwright.md). The practices below cover what the SDK can't infer on its own, such as which elements are loaders or which values are dynamic.
{% endhint %}

* **Wait until the page is ready before capturing.** Mark loading elements with `aria-busy` so `argosScreenshot()` waits for them. → [Wait for Loading](wait-for-loading.md)
* **Make dates and times deterministic.** Hide or freeze any value that changes between runs. → [Stabilize Date & Time](stabilize-date-and-time.md)
* **Force consistent text rendering.** Disable subpixel text and font hinting so glyphs look identical on every machine. → [Stabilize Text Rendering](stabilize-text-rendering.md)
* **Run the same environment everywhere, and tame rendering quirks.** Use the same OS and browser locally and on CI, and smooth over properties like `border-radius`. → [Browser Glitches](browser-glitches.md)
* **Mask or hide unavoidable dynamic content.** Use `data-visual-test` attributes for anything you can't stabilize at the source. → [Argos Helpers](argos-helpers.md)

{% hint style="success" %}
**New to visual testing?** Start with [Stabilize Text Rendering](stabilize-text-rendering.md) and [Wait for Loading](wait-for-loading.md). Together they prevent the large majority of flaky screenshots.
{% endhint %}

### Emphasis on accessibility

At Argos, we advocate for accessibility-focused end-to-end testing. Improving accessibility (semantic markup, `aria-busy`, predictable focus states) not only supports users with disabilities but also makes tests more deterministic and less prone to flakiness.
