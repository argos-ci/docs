---
description: >-
  Authenticate Argos uploads from GitHub Actions with a project token, OIDC, or
  tokenless authentication.
---

# GitHub Actions authentication

Argos supports three ways to authenticate uploads from GitHub Actions: a project token, OpenID Connect (OIDC), and tokenless authentication. The SDK picks one automatically based on what is available in the workflow.

### Choose a method

The SDK selects an authentication method in this order:

1. **`ARGOS_TOKEN`** is set → use the token.
2. **OIDC is available** (`id-token: write` permission granted and OIDC enabled in your Argos project) → use OIDC.
3. **Neither is available** → fall back to tokenless authentication.

* **Project token (`ARGOS_TOKEN`)**: A long-lived secret stored in your repository. Works on every CI provider, but needs to be provisioned and rotated. This is the only option outside GitHub Actions.
* **OIDC**: A short-lived identity token signed by GitHub, verified by Argos on every upload. The most secure option — prefer it when your workflow can use it.
* **Tokenless**: Argos verifies the upload by looking up the workflow run on GitHub. No configuration at all, and the only method that works on pull requests from forks.

A single workflow can combine OIDC and tokenless: grant `id-token: write` and leave `ARGOS_TOKEN` unset. The SDK uses OIDC when GitHub issues a token and automatically falls back to tokenless on fork PRs, where GitHub doesn't.

## OIDC

