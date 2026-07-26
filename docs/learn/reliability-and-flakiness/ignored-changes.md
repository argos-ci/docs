---
description: >-
  Review every change your project has ignored, see how much review noise each
  one absorbs, and unignore the ones that went quiet.
---

# Ignored changes

Ignoring a change is easy to do and easy to forget. The **Ignored** tab lists every change a project currently ignores, so you can tell which ignores are still earning their keep and which have become blind spots.

### Open the Ignored tab

1. Open your project in Argos.
2. Select the **Ignored** tab.

The tab only appears when the ignore feature is enabled for the project. See [Configure what Argos ignores](flaky-test-detection.md#configure-what-argos-ignores).

### What each row shows

Changes are listed most recently ignored first.

* **Change** — the most recent screenshot carrying this change, with the test name and build name. Select the row to open the change on the test page.
* **Ignored** — when the change was ignored and who ignored it. Changes that [auto-ignore](flaky-test-detection.md#automatically-ignore-recurring-flaky-changes) muted are attributed to the Argos bot and carry an **Auto** badge.
* **Occurrences** — how many auto-approved builds have shown this exact change since it was ignored. This is the review noise the ignore has absorbed.
* **Last seen** — the last build in which this exact change appeared.

### Decide what to unignore

The two right-hand columns are what make the list worth revisiting.

A change with a high **Occurrences** count is doing its job: it would have interrupted a review that many times. A change that hasn't been seen in weeks is the opposite — the flake behind it has probably been fixed, and the ignore is now hiding any genuine regression that happens to produce the same diff.

{% hint style="info" %}
An ignore is scoped to one test and one diff fingerprint, so it never hides a different change to the same screenshot. See [How Argos recognizes the same change](flaky-test-detection.md#how-argos-recognizes-the-same-change).
{% endhint %}

### Unignore a change

1. Hover the row you want to unignore.
2. Select **Unignore**, then confirm.

Argos treats the change as a change again, so the next build showing it will ask for review. The confirmation offers **Undo** if you change your mind.

Unignoring requires the **review** permission on the project.

### FAQ

<details>

<summary>Why does a row show 0 occurrences?</summary>

The change hasn't reappeared in an auto-approved build since it was ignored. Either the flake stopped, or the change simply hasn't run again. Check **Last seen** to tell the two apart.

</details>

<details>

<summary>Does turning the ignore feature off clear this list?</summary>

No. Ignored changes are kept, and the list is still there when you turn the feature back on. While it's off, new builds ignore nothing.

</details>

<details>

<summary>Can I unignore everything at once?</summary>

Not from this page — changes are unignored one at a time. You can also unignore a change from the build page or the test page using the same **Ignore** button that set it.

</details>
