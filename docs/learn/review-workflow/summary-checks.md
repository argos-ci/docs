---
description: >-
  Configure Argos summary checks to combine commit statuses into one required
  status check before merging.
---

# Summary checks

A **summary check** is a single commit status — `argos/summary` — that combines the result of all Argos builds on a commit. When your CI produces several builds (for example, one per app in a monorepo), the summary check gives you one status to glance at, and one status to require.

By default, Argos adds the summary check **only when a commit has more than one build** — a single build keeps its individual status (`argos`, or `argos/<build-name>` for a named build) with no summary added. See [Commit status names](../integrations/github-integration.md#commit-status-names) for the exact context of each status Argos posts.

![Summary status check in GitHub](<../../.gitbook/assets/summary check d7953362698c802ff3f81de23bfb83cc.png>)

Summary checks are particularly useful as a [required status check before merging](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging): require the summary check instead of each individual build check, and the requirement keeps working as you add or rename builds.

![Required Argos status check in GitHub](<../../.gitbook/assets/required status check 0c8c4bf869c27334b7e13f5decd2ff08.png>)

### Options

Argos offers three settings for summary checks:

* **Add a summary check only if there is more than one build** — The default, recommended for most projects. The summary check appears when there are multiple builds to combine, and stays out of the way otherwise.
* **Always add a summary check** — The summary check is posted even for a single build. Choose this if you require the summary check in your branch protection and some commits produce only one build — the required check is then always present.
* **Never add a summary check** — Disable summary checks entirely if they don't add value to your workflow.

Summary checks are an additional layer of status reporting — they never replace the individual build statuses.

### Configure summary checks

1. Go to your project **Settings** in Argos.
2. Locate the **Summary Checks** section.
3. Choose the option that fits your project.
4. Select **Save** to apply the changes.

![Configure summary checks in Argos](<../../.gitbook/assets/configure summary checks db8f96ec82fc779a58d5e273c492cf02.png>)
