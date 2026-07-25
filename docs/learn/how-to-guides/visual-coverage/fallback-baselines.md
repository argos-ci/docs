---
description: >-
  Compare a new screenshot against an existing one so variants and A/B tests
  show real changes instead of appearing as brand new screenshots.
---

# Fallback baselines

Argos compares a screenshot with the screenshot of the same name in the baseline build. When a name has no match, the screenshot is reported as **added** — there is nothing to compare it with.

That's the right default, but it gets in the way when a screenshot is really a variant of an existing one. The `baseName` option lets you list the names to compare against instead, in priority order.

### The problem

Say you run an A/B test on your home page and capture each variant under its own name:

```
home.png             # variant A, the page you already ship
home-variant-b.png   # variant B, the one being tested
```

The first time variant B runs, `home-variant-b.png` doesn't exist in the baseline, so Argos reports it as added and you see no diff — even though what you actually want to review is how variant B differs from the page you ship.

### Set fallback baselines

Pass an array to `baseName`. Argos tries each name in order and compares against the first one that exists in the baseline build:

{% tabs %}
{% tab title="Playwright" %}
```ts
await argosScreenshot(page, "home-variant-b", {
  baseName: ["home-variant-b", "home"],
});
```
{% endtab %}

{% tab title="Cypress" %}
```ts
cy.argosScreenshot("home-variant-b", {
  baseName: ["home-variant-b", "home"],
});
```
{% endtab %}

{% tab title="Puppeteer" %}
```ts
await argosScreenshot(page, "home-variant-b", {
  baseName: ["home-variant-b", "home"],
});
```
{% endtab %}

{% tab title="Vitest" %}
```ts
await argosScreenshot("home-variant-b", {
  baseName: ["home-variant-b", "home"],
});
```
{% endtab %}
{% endtabs %}

With that in place:

* Once variant B has a baseline of its own, `home-variant-b.png` is used — you review it against its own history.
* Until then, Argos falls back to `home.png`, so the first build shows variant B as a change from variant A.

{% hint style="info" %}
The screenshot's own name is **not** added implicitly. List it first, as above, so the screenshot keeps comparing against itself once it has a baseline. Passing only `baseName: ["home"]` would always compare against `home.png`, ignoring variant B's own history.
{% endhint %}

### Other uses

Fallback baselines fit any case where a screenshot is a derivative of another one:

* **Feature flags** — compare a flagged variant against the unflagged page.
* **Localizations** — bootstrap a new locale from the default one.
* **Renames** — keep history across a rename by falling back to the old name.

### How the comparison is reported

A screenshot compared against a fallback shows the mapping in the snapshot metadata on the build page, for example `home-variant-b.png → home.png`, so it's clear which baseline was used.

A baseline reached through a fallback is not reported as removed, even when no screenshot in the build carries its name.

### Single-name override

`baseName` also accepts a single string, which always compares against that name:

```ts
await argosScreenshot(page, "home-variant-b", { baseName: "home" });
```

### Without an SDK

If you generate [screenshot metadata](../../../sdks-reference/screenshot-metadata.md) yourself, set `transient.baseName`:

```json
{
  "transient": {
    "baseName": ["home-variant-b.png", "home.png"]
  }
}
```

Names include the file extension here, and the project prefix if you use Playwright projects (e.g. `chromium/home.png`).
