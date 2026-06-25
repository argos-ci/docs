---
description: Categorize and filter screenshots by tag so you can focus a build review on the changes you care about.
---

# Tags

Tags let you categorize screenshots so you can quickly filter a build down to the changes you care about. For example, you might tag screenshots by page area, feature, or test suite and then review only the relevant subset during a build review.

### Filtering by tags in the UI

![Filter button](<../../.gitbook/assets/filter button 2 3476f14b8e3670b8e55d112ce91efa7b.png>)

1. Open a build in Argos.
2. Click the **Filter button**.
3. Select one or more tags to narrow the screenshot list.
4. Once selected, a filter chip appears.

### Where tags come from

Tags can come from two sources in [screenshot metadata](../how-to-guides/visual-coverage/adding-screenshot-metadata.md):

| Source         | Field       | Description                                                                                                                                       |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Screenshot** | `tags`      | Custom tags you define to categorize the screenshot itself.                                                                                       |
| **Test**       | `test.tags` | Tags inherited from the test that generated the screenshot (e.g. Playwright [test tags](https://playwright.dev/docs/test-annotations#tag-tests)). |

### Adding custom tags through SDKs

#### Playwright

Playwright test tags are automatically forwarded to Argos. You have several options for how to add tags to your Playwright tests.

<pre class="language-ts" data-title="tests/homepage.spec.ts"><code class="lang-ts"><strong>import { test } from "@playwright/test";
</strong>import { argosScreenshot } from "@argos-ci/playwright";

// Option 1: At the describe level with the @ prefix
test.describe("Homepage @desktop @homepage", () => {
  // Option 2: In the test name with the @ prefix
  test("homepage @desktop @homepage", async ({ page }) => {
    await page.goto("/");
    await argosScreenshot(page, "homepage");
  });

  // Option 3: As a test option
  test("homepage", { tag: ["@desktop", "@homepage"] }, async ({ page }) => {
    await page.goto("/");
    await argosScreenshot(page, "homepage");
  });

  // Option 4: In the argosScreenshot options
  test("homepage", async ({ page }) => {
    await page.goto("/");
    await argosScreenshot(page, "homepage", {
      tags: ["@desktop", "@homepage"],
    });
  });
});
</code></pre>

Read the [Playwright test tags documentation](https://playwright.dev/docs/test-annotations#tag-tests) for more details on how to use test tags in your tests.

#### Cypress

In Cypress, you can add tags to screenshots through the `tags` option in the `cy.argosScreenshot` command.

{% code title="cypress/e2e/homepage.cy.js" %}
```js
it("screenshot homepage", () => {
  cy.visit("http://localhost:3000/");
  cy.argosScreenshot("homepage", { tags: ["@desktop", "@homepage"] });
});
```
{% endcode %}

#### Puppeteer

In Puppeteer, you can add tags to screenshots through the `tags` option in the `argosScreenshot` function.

{% code title="tests/homepage.spec.js" %}
```js
import { argosScreenshot } from "@argos-ci/puppeteer";
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://localhost:3000/");
  await argosScreenshot(page, "homepage", {
    tags: ["@desktop", "@homepage"],
  });
  await browser.close();
})();
```
{% endcode %}
