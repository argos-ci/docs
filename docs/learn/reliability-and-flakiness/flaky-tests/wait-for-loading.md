---
description: >-
  Use aria-busy so argosScreenshot waits for full page load before capturing,
  improving screenshot consistency.
---

# Wait for loading

A screenshot taken while the page is still loading produces a different image on every run. Mark your loading states with `aria-busy`, and `argosScreenshot()` waits until they are gone before capturing.

### Usage

Add `aria-busy` to your loader components:

```jsx
<Loader aria-busy={true} />
```

`argosScreenshot()` delays the capture until no element with `aria-busy` remains on the page, so the screenshot always shows the fully loaded state. Make sure your app removes the attribute (or the loader) once loading completes.

{% hint style="info" %}
Waiting for `aria-busy` is part of the SDK's default stabilization (the `stabilize.waitForAriaBusy` option) — there's nothing to enable, you only need to mark your loaders.
{% endhint %}
