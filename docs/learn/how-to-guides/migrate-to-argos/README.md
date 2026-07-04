---
description: >-
  Step-by-step guides for switching to Argos from Percy, Chromatic, Applitools,
  native Playwright screenshots, or BackstopJS.
---

# Migrate to Argos

Already running visual tests with another tool? These guides walk you through moving to Argos without rewriting your test suite. In most cases you keep your existing tests and only swap the SDK, the snapshot call, and the CI step.

Argos is built around three ideas that shape every migration:

* **Keep your tests.** Argos plugs into Playwright, Cypress, Storybook, WebdriverIO, and Puppeteer, or takes screenshots from any pipeline through the [CLI](../../../sdks-reference/argos-command-line-interface-cli.md). You don't rewrite tests to switch.
* **Baselines live in Git, not in your repo.** Argos selects the [baseline build](../../platform-fundamentals/baseline-build.md) automatically from your Git history, so there are no reference images to commit, update, or resolve in merge conflicts.
* **Review happens on the pull request.** Diffs are approved or rejected in the Argos app and reported back as a [commit status](../../platform-fundamentals/build-modes.md) and [PR comment](../../review-workflow/pull-request-comments.md).

### Pick your current tool

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Percy (BrowserStack)</strong></td><td>Replace <code>@percy/*</code> SDKs and <code>percy exec</code> with the Argos reporter.</td><td><a href="from-percy.md">from-percy.md</a></td></tr><tr><td><strong>Chromatic</strong></td><td>Move Storybook, Playwright, or Cypress visual tests off the <code>chromatic</code> CLI.</td><td><a href="from-chromatic.md">from-chromatic.md</a></td></tr><tr><td><strong>Applitools Eyes</strong></td><td>Replace <code>eyes.check()</code> and the Ultrafast Grid with Argos screenshots.</td><td><a href="from-applitools.md">from-applitools.md</a></td></tr><tr><td><strong>Playwright screenshots</strong></td><td>Move off committed <code>toHaveScreenshot()</code> snapshots to hosted review.</td><td><a href="from-playwright-native-screenshots.md">from-playwright-native-screenshots.md</a></td></tr><tr><td><strong>BackstopJS</strong></td><td>Move from self-hosted <code>backstop.json</code> scenarios to a hosted workflow.</td><td><a href="from-backstopjs.md">from-backstopjs.md</a></td></tr></tbody></table>

### Don't see your tool?

If you're coming from a tool that isn't listed, the [Any test framework](../../../quickstart/any-test-framework.md) quickstart covers the generic path: capture screenshots however you do today, then upload them with `argos upload`. [Contact support](https://argos-ci.com/contact) if you'd like help planning a migration.
