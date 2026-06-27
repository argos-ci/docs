---
description: Get the latest Argos build status and a link to the build page posted automatically on your GitHub pull requests.
---

# Pull request comments

Stay informed with Argos: Get build results directly in your GitHub pull requests for a streamlined review process and efficient change management.

### Overview

Every time there's an update to a build status, Argos automatically comments on the associated pull request thread. This comment contains the latest build status, together with a convenient link that leads you directly to the detailed build page on Argos.

![Argos GitHub pull request comment](<../../.gitbook/assets/github pr comment 54bebb73962dc705b32c33f577fb9dd0.png>)

### What the comment shows

For each build, the comment lists its status, a link to inspect it, and a **Details** column that summarizes the changes — for example `2 added` or `4 changed, 3 ignored`. [Ignored screenshots](../reliability-and-flakiness/flaky-test-detection.md#ignore-changes) are counted here too, so you can see at a glance how much was filtered out as noise.

### Silence pull request comments

If you would like to stop automatic comments from appearing on your pull request by the Argos GitHub bot, you can silence them through the project Settings:

1. Go to your project Settings in Argos.
2. In the "Connected Git Repository" section, you will find a checkbox for "Enable pull request comments".
3. Uncheck this box to disable the feature and save the settings.

Once you uncheck the box, Argos will stop posting build status updates in your pull requests. You can always re-enable it by checking the box again.
