---
description: >-
  Hide or freeze dynamic dates and times to remove a common source of flaky
  visual diffs in Argos.
---

# Stabilize date & time

Dates and times change between test runs, so any visible timestamp produces a diff on every build. Hide them from screenshots, or freeze them so they render the same value on every run.

### Hide the date

Add the `data-visual-test="transparent"` [Argos helper](argos-helpers.md) to render the element invisible in screenshots while keeping its layout space:

```html
<time data-visual-test="transparent">Oct 10, 2024</time>
```

### Freeze the date

To keep dates visible in your screenshots, make them deterministic instead:

* **Freeze the clock in your tests.** Playwright's [Clock API](https://playwright.dev/docs/clock) pins the browser time to a fixed value:

  ```js
  await page.clock.setFixedTime(new Date("2024-10-10T10:00:00"));
  ```
* **Pin dates in your test data.** If your UI renders dates from seeded data, run a script that resets those dates just before your tests, so relative labels like "2 days ago" stay constant.
