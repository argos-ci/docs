---
description: >-
  Get the latest Argos build status and a link to the build page posted
  automatically on your GitHub pull requests.
---

# Pull request comments

Argos posts a comment on your GitHub pull requests with the latest build results, so your team sees visual changes without leaving the PR.

Every time a build status updates, Argos updates the comment with the latest status and a link to the build page.

{% hint style="info" %}
Pull request comments are available on GitHub. On GitLab, Argos reports results through [commit statuses](summary-checks.md) instead.
{% endhint %}

![Argos GitHub pull request comment](<../../.gitbook/assets/github pr comment 54bebb73962dc705b32c33f577fb9dd0.png>)

### What the comment shows

For each build, the comment lists its status, a link to inspect it, and a **Details** column that summarizes the changes — for example `2 added` or `4 changed, 3 ignored`. [Ignored screenshots](../reliability-and-flakiness/flaky-test-detection.md#ignore-changes) are counted here too, so you can see at a glance how much was filtered out as noise.

If you [deploy with Argos](../deployments/README.md), the comment also lists your deployments with their preview URLs.

### Silence pull request comments

To stop the Argos bot from commenting on your pull requests:

1. Go to your project **Settings** in Argos.
2. In the **Connected Git Repository** section, uncheck **Enable pull request comments**.
3. Save the settings.

Argos stops posting build status updates on your pull requests. Re-enable the checkbox at any time to turn them back on.
