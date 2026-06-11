# GitHub Tokenless Authentication

Tokenless authentication lets the Argos SDK upload builds from GitHub Actions without an `ARGOS_TOKEN` secret and without OIDC. Argos verifies the run by looking it up on GitHub from the commit and branch the SDK reports.

It is the default fallback the Argos SDK uses when neither `ARGOS_TOKEN` nor OIDC is available — most importantly, on **pull requests from forked repositories**, where GitHub does not issue OIDC tokens.

{% hint style="info" %}
If your workflow can use GitHub OIDC, prefer it. OIDC is cryptographically signed by GitHub and is the strongest form of CI authentication Argos supports. Tokenless is the right choice when OIDC cannot be used.
{% endhint %}

### When tokenless is used

The SDK picks an authentication method in this order:

1. **`ARGOS_TOKEN`** is set → use the token.
2. **OIDC is enabled** (`id-token: write` permission granted and Argos project configured for OIDC) → use OIDC.
3. **Neither is available** → fall back to tokenless authentication.

So tokenless kicks in when you have not configured a token _and_ the workflow has not been granted `id-token: write` (or OIDC has not been enabled in your Argos project settings).

### How it works

1. The Argos SDK detects that no `ARGOS_TOKEN` is set and no OIDC token is available.
2. The SDK sends an upload request to Argos with the GitHub-provided context: repository, commit SHA, branch, and workflow run ID.
3. Argos calls the GitHub API to look up workflow runs for that repository at that commit and branch.
4. If Argos finds a workflow run that is **in progress** and matches the context the SDK reported, it issues a **short-lived token** scoped to that run and to the project.
5. The SDK uses that short-lived token to complete the upload.

The verification rests on a simple invariant: only the actual workflow run on GitHub can produce an upload whose context matches a run GitHub reports as in progress. If the run is not found, is not in progress, or doesn't match the repository linked to the Argos project, the upload is rejected.

### Use cases

* **Forked pull requests.** GitHub blocks OIDC and secrets on workflows triggered from forks. Tokenless authentication still works because it relies on the GitHub API rather than on a token injected into the runner.
* **Public repositories without configured secrets.** New contributors can open a PR and have visual tests run end-to-end without a maintainer needing to provision a token.
* **Quick setup.** You can connect a repository to Argos and have uploads work from GitHub Actions without configuring anything in the workflow.

### Configure your GitHub Actions workflow

Tokenless requires no special configuration — just leave `ARGOS_TOKEN` unset and do not grant `id-token: write`:

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
      - run: npm ci
      - run: npm run test:e2e
        # No ARGOS_TOKEN — the SDK falls back to tokenless authentication
```

If you want OIDC for internal PRs _and_ tokenless for fork PRs in the same workflow, add `id-token: write` to the job's `permissions` block. The SDK uses OIDC when GitHub issues a token and automatically falls back to tokenless on fork PRs where it doesn't.

### Limitations

* **GitHub Actions only.** Tokenless authentication relies on the GitHub workflow run lookup. It does not work outside GitHub Actions — for other CI providers, use `ARGOS_TOKEN`.
* **The workflow run must be visible to GitHub.** If the SDK runs in a context where GitHub does not report the run (for example, a self-hosted action that runs outside the standard workflow runner), tokenless cannot verify it.
* **Weaker proof than OIDC.** Tokenless verifies that a workflow with the same commit and branch is in progress; OIDC verifies a signed token from GitHub. Prefer OIDC where it is available.

### Troubleshooting

**`No matching workflow run found`.** Argos could not find an in-progress workflow run on GitHub matching the commit and branch the SDK reported. Check that the repository linked to the Argos project matches the one running the workflow, and that the workflow is still in progress when the upload runs.

**`Repository does not match the Argos project`.** The repository running the workflow is not the one linked to the Argos project. Update the project's connected repository in Argos, or run the workflow from the linked repository.

**Uploads work but are missing pull request metadata.** Tokenless authenticates the upload but does not by itself link the build to a pull request. Pass `GITHUB_TOKEN` in the job environment so the SDK can resolve the PR — see Running without `GITHUB_TOKEN`.

### Further reading

* GitHub OIDC authentication — the more secure option, preferred where available.
* Argos GitHub Integration
