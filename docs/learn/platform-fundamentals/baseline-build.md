---
description: >-
  Argos compares screenshots to a chosen baseline build, determined by analyzing
  the commit history of your Git project.
---

# Baseline build

{% hint style="info" %}
This documentation covers Argos's Continuous Integration (CI) mode. For Monitoring mode, refer to the [Monitoring documentation](build-modes.md#monitoring-mode).
{% endhint %}

### What is a baseline build?

A **baseline build** serves as the reference point for comparing screenshots to detect visual changes. Each new build is compared against its corresponding baseline build.

### How does Argos determine the baseline build?

Argos selects the baseline build by finding the most recent **candidate build** that meets all of the following conditions:

1. Has the same build name as the triggered build
2. All framework tests passed
3. Build is not marked as [_subset_](../how-to-guides/ci-pipelines/subset-builds.md)
4. Be auto-approved, manually approved or orphan
5. Its commit is an ancestor of the merge base between the triggered build's commit and the baseline branch

### What is the baseline branch?

The **baseline branch** is the branch Argos uses as the reference for determining the baseline build:

* For pull request builds, the base branch of the pull request is used.
* For push events, Argos uses the default baseline branch configured in your project.

{% hint style="info" %}
By default, the repository's default branch is used as the baseline branch. You can modify this in the Argos project settings.
{% endhint %}

### Auto-approved branches

Argos supports **auto-approved branches**, where branches matching specified patterns (e.g., `main`, `master`, or `develop`) are automatically approved for comparison.

{% hint style="info" %}
By default, Argos auto-approves your default baseline branch. You can configure auto-approved branches in the Argos project settings.
{% endhint %}

### Configuring branches in project settings

In the project settings, you can configure both the default baseline branch and any auto-approved branches.

![Project branches settings](<../../.gitbook/assets/project branches settings d4c960a48175260947ee018ec2ac371a.png>)

### Choose a custom baseline build via SDK

Argos SDKs allow you to specify a custom baseline build if needed. This can be done using environment variables:

* `ARGOS_REFERENCE_BRANCH`: The branch name used as the custom baseline.
* `ARGOS_REFERENCE_COMMIT`: The commit hash used to select a specific baseline build.

### Orphan builds

An **orphan build** occurs when Argos has no prior screenshots to compare against. This is expected for a project's first builds; subsequent builds will establish a baseline automatically once approved.
