---
description: See flaky badges, stability scores, and detailed history so you can review changed tests in Argos with confidence.
---

# Flaky test detection

Argos flags unstable tests so you can decide with confidence. See a flaky badge next to every changed test and dive into detailed history and stability scores on a dedicated test page.

![Flaky indicator next to a test change](<../../.gitbook/assets/flaky indicator 8b0a3212a9d038be252e87cea60354d8.png>)

_Example of the flaky indicator in a build review_

### View flaky indicators in your build review

1. Open any build in Argos.
2. Spot the flaky badge beside each changed test.
3. Hover over the badge to see details about the test's stability.

### Explore the test page

Select the flaky badge to open the test page, which shows the full history of the test and its stability score.

![Test page showing history and flaky score](<../../.gitbook/assets/test page example 44fb44458d2d5a457bad6eb9d6ddb29c.png>)

_A sample test page with history timeline and score_

On the test page you will find:

* A timeline of every change that affected the test.
* A stability graph showing the pass rate over time.
* A flakiness score from 0 to 100, summarizing the test's stability and consistency.
* The list of changes detected on the test.

Use this information to approve stable tests or flag flaky ones for fixes.

### See all flaky tests at a glance

The test page focuses on a single test. For a project-wide view that ranks every test by flakiness score, open the [Tests dashboard](tests-dashboard.md).

### Ignore changes

When reviewing a build in Argos, you may encounter changes that are not relevant or are caused by flakiness. You can **ignore a specific change** directly from the UI.

From the build page or the test page, select the **Ignore** button next to the change you want to ignore.

Once ignored, Argos will no longer notify you if this **exact same change** happens again in future builds. This lets you filter out noise while keeping future regressions detectable.

#### How Argos recognizes the same change

Each visual change carries a **fingerprint**: a stable signature computed from the shape of its diff. Visually similar diffs on the same test produce the same fingerprint, and an ignored change is a test-plus-fingerprint pair — any future diff matching the pair is ignored automatically. The fingerprint absorbs pixel-level noise such as antialiasing but distinguishes genuinely different changes, so ignoring one flaky change never hides a new regression elsewhere in the screenshot. You'll encounter the fingerprint in the [API](https://argos-ci.com/docs/api-reference) and [CLI](../../sdks-reference/argos-command-line-interface-cli.md#change-ignore) as part of a change's identity.

Ignored screenshots are also reflected in the [pull request comment](../review-workflow/pull-request-comments.md): the **Details** column reports how many screenshots were ignored alongside the other counts (for example, `4 changed, 3 ignored`).

### Configure what Argos ignores

You control the ignore feature per project from **Project Settings → Flaky detection**.

The **Ignore changes** card has a single toggle, **Enable the ignore feature for this project**, which is on by default. When you turn it off:

* New builds ignore nothing — every change is treated as not ignored.
* Auto-ignore is turned off.
* The **Ignore** button is hidden when reviewing builds.

{% hint style="info" %}
Disabling the feature only changes how **new** builds are computed. Previous builds are not affected — changes already ignored stay ignored on those builds.
{% endhint %}

### Automatically ignore recurring flaky changes

When the ignore feature is enabled, Argos can automatically ignore recurring flaky changes across builds, so you don't have to ignore each one by hand.

To configure auto-ignore:

1. Open your project in Argos.
2. Go to **Project Settings → Flaky detection**.
3. In the **Automatically ignore flaky changes** card, enable **Auto-ignore flaky changes**.
4. Set **Minimum occurrences to consider a change flaky (last 7 days)**.
5. Select **Save**.

![Auto-ignore flaky changes in project settings](<../../.gitbook/assets/auto ignore fce4000798bcef00801460c36c56dbad.png>)

A change is considered flaky once it appears at least this many times in auto-approved builds within the last 7 days. The default threshold is **3** occurrences.

#### Best use cases

* Flaky UI elements that appear/disappear randomly or render inconsistently.
* Non-deterministic image rendering (e.g. base64 previews, antialiasing issues).
