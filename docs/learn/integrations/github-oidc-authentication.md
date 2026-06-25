# GitHub OIDC authentication

Authenticate the Argos SDK from GitHub Actions using [OpenID Connect (OIDC)](https://docs.github.com/en/actions/reference/security/oidc) instead of storing a long-lived `ARGOS_TOKEN` secret in your repository.

With OIDC, each workflow run receives a short-lived identity token signed by GitHub. Argos verifies that token against the repository and workflow you have allowed, then issues a temporary upload credential scoped to that build. No secret is ever stored in GitHub.

### Why use OIDC

* **No long-lived secret.** Nothing to rotate, leak, or copy between repositories.
* **Per-run identity.** Each token is tied to a specific repository, workflow, branch, and run. Compromise of one run cannot be replayed elsewhere.
* **Least privilege.** The credential Argos issues from the OIDC exchange is scoped to uploading to a single project.
* **Auditable.** GitHub signs the identity token with claims (repository, ref, workflow, actor) that Argos records on the resulting build.

### How it works

1. GitHub Actions requests an OIDC identity token from GitHub's OIDC provider for the current job. This requires the `id-token: write` workflow permission.
2. The Argos SDK detects that no `ARGOS_TOKEN` is set and fetches the OIDC token from the runner.
3. The SDK sends the token to Argos with the upload request.
4. Argos verifies the token's signature, issuer, audience, and claims (`repository` and `commit`) against the project's **Connected Git Repository**.
5. If the token is valid and the repository matches the Argos project, the upload is accepted.

The OIDC token is short-lived (minutes) and never persisted by Argos beyond what is needed to attribute the build.

### Enable OIDC in your Argos project

1. Open your project in Argos and go to **Project Settings → Authentication**.
2. Enable **GitHub OIDC**.
3. Save your changes.

Once OIDC is enabled, builds from the repository linked to the project can authenticate without `ARGOS_TOKEN`.

### Configure your GitHub Actions workflow

Two things are required on the workflow side:

1. Grant the workflow permission to mint an OIDC token by adding `id-token: write` to the job's `permissions` block.
2. **Remove** `ARGOS_TOKEN` from the job environment. The SDK uses OIDC only when no token is provided — if `ARGOS_TOKEN` is set, it takes precedence.

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

{% hint style="warning" %}
If `ARGOS_TOKEN` is defined (as a repository, environment, or organization secret exposed to the job), the SDK will use it and skip OIDC entirely. Remove it from the job to enable OIDC.
{% endhint %}

{% hint style="info" %}
`id-token: write` must be set on the job (or at the workflow level). Adding it only to the `permissions` block of another job does not grant it to your Argos job. See [GitHub's documentation on `id-token` permissions](https://docs.github.com/en/actions/reference/security/oidc#adding-permissions-settings).
{% endhint %}

### Troubleshooting

**`Unable to get OIDC token` / 403 from the OIDC endpoint.** The job is missing `id-token: write`. Add it to the `permissions` block.

**Argos still uses `ARGOS_TOKEN`.** A secret is being injected into the job. Search your workflow, environments, and reusable workflows for `ARGOS_TOKEN` and remove it. You can confirm by printing `echo "${ARGOS_TOKEN:+set}${ARGOS_TOKEN:-unset}"` in a step (the value itself is masked).

**`Repository does not match the Argos project`.** The repository that ran the workflow is not the one linked to the Argos project. Run the workflow from the linked repository, or update the project's connected repository in Argos.

**OIDC is not used on forked pull requests.** GitHub does not issue OIDC tokens to workflows triggered from forks for security reasons. For PRs from forks, the Argos SDK automatically falls back to tokenless authentication, which is designed to work in that context.

### Prefer OIDC over tokenless authentication

Argos SDKs also support a **tokenless** mode that authenticates GitHub Actions runs without an `ARGOS_TOKEN` and without OIDC, by looking up the workflow run on GitHub from its commit and branch.

**If OIDC is available in your setup, prefer it over tokenless authentication.** OIDC is more secure because every upload is backed by a short-lived token signed by GitHub's OIDC provider, which Argos cryptographically verifies.

Tokenless authentication remains useful where OIDC cannot be used — most notably for **pull requests from forked repositories**, where GitHub does not issue OIDC tokens. The SDK falls back to tokenless automatically in those cases, so a single workflow can use OIDC for internal PRs and tokenless for fork PRs without any extra configuration.

To switch from tokenless to OIDC on the runs where it is available:

1. Enable **GitHub OIDC** in your Argos project's authentication settings.
2. Add `id-token: write` to the workflow permissions.

No code change is required in your tests — the SDK picks up OIDC automatically when it is available and no token is set.

### Further reading

* [GitHub: About security hardening with OpenID Connect](https://docs.github.com/en/actions/reference/security/oidc)
* [GitHub: Assigning permissions to jobs](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token)
* Argos GitHub Integration
