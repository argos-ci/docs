---
description: Capture a signup, a checkout or an onboarding as a journey with Argos, so each change is reviewed next to the screens before and after it.
---

# Capture user journeys

A test that walks a flow, such as a signup or an onboarding, and captures each screen along the way gives a **journey**: in the build review, Argos shows those screens as a strip of steps, in the order the test captured them. See [Follow a journey step by step](../../review-workflow/review-a-build.md#follow-a-journey-step-by-step).

There is nothing to configure. Walk the flow in a test and capture each screen along the way:

{% tabs %}
{% tab title="Playwright" %}
{% code title="onboarding.spec.ts" %}
```ts
import { test, expect } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

test("onboarding", async ({ page }) => {
  await page.goto("/signup");
  await argosScreenshot(page, "signup");

  await page.getByLabel("Email").fill("jane@example.com");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Create your workspace" }),
  ).toBeVisible();
  await argosScreenshot(page, "create-workspace");

  await page.getByLabel("Workspace name").fill("Acme");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(
    page.getByRole("heading", { name: "Invite your team" }),
  ).toBeVisible();
  await argosScreenshot(page, "invite-team");
});
```
{% endcode %}
{% endtab %}

{% tab title="Cypress" %}
{% code title="onboarding.cy.ts" %}
```ts
it("onboarding", () => {
  cy.visit("/signup");
  cy.argosScreenshot("signup");

  cy.get("input[name=email]").type("jane@example.com");
  cy.contains("button", "Continue").click();
  cy.contains("h1", "Create your workspace");
  cy.argosScreenshot("create-workspace");

  cy.get("input[name=workspace]").type("Acme");
  cy.contains("button", "Create").click();
  cy.contains("h1", "Invite your team");
  cy.argosScreenshot("invite-team");
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

* **One test per path.** A signup with several options gets one test per option, not one test that walks them all.
* **Unique names.** A screen captured by several tests needs one name per test: put the path in it, such as `free-signup` and `team-signup`. When that screen changes, Argos [groups the identical changes](../../review-workflow/review-a-build.md#review-similar-changes-together) in one row, so you review it once. The order comes from the calls, so there is nothing to number.

{% hint style="info" %}
Journeys work with Playwright, Cypress and Vitest. The order of the steps is recorded by `@argos-ci/playwright` 7.5.1, `@argos-ci/cypress` 7.2.1 and `@argos-ci/vitest` 0.6.1 and above: with an earlier version, the steps fall back to alphabetical order.
{% endhint %}
