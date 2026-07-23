---
description: How long Argos deployments last, why they can't be overwritten, and how to pick a deploy cadence without cleaning up old builds.
---

# Lifecycle and retention

Deployments are permanent, immutable records. Once a deployment is ready, it keeps working at its own URL and Argos never expires it, replaces it in place, or removes it automatically. This page explains what that means for how you deploy and how often.

### How long deployments last

A deployment has no expiration. It stays reachable at its immutable [deployment URL](urls-and-domains.md#deployment-url) for as long as the project exists—whether it was created minutes ago or months ago.

There is no retention window to configure and nothing that ages deployments out. The only way a deployment stops existing is if you delete the whole project (see [Deleting deployments](#deleting-deployments)).

### Overwriting a deployment

You can't overwrite a deployment. Every `argos deploy` run creates a **new** deployment with its own immutable URL—the previous one keeps working untouched.

What moves instead of being overwritten are the shared URLs:

* The [branch URL](urls-and-domains.md#branch-url) always points at the latest deployment on that branch. Re-deploying the same branch updates the branch URL to the new build; the previous deployment stays available at its own deployment URL.
* The [production domain](urls-and-domains.md#production-domain) always serves the latest promoted production deployment. A new production deployment takes over the domain immediately; earlier production builds stay reachable on their own URLs.

So from a reviewer's point of view, a new deploy on the same branch effectively supersedes the old one—the link they use keeps showing the latest build—without any manual cleanup, and without losing the older builds' stable URLs.

### Deleting deployments

Individual deployments can't be deleted, the same way [builds are immutable records](../review-workflow/builds-list.md#faq). There's no bulk-delete and nothing you need to clear out: deployments don't age, and they don't count toward your [screenshot quota](../billing-and-subscription/pricing-plans.md) (that quota applies to visual testing, not deployments).

If you ever need to remove every deployment for a project, delete the project from **Settings → General**. This removes the project entirely, including its builds and deployments, and can't be undone.

### Choosing a deploy cadence

Because deployments never pile up in a way you have to manage, you can deploy as often—or as rarely—as fits your workflow:

* **On every pull request** — The most common setup. Each PR push creates a preview deployment and the link appears in the [pull request comment](../review-workflow/pull-request-comments.md). See [Use deployments in CI](use-deployments-in-ci.md).
* **On a subset of pull requests** — If you don't need a preview on every PR, gate the deploy step on a label (for example, only run `argos deploy` when a `deploy-preview` label is present) or on changes to the relevant directory.
* **On releases** — Deploy to [production](environments.md#production-deployments) from your release branch, either by matching the [production branch pattern](environments.md#configure-the-production-branch) or by passing `--prod`.

Attaching previews to a PR label and running production deploys on releases is a perfectly reasonable setup—there's no downside to old deployments sticking around, and no cleanup step to schedule.

### FAQ

<details>

<summary>How long do deployments stick around?</summary>

Indefinitely. Deployments don't expire—each one stays reachable at its immutable deployment URL for as long as the project exists.

</details>

<details>

<summary>Can I overwrite a previous deployment?</summary>

No. Every deploy creates a new immutable deployment. The branch URL and production domain automatically move to point at the latest build, so the links people share stay current, while older builds remain available at their own URLs.

</details>

<details>

<summary>Do I have to bulk-delete old deployments to clear them out?</summary>

No. There's nothing to clean up—deployments don't age out and don't count toward your screenshot quota. Individual deployments can't be deleted; the only way to remove them all is to delete the project.

</details>

### Related

* [Deployments overview](./)
* [URLs and domains](urls-and-domains.md)
* [Environments](environments.md)
