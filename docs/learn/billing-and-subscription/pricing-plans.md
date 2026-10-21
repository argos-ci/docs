---
description: >-
  Compare the Hobby, Pro, and Enterprise plans to find the right Argos pricing
  for individuals, teams, or companies.
---

# Argos pricing plans

Argos offers plans for individuals, teams, and enterprises — from the free Hobby plan to fully custom Enterprise options. For current details, see the [pricing page](https://argos-ci.com/pricing).

### Hobby plan

The Hobby plan is free and belongs to your personal account. You can use it for commercial work, and connect repositories from any GitHub organization, private repositories included.

- **Price**: Free
- **Screenshots included**: 5,000 / month
- **Extra screenshots**: Not available. When you reach the limit, uploads pause until the next billing period.
- **Members**: Only you
- **Media sharing**: public share pages, 30-day retention, 50 MB per file

### Pro plan

Designed for teams, with usage-based pricing. Pro adds two things to Hobby:

- **No hard screenshot limit.** Screenshots beyond the included volume are billed at the per-screenshot rate, so uploads keep going instead of pausing. You can cap the extra cost with [spend management](spend-management.md#manage-your-spend).
- **Team collaboration.** Invite members to your team, so several people review and approve builds.

Plan details:

- **Starting price**: $100 / month
- **Screenshots included**: 35,000 / month
- **Extra screenshots**:
  - Standard: $0.004 per screenshot
  - Storybook: $0.0015 per screenshot (see [Storybook screenshots](#storybook-screenshots))
- **Optional add-ons** (Stripe subscriptions only):
  - [GitHub SSO](../account-and-access/github-single-sign-on.md): $50 / month
  - [SAML SSO](../account-and-access/saml-single-sign-on.md), with [SCIM provisioning](../account-and-access/scim-provisioning.md): $200 / month
- **Media sharing**: team-scoped or public share pages, 1-year retention, 500 MB per file

A Pro plan belongs to a team, not to a personal account. You can subscribe with a credit card through [Stripe](how-to-subscribe.md), or through GitHub Marketplace to pay via your GitHub invoice.

#### Pro plans on GitHub Marketplace

GitHub Marketplace plans come in fixed sizes, for GitHub organizations only. They have no extra screenshots: when you reach the plan's limit, uploads pause until the next billing period. The sizes, as listed on [Argos's GitHub Marketplace page](https://github.com/marketplace/argos-ci), which is the reference for these prices:

- **Pro S**: $100 / month, 35,000 screenshots / month
- **Pro M**: $300 / month, 100,000 screenshots / month
- **Pro L**: $500 / month, 150,000 screenshots / month
- **Pro XL**: $1,000 / month, 300,000 screenshots / month

See [Usage & spend management](spend-management.md) for how each billing model handles the limit.

### What counts as a screenshot

Every snapshot Argos stores for a build counts as one screenshot, whether it is an image or a non-image file such as Markdown, JSON or HTML. Each [ARIA snapshot](../how-to-guides/visual-coverage/adding-aria-snapshots-manually.md) (`.aria.yml` file) also counts as one screenshot.

[Media uploads](../media/) draw on the same allowance rather than a separate quota: one uploaded image counts as 1 screenshot, and one uploaded video as 25 — a video costs more to store and to serve. Uploading the same file twice is free.

The monthly allowance belongs to the account, your personal account or your team, and covers all of its projects together. See [How usage is counted](spend-management.md#how-usage-is-counted).

#### Storybook screenshots

A screenshot is billed at the Storybook rate when it was captured by:

- `@argos-ci/storybook`, with the Storybook Test Runner or the Vitest plugin.
- `@argos-ci/vitest`, in a test that renders a Storybook story, for example through `@storybook/addon-vitest` or `composeStories()`.

Every other screenshot is billed at the standard rate. That includes screenshots taken with `@argos-ci/playwright`, even of a Storybook and even inside `@storybook/test-runner`, and images you upload with the CLI that no Argos SDK captured, such as Storycap screenshots of a [legacy Storybook](../../quickstart/storybook-quickstart/storybook-legacy-less-than-v8-quickstart.md).

Your plan's included screenshots go to standard screenshots first. Storybook screenshots use what is left, and each screenshot beyond the included volume is billed at its own rate.

### Data retention

Argos keeps your builds, screenshots and diffs with no expiry, on every plan.

Media sharing files have their own retention, which depends on your plan: see [Share links, retention and limits](../media/share-links-retention-and-limits.md#retention).

### Open-source plan

Argos sponsors selected [open-source projects](open-source.md) with free usage, evaluated case by case.

### Enterprise plan

For large organizations with custom requirements: custom screenshot volumes, [SAML single sign-on](../account-and-access/saml-single-sign-on.md) with [SCIM provisioning](../account-and-access/scim-provisioning.md), and [fine-grained access control](../account-and-access/team-members-and-roles.md).

[Contact us](https://argos-ci.com/contact) to design the right plan for your business.
