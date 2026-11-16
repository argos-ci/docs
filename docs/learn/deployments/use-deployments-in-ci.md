---
description: Run argos deploy from CI to create a deployment on every pull request, with a GitHub Actions Storybook example.
---

# Use deployments in CI

Running `argos deploy` from CI is the most common setup: a new deployment is created on every push to a pull request, and the deployment link appears in the PR comment alongside Argos visual tests.

This page walks through a GitHub Actions setup for Storybook. The same pattern works for any static build and any CI provider.

### Prerequisites

* A static build step that produces a directory (for Storybook: `npm run build-storybook` → `storybook-static/`).
* An `ARGOS_TOKEN` available as a CI secret. You can also use [OIDC or tokenless authentication](../integrations/github-actions-authentication.md) to avoid managing a secret. With tokenless authentication, Argos doesn't report [GitHub deployments](../integrations/github-integration.md#github-deployments).

### GitHub Actions example

{% code title=".github/workflows/argos-deploy.yml" %}
```yaml
name: Deploy Storybook to Argos

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build-storybook
      - run: npx --no-install argos deploy ./storybook-static
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

A few notes:

* The workflow listens to both `pull_request` and `push` to `main`. Pull request runs produce **preview** deployments; pushes to `main` produce **production** deployments (because `main` matches the default production branch pattern—see [Environments](environments.md)).
* `actions/checkout` gives Argos the commit SHA and branch it needs to associate the deployment with the right pull request.
* `ARGOS_TOKEN` is a [project token](../account-and-access/project-tokens.md): create one in your project's **Settings → Authentication**, and copy it right away, as Argos only shows it once.

### Force a production deployment

If your production branch differs from your repository's default branch (or if you want to be explicit), pass the `--prod` flag:

```yaml
- run: npx --no-install argos deploy ./storybook-static --prod
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```

You can keep the same workflow for both preview and production by branching on the event:

```yaml
- name: Deploy
  run: |
    if [ "${{ github.event_name }}" = "push" ]; then
      npx --no-install argos deploy ./storybook-static --prod
    else
      npx --no-install argos deploy ./storybook-static
    fi
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```

### Combine with visual testing

The `deploy` and `upload` commands are independent: you can run both in the same workflow to get a deployment URL **and** Argos visual tests on the same commit.

```yaml
- run: npm run build-storybook
- run: npm run test:visual # Your usual Argos visual test job
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
- run: npx --no-install argos deploy ./storybook-static
  env:
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```

Argos posts a single pull request comment that lists both the deployment URLs and the visual build results.

<figure><img src="../../.gitbook/assets/pr comment d8856fb76179f0d92711fd7855d77906.png" alt=""><figcaption><p><em>GitHub pull request comment showing both the deployment  and the Argos visual build.</em></p></figcaption></figure>

### Status checks

Each deployment registers a commit status named `argos-deploy/<project>`. The status starts as **pending** when the upload begins and becomes **success** when the deployment is ready. You can require it in your branch protection rules if a missing deployment should block a merge.

On GitHub, Argos also reports each deployment as a [GitHub deployment](../integrations/github-integration.md#github-deployments): the pull request shows a **View deployment** button, and workflows can react to it. GitLab projects are not affected.

A [deployment hosted elsewhere](report-external-deployments.md) gets no `argos-deploy/<project>` commit status: its host reports its own.

### Run a workflow when a preview is live

On GitHub, each status Argos reports for a deployment triggers a [`deployment_status`](https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status) event. Listen to it to run a job once a preview is ready, for example end-to-end tests against the deployed Storybook:

{% code title=".github/workflows/test-preview.yml" %}
```yaml
name: Test the Argos preview

on:
  deployment_status:

jobs:
  test:
    # Replace "docs" with your Argos project name
    if: >-
      github.event.deployment_status.state == 'success' &&
      github.event.deployment.environment == 'docs/preview'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22
      - run: npm ci
      - run: npm test
        env:
          BASE_URL: ${{ github.event.deployment_status.environment_url }}
```
{% endcode %}

* `github.event.deployment.environment` is `<project>/preview` for previews and `<project>/production` for production deployments. See [Environments](../integrations/github-integration.md#environments).
* `github.event.deployment_status.environment_url` is the URL of the deployment.
* The workflow doesn't run for [skipped deployments](../integrations/github-integration.md#skipped-deployments): deployments authenticated with tokenless authentication, and deployments from a fork's pull request. It doesn't run either once you [turn GitHub deployments off](../integrations/github-integration.md#turn-github-deployments-off).

### Other CI providers

The `argos deploy` command has no GitHub-specific behavior. To run it on another CI provider:

1. Build your static directory in your pipeline.
2. Set `ARGOS_TOKEN` as a secret.
3. Run `argos deploy <directory>` (add `--prod` for production).

Argos automatically detects the commit SHA, branch, and pull request number from the most common CI environment variables.

### Related

* [Deployments overview](./)
* [Environments](environments.md)
* [GitHub integration](../integrations/github-integration.md)
* [Argos CLI reference](../../sdks-reference/argos-command-line-interface-cli.md)
