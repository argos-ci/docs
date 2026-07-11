---
description: >-
  Use the Argos CLI to upload screenshots, deploy static builds, inspect
  builds, and submit reviews from scripts, local workflows, or AI agents.
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

Uploads and build reads work with a **project token**. Submitting or dismissing a review requires a **personal access token**, because the review is attributed to an Argos user and checked against that user's project permissions.

To create a personal access token manually, go to your personal account settings, open **Tokens**, then select **Generate new token**.

![Personal settings tokens page](<../.gitbook/assets/personal settings tokens d3d1a5de5368576c1caf5660d0041e07.png>)

_A personal settings tokens page_

## Commands

### `upload`

Upload snapshots from a directory and create a build:

```bash
argos upload ./screenshots
```

| Option                      | Description                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `-f, --files <patterns...>` | One or more globs matching the files to upload. Defaults to `**/*.{png,jpg,jpeg}`.                                                  |
| `-i, --ignore <patterns...>` | One or more globs matching file paths to ignore.                                                                                     |
| `--token <token>`           | Project token. Prefer the `ARGOS_TOKEN` environment variable.                                                                        |
| `--project <slug>`          | Argos project slug (`account/project-name`). Also `ARGOS_PROJECT`.                                                                   |
| `--build-name <string>`     | Name of the build, to run [multiple builds on a single commit](../learn/how-to-guides/ci-pipelines/monorepos-setup.md). Also `ARGOS_BUILD_NAME`. |
| `--mode <mode>`             | `ci` (default) or `monitoring`. See [Build modes](../learn/platform-fundamentals/build-modes.md).                                    |
| `--parallel`                | Enable [parallel mode](../learn/how-to-guides/ci-pipelines/parallel-testing-sharding.md). Also `ARGOS_PARALLEL`.                     |
| `--parallel-total <number>` | The number of parallel nodes, or `-1` for finalize mode. Also `ARGOS_PARALLEL_TOTAL`.                                                |
| `--parallel-index <number>` | The index of the parallel node (starts at 1). Also `ARGOS_PARALLEL_INDEX`.                                                           |
| `--parallel-nonce <nonce>`  | Unique identifier shared by the jobs of one run. Detected automatically on most CI providers. Also `ARGOS_PARALLEL_NONCE`.           |
| `--reference-branch <name>` | Branch used as the [baseline](../learn/platform-fundamentals/baseline-build.md) for comparison. Also `ARGOS_REFERENCE_BRANCH`.       |
| `--reference-commit <sha>`  | Commit used as the baseline for comparison. Also `ARGOS_REFERENCE_COMMIT`.                                                           |
| `--threshold <number>`      | Sensitivity threshold between 0 and 1. The higher the threshold, the less sensitive the diff. Defaults to `0.5`.                     |
| `--subset`                  | Mark the build as a [subset build](../learn/how-to-guides/ci-pipelines/subset-builds.md). Also `ARGOS_SUBSET`.                       |

#### Snapshot size limit

