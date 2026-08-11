---
description: >-
  Use the Argos CLI to upload screenshots, deploy static builds, inspect
  builds and flaky tests, and submit reviews from scripts, local workflows, or
  AI agents.
---

# CLI

The Argos command-line interface (CLI) uploads screenshots, deploys static builds, and lets you inspect and review builds from a terminal, a CI pipeline, or an AI agent. It is distributed as the [`@argos-ci/cli`](https://www.npmjs.com/package/@argos-ci/cli) npm package; the source code is available on [GitHub](https://github.com/argos-ci/argos-javascript/tree/main/packages/cli).

The examples on this page call the `argos` binary directly. Depending on your package manager, run it with `npm exec -- argos`, `yarn run argos`, `pnpm exec -- argos`, or `bun x argos`.

### Installation

The CLI requires **Node.js 22 or later**. Install it as a dev dependency:

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/cli
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/cli
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/cli
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/cli
```
{% endtab %}
{% endtabs %}

### Authentication

Authentication depends on where the CLI runs:

* **In CI**, set the `ARGOS_TOKEN` environment variable to your project token (from **Settings → General → Token**), usually as a CI secret. On GitHub Actions, you can also use [OIDC or tokenless authentication](../learn/integrations/github-actions-authentication.md) to avoid managing a secret.
* **Locally**, sign in once with the browser-based login flow:

```bash
argos login
```

`argos login` authorizes the CLI and stores a user token on your machine. This token is used by commands that act as a user, such as submitting a review.

Commands resolve authentication in this order:

1. The `--token <token>` argument.
2. The `ARGOS_TOKEN` environment variable.
3. The token stored by `argos login`.

{% hint style="warning" %}
Do not use `argos login` in CI. CI uploads should use `ARGOS_TOKEN` or [GitHub OIDC authentication](../learn/integrations/github-actions-authentication.md).
{% endhint %}

#### Project tokens and personal access tokens

Uploads and read-only commands — `build get`, `build snapshots`, `test list`, `test get`, `test changes`, `change list`, `project get`, `project deployments`, `project domain get`, `media list`, `media get`, `media versions` — work with a **project token**. Anything attributed to a user requires a **personal access token**, because the action is checked against that user's permissions: submitting or dismissing a review, requesting reviewers, posting comments (on builds, tests, and media alike), ignoring a change, configuring a project, and administering a team.

Two read-only commands are the exception: `project contributor list` and `review reviewer list` return users, so they need a personal access token to resolve them against — a project token carries no identity.

To create a personal access token manually, go to your personal account settings, open **Tokens**, then select **Generate new token**.

![Personal settings tokens page](<../.gitbook/assets/personal settings tokens d3d1a5de5368576c1caf5660d0041e07.png>)

_A personal settings tokens page_

## Commands

Run `argos <command> --help` for a command's exact arguments, flags, and defaults — the CLI is the source of truth for those. This page covers what each command is for, and the things `--help` can't tell you.

| Command                                    | What it does                                                        |
| ------------------------------------------ | ------------------------------------------------------------------- |
| `upload <directory>`                       | Upload snapshots from a directory and create a build.               |
| `finalize`                                 | Close a parallel build once every shard has uploaded.               |
| `skip`                                     | Create a skipped build so a required check still reports success.   |
| `deploy <directory>`                       | Deploy a static build (Storybook or any static site).               |
| `build get <buildReference>`               | Fetch a build's status, branch, commit, stats, and URL.             |
| `build snapshots <buildReference>`         | Fetch a build's snapshot diffs, with flakiness data on each.        |
| `build subscribe \| unsubscribe`           | Follow or stop following a build's notifications.                   |
| `test list`                                | List a project's tests, flakiest first.                             |
| `test get <testId>`                        | Fetch a test with its flakiness metrics.                            |
| `test changes <testId>`                    | List a test's distinct changes, most frequent first.                |
| `test subscribe \| unsubscribe <testId>`   | Follow or stop following a test's notifications.                    |
| `change list`                              | List the changes currently ignored in a project.                    |
| `change ignore \| unignore <changeId>`     | Silence a flaky change, or bring it back under review.              |
| `review create \| list \| dismiss`         | Submit, list, and dismiss reviews on a build.                       |
| `review reviewer list \| add \| remove`    | List, request, and cancel review requests on a build.               |
| `comment <subcommand>`                     | List, post, and act on the comments on a build.                     |
| `test comment <subcommand>`                | The same, on the comments on a test.                                |
| `project get \| update`                    | Read a project's settings, and change them one flag at a time.      |
| `project transfer`                         | Move a project to another account.                                  |
| `project contributor list \| set \| remove` | Manage who can reach a project outside the team's own roles.        |
| `project deployments`                      | List a project's deployments, most recent first.                    |
| `project domain get \| set`                | Read or set the domain production deployments are served on.        |
| `automation <subcommand>`                  | List, create, replace, and deactivate a project's automation rules. |
| `account get \| update`                    | Read plan and usage, and set the role users get when they join.     |
| `account member <subcommand>`              | List a team's members, change their role, remove them.              |
| `account invite <subcommand>`              | Invite people, cancel invites, rotate the invite link.              |
| `account domain <subcommand>`              | Manage the email domains a team is open to.                         |
| `media upload <files...>`                  | Upload standalone images or videos and print their share URLs.       |
| `media list`                               | List a project's uploaded media, most recent first.                 |
| `media get \| update \| delete <mediaId>`   | Fetch, edit, or delete one uploaded media.                          |
| `media versions <mediaId>`                 | List a media's uploaded versions, newest first.                     |
| `media comment <subcommand>`               | List, post, edit, resolve and react to comments on a media.         |
| `login`, `logout`, `whoami`                | Manage the CLI's user session.                                      |
| `create-project <name>`                    | Create a project in an account you administer.                      |
| `analytics`                                | Fetch build and screenshot metrics for an account.                  |
| `help [command]`                           | Display the available commands and options.                         |

### Uploading from CI

`upload` is the command that creates a build. Point it at the directory holding your snapshots:

```bash
argos upload ./screenshots
```

By default it uploads `**/*.{png,jpg,jpeg}`; narrow or widen that with `--files` and `--ignore`. Several flags map onto concepts documented elsewhere:

- `--mode` switches between [build modes](../learn/platform-fundamentals/build-modes.md) (`ci` by default, or `monitoring`).
- `--parallel`, `--parallel-total`, `--parallel-index` and `--parallel-nonce` drive [parallel testing](../learn/how-to-guides/ci-pipelines/parallel-testing-sharding.md).
- `--subset` marks a [subset build](../learn/how-to-guides/ci-pipelines/subset-builds.md).
- `--build-name` runs [multiple builds on a single commit](../learn/how-to-guides/ci-pipelines/monorepos-setup.md).
- `--reference-branch` and `--reference-commit` pin the [baseline](../learn/platform-fundamentals/baseline-build.md) instead of letting Argos resolve it.
- `--threshold` sets diff sensitivity between 0 and 1 — the higher the threshold, the less sensitive the comparison.

Most of these also read an `ARGOS_*` environment variable, which is usually how you set them in CI.

**`finalize`** closes a [parallel build](../learn/how-to-guides/ci-pipelines/parallel-testing-sharding.md) running in finalize mode (`ARGOS_PARALLEL_TOTAL=-1`). Run it once every upload has completed — Argos then aggregates the shards and starts the comparison:

```bash
argos finalize
```

The shards are matched by their nonce, read from `--parallel-nonce` or `ARGOS_PARALLEL_NONCE`. In most CI environments the nonce is detected automatically, so no flag is needed as long as `finalize` runs in the same pipeline as the uploads.

When every upload step is conditional — skipped by a task cache such as Turborepo or Nx, or by change detection — a run may produce no shard at all. Use `--skip-if-empty` to create a [skipped build](../learn/how-to-guides/ci-pipelines/skipping-a-build.md) in that case, so a required Argos status check still reports success:

```bash
argos finalize --skip-if-empty --build-name unit
```

**`skip`** creates that same [skipped build](../learn/how-to-guides/ci-pipelines/skipping-a-build.md) directly: no screenshots, no comparison, an immediately successful status. It keeps a required Argos check green on commits where you intentionally don't run visual tests. Use `--build-name` to match the check you want to satisfy.

#### Snapshot size limit

Each snapshot uploaded to Argos is limited to **50 MB**. This applies to every artifact type — a screenshot, a [non-image snapshot](#compare-non-image-files), or a [Playwright trace](playwright.md). Files larger than 50 MB are skipped and won't appear in your build.

A build is also limited to **5,000 screenshots**. Beyond that, the upload is rejected with an error — use [parallel mode](../learn/how-to-guides/ci-pipelines/parallel-testing-sharding.md) to split a larger test suite across several uploads.

#### Compare non-image files

Use `-f` or `--files` to upload text-based artifacts such as JSON, YAML, XML, HTML, Markdown, CSS, or JavaScript files. See [Compare non-image files](../learn/how-to-guides/visual-coverage/compare-non-image-files.md) for examples and the full list of supported content types.

#### Specify the project

Use `--project <slug>` to set the Argos project slug (`account/project-name`). This disambiguates [tokenless authentication](../learn/integrations/github-actions-authentication.md#tokenless-authentication) when multiple Argos projects are linked to the same repository:

```bash
argos upload ./screenshots --project my-account/my-project
```

#### Override Git detection

`argos upload` detects the commit, branch, and pull request from your CI environment — or from the local Git repository when running outside CI. To override detection, set these environment variables (there are no flag equivalents):

| Environment variable   | Description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `ARGOS_COMMIT`         | Commit SHA of the build. Must be a full 40-character SHA — short SHAs are rejected. |
| `ARGOS_BRANCH`         | Branch of the build.                                                                |
| `ARGOS_PR_NUMBER`      | Number of the pull request associated with the build.                               |
| `ARGOS_PR_HEAD_COMMIT` | Head commit of the pull request.                                                    |
| `ARGOS_PR_BASE_BRANCH` | Base branch of the pull request.                                                    |

In a non-Git environment, `ARGOS_COMMIT` and `ARGOS_BRANCH` are required — without them the upload fails with "Argos requires a branch and a commit to be set".

To find the [baseline](../learn/platform-fundamentals/baseline-build.md), Argos resolves ancestor commits. When your project is connected to GitHub or GitLab, this happens server-side. Otherwise the CLI fetches history from the `origin` remote — in a repository without `origin` (for example a local mirror), it falls back to the local history, so make sure enough history is available locally, or pin the baseline explicitly with `--reference-commit` and `--reference-branch`. Parent commits are always computed automatically and cannot be set manually.

To see what the CLI detected, run it with debug output:

```bash
DEBUG=@argos-ci/core argos upload ./screenshots
```

### Deploying a static build

`deploy` publishes a static site — a Storybook, a docs build, anything — to Argos. See [Deployments](../learn/deployments/README.md) for the overview:

```bash
argos deploy ./storybook-static
```

By default this creates a **preview** deployment. Add `--prod` to force a **production** one regardless of the branch. If the branch matches the project's production branch pattern, it is created as production even without the flag — see [Environments](../learn/deployments/environments.md) for the full rules.

`deploy` uses the same [authentication](#authentication) as `upload`.

### Inspecting builds and tests

These commands read data, so a project token is enough. A `<buildReference>` is a build number or a full Argos build URL; with a number, add `--project team/project`, since a URL already carries it.

```bash
argos build get https://app.argos-ci.com/team/project/builds/72652
argos build snapshots 72652 --project team/project --needs-review --json
```

`build get` returns the build's status, branch, commit, stats, and URL. `build snapshots` returns its diffs — each with a status, score, diff mask URL, baseline file, current file, and the metadata your SDK provided. Add `--needs-review` to get only the diffs awaiting a decision.

When a diff belongs to a tracked test it also carries that test's [flakiness metrics](../learn/reliability-and-flakiness/flaky-test-detection.md) under `test.metrics`, and — when the diff is a change — its ignore state and occurrence count under `change`. `--metrics-period` sets the window those are computed over (`24h`, `3d`, `7d`, `30d`, `90d`; defaults to `7d`).

To start from the project rather than from a build, `test list` returns the tests currently running in it, flakiest first — the first page is your flakiness backlog:

```bash
argos test list --project team/project --limit 20 --json
argos test list --project team/project --build-name unit --search carousel
```

A test is listed when it appeared in the latest reference build of its build name, so tests that were deleted, renamed, or skipped drop out on their own.

A high occurrence count or flakiness score is a strong flakiness signal. Take the diff's `test.id` and look at the whole test — the CLI equivalent of the [test page](../learn/reliability-and-flakiness/test-page.md):

```bash
argos test get <testId> --json
argos test changes <testId> --json
```

`test get` returns the test's name, build name, and `ongoing` or `removed` status; its `metrics` for the period; a `series` of the same counts bucketed over time, which distinguishes a test that has always been flaky from one that started recently; and `firstSeenChange` / `lastSeenChange`.

`test changes` lists its distinct changes, the ones that came back most often first. Each carries its `id`, whether it is `ignored`, its `occurrences`, when it was `firstSeen` and `lastSeen`, and the `diff` of its latest occurrence with the mask, baseline, and captured screenshot URLs. `--ignored true|false` narrows the list to ignored or still-reviewable changes.

A `<testId>` carries the project name but not the account, so pass `--project owner/project` (or `ARGOS_PROJECT`) — unless you authenticate with a project token, which already identifies its own project.

### Silencing a flaky change

`change ignore` stops a flaky change from requiring review, auto-approving it on future builds. `change unignore` reverses that. Both are the CLI equivalent of the **Ignore** button in a build review — see [Ignore changes](../learn/reliability-and-flakiness/flaky-test-detection.md#ignore-changes) — and both need a [personal access token](#project-tokens-and-personal-access-tokens) with review permission.

The `<changeId>` comes from a diff's `change.id` in `argos build snapshots --json`, or from `argos test changes --json`. Like a test id it doesn't carry the account, so pass the project:

```bash
argos change ignore <changeId> --project team/project
argos change unignore <changeId> --project team/project
```

The ignore feature must be enabled for the project (**Project Settings → Flaky detection**, on by default). Argos can also [ignore recurring flaky changes automatically](../learn/reliability-and-flakiness/flaky-test-detection.md#automatically-ignore-recurring-flaky-changes).

`change list` audits what has been silenced so far, most recently ignored first, with the test each change belongs to. Pass any of those ids back to `change unignore` to bring it under review again:

```bash
argos change list --project team/project --json
```

To let an agent do the investigation instead, see [Fix flaky tests with AI agents](../learn/reliability-and-flakiness/fix-flaky-tests-with-ai-agents.md).

### Reviewing and commenting

Every command in this group acts as a user, so they all require a [personal access token](#project-tokens-and-personal-access-tokens).

```bash
argos review create <buildReference> --event approve
argos review create <buildReference> --event reject --body "The header spacing regressed."
argos review list <buildReference> --json
argos review dismiss <buildReference> <reviewId>
```

`--event` is one of `approve`, `reject`, or `comment`, and `--body` / `--body-file` attach a Markdown summary. Dismissing a review stops it counting toward the [build status](../learn/review-workflow/review-a-build.md#how-reviews-decide-the-build-status).

Comments live in two groups: `comment` for a [build's review discussion](../learn/review-workflow/review-a-build.md#comment-on-exactly-what-changed), and `test comment` for a [test's own thread](../learn/reliability-and-flakiness/test-page.md#discuss-the-test-with-your-team). Both take the same subcommands — `list`, `create`, `get`, `edit`, `delete`, `resolve`, `unresolve`, `react`, `unreact`, `subscribe`, `unsubscribe`:

```bash
argos comment list <buildReference> --json
argos test comment create <testId> --project team/project --body "Flaky since the carousel landed."
```

Run `argos comment --help` or `argos test comment --help` for each subcommand's arguments.

`review reviewer` handles the review requests standing on a build. Requesting someone notifies them; requesting someone already requested is a no-op, and users without access to the project are ignored:

```bash
argos review reviewer list <buildReference> --json
argos review reviewer add <buildReference> <userId> <userId>
argos review reviewer remove <buildReference> <userId>
```

User ids come from `argos account member list --json` or `argos whoami --json`. You cannot request yourself.

To follow a build or a test without commenting on it, subscribe to its notifications. Unsubscribing is recorded as intentional, so Argos won't subscribe you again automatically:

```bash
argos build subscribe <buildReference>
argos test unsubscribe <testId> --project team/project
```

### Configuring a project

`project get` prints a project's settings; `project update` changes them. Only the settings you pass are touched, and every one takes an explicit value — so a script never has to guess whether an omitted flag means "false" or "leave alone":

```bash
argos project get --project team/project --json
argos project update --project team/project --summary-check auto --auto-ignore-after 3
argos project update --project team/project --default-user-level reviewer --deployments true
```

Run `argos project update --help` for the full list. A few conventions are worth knowing:

- Nullable settings reset to their inherited default when passed an empty value: `--default-base-branch ""` falls back to the repository's default branch.
- `--private inherit` returns the project's visibility to whatever the linked repository says.
- `--ignore-changes` and `--auto-ignore-after` drive [flaky change detection](../learn/reliability-and-flakiness/flaky-test-detection.md); `--auto-ignore-after off` turns automatic ignoring off while leaving manual ignoring on.

`project contributor` grants access to users who aren't covered by their team role — team owners and members already reach every project, so this is for contributors:

```bash
argos project contributor list --project team/project --json
argos project contributor set <userId> --level reviewer --project team/project
argos project contributor remove <userId> --project team/project
```

Levels are `admin`, `reviewer`, and `viewer`. Revoking your own access never requires administrator rights — a contributor can always walk away from a project.

`project transfer` moves a project to another account, optionally renaming it on the way. You must administer both the project and the account receiving it:

```bash
argos project transfer --project team/project --to other-team --name web
```

`project deployments` and `project domain` cover [deployments](../learn/deployments/README.md): the deployments a project has published, and the [custom domain](../learn/deployments/urls-and-domains.md) its production ones are served on. Only domains under `argos-ci.live` are accepted.

```bash
argos project deployments --project team/project --environment production --json
argos project domain set acme-web.argos-ci.live --project team/project
```

### Automation rules

`automation` manages the [automation rules](../learn/review-workflow/automations.md) that run when a build event matches. Rules are never deleted — deactivating one keeps its run history, which is what tells you why something fired:

```bash
argos automation list --project team/project --active true --json
argos automation get <ruleId> --project team/project
argos automation deactivate <ruleId> --project team/project
```

`create` and `update` take the rule definition as JSON, inline with `--definition` or from a file with `--definition-file`. `update` replaces the whole definition, so send the events, conditions, and actions you want the rule to end up with:

```bash
argos automation create --project team/project --definition-file rule.json
```

```json
{
  "name": "Notify on regressions",
  "events": ["build.completed"],
  "conditions": [{ "type": "build-conclusion", "value": "changes-detected" }],
  "actions": [
    { "type": "sendSlackMessage", "payload": { "name": "argos-alerts" } }
  ]
}
```

Action targets must belong to the project's account: a Slack channel connected to it, or the id of a Microsoft Teams or Discord webhook registered on it. Run `argos automation create --help` for the example inline.

### Managing a team

`account get` reports an account's plan and its usage for the current billing period — screenshots consumed against the plan, the consumption ratio, and the cost accrued beyond it. It's the CLI equivalent of watching your usage before it runs over:

```bash
argos account get --account my-team --json
```

`account member` lists a team's members and changes what they can reach:

```bash
argos account member list --account my-team --levels owner,member --json
argos account member set-level <userId> --level member --account my-team
argos account member remove <userId> --account my-team
```

Roles are `owner`, `member`, and `contributor` — owners administer the team, members see every project, contributors only the projects they are added to. A team can never be left without an administrator: the last member cannot be removed, and removing the second-to-last one promotes the survivor to owner.

`account invite` covers everything that brings someone in. Re-inviting an address that already has a pending invite refreshes it, so a lost invite can always be resent:

```bash
argos account invite create dev@acme.com --account my-team --level contributor
argos account invite list --account my-team --json
argos account invite cancel <inviteId> --account my-team
argos account invite reset-link --account my-team
```

`reset-link` rotates the team's shared invite link and invalidates the previous one.

`account domain` opens a team to an email domain, so anyone signing up with a verified address on it joins automatically, at the team's default role. Public email providers are refused, and you must hold a verified address on the domain yourself:

```bash
argos account domain add acme.com --account my-team
argos account domain list --account my-team --json
argos account domain remove acme.com --account my-team
```

Removing a domain only stops new sign-ups from joining — members who already joined through it stay. `account update --default-user-level <member|contributor>` sets the role given to everyone who joins through the invite link or a verified domain.

Every command in this section needs a [personal access token](#project-tokens-and-personal-access-tokens) with administrator rights on the team, and takes the account from `--account <slug>` or `ARGOS_ACCOUNT`.

### Paginated lists

`test list`, `change list`, `account member list`, `account invite list`, `project contributor list`, `project deployments`, and `automation list` follow pagination for you, up to `--limit` (100 by default). Raise it to walk a longer list:

```bash
argos project deployments --project team/project --limit 500 --json
```

### Managing your session

`login`, `logout` and `whoami` manage the CLI's user session — see [Authentication](#authentication):

```bash
argos login   # Log in to Argos by opening your browser
argos whoami  # Display the user authenticated with the current token
argos logout  # Log out from Argos
```

### Sharing images and videos

`media upload` uploads a standalone image or video — no build, no test run — and prints a share URL with ready-to-paste Markdown:

```bash
argos media upload before.png after.png
```

Add `--pr 1234` to publish to an existing pull request, or `--branch <branch>` while you are still working: the media is **staged**, and Argos publishes it — and posts a single managed comment listing every media — by itself once a pull request opens for that branch. Neither flag is inferred from the environment, CI included.

Re-uploading the same file name adds a **version** rather than a second media: the share URL keeps pointing at the newest upload, so Markdown already posted to a pull request never goes stale. A file named `checkout-before.png` uploads as `checkout.png` labelled `before` and pairs with its `after` for side-by-side comparison; `--state` sets the label for files not named that way.

Images are converted to WebP before upload — `--no-compress` opts out — while the media keeps your file's name and extension. Copy the Markdown the command prints rather than writing your own. For a video it is a poster frame wrapped in a link, which is the only form GitHub renders — an inline player only works for media GitHub hosts itself.

The rest of the group: `media list` filters by `--branch`, `--pr`, `--stage staged|published`, `--search` and `--type image|video`; `media update` edits a **staged** media's name, description or branch, which are fixed once it is published; `media versions` lists the uploads behind a media, newest first.

Media belongs to a project and inherits its access. `media upload` and `media list` accept either token type; with a [personal access token](#project-tokens-and-personal-access-tokens) pass `--project <owner/project>` or set `ARGOS_PROJECT`. `media delete` needs project administrator rights, since deleting a media breaks any share link already pasted somewhere.

A human can pin a comment to a point on an uploaded screenshot, which is how an agent gets told what to change about an image it cannot see:

```bash
argos media list --branch feat/checkout   # find what was uploaded for the branch
argos media comment list <mediaId>        # open threads, each with its pinned coordinates
argos media comment resolve <mediaId> <commentId>
```

A comment records the media **version** it was written against — `media versions` resolves it to the right file once the media has been re-uploaded. Every `media comment` command, reading included, needs a personal access token: a comment has an author.

See [Media sharing](../learn/media/) for retention, visibility and billing.

### Account commands

`create-project` creates a project in an account you administer:

```bash
argos create-project my-new-project --account my-team
```

`analytics` fetches build and screenshot metrics for an account. It reports totals and a per-period series for both screenshots and builds — including how many detected changes and how many were accepted or rejected — broken down by project:

```bash
argos analytics --account my-team --from 2026-01-01 --group-by month --json
```

`--from` defaults to 30 days ago and `--to` to now, with a range capped at 365 days; `--group-by` buckets by `day`, `week`, or `month`; and `--project` filters by project name, repeated for several. Both `create-project` and `analytics` take the account from `--account <slug>` or `ARGOS_ACCOUNT`, and need a [personal access token](#project-tokens-and-personal-access-tokens) scoped to it.

See [Analytics](../learn/account-and-access/analytics.md) for the dashboard view of these metrics.
## AI agent skills

The [`argos-javascript`](https://github.com/argos-ci/argos-javascript) repository includes skills that help AI agents use Argos CLI commands and review pull requests with Argos build data:

* [`argos-cli`](https://github.com/argos-ci/argos-javascript/tree/main/skills/argos-cli): use Argos CLI commands, flags, authentication, and output formats.
* [`argos-pr-review`](https://github.com/argos-ci/argos-javascript/tree/main/skills/argos-pr-review): review a pull request with an Argos build as visual evidence.
* [`argos-upload`](https://github.com/argos-ci/argos-javascript/tree/main/skills/argos-upload): share a screenshot or a screen recording by link, and embed it in a pull request.

See [Review builds with AI agents](../learn/review-workflow/review-builds-with-ai-agents.md) to install and use the skills in a pull request review workflow.
