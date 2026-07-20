---
description: Learn how Argos works and where to start.
icon: book-open
---

# Overview

Argos is a visual testing platform that catches visual regressions before they reach production. Your tests capture screenshots, Argos compares them against a baseline, and you review the changes on your pull requests.

It works with the tools you already use — Playwright, Storybook, Cypress, Vitest, or any pipeline that produces screenshots.

### How it works

<figure><img src=".gitbook/assets/argos-schema-web.png" alt="Diagram of the Argos workflow, from capturing screenshots in CI to approving changes on the pull request"><figcaption></figcaption></figure>

1. **Your tests capture** screenshots in CI.
2. **Your CI uploads** the screenshots to Argos.
3. **Argos compares** them against the [baseline build](learn/platform-fundamentals/baseline-build.md).
4. **You review** visual diffs on the pull request.
5. **You approve** expected changes or reject regressions.
6. **Argos updates** the pull request check, so you can merge with confidence.

### When to use Argos

Use Argos when visual changes affect product quality or release confidence:

* **UI regressions**: Catch broken layouts, CSS changes, and missing images, icons, or fonts.
* **Design systems**: Track component changes across themes, browsers, and viewports.
* **Product variants**: Validate white-labeled interfaces, translations, and localized layouts.
* **AI-generated UI**: Visually validate generated changes before merging them.

### Open source and self-hosting

Argos is open source: the whole platform — backend, frontend, and the screenshot comparison engine — is developed in the open in the MIT-licensed [argos-ci/argos](https://github.com/argos-ci/argos) repository. There is no closed-source component behind the diff service.

Argos is operated as a managed cloud service, and that is the supported way to run it. Self-hosting is not officially supported or documented: the production setup targets AWS and depends on PostgreSQL, RabbitMQ, Redis, S3, and DynamoDB, plus integrations such as the GitHub App and Stripe — you would be on your own to deploy and operate them. If your organization has strict hosting or compliance requirements, [contact us](https://argos-ci.com/contact) about the Enterprise plan.

### Get started

Ready to add Argos to your project? Pick your framework in the [Quickstart](quickstart/README.md) — you'll upload your first build and see it on a pull request in a few minutes.

### Explore more

Once Argos is set up, go deeper:

* [Core concepts](learn/platform-fundamentals/README.md) – How Argos compares screenshots and picks a baseline
* [Review workflow](learn/review-workflow/README.md) – Review builds in the dashboard and on your pull requests
* [Stabilize screenshots](learn/reliability-and-flakiness/flaky-tests/README.md) – Keep your visual tests free of flakiness
* [Integrations](learn/integrations/README.md) – Connect GitHub, GitLab, and Slack
