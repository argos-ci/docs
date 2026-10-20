---
description: Connect Argos to GitHub for automated visual testing, commit and pull request checks, and baseline selection.
---

# GitHub integration

Connect Argos to GitHub for automated visual testing on every pull request and merge queue run. Argos reads commit history to pick the right baseline build and reports results back to GitHub so you can ship with confidence.

### What Argos does on GitHub

* Adds commit and pull request checks, so Argos results can block merges when required in GitHub.
* Posts [pull request comments](../review-workflow/pull-request-comments.md) with the latest build results and links back to Argos.
* Analyzes commit history to find the right merge base and select the correct [baseline build](../platform-fundamentals/baseline-build.md) for visual comparisons.

This is why Argos asks for repository access: it reads commits to find merge bases, and writes statuses and comments to report results.

### Commit status names

Argos reports results as [commit statuses](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks) on the pull request's head commit, not as check runs. The status context depends on your setup:

| Context                             | When it is used                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `argos`                             | The default — one Argos project on the repository, default build name.                                       |
| `argos/<build-name>`                | The build has a custom name (for example `argos/e2e` with `--build-name e2e`), as in [monorepo setups](../how-to-guides/ci-pipelines/monorepos-setup.md). |
| `argos/<project-name>`              | Several Argos projects share the same repository — the project name disambiguates them.                       |
| `argos/<project-name>/<build-name>` | Several projects share the repository and the build has a custom name.                                        |
| `argos/summary`                     | The [summary check](../review-workflow/summary-checks.md) that combines all Argos builds on a commit.         |

Use these exact context names when you configure [required status checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging) in branch protection.

#### Which commit receives the status

On GitHub Actions `pull_request` events, `GITHUB_SHA` points to an ephemeral merge commit, not to your branch's head. Argos records that merge commit as the build commit — what you tested is the merged result — but detects the pull request from the event payload and **posts the status on the pull request's head commit**, so the check shows up on your PR as expected.

Special cases:

