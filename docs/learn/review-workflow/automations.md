---
description: >-
  Create rules that react to build events and notify Slack or Microsoft Teams,
  so nobody has to watch Argos to know a build needs review.
---

# Automations

An automation is a rule on a project: **when** something happens to a build, **if** it matches your conditions, **then** Argos notifies a channel. It replaces the person who would otherwise have to notice a build finished and relay it.

### Open the Automations tab

1. Open your project in Argos.
2. Select the **Automations** tab.

Automations are available on team projects, and the tab requires permission to view project settings.

### The three parts of a rule

<table><thead><tr><th width="120">Step</th><th>What it does</th></tr></thead><tbody><tr><td><strong>When</strong></td><td>The build events that trigger the rule. A rule fires if <em>any</em> selected event happens.</td></tr><tr><td><strong>If</strong></td><td>Optional conditions that must <em>all</em> match for the rule to act.</td></tr><tr><td><strong>Then</strong></td><td>The actions Argos runs.</td></tr></tbody></table>

### When: build events

* **Build Completed** — the build finished processing, whatever its outcome.
* **Build Reviewed** — someone approved or rejected the build.

### If: conditions

Conditions narrow a rule so it only fires on the builds you care about. Every condition you add must match.

* **Build conclusion** — `no changes` or `changes detected`.
* **Build type** — `reference`, `check`, or `orphan`. See [build types](../platform-fundamentals/README.md#build-types).
* **Build mode** — `CI` or `monitoring`. See [build modes](../platform-fundamentals/build-modes.md).
* **Build name** — an exact build name, useful when your CI [splits builds](../how-to-guides/ci-pipelines/monorepos-setup.md).
* **Build branch** — an exact branch name, or a glob pattern such as `release/*`.

Each condition can be negated, so you can express "every branch except `main`" as a negated **Build branch** condition.

{% hint style="info" %}
Conditions are combined with AND. To notify on two unrelated cases — say, failures on `main` and anything on `release/*` — create two automations rather than one rule with both conditions.
{% endhint %}

### Then: actions

* **Send notification to Slack** — posts to a Slack channel. Requires the [Slack integration](../integrations/slack-integration.md).
* **Send notification to Microsoft Teams** — posts an adaptive card to a channel webhook. Requires the [Microsoft Teams integration](../integrations/microsoft-teams-integration.md).

If the destination isn't connected yet, the action offers the connection flow.

### Create an automation

{% stepper %}
{% step %}

#### Start a new rule

From the **Automations** tab, select **New Automation** and give it a name that says what it does — for example "Notify #frontend when main has changes".
{% endstep %}

{% step %}

#### Choose the events

Under **When**, select one or more build events.
{% endstep %}

{% step %}

#### Narrow it down

Under **If**, add conditions. Skip this step to act on every build that triggers the events.
{% endstep %}

{% step %}

#### Pick the destination

Under **Then**, choose an action and select the channel it posts to.
{% endstep %}

{% step %}

#### Test and save

Send a test notification to confirm the channel receives it, then save the automation.
{% endstep %}
{% endstepper %}

### Common recipes

<details>

<summary>Tell the team when a build needs review</summary>

**When** Build Completed · **If** Build conclusion is `changes detected` and Build type is `check` · **Then** notify your review channel.

This skips builds with no changes and skips reference builds, so the channel only hears about work that actually needs a human.

</details>

<details>

<summary>Watch a release branch only</summary>

**When** Build Completed · **If** Build branch matches `release/*` · **Then** notify your release channel.

</details>

<details>

<summary>Close the loop after review</summary>

**When** Build Reviewed · **Then** notify the channel where the build was announced, so the thread ends with the outcome.

</details>

### FAQ

<details>

<summary>Why didn't my automation fire?</summary>

Check the conditions first: they are combined with AND, so one non-matching condition stops the rule. Then confirm the event you selected is the one that actually happened — a build finishing raises **Build Completed**, not **Build Reviewed**.

</details>

<details>

<summary>Can an automation call my own endpoint?</summary>

Not today. Argos has no user-configurable outgoing webhooks — see [Integrations](../integrations/README.md#webhooks) for the alternatives, and tell us if webhooks would unblock your workflow.

</details>

<details>

<summary>Do automations apply to every project in my team?</summary>

No. Automations are configured per project, so a rule you create on one project doesn't run on the others.

</details>
