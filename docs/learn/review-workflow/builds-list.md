---
description: Browse, filter, and open builds for a project to scan status and drill into the runs you care about in Argos.
---

# Builds list

The Builds list is the main view for tracking every Argos build in a project. It helps you scan status, drill into a specific build, and filter down to exactly the runs you care about.

![Builds list showing build rows with status badges, change counts, and filters](<../../.gitbook/assets/builds list 1c05680bba57d079cfe4fbe60437cb0d.png>)

_A project Builds list with status badges, change counts, and filters_

### Open the Builds list

1. Open your project in Argos.
2. Click the **Builds** tab.

### What each row shows

Each row represents a single build and typically includes:

* **Build ID** and status (for example: Auto-approved, Approved, Changes detected, or Rejected).
* **Change counts** for the build (changes, additions, and removals when applicable).
* **Pull request metadata** when the build is linked to a PR.
* **Branch and commit** information.
* **Timestamp** for when the build was created.

### Filters

Use the filters at the top of the page to narrow the list:

* **Type**: Filter by build category (for example: check, orphan, or auto-approved builds).
* **Status**: Filter by review state (for example: approved, changes detected, or rejected).
* **Build name**: Filter to a specific build name when your CI splits builds (see [Build splitting](../how-to-guides/ci-pipelines/monorepos-setup.md)).

Build names in the filter are sourced from builds created in the **last month**. Builds can't be deleted, but unused build names drop out of the filter list after about a month of inactivity.

### FAQ

<details>

<summary>Can I delete a build?</summary>

No. Builds are immutable records and cannot be deleted.

</details>

<details>

<summary>Why did a build name disappear from the filter?</summary>

The build name list only includes names used in builds created within the last month. If a build name has no recent activity, it will no longer appear.

</details>
