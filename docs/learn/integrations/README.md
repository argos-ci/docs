---
description: >-
  Connect Argos to your Git provider for pull request statuses, authenticate
  your CI uploads, get notified in Slack, and send events to your own
  endpoints with webhooks.
---

# Integrations

Argos integrates with your Git provider to post build statuses on pull requests, and with Slack, Microsoft Teams, or Discord to notify your team. Which notifications go where is decided by [automations](../review-workflow/automations.md). To act on builds and deployments from your own code, use [webhooks](webhooks.md).

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

[Webhooks](webhooks.md) send a signed `POST` request to your endpoint when a build completes or gets reviewed, and when a deployment is created or ready. The same events are available from the REST API and the [Argos MCP server](../../agents/mcp-server.md), for when you'd rather poll.
