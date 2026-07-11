---
description: >-
  The core concepts behind Argos — builds, baselines, comparisons, and the
  statuses you see on your pull requests.
---

# Core concepts

Argos turns the screenshots your tests produce into a review signal on your pull requests. This page defines the concepts you'll meet everywhere else in the docs.

### Builds and snapshots

A **build** is the result of one test run: the set of **screenshots** (and other snapshots, like [ARIA snapshots](how-argos-detects-visual-differences.md#what-argos-compares) or [text files](../how-to-guides/visual-coverage/compare-non-image-files.md)) uploaded together from your CI. Each build belongs to a project and is tied to a commit and branch.

A build goes through three stages:

1. **Upload**: Your CI uploads the snapshots, either automatically through an SDK or with the [CLI](../../sdks-reference/argos-command-line-interface-cli.md).
2. **Comparison**: Argos picks a [baseline build](baseline-build.md) and diffs each snapshot against its counterpart.
3. **Conclusion**: The build concludes with **No changes detected** or **Changes detected**, and Argos reports it to your Git provider as a commit status.

### Build types

Argos assigns each build a type that describes how it is compared:

* **Check**: The standard build on a feature branch — compared against a baseline and awaiting review when changes are detected.
* **Auto-approved**: A build on an [auto-approved branch](baseline-build.md#auto-approved-branches) (your default branch by default) — approved automatically so it can serve as a future baseline.
* **Orphan**: A build with [no baseline to compare against](baseline-build.md#orphan-builds) — expected for a project's first builds.
* **Skipped**: A build [intentionally marked as skipped](../how-to-guides/ci-pipelines/skipping-a-build.md) — reports success without screenshots.

### Review

When a build concludes with **Changes detected**, your team [reviews it](../review-workflow/review-a-build.md): approve the changes to accept them as the new expected state, or reject them to flag a regression. The review outcome updates the commit status on your pull request, so you can [require it before merging](../review-workflow/summary-checks.md).

### Go deeper

* [How Argos detects visual differences](how-argos-detects-visual-differences.md) – The deterministic diff algorithm behind comparisons
* [Baseline build](baseline-build.md) – How Argos chooses the build to compare against
* [Build modes](build-modes.md) – CI mode and Monitoring mode, and when to use each

Once the concepts are clear, head to the [Review workflow](../review-workflow/README.md) to see how builds are reviewed day to day.
