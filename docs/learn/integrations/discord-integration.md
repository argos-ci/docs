---
description: >-
  Send Argos build notifications to a Discord channel using an incoming
  webhook.
---

# Discord integration

Connect Argos to Discord to notify your team about visual changes directly in a channel.

{% hint style="info" %}
The Discord integration is configured at team level and is available on Pro and Enterprise plans.
{% endhint %}

### What you get

- Automatic Discord notifications when builds are created, reviewed, approved, or rejected.
- Fine-grained control over notifications using automation conditions.
- Notifications rendered as embeds, with the build status, project, commit, branch, pull request, and a direct link to the build.

### How it works

Like Microsoft Teams and unlike Slack, Argos does not install a bot in your Discord server. You create a **webhook** in the channel you want to notify and paste the URL it gives you into Argos. Argos then posts embeds to that URL.

This has two consequences worth knowing before you start:

- **One webhook per channel.** Each channel you want to notify needs its own webhook and its own URL in Argos.
- **No URL unfurling.** Pasting an Argos build URL in Discord does not produce a build preview. The connection is outbound only, so Argos never sees messages posted in Discord.

{% hint style="info" %}
You need the **Manage Webhooks** permission on the channel to create one. If you don't see the **Integrations** tab, ask a server admin.
{% endhint %}

### Create the webhook in Discord

{% stepper %}
{% step %}

#### Open the channel integrations

In Discord, hover the channel you want to notify, select the gear icon to **Edit Channel**, then open the **Integrations** tab.

You can also reach it from **Server Settings** › **Integrations** › **Webhooks**.
{% endstep %}

{% step %}

#### Create the webhook

Select **Webhooks**, then **New Webhook**. Discord creates one targeting the current channel.

The name and avatar you give the webhook here are cosmetic: Argos posts under the name **Argos**, whatever the webhook is called in Discord.
{% endstep %}

{% step %}

#### Copy the webhook URL

Select **Copy Webhook URL**.

The URL looks like `https://discord.com/api/webhooks/<id>/<token>`.
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
The webhook URL ends with a token. Anyone holding it can post messages to that channel. Treat it like a secret and avoid sharing it in tickets or chat.

Argos lists each connected channel with its webhook URL underneath, so you can tell two webhooks apart. Only team admins see the whole URL; for everybody else the token is masked as `***`.
{% endhint %}

### Connect the channel to your team

{% stepper %}
{% step %}

#### Open your team integrations

From the dashboard, select your team from the scope selector, go to the team's **Settings** tab, then the **Integrations** section.
{% endstep %}

{% step %}

#### Add the channel

In the **Discord** card, enter a **Name** to identify the channel in Argos, paste the **Webhook URL**, and select **Add channel**.

The name is only a label: a webhook URL never reveals which channel it points to, so pick something recognizable such as `#engineering`.
{% endstep %}

{% step %}

#### Send a test message

Open the channel's actions menu (**⋯**) and select **Send a test message** to post a confirmation embed. If it arrives in Discord, the connection works.

The same menu holds **Copy webhook URL** and **Remove channel**.
{% endstep %}
{% endstepper %}

### Set up Discord notifications

Create a notification rule with Argos [automations](../review-workflow/automations.md):

1. Select a project in your Argos team.
2. Go to the **Automations** tab and select **New Automation**.
3. Name your automation, e.g., "Notify Discord on build completion".
4. Under **WHEN**, select one or several events that trigger the notification.
5. (Optional) Under **IF**, add conditions such as "Build type is check".
6. Under **THEN**, choose the action **Post in Discord channel**. If no channel is connected yet, select **Connect Discord** and follow the steps above.
7. Select the channel to notify.
8. Select **Send Test Notification** to verify the rule. An embed built from your project's latest build is sent to the selected channel.
9. Select **Create Rule** to activate it.

### Troubleshooting and tips

- **"This does not look like a Discord webhook URL".** Argos only accepts webhook URLs served by Discord: `discord.com`, `discordapp.com`, and the `canary` and `ptb` release channels. Copy the URL with **Copy Webhook URL** rather than retyping it, and keep the whole `/api/webhooks/<id>/<token>` path.
- **Nothing arrives in the channel.** Check that the webhook still exists in the channel's **Integrations** tab. Deleting it silently stops delivery; use **Send a test message** in Argos to surface the error.
- **Notifications stopped after a while.** Deleting and recreating a webhook in Discord issues a new token. Copy the new URL and replace it in Argos.
- **The channel moved or was deleted.** A webhook is bound to the channel it was created in. Create a new webhook in the new channel and replace the URL in Argos.
- **Send Test Notification does nothing.** The automation form must be valid first, including the rule name.
- Only Argos team admins can add, test, or remove channels.

Need help setting up the Discord integration? Reach out on our [Discord community](https://argos-ci.com/discord) or [contact support](https://argos-ci.com/contact).
