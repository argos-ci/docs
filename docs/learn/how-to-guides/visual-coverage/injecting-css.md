---
description: Apply custom CSS at capture time to hide or restyle elements and fix flaky visual diffs in your Argos screenshots.
---

# Injecting CSS

Argos can apply custom CSS while a screenshot is taken — useful to hide or restyle elements that the [built-in helpers](../../reliability-and-flakiness/flaky-tests/argos-helpers.md#helpers) don't cover, such as third-party iframes or complex dynamic regions.

### Add CSS while taking the screenshot

All our SDKs support an `argosCSS` option that allows you to specify custom CSS evaluated during the screenshot process. The style will be removed from the page after the screenshot is taken.

```ts
// Usage in Playwright or Puppeteer
await argosScreenshot(page, "my-screenshot", {
  argosCSS: `iframe { display: none; }`,
});

// Usage in Cypress
cy.argosScreenshot("my-screenshot", {
  argosCSS: `iframe { display: none; }`,
});
```

### Add CSS in your code

Argos adds a `__argos__` class to the HTML element during screenshots. You can target this class in your CSS for Argos-specific styling.

```css
.__argos__ iframe {
  display: none;
}
```

Both approaches only affect screenshots — your app's rendering outside Argos is untouched.
