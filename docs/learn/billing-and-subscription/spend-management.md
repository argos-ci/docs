---
description: >-
  Track your team's screenshot usage, understand what happens at your plan
  limit, and set spend thresholds to get notified or pause builds.
---

# Usage & spend management

Argos bills on screenshot usage, so keeping an eye on it is how you keep costs under control. This page covers where to find your usage, what happens when you reach your plan's limit, and how to cap spending with spend management.

### Monitor your usage

To see your team's usage details:

1. From the dashboard, select your team from the scope selector.
2. Select the **Settings** tab and go to the **Billing** section.

![The plan card showing screenshot usage in the Billing settings](<../../.gitbook/assets/plan card 9000747fcacb6b2b42aeeb9677d81816.png>)

The plan card breaks down your consumption:

* **Private project**: Screenshots taken from private projects. These count toward your plan limit and are subject to charges.
* **Public project**: Screenshots taken from open-source projects.

### What happens at your plan's limit

When you approach your plan's included screenshots, Argos alerts you. What happens when you exceed them depends on your plan:

* **Hobby plan**: Uploads are paused until the next billing period. To keep uploading, upgrade to the [Pro plan](pricing-plans.md) — you can transfer your project to a newly created team.
* **Pro plan (Stripe, usage-based)**: Extra screenshots are billed at the [per-screenshot rate](pricing-plans.md). Uploads continue uninterrupted — use [spend management](#manage-your-spend) to cap the extra cost.
* **Pro plan (GitHub Marketplace, fixed size)**: Uploads are paused until the next billing period. To keep uploading, [upgrade your plan](https://github.com/marketplace/argos-ci) to a larger size (S, M, L, XL).

### Manage your spend

{% hint style="info" %}
Spend management is available on Pro and Enterprise plans with usage-based pricing.
{% endhint %}

Spend management lets you act automatically when your team reaches a spend amount you set:

* **Get notified** when you reach thresholds of your spend amount.
* **Pause builds** on all your projects when the amount is reached.

The spend amount covers additional screenshots beyond your plan's included usage, across all projects on your team. It does not include separate **add-ons**, which Argos charges per billing period. The amount is set per billing cycle, and Argos checks your usage against it at every build.

{% hint style="warning" %}
Setting a spend amount does not stop usage by itself. To stop builds at the amount, keep the [Pause builds](#pause-builds-at-the-spend-amount) option enabled.
{% endhint %}

#### Set a spend amount

To configure spend management, you need the **Owner** role on your team.

{% stepper %}
{% step %}
### Open your team's billing settings

From the dashboard, select your team from the scope selector, then open the **Settings** tab and go to the **Billing** section.
{% endstep %}

{% step %}
### Enable Spend Management

Scroll to **Spend Management** and enable the switch.

![The Spend Management section enabled in Billing settings](<../../.gitbook/assets/spend management section 9076213ed403afcd2136d0f06cc85c8b.jpg>)
{% endstep %}

{% step %}
### Set your spend amount

Enter the amount at which you want to be notified or take action. Setting the amount halfway through a billing cycle takes your current spend into account — if you set it below what you have already spent, the configured actions (including pausing projects) trigger immediately.
{% endstep %}
{% endstepper %}

#### Threshold notifications

Once a spend amount is set, Argos emails all team owners when spending reaches **50%**, **75%**, and **100%** of the amount. The thresholds are not customizable.

#### Pause builds at the spend amount

When spend management is enabled, the **Pause builds** option is on by default: once your team reaches the spend amount, Argos pauses builds for all projects on the team. To confirm the option, enter the team slug and select **Continue**.

When builds are paused, creating a new build fails with an error explaining that the spend amount was reached. **Your CI builds will fail until you increase the spend amount or disable the Pause builds option.**
