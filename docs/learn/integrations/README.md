---
description: >-
  Connect Argos to your Git provider for pull request statuses, authenticate
  your CI uploads, and get notified in Slack.
---

# Integrations

Argos integrates with your Git provider to post build statuses on pull requests, and with Slack, Microsoft Teams, or Discord to notify your team. Which notifications go where is decided by [automations](../review-workflow/automations.md).

### Git providers

* [GitHub integration](github-integration.md) – Install the Argos GitHub App for statuses, comments, and merge queue support
* [GitLab integration](gitlab-integration.md) – Connect GitLab to get statuses on merge requests
* [Other Git providers](other-git-providers.md) – Bitbucket and Azure DevOps status, and how to use Argos without a native integration

### CI authentication

* [GitHub Actions authentication](github-actions-authentication.md) – Authenticate uploads with a token, OIDC, or tokenless authentication

{% hint style="info" %}
Looking for how to sign in to Argos itself? See [Account & access](../account-and-access/README.md) for GitHub and SAML single sign-on.
{% endhint %}

### Notifications

* [Slack integration](slack-integration.md) – Send build notifications to Slack channels with automations
* [Microsoft Teams integration](microsoft-teams-integration.md) – Send build notifications to a Teams channel with automations
* [Discord integration](discord-integration.md) – Send build notifications to a Discord channel with automations

### Webhooks

Argos does not offer user-configurable outgoing webhooks. To react to build events, use [Slack](slack-integration.md), [Microsoft Teams](microsoft-teams-integration.md), or [Discord](discord-integration.md) notifications, the commit statuses posted on your Git provider, or poll builds from the [REST API](https://argos-ci.com/docs/api-reference) or the [CLI](../../sdks-reference/argos-command-line-interface-cli.md#inspecting-builds-and-tests). If webhooks would unblock your workflow, [tell us about your use case](https://argos-ci.com/contact).
