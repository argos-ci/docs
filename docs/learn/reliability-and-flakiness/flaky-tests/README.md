---
description: A playbook for tackling visual flakiness, with detection, ignoring noisy changes, and stabilization strategies.
---

# Stabilize screenshots

The most reliable visual test suite is one where flakiness is fixed at the source. This playbook covers the strategies that make screenshots deterministic — from waiting for loading to freezing dynamic values.

{% hint style="info" %}
Argos also detects and filters flakiness for you: see [Flaky test detection](../flaky-test-detection.md) for flaky badges, ignore, and auto-ignore, and the [Tests dashboard](../tests-dashboard.md) for a project-wide ranking.
{% endhint %}

### Common causes

Visual flakiness usually stems from one of the following:

* **Dynamic content**: Ads, user-generated content, or other data that changes between runs.
* **Asynchronous loading**: Elements or styles that render at inconsistent times.
* **Rendering differences**: Browser, OS, or device variations that alter visual output.
* **External dependencies**: Reliance on third-party systems that introduce variability.
* **Animations and transitions**: Unhandled motion captured mid-frame.
* **Resolution and scaling**: Screen size or pixel density differences between environments.

### Best practices for stable screenshots

Follow these practices — each one targets a common cause above:

{% hint style="info" %}
Most stabilization is automatic. The Argos SDK stabilizes every screenshot by default — waiting for `aria-busy`, fonts, and images to settle, forcing font antialiasing, hiding carets and scrollbars, and more. You can customize or disable any of it through the [`stabilize` option](../../../sdks-reference/playwright.md). The practices below cover what the SDK can't infer on its own, such as which elements are loaders or which values are dynamic.
{% endhint %}

* **Wait until the page is ready before capturing.** Mark loading elements with `aria-busy` so `argosScreenshot()` waits for them. → [Wait for loading](wait-for-loading.md)
* **Wait for CSS background images to load.** Flag elements with `data-visual-test-wait-bg-img` so Argos waits for their backgrounds — or extend the check to the whole page. → [Wait for background images](wait-for-background-images.md)
* **Freeze animated GIFs.** GIFs are paused on their first frame by default so they don't capture a random frame on each run. → [Pause animated GIFs](pause-gifs.md)
* **Make dates and times deterministic.** Hide or freeze any value that changes between runs. → [Stabilize date & time](stabilize-date-and-time.md)
* **Force consistent text rendering.** Disable subpixel text and font hinting so glyphs look identical on every machine. → [Stabilize text rendering](stabilize-text-rendering.md)
* **Run the same environment everywhere, and tame rendering quirks.** Use the same OS and browser locally and on CI, and smooth over properties like `border-radius`. → [Browser glitches](browser-glitches.md)
* **Mask or hide unavoidable dynamic content.** Use `data-visual-test` attributes for anything you can't stabilize at the source. → [Argos helpers](argos-helpers.md)

{% hint style="success" %}
**New to visual testing?** Start with [Stabilize text rendering](stabilize-text-rendering.md) and [Wait for loading](wait-for-loading.md). Together they prevent the large majority of flaky screenshots.
{% endhint %}

### Emphasis on accessibility

At Argos, we advocate for accessibility-focused end-to-end testing. Improving accessibility (semantic markup, `aria-busy`, predictable focus states) not only supports users with disabilities but also makes tests more deterministic and less prone to flakiness.
