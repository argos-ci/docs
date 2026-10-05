---
description: >-
  Run Argos visual tests in GitHub Actions, GitLab CI, CircleCI, Buildkite, or
  any other CI: working pipeline examples, the CI providers Argos detects
  automatically, and the environment variables to set everywhere else.
---

# Run Argos in CI (GitHub Actions, GitLab CI, CircleCI, Buildkite)

To run Argos in CI, run your tests as usual with the `ARGOS_TOKEN` environment variable set. The Argos SDK or CLI reads the commit, the branch, and the pull request from your CI provider, uploads the screenshots, and Argos compares them with the [baseline build](../../platform-fundamentals/baseline-build.md). On a CI provider that Argos doesn't detect, set `ARGOS_BRANCH` (and `ARGOS_COMMIT` if needed) yourself.

`ARGOS_TOKEN` is the project token from **Settings → General → Token**; store it as a secret in your CI. The examples below run Playwright tests: replace `npx playwright test` with your own test command, and follow the [quickstart](../../../quickstart/README.md) for your framework to set up the SDK.

{% hint style="info" %}
Commit statuses and pull request comments come from the Argos [GitHub](../../integrations/github-integration.md) or [GitLab](../../integrations/gitlab-integration.md) integration, whichever CI runs your tests. Without one of them, review builds in the Argos dashboard. See [Other Git providers](../../integrations/other-git-providers.md).
{% endhint %}

### CI providers detected automatically

Argos recognizes these CI providers from their environment variables, with no configuration:

| CI provider    | Detected with        | Commit                           | Branch                   | Pull request             |
| -------------- | -------------------- | -------------------------------- | ------------------------ | ------------------------ |
| GitHub Actions | `GITHUB_ACTIONS`     | From the workflow event          | From the workflow event  | From the workflow event  |
| GitLab CI      | `GITLAB_CI`          | `CI_COMMIT_SHA`                  | `CI_COMMIT_REF_NAME`     | —                        |
| CircleCI       | `CIRCLECI`           | `CIRCLE_SHA1`                    | `CIRCLE_BRANCH`          | `CIRCLE_PULL_REQUEST`    |
| Buildkite      | `BUILDKITE`          | `BUILDKITE_COMMIT`, or the checkout | `BUILDKITE_BRANCH`    | `BUILDKITE_PULL_REQUEST` |
| Travis CI      | `TRAVIS`             | `TRAVIS_COMMIT`                  | `TRAVIS_BRANCH`          | `TRAVIS_PULL_REQUEST`    |
| Bitrise        | `BITRISE_IO`         | `BITRISE_GIT_COMMIT`             | `BITRISE_GIT_BRANCH`     | `BITRISE_PULL_REQUEST`   |
| Heroku CI      | `HEROKU_TEST_RUN_ID` | `HEROKU_TEST_RUN_COMMIT_VERSION` | `HEROKU_TEST_RUN_BRANCH` | —                        |

On any other CI, Argos falls back to the Git checkout: see [Any other CI](#any-other-ci).

### GitHub Actions

{% code title=".github/workflows/argos.yml" %}
```yaml
name: Argos

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  argos:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```
{% endcode %}

On GitHub Actions, you can also authenticate without a long-lived secret, with [OIDC or tokenless authentication](../../integrations/github-actions-authentication.md).

### GitLab CI

{% code title=".gitlab-ci.yml" %}
```yaml
argos:
  image: node:22
  script:
    - npm ci
    - npx playwright install --with-deps chromium
    - npx playwright test
```
{% endcode %}

Add `ARGOS_TOKEN` as a masked variable in **Settings → CI/CD → Variables**. The job runs on every push, so your default branch builds the baseline and each merge request branch is compared against it. To get commit statuses on your merge requests, [connect your GitLab repository](../../integrations/gitlab-integration.md) to Argos.

### CircleCI

{% code title=".circleci/config.yml" %}
```yaml
version: 2.1

jobs:
  argos:
    docker:
      - image: cimg/node:22.23
    steps:
      - checkout
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test

workflows:
  visual-tests:
    jobs:
      - argos
```
{% endcode %}

Add `ARGOS_TOKEN` as an environment variable in your CircleCI project settings, or in a context. Argos reads the pull request number from `CIRCLE_PULL_REQUEST` when CircleCI sets it.

### Buildkite

{% code title=".buildkite/pipeline.yml" %}
```yaml
steps:
  - label: "Visual tests"
    command:
      - npm ci
      - npx playwright install --with-deps chromium
      - npx playwright test
    secrets:
      - ARGOS_TOKEN
```
{% endcode %}

Buildkite runs the step on your own agents, so the agent needs Node.js 22 or later. The `secrets` key exposes a [Buildkite secret](https://buildkite.com/docs/pipelines/security/secrets/buildkite-secrets) named `ARGOS_TOKEN` as an environment variable; it requires Buildkite agent 3.106.0 or later. If your step runs inside a container, pass the `BUILDKITE_*` environment variables through so Argos can read them.

### Any other CI

On a CI provider that isn't in the table above, such as Jenkins, Azure Pipelines, or Bitbucket Pipelines, Argos reads the commit and the branch from the Git checkout. Many CI systems check out a detached `HEAD`, which has no branch name, so set `ARGOS_BRANCH` from your CI's branch variable. Outside a Git checkout, set both `ARGOS_BRANCH` and `ARGOS_COMMIT`; without them, the upload fails with "Argos requires a branch and a commit to be set".

| Environment variable                                                  | Description                                                                                                                 |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `ARGOS_TOKEN`                                                         | Project token. Required, except with GitHub Actions OIDC or tokenless authentication.                                      |
| `ARGOS_BRANCH`                                                        | Branch of the build.                                                                                                        |
| `ARGOS_COMMIT`                                                        | Commit of the build, as a full 40-character SHA.                                                                            |
| `ARGOS_PR_NUMBER`                                                     | Number of the pull request associated with the build.                                                                       |
| `ARGOS_PR_BASE_BRANCH`                                                | Base branch of the pull request.                                                                                            |
| `ARGOS_BUILD_NAME`                                                    | Name of the build, to run [several builds per commit](monorepos-setup.md).                                                  |
| `ARGOS_PARALLEL`, `ARGOS_PARALLEL_TOTAL`, `ARGOS_PARALLEL_INDEX`, `ARGOS_PARALLEL_NONCE` | Collect the uploads of [parallel jobs](parallel-testing-sharding.md) into one build.                     |
| `ARGOS_REFERENCE_BRANCH`, `ARGOS_REFERENCE_COMMIT`                    | Pick the [baseline](../../platform-fundamentals/baseline-build.md#choose-a-custom-baseline-via-sdk) yourself.              |

Options passed to the SDK or the CLI take precedence over these variables, and both take precedence over the values detected from your CI provider. These variables also override detection on the providers listed above.

To find the baseline, Argos walks the commit history. When your project is connected to GitHub or GitLab, this happens server-side. Otherwise Argos reads it from the `origin` remote, or from the local history, so make sure your checkout has enough history, or pin the baseline with `ARGOS_REFERENCE_COMMIT`. See the [CLI reference](../../../sdks-reference/argos-command-line-interface-cli.md#override-git-detection).

### Troubleshooting

To see the commit, branch, and pull request Argos detected, run your upload with debug logs:

```bash
DEBUG=@argos-ci/core npx playwright test
```

If a pull request build shows up as [orphan](../../platform-fundamentals/baseline-build.md#orphan-builds), Argos found no baseline yet: run the pipeline once on your default branch.
