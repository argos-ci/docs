---
description: Collect screenshots from sharded or parallelized test runs into a single Argos build across your CI nodes.
---

# Parallel testing (sharding)

When a test suite is split across several CI jobs — Playwright shards, a test matrix, or independent suites in a monorepo — each job uploads its own screenshots. Parallel mode tells Argos to collect all these uploads into a **single build**, so you review one comparison and get one status check for the commit.

Uploads are correlated by a **nonce**, a unique identifier shared by all jobs of the same run. On most CI providers (GitHub Actions, GitLab CI, CircleCI…), Argos derives the nonce automatically from the pipeline run, so jobs of the same run join the same build without any configuration.

### Playwright

Argos integrates with Playwright out of the box, including [Playwright test sharding](https://playwright.dev/docs/test-sharding): the reporter detects the shard configuration and joins the parallel build automatically. For more details, refer to the [Argos Playwright SDK](../../../sdks-reference/playwright.md).

If you use an advanced orchestration system like the excellent one from [Currents](https://currents.dev/), use [finalize mode](#finalize-mode) instead: the number of shards isn't known upfront.

### Other SDKs

For environments beyond Playwright, parallel mode is configured through environment variables:

* `ARGOS_PARALLEL`: Activate the parallel mode.
* `ARGOS_PARALLEL_TOTAL`: The number of expected uploads, or `-1` for [finalize mode](#finalize-mode).
* `ARGOS_PARALLEL_INDEX`: The index of the current parallel node. Must start from `1`.
* `ARGOS_PARALLEL_NONCE`: A unique identifier for each build. In most CI environments, Argos generates it automatically from the pipeline run.

{% hint style="info" %}
Alternatively, use the `--parallel`, `--parallel-nonce`, `--parallel-total` and `--parallel-index` flags with the CLI, or `parallel: { nonce: string, total: number, index: number }` within SDK options.
{% endhint %}

### Choosing a mode

There are two parallel modes. Pick one based on whether you know, when the pipeline starts, exactly how many uploads will happen.

#### Count mode

Set `ARGOS_PARALLEL_TOTAL` to the number of parallel jobs. Argos finalizes the build automatically once it has received that many uploads.

Use count mode when the number of uploads is **fixed and guaranteed**, typically a static CI matrix where every job always uploads — it's the simplest setup, with no extra CI step.

{% hint style="warning" %}
If fewer uploads than `ARGOS_PARALLEL_TOTAL` arrive — a job failed before uploading, was skipped by a condition or a cache — the build never completes and the commit status stays pending. If uploads can be skipped, use finalize mode.
{% endhint %}

#### Finalize mode

Set `ARGOS_PARALLEL_TOTAL` to `-1`. Each upload joins the build as a shard, and the build stays open until you explicitly close it by running [`argos finalize`](../../../sdks-reference/argos-command-line-interface-cli.md#finalize-command) in a step that runs after all uploads.

Use finalize mode whenever the number of uploads **isn't known upfront or isn't guaranteed**:

* **Dynamic shard counts** — the matrix size varies per run, or an orchestrator (e.g. Currents) decides how tests are distributed.
* **Conditional uploads** — some jobs only run when their part of the codebase changed, or are skipped by a task cache such as Turborepo or Nx. See [Cached CI pipelines](cached-pipelines.md).
* **Aggregating independent suites** — several packages or tools upload to the same build name at different points of the pipeline, and no single job knows how many uploads to expect.

When it's possible that **no upload happens at all** (every suite skipped or cached), pass `--skip-if-empty` to `argos finalize`: instead of doing nothing, it creates a [skipped build](skipping-a-build.md) so a required Argos status check still reports success on the commit.

### Implementing in GitHub Actions

#### Count mode, with a static shard matrix

{% code title=".github/workflows/ci.yml" %}
```yaml
jobs:
  e2e-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      # ---
      # Here you setup your repo and run your E2E tests
      # ---
      - name: Upload screenshots to Argos
        env:
          ARGOS_PARALLEL: true
          ARGOS_PARALLEL_TOTAL: ${{ matrix.shardTotal }}
          ARGOS_PARALLEL_INDEX: ${{ matrix.shardIndex }}
          # ARGOS_PARALLEL_NONCE is automatically detected
        run: npm exec -- argos upload ./screenshots
```
{% endcode %}

#### Finalize mode

A dedicated job closes the build once all test jobs have run:

{% code title=".github/workflows/ci.yml" %}
```yaml
jobs:
  e2e-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      # ---
      # Here you setup your repo and run your E2E tests
      # ---
      - name: Upload screenshots to Argos
        env:
          ARGOS_PARALLEL: true
          ARGOS_PARALLEL_TOTAL: -1
          ARGOS_PARALLEL_INDEX: ${{ matrix.shardIndex }}
          # ARGOS_PARALLEL_NONCE is automatically detected
        run: npm exec -- argos upload ./screenshots

  finalize:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    # Finalize the build even if some shards have failed
    if: ${{ always() }}
    needs: ["e2e-tests"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - name: Finalize Argos build
        # ARGOS_PARALLEL_NONCE is automatically detected
        run: npm exec -- argos finalize
```
{% endcode %}

If the upload steps are conditional and may all be skipped, use `argos finalize --skip-if-empty` so the commit still gets a successful (skipped) Argos build.

### Troubleshooting / FAQ

<details>

<summary>My build stays pending forever</summary>

In count mode, the build completes only after exactly `ARGOS_PARALLEL_TOTAL` uploads. A shard that failed, was skipped, or uploaded with a different nonce or build name leaves the build waiting. Switch to finalize mode if uploads aren't guaranteed.

</details>

<details>

<summary>Each shard created its own build instead of joining one</summary>

The shards used different nonces. On unsupported CI providers, set `ARGOS_PARALLEL_NONCE` explicitly to a value shared by all jobs of the run (e.g. the pipeline run ID). Also make sure all shards use the same build name.

</details>