* On `pull_request_target` events, `GITHUB_SHA` points to the base branch, so Argos uses the pull request head commit as the build commit instead.
* Outside a pull request (a push to a branch), the status is posted on the commit the screenshots were captured from.
* In a [merge queue](#merge-queue-support), the status is posted on the merge group's commit, where the queue reads it, and Argos doesn't comment on the pull request.

To override detection — for example in a custom pipeline — set the `ARGOS_COMMIT` (full 40-character SHA) and `ARGOS_BRANCH` environment variables.

### Commit status states

Each Argos status moves through these GitHub states as the build progresses:

| Build                                                        | GitHub state | Description                                  |
| ------------------------------------------------------------ | ------------ | -------------------------------------------- |
| Queued                                                       | `pending`    | "Build is queued"                            |
| In progress                                                  | `pending`    | "Build in progress..."                       |
| No changes detected                                          | `success`    | "Everything's good!" or "… no changes found" |
| Changes detected                                             | `failure`    | "… waiting for your decision"                |
| Changes approved                                             | `success`    | "… approved"                                 |
| Changes rejected                                             | `failure`    | "… rejected"                                 |
| Changes detected on an auto-approved build                   | `success`    | "…, automatically approved"                  |
| [Skipped](../how-to-guides/ci-pipelines/skipping-a-build.md) | `success`    | "Build skipped"                              |

Once the comparison is done, the description starts with the screenshot counts, such as "2 changed, 1 added".

A build on an [auto-approved branch](../platform-fundamentals/baseline-build.md#auto-approved-branches) outside a pull request is approved automatically, so its status passes even when it has changes.

Whether a `failure` blocks merging is your choice in GitHub. To block, mark the Argos context as a required status check in a [branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging) or a [ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging). Otherwise the status is informational. Argos posts the same states either way.

### Choose your access level

* **Full access (recommended)** — Required for Merge Queue and baseline selection based on commit history.
* **Limited access (no content)** — Works for basic checks without reading repository content; Merge Queue is not supported. See [GitHub integration without content permission](github-integration.md#github-integration-without-content-permission).

Use GitHub Connect to log in with your GitHub account, then install the Argos GitHub App to link repositories.

### Install the Argos GitHub App

Argos provides a dedicated GitHub App that connects directly to your repositories, enabling real-time visual testing feedback on pull requests.

1. Visit the [Argos app page on GitHub](https://github.com/apps/argos-ci).
2. Select **Configure** and pick the organization where you want to install Argos.
3. Follow the prompts to complete the installation.

#### Import a GitHub repository to Argos

1. Sign in to Argos and select **Create a new project**.
2. Choose GitHub as your provider, then select **Import your repository**.

#### Update the repositories shared with Argos

1. Go to the [Argos app page on GitHub](https://github.com/apps/argos-ci) and select **Configure**.
2. Select the organization where you want to manage repository access.
3. Under **Repository access**, choose **Only select repositories** and pick the repositories you want to share with Argos.

![Repository access settings for the Argos GitHub App](<../../.gitbook/assets/repository access 9f17c9ae0a701fcacc914b10dea40a5e.jpg>)

### Required GitHub App permissions

Argos needs the following permissions to operate:

* **Contents** — used to find a common commit ancestor between branches
* **Statuses** — used to add statuses to commits
* **Pull requests** — used to add comments in pull requests
* **Actions** — used to re-run an individual GitHub Actions workflow run when a check is retried from Argos, and to look up workflow runs for [tokenless authentication](github-actions-authentication.md#tokenless-authentication)

We take your security and privacy seriously. If you have any concerns or questions, please [contact us](https://argos-ci.com/contact).

### Merge Queue support

Argos supports [GitHub's native Merge Queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue) out of the box, and can be configured for custom merge queue systems as well.

#### How Argos compares a merge queue build

A merge queue build takes its baseline from your base branch, then applies the changes already approved on the queued pull request (or on each pull request listed in `ARGOS_MERGE_QUEUE_PRS`). Changes you approved on the pull request don't show up again in the queue.

A merge queue build can't be reviewed: Argos shows "This build was triggered in a merge queue and doesn't require a review." If it finds changes that weren't approved on the pull request, its status is `failure` ("waiting for your decision"), so the queue check fails when Argos is a [required status check](#commit-status-states).

Once GitHub merges the group, your base branch points to the commit the merge queue build tested, so that build can serve as the [baseline](../platform-fundamentals/baseline-build.md) for later builds, and a separate `push` build on the base branch is optional. Like any baseline, the build must be complete, its tests must have passed, it must not be a subset, and it must not be rejected. Pull request builds also [need an approved baseline](../platform-fundamentals/baseline-build.md#when-the-baseline-must-be-approved). A merge queue build counts as approved once its pull request is merged, as long as the build is linked to that pull request (see `GITHUB_TOKEN` below).

#### GitHub Actions setup for GitHub Merge Queue

Listen to both `pull_request` and `merge_group` events so Argos uploads run for PR reviews and for queued merges:

{% code title=".github/workflows/ci.yml" %}
```yaml
name: Visual tests

on:
  pull_request:
  merge_group:

jobs:
  argos:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22
      - run: npm ci
      - run: npm run test:e2e # Run E2E tests with Argos SDK integration
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }} # Argos token stored in GitHub Secrets
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Lets the SDK find the pull request of a merge group
```
{% endcode %}

On `merge_group` events, the SDK reads the pull request from the GitHub API with `GITHUB_TOKEN`. Without it, the build isn't linked to its pull request, and Argos can't apply the changes approved there. If your workflow restricts `GITHUB_TOKEN` permissions, grant `pull-requests: read`.

#### Custom merge queue systems

When you are using a merge queue system other than GitHub’s built-in Merge Queue (like [Mergify](https://mergify.com/)), you can set `ARGOS_MERGE_QUEUE_PRS` to the comma-separated pull request numbers included in the queued build. This tells Argos to treat the upload as a merge queue build and use the right baseline for visual comparisons.

When the queued build contains a single pull request, Argos finds the builds approved on it by branch, so upload under that pull request's branch: set `ARGOS_BRANCH` if your merge queue runs on a branch of its own.

```yaml
steps:
  - name: Upload screenshots to Argos
    env:
      ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
      ARGOS_MERGE_QUEUE_PRS: "101,102"
    run: npm exec -- argos upload ./screenshots
```

### GitHub integration without content permission

If you prefer to use Argos without granting full content access to your repositories, you can integrate via a more restricted setup.

#### Set up Argos with limited GitHub access

1. From the dashboard, select your team from the scope selector.
2. Select the **Settings** tab and go to the **Integrations** section.
3. Scroll to **GitHub without content access**.
4. Select **Install GitHub App**.

![GitHub without content access settings in Argos](<../../.gitbook/assets/github light settings f92cce07ed0ba7ddcd67bdaf4d189c51.jpg>)

5. On GitHub, choose the specific repositories where you want to install the Argos app.

![Argos GitHub app without content access](<../../.gitbook/assets/github light app 2fab2975617916eb69fa710a113d9882.jpg>)

6. Back in Argos, go to the **Projects** tab.
7. Select **Create a new project** at the top right.
8. Select **Continue with GitHub (no-content access)**.

![Argos GitHub app without content access](<../../.gitbook/assets/create project 97d56ce76dfd351b29e727076e01021c.jpg>)

9. Choose the repository you want to connect.

### GitHub Enterprise

#### GitHub Enterprise Cloud

GitHub Enterprise Cloud works out of the box. Follow the same GitHub App setup described above — no extra configuration is needed in Argos.

#### GitHub Enterprise Server (self-hosted)

Self-hosted GitHub Enterprise Server deployments are supported on the Argos Enterprise plan, which also includes SAML SSO and other advanced features. To upgrade to Enterprise, [contact sales](https://argos-ci.com/contact).

### Authenticating Argos in CI

Uploads from GitHub Actions can authenticate in three ways:

* **`ARGOS_TOKEN`** — a project token stored as a GitHub secret (used in the examples above).
* [**GitHub OIDC**](github-actions-authentication.md#oidc) — short-lived signed tokens with no secret to manage. Preferred where available.
* [**Tokenless authentication**](github-actions-authentication.md#tokenless-authentication) — the automatic fallback for pull requests from forked repositories.

OIDC and tokenless authentication are per-project settings: a project admin [enables them](github-actions-authentication.md#enable-oidc-or-tokenless-on-your-project) in **Project Settings → Authentication**.