Each snapshot uploaded to Argos is limited to **50 MB**. This applies to every artifact type — a screenshot, a [non-image snapshot](#compare-non-image-files), or a [Playwright trace](playwright.md). Files larger than 50 MB are skipped and won't appear in your build.

#### Compare non-image files

Use `-f` or `--files` to upload text-based artifacts such as JSON, YAML, XML, HTML, Markdown, CSS, or JavaScript files. See [Compare non-image files](../learn/how-to-guides/visual-coverage/compare-non-image-files.md) for examples and the full list of supported content types.

#### Specify the project

Use `--project <slug>` to set the Argos project slug (`account/project-name`). This disambiguates [tokenless authentication](../learn/integrations/github-actions-authentication.md#tokenless-authentication) when multiple Argos projects are linked to the same repository:

```bash
argos upload ./screenshots --project my-account/my-project
```

#### Debug mode

Enable debug logging by setting the `DEBUG` environment variable:

```bash
DEBUG=@argos-ci/core argos upload ./screenshots
```

### `finalize`

Close a [parallel build](../learn/how-to-guides/ci-pipelines/parallel-testing-sharding.md) running in finalize mode (`ARGOS_PARALLEL_TOTAL=-1`). Run it once every upload has completed — Argos then aggregates the uploaded shards and starts the comparison:

```bash
argos finalize
```

The shards are matched by their nonce, read from `--parallel-nonce` or the `ARGOS_PARALLEL_NONCE` environment variable. In most CI environments the nonce is detected automatically, so no flag is needed as long as `finalize` runs in the same pipeline as the uploads.

When every upload step is conditional — skipped by a task cache such as Turborepo or Nx, or by change detection — a run may produce no shard at all. Use `--skip-if-empty` to create a [skipped build](../learn/how-to-guides/ci-pipelines/skipping-a-build.md) in that case, so a required Argos status check still reports success on the commit:

```bash
argos finalize --skip-if-empty --build-name unit
```

`--build-name` (or `ARGOS_BUILD_NAME`) names the skipped build; use the same name as your uploads so the status check context matches.

### `skip`

Create a [skipped build](../learn/how-to-guides/ci-pipelines/skipping-a-build.md): a build with no screenshots and no comparison that immediately reports a successful status. This keeps a required Argos check green on commits where you intentionally don't run visual tests:

```bash
argos skip
```

Use `--build-name` to match the build name of the check you want to satisfy.

### `deploy`

Deploy a static build (Storybook or any static site) to Argos. The argument is the directory containing the static files. See [Deployments](../learn/deployments/README.md) for an overview:

```bash
argos deploy ./storybook-static
```

By default, `deploy` creates a **preview** deployment. Add `--prod` to force a **production** deployment regardless of the branch:

```bash
argos deploy ./storybook-static --prod
```

If the branch matches the project's production branch pattern, the deployment is created as production even without `--prod`. See [Environments](../learn/deployments/environments.md) for the full rules.

`deploy` uses the same [authentication](#authentication) as `upload`.

### `build get`

Fetch a build's status, branch, commit, stats, and URL. The argument is a build number or an Argos build URL:

```bash
argos build get https://app.argos-ci.com/team/project/builds/72652
```

When you pass a build number instead of a URL, also pass `--project team/project`. Use `--json` when another tool needs to parse the response:

```bash
argos build get 72652 --project team/project --json
```

### `build snapshots`

Fetch the snapshot diffs of a build:

```bash
argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --json
```

Add `--needs-review` to only return snapshots that need a review decision:

```bash
argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --needs-review --json
```

Each snapshot diff includes the status, score, diff mask URL, baseline file, current file, and metadata provided by the SDK.

### `review create`

Submit a review on a build. Requires a [personal access token](#project-tokens-and-personal-access-tokens):

```bash
argos review create https://app.argos-ci.com/team/project/builds/72652 --event approve
```

| Option               | Description                                                     |
| -------------------- | ---------------------------------------------------------------- |
| `--event <event>`    | Review event: `approve`, `reject`, or `comment`. Required.      |
| `--body <markdown>`  | Markdown comment to attach to the review.                       |
| `--body-file <path>` | Read the review comment from a Markdown file.                   |

To reject the visual changes:

```bash
argos review create https://app.argos-ci.com/team/project/builds/72652 --event reject --body "The header spacing regressed."
```

As with `build get`, you can pass a build number with `--project team/project` instead of a URL.

### `review list`

List the reviews submitted on a build:

```bash
argos review list https://app.argos-ci.com/team/project/builds/72652 --json
```

### `review dismiss`

Dismiss a submitted review so it no longer counts toward the [build status](../learn/review-workflow/review-a-build.md#how-reviews-decide-the-build-status):

```bash
argos review dismiss https://app.argos-ci.com/team/project/builds/72652 <reviewId>
```

### `comment`

List, post, and act on build comments. The `comment` command groups the following subcommands: `list`, `create`, `get`, `edit`, `delete`, `resolve`, `unresolve`, `react`, `unreact`, `subscribe`, and `unsubscribe`.

```bash
argos comment list https://app.argos-ci.com/team/project/builds/72652 --json
```

Run `argos help comment` to see each subcommand's arguments and options.

### `login`, `logout`, and `whoami`

Manage the CLI's user session:

```bash
argos login   # Log in to Argos by opening your browser
argos whoami  # Display the user authenticated with the current token
argos logout  # Log out from Argos
```

### `create-project`

Create a new project in an account you administer. Pass the account with `--account <slug>` or the `ARGOS_ACCOUNT` environment variable:

```bash
argos create-project my-new-project --account my-team
```

### `help`

Display the available commands and options:

```bash
argos help upload
```

## AI agent skills

The [`argos-javascript`](https://github.com/argos-ci/argos-javascript) repository includes skills that help AI agents use Argos CLI commands and review pull requests with Argos build data:

* [`argos-cli`](https://github.com/argos-ci/argos-javascript/tree/main/skills/argos-cli): use Argos CLI commands, flags, authentication, and output formats.
* [`argos-pr-review`](https://github.com/argos-ci/argos-javascript/tree/main/skills/argos-pr-review): review a pull request with an Argos build as visual evidence.

See [Review builds with AI agents](../learn/review-workflow/review-builds-with-ai-agents.md) to install and use the skills in a pull request review workflow.