With [OpenID Connect (OIDC)](https://docs.github.com/en/actions/reference/security/oidc), each workflow run receives a short-lived identity token signed by GitHub. Argos verifies that token against the repository you have connected, then issues a temporary upload credential scoped to that build. No secret is ever stored in GitHub.

### Why use OIDC

* **No long-lived secret.** Nothing to rotate, leak, or copy between repositories.
* **Per-run identity.** Each token is tied to a specific repository, workflow, branch, and run. Compromise of one run cannot be replayed elsewhere.
* **Least privilege.** The credential Argos issues from the OIDC exchange is scoped to uploading to a single project.
* **Auditable.** GitHub signs the identity token with claims (repository, ref, workflow, actor) that Argos records on the resulting build.

### How OIDC works

1. GitHub Actions requests an OIDC identity token from GitHub's OIDC provider for the current job. This requires the `id-token: write` workflow permission.
2. The Argos SDK detects that no `ARGOS_TOKEN` is set and fetches the OIDC token from the runner.
3. The SDK sends the token to Argos with the upload request.
4. Argos verifies the token's signature, issuer, audience, and claims (`repository` and `commit`) against the project's **Connected Git Repository**.
5. If the token is valid and the repository matches the Argos project, the upload is accepted.

The OIDC token is short-lived (minutes) and never persisted by Argos beyond what is needed to attribute the build.

### Set up OIDC

To enable OIDC in your Argos project:

1. Open your project in Argos and go to **Project Settings → Authentication**.
2. Enable **GitHub OIDC**.
3. Save your changes.

Then configure your workflow. Two things are required:

1. Grant the workflow permission to mint an OIDC token by adding `id-token: write` to the job's `permissions` block.
2. **Remove** `ARGOS_TOKEN` from the job environment — if `ARGOS_TOKEN` is set, it takes precedence and OIDC is skipped.

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
      # Lets Argos link the build to its pull request
      pull-requests: read
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
      - run: npm ci
      - run: npm run test:e2e
        # Note: no ARGOS_TOKEN — the SDK uses OIDC automatically
```

{% hint style="info" %}
`id-token: write` must be set on the job (or at the workflow level). Adding it only to the `permissions` block of another job does not grant it to your Argos job. See [GitHub's documentation on `id-token` permissions](https://docs.github.com/en/actions/reference/security/oidc#adding-permissions-settings).
{% endhint %}

## Tokenless authentication

Tokenless authentication lets the Argos SDK upload builds without an `ARGOS_TOKEN` secret and without OIDC. Argos verifies the run by looking it up on GitHub from the commit and branch the SDK reports.

It is the fallback the SDK uses when neither a token nor OIDC is available — most importantly, on **pull requests from forked repositories**, where GitHub does not issue OIDC tokens or expose secrets.

### How tokenless works

1. The Argos SDK detects that no `ARGOS_TOKEN` is set and no OIDC token is available.
2. The SDK sends an upload request to Argos with the GitHub-provided context: repository, commit SHA, branch, and workflow run ID.
3. Argos calls the GitHub API to look up workflow runs for that repository at that commit and branch.
4. If Argos finds a workflow run that is **in progress** and matches the context the SDK reported, it issues a **short-lived token** scoped to that run and to the project.
5. The SDK uses that short-lived token to complete the upload.

The verification rests on a simple invariant: only the actual workflow run on GitHub can produce an upload whose context matches a run GitHub reports as in progress. If the run is not found, is not in progress, or doesn't match the repository linked to the Argos project, the upload is rejected.

### When to use tokenless

* **Forked pull requests.** GitHub blocks OIDC and secrets on workflows triggered from forks. Tokenless authentication still works because it relies on the GitHub API rather than on a token injected into the runner.
* **Public repositories without configured secrets.** New contributors can open a PR and have visual tests run end-to-end without a maintainer needing to provision a token.
* **Quick setup.** You can connect a repository to Argos and have uploads work from GitHub Actions without configuring anything in the workflow.

Tokenless requires no configuration — leave `ARGOS_TOKEN` unset and do not grant `id-token: write`. To pair it with OIDC in the same workflow, grant `id-token: write`: internal PRs use OIDC and fork PRs fall back to tokenless.

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
{% endhint %}

### Tokenless limitations

* **GitHub Actions only.** Tokenless authentication relies on the GitHub workflow run lookup. It does not work outside GitHub Actions — for other CI providers, use `ARGOS_TOKEN`.
* **The workflow run must be visible to GitHub.** If the SDK runs in a context where GitHub does not report the run (for example, a self-hosted action that runs outside the standard workflow runner), tokenless cannot verify it.
* **Weaker proof than OIDC.** Tokenless verifies that a workflow with the same commit and branch is in progress; OIDC verifies a signed token from GitHub. Prefer OIDC where it is available.

## Troubleshooting

**`Unable to get OIDC token` / 403 from the OIDC endpoint.** The job is missing `id-token: write`. Add it to the `permissions` block.

**Argos still uses `ARGOS_TOKEN`.** A secret is being injected into the job. Search your workflow, environments, and reusable workflows for `ARGOS_TOKEN` and remove it. You can confirm by printing `echo "${ARGOS_TOKEN:+set}${ARGOS_TOKEN:-unset}"` in a step (the value itself is masked).

**`Repository does not match the Argos project`.** The repository that ran the workflow is not the one linked to the Argos project. Run the workflow from the linked repository, or update the project's connected repository in Argos.

**`No matching workflow run found`.** Argos could not find an in-progress workflow run on GitHub matching the commit and branch the SDK reported. Check that the repository linked to the Argos project matches the one running the workflow, and that the workflow is still in progress when the upload runs.

**`Multiple projects are linked to this repository`.** More than one Argos project is connected to the repository, so tokenless cannot pick one automatically. Specify which project to use with the project slug — see [Specify a project when several share a repository](#specify-a-project-when-several-share-a-repository).

**Uploads work but are missing pull request metadata.** Tokenless authenticates the upload but does not by itself link the build to a pull request. Pass `GITHUB_TOKEN` in the job environment so the SDK can resolve the PR.

## Further reading

* [GitHub: About security hardening with OpenID Connect](https://docs.github.com/en/actions/reference/security/oidc)
* [GitHub integration](github-integration.md) — connect Argos to your GitHub repositories.
