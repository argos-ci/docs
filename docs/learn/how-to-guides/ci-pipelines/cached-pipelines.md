---
description: Run Argos reliably in pipelines where a task cache like Turborepo or Nx decides which test suites actually run.
---

# Cached CI pipelines (Turborepo, Nx)

Monorepo build systems like [Turborepo](https://turborepo.com/) and [Nx](https://nx.dev/) cache test tasks: when a package and its dependencies haven't changed, the task is replayed from cache instead of executing. This is great for CI speed, but it breaks a naive visual testing setup, because **a cached test task never uploads screenshots**.

Three problems follow:

1. **You can't predict how many uploads a run will produce.** Any fixed expectation (a parallel total, a required upload step) will hang or fail on runs where suites are cached.
2. **Missing screenshots look like removed screenshots.** If a build only contains the suites that ran, Argos would report every cached suite's screenshots as removed.
3. **Baselines on your main branch can go stale.** A baseline must be a complete build. If the suite that produces a screenshot doesn't run on main, no build contains its up-to-date version.

There are two ways to handle this. The examples use Turborepo and GitHub Actions; the same patterns apply to Nx or any cache that skips tasks.

## Preferred: cache the snapshot files as task outputs

The key insight: **Argos doesn't need your tests to run — it needs their snapshot files.** Build system caches can restore task outputs without executing the task. Declare the snapshot directory as a cached output, and upload the full set in a single step after the build-system run:

* Suites that ran contribute fresh files.
* Suites replayed from cache contribute their **restored** files — identical to the run that populated the cache, which is exactly right: a cache hit means the suite's inputs are unchanged.

Every build is complete, on pull requests and on main. A suite executes at most once per content change, on any branch, and baselines are always fresh.

### 1. Write snapshots to a directory inside the package

Capture snapshots to a directory owned by the task's package — Argos SDKs default to `./screenshots`. Don't upload from inside the test task (skip the SDK reporter / `uploadToArgos` option): the upload moves to a later step, outside the cache boundary.

### 2. Declare the directory as a cached task output

{% code title="packages/my-package/turbo.json" %}
```json
{
  "extends": ["//"],
  "tasks": {
    "test": {
      "outputs": ["screenshots/**"]
    }
  }
}
```
{% endcode %}

With Nx, add the directory to the target's [`outputs`](https://nx.dev/reference/project-configuration#outputs).

### 3. Upload once after the run

{% code title=".github/workflows/tests.yml" %}
```yaml
env:
  ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}

steps:
  - name: Run tests
    run: npx turbo test

  - name: Upload snapshots to Argos
    run: >-
      npx argos upload . --build-name unit
      --files "**/screenshots/**/*"
      --ignore "**/node_modules/**" "**/*.argos.json"
```
{% endcode %}

That's the whole setup: no parallel mode, no subset builds, no finalize step, and nothing special on your main branch.

{% hint style="warning" %}
Scope the `--files` globs so they match only the snapshot directories your cached tasks produce — a repo-root glob can accidentally sweep up unrelated screenshot folders (a Storybook suite from another workflow, stray local artifacts). Always ignore `**/node_modules/**` and the `**/*.argos.json` metadata sidecars.
{% endhint %}

### Caveats

* **Snapshots must be deterministic and machine-independent.** Cached files are reused across runners and branches; anything environment-dependent in them (timestamps, absolute paths, font rendering differences) will produce diffs that depend on which machine populated the cache. Text snapshots and stabilized screenshots are fine.
* **You extend the cache's trust model to baselines.** With a remote cache, files produced on a pull-request runner can end up in a main-branch build. That's the same trust you already place in the cache for test *results* — but it's worth stating.
* **Screenshot names become upload-root-relative.** Uploading from the repository root names snapshots by their full path (`packages/app/screenshots/home.png`), which also prevents name collisions between packages sharing a build.

## Alternative: subset builds + finalize

When the snapshot files can't be treated as cacheable outputs — uploads happen deep inside the test process, or suites are skipped by change detection rather than an artifact-restoring cache — use [parallel finalize mode](parallel-testing-sharding.md#finalize-mode) with [subset builds](subset-builds.md):

1. **Aggregate uploads into one build with finalize mode.** Each suite uploads as a shard (`ARGOS_PARALLEL=true`, `ARGOS_PARALLEL_TOTAL=-1`, one shared `ARGOS_BUILD_NAME`); the number of uploads may vary per run.
2. **Mark pull request builds as subset** (`ARGOS_SUBSET=true` on non-main runs), so screenshots missing from skipped suites are ignored instead of reported as removed.
3. **Guarantee complete builds on your main branch.** Subset builds are not eligible as baselines, so on main the Argos-enabled suites must actually run. Declare a variable in the task's **hashed** `env` (not the passthrough list — passthrough doesn't invalidate the cache) and give it a fresh value on main only:

