---
description: >-
  Connect Argos to Cursor Origin for check runs and comments on your Origin
  pull requests, and baseline selection from your commit history.
---

# Cursor Origin integration

Connect Argos to [Cursor Origin](https://cursor.com/docs/origin), Cursor's git hosting, to get visual testing results on every Origin pull request. Argos reads commit history to pick the right baseline build and reports results back to Origin as check runs and pull request comments.

### What Argos does on Origin

* Adds check runs on the pull request's head commit, so Argos results can be required before merging in Origin's branch protections.
* Posts [pull request comments](../review-workflow/pull-request-comments.md) with the latest build results and links back to Argos.
* Analyzes commit history to find the right merge base and select the correct [baseline build](../platform-fundamentals/baseline-build.md) for visual comparisons.
* Finds the pull request a build belongs to from its branch, so Argos works from any CI, even one that does not know about pull requests.

This is why Argos asks for repository access: it reads commits to find merge bases, and writes check runs and comments to report results.

{% hint style="info" %}
Origin apps only reach repositories hosted on Origin. A repository [mirrored from GitHub](https://cursor.com/docs/origin/mirror-github) into Origin stays on the [GitHub integration](github-integration.md): keep it connected to GitHub in Argos.
{% endhint %}

### Install the Argos app on Origin

Argos provides an Origin app that connects to your Origin codebase. Installing it links your Origin namespace to your Argos team or personal account.

{% stepper %}
{% step %}
#### Start the installation from Argos

1. From the dashboard, select your team or your personal account from the scope selector.
2. Select the **Settings** tab and go to the **Integrations** section.
3. Scroll to **Cursor Origin** and select **Install Argos on Origin**.

You need to be an owner of the Argos account, and an admin of the Origin codebase.
{% endstep %}

{% step %}
#### Approve the installation on Origin

Origin shows the permissions Argos requests. Choose whether Argos reaches all repositories of your codebase or only selected ones, then select **Install**.

Origin sends you back to Argos once the installation is approved. The **Cursor Origin** section now shows your Origin namespace.
{% endstep %}

{% step %}
#### Import an Origin repository to Argos

1. Select the **Projects** tab.
2. Select **Create a new Project** at the top right.
3. Select **Continue with Cursor Origin**.
4. Pick the repository. The new project appears in your projects list.

A repository created on Origin after the installation shows up after you select **Refresh** in the list.
{% endstep %}
{% endstepper %}

### Connect an existing Argos project to Origin

To link an Origin repository to a project that already exists in Argos, go to **Project Settings → Git → Connected Git Repository**, select **Cursor Origin** and pick the repository. The app must be [installed](#install-the-argos-app-on-origin) first.

### Send builds from your CI

Origin has no CI of its own: run your tests on the CI you connect to Origin, such as [Buildkite](https://buildkite.com/) or [Depot](https://depot.dev/), and upload screenshots with the Argos SDK or the [CLI](../../sdks-reference/argos-command-line-interface-cli.md) as on any other CI. Authenticate with `ARGOS_TOKEN`.

The Argos SDK reads the commit and branch from your CI environment or from `git`. When your CI does not know the pull request, Argos asks Origin which open pull request has this branch as its head, so builds land on the right pull request without any extra configuration. And when the pull request is opened after the branch was built — the usual order on Origin, where Buildkite does not rebuild a commit it already ran — Argos attaches the builds of its head commit to the pull request and posts the comment. To override detection, set the `ARGOS_COMMIT` (full 40-character SHA), `ARGOS_BRANCH` and `ARGOS_PR_NUMBER` environment variables.

{% hint style="info" %}
Buildkite is the tested setup: install the [Buildkite app on Origin](https://buildkite.com/docs/pipelines/source-control/origin), create a pipeline from the Origin repository, and add a step running your tests and the Argos upload with `ARGOS_TOKEN` in its environment. Builds run on Buildkite hosted agents check out the Origin repository with its full history, so Argos finds the merge base as it does on GitHub.
{% endhint %}

### Check run names

Argos reports results as check runs in the `argos` check suite. The check run key depends on your setup:

| Key                                 | When it is used                                                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `argos`                             | The default — one Argos project on the repository, default build name.                                                                                    |
| `argos/<build-name>`                | The build has a custom name (for example `argos/e2e` with `--build-name e2e`), as in [monorepo setups](../how-to-guides/ci-pipelines/monorepos-setup.md). |
| `argos/<project-name>`              | Several Argos projects share the same repository — the project name disambiguates them.                                                                   |
| `argos/<project-name>/<build-name>` | Several projects share the repository and the build has a custom name.                                                                                    |
| `argos/summary`                     | The [summary check](../review-workflow/summary-checks.md) that combines all Argos builds on a commit.                                                      |

Use these exact keys when you configure required checks in your repository's **Rules and Protections** on Origin.

### Update the repositories shared with Argos

Repository access is managed on Origin: open [cursor.com/codebase/settings/apps](https://cursor.com/codebase/settings/apps), select the Argos app and change the selected repositories. Argos picks the change up automatically; select **Refresh** in the repository list if a repository is missing.

### Required permissions

Argos asks for the following Origin permissions:

* **Read repository contents, branches, and commits** — used to find a common commit ancestor between branches
* **Read pull requests** — used to link builds to pull requests
* **Read and create pull request comments** — used to post and update the Argos comment
* **Read and create check suites and runs** — used to report build results

If you would rather not grant content access, you can decline it when you install the app: Argos then relies on the base commit and parent commits sent by the SDK, like the [GitHub integration without content permission](github-integration.md#github-integration-without-content-permission).

We take your security and privacy seriously. If you have any concerns or questions, please [contact us](https://argos-ci.com/contact).
