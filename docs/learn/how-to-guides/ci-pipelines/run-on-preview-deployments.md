---
description: Run Argos visual tests against Vercel, Netlify, or Cloudflare preview deployments to catch regressions before merging.
---

# Run on preview deployments

Catch visual regressions **before merging** by running automated tests on every preview deployment.

Argos integrates with GitHub Actions and works with providers like **Vercel, Netlify, and Cloudflare**.

With this setup:

* Each deployment preview is tested automatically.
* Regressions are surfaced directly in your pull requests.
* Your production baseline stays reliable and up to date.

### Setup with Vercel repository dispatch events

Vercel can notify GitHub on every deployment via a [`repository_dispatch` event](https://vercel.com/docs/git/vercel-for-github#repository-dispatch-events).

Argos can use this payload to run visual tests against the preview URL.

{% code title=".github/workflows/ci.yml" %}
```yaml
name: Playwright + Argos Tests

on:
  repository_dispatch:
    types:
      - "vercel.deployment.success"

permissions:
  contents: read
  # Required to access pull request metadata for Argos with GITHUB_TOKEN
  pull-requests: read

jobs:
  run-e2es:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6

      - name: Install dependencies
        run: npm ci && npx playwright install --with-deps

      - name: Print context (optional)
        run: |
          echo "URL: $BASE_URL"

      - name: Run Playwright tests with Argos reporter
        run: npx playwright test
        env:
          # URL of the preview deployment used by your test as the base URL.
          BASE_URL: ${{ github.event.client_payload.deployment.url }}
          # Provided by GitHub used by Argos to link builds to branches and pull requests
          # Optional, if not provided Argos will not link builds to PRs
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
{% endcode %}

### Setup with GitHub deployment status events

If your hosting provider emits GitHub Deployments events (Vercel, Netlify, Cloudflare), you can trigger tests from the [`deployment_status` event](https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status).

The event carries the preview URL when a deployment becomes successful.

{% code title=".github/workflows/ci.yml" %}
```yaml
name: Playwright + Argos Tests

on:
  deployment_status:

permissions:
  contents: read
  # Required to access pull request metadata for Argos with GITHUB_TOKEN
  pull-requests: read

jobs:
  run-e2es:
    # Run tests only if the deployment is successful
    if: github.event_name == 'deployment_status' && github.event.deployment_status.state == 'success'

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6

      - name: Install dependencies
        run: npm ci && npx playwright install --with-deps

      - name: Print context (optional)
        run: |
          echo "URL: $BASE_URL"
          echo "Branch: $ARGOS_BRANCH"

      - name: Run Playwright tests with Argos reporter
        run: npx playwright test
        env:
          # URL of the preview deployment, used by your tests as the base URL.
          BASE_URL: ${{ github.event.deployment_status.environment_url }}
          # Set only for production deployments to keep baselines stable (usually `main`).
          ARGOS_BRANCH: ${{ github.event.deployment_status.environment == 'Production' && 'main' || '' }}
          # Provided by GitHub used by Argos to link builds to branches and pull requests
          # Optional, if not provided Argos will not link builds to PRs
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
{% endcode %}

### Disable the Vercel Toolbar

By default, Vercel may inject a toolbar overlay into preview deployments. This can interfere with automated screenshots.

To avoid false diffs, disable the toolbar in your tests by sending the [`x-vercel-skip-toolbar` header](https://vercel.com/docs/vercel-toolbar/managing-toolbar#disable-toolbar-for-automation) with every request.

#### Playwright

Add the header in your `playwright.config.ts` so all test requests skip the toolbar:

{% code title="playwright.config.ts" %}
```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    extraHTTPHeaders: {
      "x-vercel-skip-toolbar": "1",
    },
  },
});
```
{% endcode %}

#### Cypress

Inject the header for all network requests in your test suite:

{% code title="support/index.ts" %}
```ts
beforeEach(() => {
  cy.intercept(`${Cypress.config("baseUrl")}**`, (req) => {
    req.headers["x-vercel-skip-toolbar"] = "1";
  });
});
```
{% endcode %}

### Running without GITHUB\_TOKEN

You can run Argos tests without exposing `GITHUB_TOKEN`. This is useful if you want to limit token scope in deployment workflows.

However, some features will not be available:

* Builds are only associated with a branch (no pull request metadata).
* No pull request link will appear in Argos.

{% hint style="info" %}
Argos SDKs warn if `GITHUB_TOKEN` is missing. To silence this, set `DISABLE_GITHUB_TOKEN_WARNING=true`.
{% endhint %}
