---
description: Capture screenshots of a list of web pages with Argos using Playwright, Cypress, or Puppeteer.
---

# Capture screenshots from URLs

Cover many pages with little code: loop over a list of URLs and capture a screenshot of each. The same pattern works in Playwright, Cypress, and Puppeteer.

### Using Playwright

Generate one test per page, each capturing a screenshot with the Argos Playwright SDK:

{% code title="screenshot-pages.spec.ts" %}
```js
import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

const pages = [
  { name: "homepage", path: "/" },
  { name: "integrations", path: "/integrations" },
  { name: "contact", path: "/contact-us" },
  { name: "pricing", path: "/pricing" },
];

for (const { name, path } of pages) {
  test(`Run Argos on ${name} (${path})`, async ({ page }) => {
    await page.goto(path);
    await argosScreenshot(page, name);
  });
}
```
{% endcode %}

### Using Cypress

Generate one test per page with the Argos Cypress command:

{% code title="screenshot-pages.cy.js" %}
```js
const pages = [
  { name: "homepage", path: "/" },
  { name: "integrations", path: "/integrations" },
  { name: "contact", path: "/contact-us" },
  { name: "pricing", path: "/pricing" },
];

for (const { name, path } of pages) {
  it(`Run Argos on ${name} (${path})`, () => {
    cy.visit(path);
    cy.argosScreenshot(name);
  });
}
```
{% endcode %}

### Using Puppeteer

Loop over the pages in a standalone script and capture each with the Argos Puppeteer SDK:

{% code title="screenshot-pages.mjs" %}
```js
import puppeteer from "puppeteer";
import { argosScreenshot } from "@argos-ci/puppeteer";

const baseUrl = "http://localhost:3000";
const pages = [
  { name: "homepage", path: "/" },
  { name: "integrations", path: "/integrations" },
  { name: "contact", path: "/contact-us" },
  { name: "pricing", path: "/pricing" },
];

const browser = await puppeteer.launch();
const page = await browser.newPage();

for (const { name, path } of pages) {
  await page.goto(`${baseUrl}${path}`);
  await argosScreenshot(page, name);
}

await browser.close();
```
{% endcode %}
