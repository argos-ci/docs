---
description: Run Argos reliably in pipelines where a task cache like Turborepo or Nx decides which test suites actually run.
---

# Cached CI pipelines (Turborepo, Nx)

Monorepo build systems like [Turborepo](https://turborepo.com/) and [Nx](https://nx.dev/) cache test tasks: when a package and its dependencies haven't changed, the task is replayed from cache instead of executing. This is great for CI speed, but it breaks a naive visual testing setup, because **a cached test task never uploads screenshots**.

Three problems follow:

1. **You can't predict how many uploads a run will produce.** Any fixed expectation (a parallel total, a required upload step) will hang or fail on runs where suites are cached.
2. **Missing screenshots look like removed screenshots.** If a build only contains the suites that ran, Argos would report every cached suite's screenshots as removed.
3. **Baselines on your main branch can go stale.** A baseline must be a complete build. If the suite that produces a screenshot doesn't run on main, no build contains its up-to-date version.

This guide sets up a pipeline that handles all three, using one aggregated build per run. The examples use Turborepo and GitHub Actions; the same pattern applies to Nx or any cache that skips tasks.

### 1. Aggregate uploads into one build with finalize mode

Each Argos-enabled package uploads its screenshots as a shard of a single [parallel build](parallel-testing-sharding.md) in [finalize mode](parallel-testing-sharding.md#finalize-mode), since the number of uploads varies per run. Set the configuration once at the job level:

{% code title=".github/workflows/tests.yml" %}
```yaml
env:
  ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
  # All packages upload as shards of a single "unit" build.
  ARGOS_BUILD_NAME: unit
  ARGOS_PARALLEL: true
  ARGOS_PARALLEL_TOTAL: -1
  # ARGOS_PARALLEL_NONCE is automatically detected
```
{% endcode %}

Every package that ran uploads a shard; cached packages upload nothing. After the test run, a finalize step closes the build (see [step 4](#4-finalize-and-keep-a-required-check-green)).

{% hint style="info" %}
If you prefer one Argos build per package ([build splitting](monorepos-setup.md)), the caching problems and the fixes below apply per build name. A single aggregated build keeps review and required checks simpler when many small packages are involved.
{% endhint %}

### 2. Mark pull request builds as subset

On pull requests, cached suites are absent from the build. Mark these builds as [subset builds](subset-builds.md) so Argos ignores the missing screenshots instead of reporting them as removed:

{% code title=".github/workflows/tests.yml" %}
```yaml
env:
  # On PRs the cache may skip suites, so builds only contain a subset of the
  # screenshots. On main, suites are forced to run (see next section).
  ARGOS_SUBSET: ${{ github.ref != 'refs/heads/main' }}
```
{% endcode %}

The semantics work out naturally: a suite is cached exactly when its inputs are unchanged, so its screenshots are the same as a previous run's — there is nothing new to review.

### 3. Guarantee complete builds on your main branch

Subset builds are **not eligible as baselines** — a baseline must represent the full suite. If main builds were subset too, your baselines would never include the packages the cache skipped, and every PR would diff against stale screenshots.

The fix is to force the Argos-enabled test tasks — and only those — to run on every main commit. Declare an environment variable in the task's hashed inputs, and give it a fresh value (the commit SHA) on main only:

{% code title="packages/my-package/turbo.json" %}
```json
{
  "extends": ["//"],
  "tasks": {
    "test": {
      "env": ["ARGOS_BASELINE_KEY"]
    }
  }
}
```
{% endcode %}

{% code title=".github/workflows/tests.yml" %}
```yaml
env:
  # Part of the turbo cache key of Argos-enabled test tasks: a fresh value on
  # every main commit forces them to run, producing complete builds that are
  # eligible as baselines. Empty on PRs, where caching stays effective.
  ARGOS_BASELINE_KEY: ${{ github.ref == 'refs/heads/main' && github.sha || '' }}
```
{% endcode %}

With Nx, declare the variable in the task's [`inputs`](https://nx.dev/reference/inputs) (`{ "env": "ARGOS_BASELINE_KEY" }`) for the same effect.

{% hint style="warning" %}
The baseline key must be declared in the task's **hashed** `env` list — that's what invalidates the cache. Passing it through an environment allowlist (Turborepo's `passThroughEnv`, for example) is not enough: passthrough variables reach the task but don't participate in the cache key. An `env` declaration invalidates the cache even when a passthrough wildcard like `ARGOS_*` also matches the variable.
{% endhint %}

The cost is bounded: only the Argos-enabled suites re-run on main pushes, and only there. Everything else keeps hitting the cache, and pull requests are unaffected.

### 4. Finalize, and keep a required check green

After the test run, close the build. On runs where **every** Argos-enabled suite was cached, no build exists at all — without one, a commit with Argos as a [required status check](../../review-workflow/summary-checks.md) would stay blocked. `--skip-if-empty` covers this case by creating a [skipped build](skipping-a-build.md) (an immediately-successful build with no comparison):

{% code title=".github/workflows/tests.yml" %}
```yaml
- name: Run tests
  run: pnpm turbo test

- name: Finalize Argos build
  run: pnpm exec argos finalize --skip-if-empty
```
{% endcode %}

Run the finalize step only when the tests succeeded (the default step behavior). Finalizing a partial run on main would produce an incomplete build that could be picked as a baseline.

### Complete example

{% code title=".github/workflows/tests.yml" %}
```yaml
name: Tests

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  tests:
    runs-on: ubuntu-latest
    env:
      ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
      ARGOS_BUILD_NAME: unit
      ARGOS_PARALLEL: true
      ARGOS_PARALLEL_TOTAL: -1
      ARGOS_SUBSET: ${{ github.ref != 'refs/heads/main' }}
      ARGOS_BASELINE_KEY: ${{ github.ref == 'refs/heads/main' && github.sha || '' }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci

      - name: Run tests
        run: npx turbo test

      - name: Finalize Argos build
        run: npx argos finalize --skip-if-empty
```
{% endcode %}

{% hint style="info" %}
Turborepo runs tasks in [strict environment mode](https://turborepo.com/docs/reference/configuration#envmode) by default: environment variables not declared in the configuration are stripped from the task's environment. Pass the Argos variables through without hashing them, so they reach your test processes without invalidating the cache:

{% code title="turbo.json" %}
```json
{
  "globalPassThroughEnv": ["ARGOS_*", "GITHUB_*"]
}
```
{% endcode %}

`GITHUB_*` (or your CI provider's equivalent) lets the Argos SDK detect the branch, commit, and parallel nonce from inside the task.
{% endhint %}

### Troubleshooting / FAQ

<details>

<summary>How do PR builds compare against the right screenshots when suites are cached?</summary>

Argos resolves the baseline by walking the ancestor commits of the pull request's merge base until it finds an eligible build. Since main builds are complete (step 3), the nearest ancestor build contains an up-to-date version of every screenshot, including those from suites the PR run skipped.

</details>

<details>

<summary>Why not simply disable the cache for visual test suites everywhere?</summary>

That works, but you pay for it on every pull request push. Busting the cache on main only (step 3) keeps PR feedback fast while keeping baselines fresh: a suite skipped on a PR is by definition unchanged, and subset mode (step 2) makes Argos treat it that way.

</details>

<details>

<summary>What about re-runs of a failed workflow?</summary>

On GitHub Actions, the parallel nonce includes the run attempt, so a re-run starts a fresh build. Argos detects partial re-runs of parallel builds and fills the missing shards from the previous attempt automatically.

</details>
