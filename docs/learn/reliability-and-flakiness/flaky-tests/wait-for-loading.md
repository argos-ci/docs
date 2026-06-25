---
description: Use aria-busy so argosScreenshot waits for full page load before capturing, improving screenshot consistency.
---

# Wait for loading

Master timing in visual tests with Argos: Use `aria-busy` to ensure screenshots are captured post full page load, enhancing accuracy and consistency.

### Usage

`argosScreenshot()` delays capturing screenshots until no elements with `aria-busy` are detected, ensuring full page load.

```jsx
<Loader aria-busy={true} />
```

**We recommend applying `aria-busy` to your loader components to ensure that your page is fully loaded before a screenshot is taken.**

{% hint style="info" %}
Waiting for `aria-busy` is part of the SDK's default stabilization (the `stabilize.waitForAriaBusy` option), so there's nothing to enable—you only need to mark your loaders.
{% endhint %}
