---
description: >-
  Use the Argos CLI to upload screenshots, inspect builds, and create build
  reviews from scripts, local workflows, or AI agents.
---

# Argos Command Line Interface (CLI)

You can access `@argos-ci/cli` through our [npm package](https://www.npmjs.com/package/@argos-ci/cli). The source code is available on our [GitHub repository](https://github.com/argos-ci/argos-javascript/tree/main/packages/cli).

### Installation

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

Your configuration requirements vary depending on the command you run.

For CI uploads, set `ARGOS_TOKEN` as an environment variable, usually as a CI secret.

{% hint style="info" %}
You can also specify the token with the `--token=<your-repository-token>` argument. However, for security reasons, we recommend using an environment variable instead.
{% endhint %}

For local review commands, sign in once with the browser-based login flow:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos login
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos login
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos login
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos login
```
{% endtab %}
{% endtabs %}

`argos login` authorizes the CLI and stores a user token on your machine. This token is used by commands that need to act as a user, such as creating a build review.

{% hint style="warning" %}
Do not use `argos login` in CI. CI uploads should use `ARGOS_TOKEN`, `--token`, or [GitHub OIDC authentication](../learn/integrations/github-oidc-authentication.md)
{% endhint %}

### Upload Command

Use the `upload` command to upload screenshots stored in your `./screenshots` directory.

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos upload ./screenshots
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos upload ./screenshots
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos upload ./screenshots
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos upload ./screenshots
```
{% endtab %}
{% endtabs %}

#### Compare non-image files

Use `-f` or `--files` to upload text-based artifacts such as JSON, YAML, XML, HTML, Markdown, CSS, or JavaScript files. See [Compare non-image files](../learn/how-to-guides/visual-coverage/compare-non-image-files.md) for examples and the full list of supported content types.

#### Debug mode

You can enable debug mode by setting the `DEBUG` environment variable.

{% tabs %}
{% tab title="npm" %}
```
DEBUG=@argos-ci/core npm exec -- argos upload ./screenshots
```
{% endtab %}

{% tab title="yarn" %}
```
DEBUG=@argos-ci/core yarn run argos upload ./screenshots
```
{% endtab %}

{% tab title="pnpm" %}
```
DEBUG=@argos-ci/core pnpm exec -- argos upload ./screenshots
```
{% endtab %}

{% tab title="bun" %}
```
DEBUG=@argos-ci/core bun x argos upload ./screenshots
```
{% endtab %}
{% endtabs %}

### Deploy Command

Use the `deploy` command to deploy a static build (Storybook or any static site) to Argos. See [Deployments](../learn/deployments/) for an overview of the feature.

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos deploy ./storybook-static
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos deploy ./storybook-static
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos deploy ./storybook-static
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build deploy ./storybook-static
```
{% endtab %}
{% endtabs %}

The argument is the directory containing the static files to deploy.

#### Production deployments

By default, `deploy` creates a **preview** deployment. Add `--prod` to force a **production** deployment regardless of the branch:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos deploy ./storybook-static --prod
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos deploy ./storybook-static --prod
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos deploy ./storybook-static --prod
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build deploy ./storybook-static --prod
```
{% endtab %}
{% endtabs %}

If the branch matches the project's production branch pattern, the deployment is created as production even without `--prod`. See [Environments](../learn/deployments/environments.md) for the full rules.

#### Authentication

`deploy` uses the same authentication as `upload`:

1. `ARGOS_TOKEN` environment variable (recommended).
2. `--token <token>` argument.
3. [GitHub OIDC](../learn/integrations/github-oidc-authentication.md) or [tokenless authentication](../learn/integrations/github-tokenless-authentication.md) on GitHub Actions.

### Build Commands

Use `build` commands to fetch build metadata, fetch snapshot diffs, and create a review on a build.

#### Get build metadata

Use `build get` to fetch status, branch, commit, stats, and the build URL.

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos build get <buildNumber>
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos build get <buildNumber>
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos build get <buildNumber>
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build get <buildNumber>
```
{% endtab %}
{% endtabs %}

You can also pass an Argos build URL directly:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos build get https://app.argos-ci.com/team/project/builds/72652
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos build get https://app.argos-ci.com/team/project/builds/72652
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos build get https://app.argos-ci.com/team/project/builds/72652
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build get https://app.argos-ci.com/team/project/builds/72652
```
{% endtab %}
{% endtabs %}

Use `--json` when another tool needs to parse the response:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos build get https://app.argos-ci.com/team/project/builds/72652 --json
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos build get https://app.argos-ci.com/team/project/builds/72652 --json
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos build get https://app.argos-ci.com/team/project/builds/72652 --json
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build get https://app.argos-ci.com/team/project/builds/72652 --json
```
{% endtab %}
{% endtabs %}

#### Fetch snapshot diffs

Use `build snapshots` to fetch snapshot diffs for a build.

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --json
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --json
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --json
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --json
```
{% endtab %}
{% endtabs %}

Add `--needs-review` to only return snapshots that need a review decision:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --needs-review --json
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --needs-review --json
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --needs-review --json
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build snapshots https://app.argos-ci.com/team/project/builds/72652 --needs-review --json
```
{% endtab %}
{% endtabs %}

Each snapshot diff includes the status, score, diff mask URL, baseline file, current file, and metadata provided by the SDK.

#### Submit a build review

Use `build review` to approve a build or request changes.

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos build review https://app.argos-ci.com/team/project/builds/72652 --conclusion approve
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos build review https://app.argos-ci.com/team/project/builds/72652 --conclusion approve
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos build review https://app.argos-ci.com/team/project/builds/72652 --conclusion approve
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build review https://app.argos-ci.com/team/project/builds/72652 --conclusion approve
```
{% endtab %}
{% endtabs %}

To reject the visual changes:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos build review https://app.argos-ci.com/team/project/builds/72652 --conclusion request-changes
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos build review https://app.argos-ci.com/team/project/builds/72652 --conclusion request-changes
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos build review https://app.argos-ci.com/team/project/builds/72652 --conclusion request-changes
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build review https://app.argos-ci.com/team/project/builds/72652 --conclusion request-changes
```
{% endtab %}
{% endtabs %}

When you pass a build number instead of a full URL, also pass the project path:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos build review 72652 --project team/project --conclusion approve
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos build review 72652 --project team/project --conclusion approve
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos build review 72652 --project team/project --conclusion approve
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos build review 72652 --project team/project --conclusion approve
```
{% endtab %}
{% endtabs %}

#### Project tokens and personal access tokens

Uploads and build reads can use a project token.

Creating a build review requires a personal access token because the review is attributed to an Argos user and checked against that user's project permissions.

To create a personal access token manually, go to your personal account settings, open **Tokens**, then click **Generate new token**.

![Personal settings tokens page](<../.gitbook/assets/personal settings tokens d3d1a5de5368576c1caf5660d0041e07.png>)

_A personal settings tokens page_

For `build review`, authentication is resolved in this order:

1. `--token <token>`
2. `ARGOS_TOKEN`
3. token stored by `argos login`

Project tokens can inspect build data, but they cannot create reviews. If `ARGOS_TOKEN` contains a project token, use `argos login` locally or pass a personal access token with `--token`.

### AI Agent Skills

The [`argos-javascript`](https://github.com/argos-ci/argos-javascript) repository includes skills that help AI agents use Argos CLI commands and review pull requests with Argos build data:

* [`argos-cli`](https://github.com/argos-ci/argos-javascript/tree/main/skills/argos-cli): use Argos CLI commands, flags, authentication, and output formats.
* [`argos-pr-review`](https://github.com/argos-ci/argos-javascript/tree/main/skills/argos-pr-review): review a pull request with an Argos build as visual evidence.

See [Review builds with AI agents](../learn/review-workflow/review-builds-with-ai-agents.md) to install and use the skills in a pull request review workflow.

### Help Command

To view a list of available options, use the argos help command.

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos help upload
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos help upload
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos help upload
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos help upload
```
{% endtab %}
{% endtabs %}