{% code title=".github/workflows/tests.yml" %}
```yaml
env:
  ARGOS_SUBSET: ${{ github.ref != 'refs/heads/main' }}
  # Hashed into the Argos-enabled test tasks (turbo.json `env`): a fresh value
  # on every main commit forces them to re-run and produce complete builds.
  ARGOS_BASELINE_KEY: ${{ github.ref == 'refs/heads/main' && github.sha || '' }}
```
{% endcode %}

4. **Finalize, and keep a required check green.** After the run, `argos finalize --skip-if-empty` closes the build — and creates a [skipped build](skipping-a-build.md) when every upload was skipped, so a required Argos check still reports success. Run it only when the tests succeeded, so a partial run can never become a baseline.

{% code title=".github/workflows/tests.yml" %}
```yaml
- name: Run tests
  run: npx turbo test

- name: Finalize Argos build
  run: npx argos finalize --skip-if-empty
```
{% endcode %}

This costs a re-run of the Argos-enabled suites on every main commit, and uploads happen inside cached tasks — see the FAQ below for a logging gotcha that comes with that.

## Troubleshooting / FAQ

<details>

<summary>How do PR builds compare against the right screenshots when suites are cached?</summary>

Argos resolves the baseline by walking the ancestor commits of the pull request's merge base until it finds an eligible build. As long as main builds are complete — automatic with the outputs-caching pattern, forced in the subset + finalize pattern — the nearest ancestor build contains an up-to-date version of every screenshot.

</details>

<details>

<summary>Turborepo strips my ARGOS_* variables inside tasks</summary>

Turborepo runs tasks in [strict environment mode](https://turborepo.com/docs/reference/configuration#envmode) by default: undeclared variables never reach the task. This only matters when uploading from **inside** tasks (the subset + finalize pattern) — pass the variables through without hashing them:

{% code title="turbo.json" %}
```json
{
  "globalPassThroughEnv": ["ARGOS_*", "GITHUB_*"]
}
```
{% endcode %}

With the outputs-caching pattern the upload runs outside the build system, so no passthrough is needed.

</details>

<details>

<summary>The logs show "Argos build created" but the build isn't in my finalized build</summary>

When uploading from inside cached tasks, a cache hit replays the cached task's **logs**, including the "Argos build created" line from the run that populated the cache — but no upload actually happens, and the replayed URL points to the old run's build. Trust the output of the `argos finalize` step: it lists the builds that were really uploaded and finalized in the current run. (The outputs-caching pattern doesn't have this problem: the only upload log line is the real one.)

</details>

<details>

<summary>What about re-runs of a failed workflow?</summary>

With the outputs-caching pattern, the upload step simply runs again with the same files. In finalize mode, the parallel nonce includes the run attempt on GitHub Actions, so a re-run starts a fresh build; Argos detects partial re-runs of parallel builds and fills the missing shards from the previous attempt automatically.

</details>
