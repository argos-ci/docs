---
description: Connect Argos to Slack for build notifications and rich previews when you paste an Argos build URL.
---

# Slack integration

Connect Argos to Slack to notify your team about visual changes and get rich previews when an Argos build URL is shared in Slack.

{% hint style="info" %}
The Slack integration is available on Pro and Enterprise plans.
{% endhint %}

### What you get

* Automatic Slack notifications when builds are created, reviewed, approved, or rejected.
* Rich previews when pasting an Argos build URL in Slack.
* Fine-grained control over notifications using automation conditions.

### Slack notifications

Notifications are driven by **automations**: rules that post messages to the right channels at the right time. Typical signals you may want to route to Slack:

* A build is ready for review.
* Changes are requested.
* A build is auto-approved on main.
* Only failed or blocking builds.

Notifications include the build status, branch, author, and a direct link to the build.

![Slack notification sent by Argos](<../../.gitbook/assets/slack notification example 937c6480622562c1b7b2641fd364e254.png>)

_Example of a Slack notification sent by Argos_

### URL unfurling in Slack

When you paste an Argos build URL into Slack, Argos automatically unfurls it.

The preview includes:

* Build status and outcome
* Project and branch
* Direct shortcut to open the build in Argos

This works in messages, threads, and shared links, which makes reviews and handoffs easier without extra clicks.

### Connect Slack to your team

Connecting your Slack workspace enables URL unfurling and makes Slack available as an automation action.

1. From the dashboard, select your team from the scope selector.
2. Go to the team's **Settings** tab.
3. Select the **Integrations** section.
4. Select **Connect to Slack** and follow the connection flow.

### Set up Slack notifications

Create a notification rule with Argos automations:

1. Select a project in your Argos team.
2. Go to the **Automations** tab and select **New Automation**.
3. Name your automation, e.g., "Notify Slack on build completion".
4. Under **WHEN**, select one or several events that trigger the notification.
5.  (Optional) Under **IF**, add conditions such as "Build type is check".

    ![Automation conditions example](<../../.gitbook/assets/automation conditions 6bc66f9d8c99db7e8601ac368a9fda4c.png>)
6. Under **THEN**, choose the action **Send notification to Slack**. If your workspace isn't connected yet, select **Connect to Slack** and follow the connection flow.
7.  Select the Slack channel and optionally provide the channel ID.

    ![Locate Slack channel ID](<../../.gitbook/assets/slack channel id 7e607e0f5800c51bc38f17bb856ac88c.png>)

    _Finding the ID of a Slack channel_
8. Select **Send test notification** to verify the connection. A test message is sent to the selected channel.
9. Select **Create Rule** to activate it.

### Troubleshooting and tips

* Make sure the Argos app is authorized in your Slack workspace.
* For private channels, manually invite the bot with `/invite @Argos`.
* Only Argos team admins can configure Slack integrations.
* You can test notifications anytime using **Send test notification**.

Need help setting up Slack integration? Reach out via [Discord](https://argos-ci.com/discord) or [contact support](https://argos-ci.com/contact).
