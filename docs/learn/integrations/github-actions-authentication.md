---
description: >-
  Authenticate Argos uploads from GitHub Actions with a project token, OIDC, or
  tokenless authentication.
---

# GitHub Actions authentication

Argos supports three ways to authenticate uploads from GitHub Actions: a project token, OpenID Connect (OIDC), and tokenless authentication. The SDK picks one automatically based on what is available in the workflow. OIDC and tokenless authentication must also be [enabled on the Argos project](#enable-oidc-or-tokenless-on-your-project).

### Choose a method

The SDK selects an authentication method in this order:

1. **`ARGOS_TOKEN`** is set → use the token.
2. **The job can request a GitHub OIDC token** (the `id-token: write` permission is granted) → use OIDC.
3. **Neither is available** → use tokenless authentication.

The SDK doesn't read your project settings. As soon as the job has `id-token: write`, it uses OIDC, even if OIDC is disabled on the project. In that case the upload fails; the SDK does not fall back to tokenless.

* **Project token (`ARGOS_TOKEN`)**: A long-lived secret stored in your repository. Works on every CI provider, but needs to be provisioned and rotated. This is the only option outside GitHub Actions.
* **OIDC**: A short-lived identity token signed by GitHub, verified by Argos on every upload. The most secure option — prefer it when your workflow can use it.
* **Tokenless**: Argos verifies the upload by looking up the workflow run on GitHub. Nothing to add to the workflow once it is enabled on the project, and the only method that works on pull requests from forks.

A single workflow can combine OIDC and tokenless: enable both on the project, grant `id-token: write` and leave `ARGOS_TOKEN` unset. The SDK uses OIDC when GitHub issues a token and automatically falls back to tokenless on fork PRs, where GitHub doesn't.

### Enable OIDC or tokenless on your project

OIDC and tokenless authentication are per-project settings. A project admin turns them on once the project is connected to a GitHub repository:

1. Open your project in Argos and go to **Project Settings → Authentication**.
2. Turn on **Enable GitHub Actions OIDC**, **Enable tokenless authentication**, or both.
3. Select **Save**.

Both are off by default for new projects. Tokenless authentication became a setting in May 2026, and Argos turned it on for every project that existed then, so their workflows kept working.

### Private repositories

OIDC and tokenless authentication both work with private repositories:

* **OIDC** doesn't use the GitHub API. Argos matches the repository ID in the signed token against the repository linked to the project.
* **Tokenless** looks up the workflow run through the Argos GitHub App installation, so the app must stay installed on the repository.

## OIDC

With [OpenID Connect (OIDC)](https://docs.github.com/en/actions/reference/security/oidc), each workflow run receives a short-lived identity token signed by GitHub. Argos verifies that token against the repository you have connected, then issues a temporary upload credential scoped to your project. No secret is ever stored in GitHub.

### Why use OIDC

* **No long-lived secret.** Nothing to rotate, leak, or copy between repositories.
* **Per-run identity.** GitHub issues the token for a single job. The credential Argos returns only uploads builds for the commit named in the token.
* **Least privilege.** The credential Argos issues from the OIDC exchange is scoped to a single project.

### How OIDC works

1. The job has the `id-token: write` permission, so it can request an identity token from GitHub's OIDC provider.
2. The Argos SDK detects that no `ARGOS_TOKEN` is set and requests the token for the audience `https://api.argos-ci.com`.
3. The SDK exchanges the token with the Argos API.
4. Argos verifies the token's signature, its issuer (`https://token.actions.githubusercontent.com`) and its audience (`https://api.argos-ci.com`). It then finds the Argos project linked to the repository identified in the token, and checks that the token's repository and commit match the ones the SDK reports.
5. If OIDC is enabled on that project, Argos returns a short-lived token scoped to the project, and the SDK uses it to upload.

Argos only accepts tokens issued for the `https://api.argos-ci.com` audience. A token requested for another service is rejected.

### Set up OIDC

1. [Enable **GitHub Actions OIDC**](#enable-oidc-or-tokenless-on-your-project) in your project settings.
2. Grant the workflow permission to mint an OIDC token by adding `id-token: write` to the job's `permissions` block.
3. **Remove** `ARGOS_TOKEN` from the job environment. If `ARGOS_TOKEN` is set, it takes precedence and OIDC is skipped.

```yaml
name: Visual tests

on:
  pull_request:
  merge_group:

jobs:
  argos:
    runs-on: ubuntu-latest
    permissions:
      # Required to check out the repository and read its metadata
      contents: read
      # Required for Argos to authenticate via OIDC
      id-token: write
      # Lets the SDK read the pull request of merge queue runs with GITHUB_TOKEN
      pull-requests: read
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22
      - run: npm ci
      - run: npm run test:e2e
        # No ARGOS_TOKEN: the SDK uses OIDC automatically
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

{% hint style="info" %}
`id-token: write` must be set on the job (or at the workflow level). Adding it only to the `permissions` block of another job does not grant it to your Argos job. See [GitHub's documentation on `id-token` permissions](https://docs.github.com/en/actions/reference/security/oidc#adding-permissions-settings).
{% endhint %}

## Tokenless authentication

Tokenless authentication lets the Argos SDK upload builds without an `ARGOS_TOKEN` secret and without OIDC. Argos verifies the run by looking it up on GitHub.

It is the method the SDK uses when neither a token nor OIDC is available. Most importantly, it works on **pull requests from forked repositories**, where GitHub does not issue OIDC tokens or expose secrets.

### How tokenless works

1. The Argos SDK detects that no `ARGOS_TOKEN` is set and no OIDC token is available.
2. The SDK sends Argos the GitHub-provided context: repository, job ID, and workflow run ID, along with the commit and branch of the build.
3. Argos finds the project linked to the repository, checks that tokenless authentication is enabled on it, and looks up the workflow run on GitHub through the Argos GitHub App installation.
4. If the run is **in progress** and its commit and branch match the ones the SDK reported, Argos issues a **short-lived token** scoped to the project.
5. The SDK uses that short-lived token to complete the upload.

The verification rests on a simple invariant: only the actual workflow run on GitHub can produce an upload whose context matches a run GitHub reports as in progress. If the run is not found, is not in progress, or its commit or branch doesn't match, the upload is rejected.

### When to use tokenless

* **Forked pull requests.** GitHub blocks OIDC and secrets on workflows triggered from forks. Tokenless authentication still works because it relies on the GitHub API rather than on a token injected into the runner.
* **Public repositories without configured secrets.** New contributors can open a PR and have visual tests run end-to-end without a maintainer needing to provision a token.
* **Quick setup.** Once tokenless is enabled on the project, uploads from GitHub Actions work without adding anything to the workflow.

To use tokenless, [enable it on the project](#enable-oidc-or-tokenless-on-your-project), leave `ARGOS_TOKEN` unset, and do not grant `id-token: write`. To pair it with OIDC in the same workflow, enable both on the project and grant `id-token: write`: internal PRs use OIDC and fork PRs fall back to tokenless.

### Specify a project when several share a repository

Tokenless authentication identifies your Argos project from the GitHub repository running the workflow. If you have **multiple Argos projects linked to the same repository**, Argos cannot tell which one the upload belongs to, and the upload is rejected.

To disambiguate, pass the project slug (`account/project-name`) so Argos knows which project to use. You can set it three ways, all equivalent:

{% tabs %}
{% tab title="Environment variable" %}
```yaml
- run: npm run test:e2e
  env:
    ARGOS_PROJECT: my-account/my-project
```
{% endtab %}

{% tab title="CLI flag" %}
```bash
argos upload ./screenshots --project my-account/my-project
```
{% endtab %}

{% tab title="SDK option" %}
```js
import { upload } from "@argos-ci/core";

await upload({
  files: ["screenshots/**/*.png"],
  project: "my-account/my-project",
});
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You only need this when more than one Argos project is connected to the same GitHub repository. With a single linked project, tokenless resolves it automatically.

OIDC has no such option: with several projects linked to the repository, the OIDC exchange fails. Use tokenless with a project slug, or a project token, for these projects.
{% endhint %}

### Tokenless limitations

* **GitHub Actions only.** Tokenless authentication relies on the GitHub workflow run lookup. It does not work outside GitHub Actions — for other CI providers, use `ARGOS_TOKEN`.
* **The Argos GitHub App must be installed on the repository.** Argos looks up the run with the app's access, for public and private repositories alike.
* **The workflow run must be visible to GitHub.** If the SDK runs in a context where GitHub does not report the run (for example, a self-hosted action that runs outside the standard workflow runner), tokenless cannot verify it.
* **Weaker proof than OIDC.** Tokenless verifies that the workflow run is in progress on the reported commit and branch; OIDC verifies a signed token from GitHub. Prefer OIDC where it is available.

## Troubleshooting

To see which method the SDK used, run the upload with `DEBUG=@argos-ci/core`: the log says "Authenticated with ARGOS_TOKEN", "Authenticated with GitHub Actions OIDC", or "Authenticated with GitHub Actions tokenless exchange".

**The SDK uses tokenless instead of OIDC.** The job is missing `id-token: write`, so GitHub doesn't give it an OIDC token. Add the permission to the job's `permissions` block. On pull requests from forks this is expected: GitHub never issues OIDC tokens there.

**Argos still uses `ARGOS_TOKEN`.** A secret is being injected into the job. Search your workflow, environments, and reusable workflows for `ARGOS_TOKEN` and remove it. You can confirm by printing `echo "${ARGOS_TOKEN:+set}${ARGOS_TOKEN:-unset}"` in a step (the value itself is masked).

**`GitHub Actions OIDC authentication is not enabled for this project. Enable it in the project settings.`** The job has `id-token: write`, so the SDK chose OIDC, but OIDC is off on the project. Turn on **Enable GitHub Actions OIDC** in **Project Settings → Authentication**, or remove `id-token: write` from the job to use tokenless authentication.

**`Tokenless authentication is disabled for this project. Set the ARGOS_TOKEN environment variable to authenticate.`** Tokenless authentication is off on the project, which is the default for new projects. Turn on **Enable tokenless authentication** in **Project Settings → Authentication**, or authenticate with OIDC or `ARGOS_TOKEN`.

**`No Argos project is linked to this GitHub repository.`** (OIDC) or **`No project found. Tokenless authentication requires an Argos project to be linked to your GitHub repository.`** (tokenless) No Argos project is connected to the repository that ran the workflow. Connect the repository in your project settings, or set `ARGOS_TOKEN`.

**`The Argos GitHub App is no longer installed on this repository. Reinstall the app or use a project token.`** Tokenless authentication looks up the workflow run through the Argos GitHub App. [Install the app](github-integration.md#install-the-argos-github-app) on the repository again, or set `ARGOS_TOKEN`.

**`GitHub run not found`** or **`GitHub job is not in progress`**. Argos could not find the workflow run the SDK reported in progress on GitHub. Upload while the workflow is still running, from the repository linked to the Argos project.

**`GitHub Actions workflow run does not match commit.`**, **`GitHub Actions workflow run does not match branch.`**, **`GitHub Actions OIDC token does not match repository.`**, or **`GitHub Actions OIDC token does not match commit.`** The repository, commit, or branch the SDK reported differs from the workflow run or the OIDC token, for example because `ARGOS_COMMIT` or `ARGOS_BRANCH` overrides them. Remove the override, or authenticate with `ARGOS_TOKEN`.

**`Multiple projects found for GitHub repository`** (tokenless) or **`Multiple Argos projects are linked to this GitHub repository.`** (OIDC) More than one Argos project is connected to the repository, so Argos cannot pick one automatically. With tokenless, specify the project slug: see [Specify a project when several share a repository](#specify-a-project-when-several-share-a-repository). With OIDC, switch to tokenless with a project slug, or to `ARGOS_TOKEN`.

**`Too many failed tokenless authentication attempts for this GitHub installation.`** Argos limits how many tokenless lookups can fail for a GitHub App installation in a short time. Retry later, or set `ARGOS_TOKEN`.

**Merge queue builds aren't linked to their pull request.** On `merge_group` events, the SDK fetches the pull request from the GitHub API, which needs `GITHUB_TOKEN` in the job environment, whatever the authentication method. See [Merge Queue support](github-integration.md#merge-queue-support).

## Further reading

* [GitHub: About security hardening with OpenID Connect](https://docs.github.com/en/actions/reference/security/oidc)
* [GitHub integration](github-integration.md) — connect Argos to your GitHub repositories.
