---
description: Skip an Argos build to report success without screenshots when a required check shouldn't run a visual comparison.
---

# Skipping a build

Sometimes you want Argos to report success without running visual tests.

This is useful when Argos is configured as a required GitHub status check, but you intentionally want to skip screenshots for a commit or pull request.

A skipped build:

* uploads no screenshots
* runs no visual comparison
* immediately marks the commit status as success

### Creating a skipped build

You can skip a build in two ways.

#### Environment variable

Set the environment variable `ARGOS_SKIPPED` to `"true"` in your CI configuration.

**GitHub Actions example:**

```yaml
jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
      - name: Run tests
        run: npm run visual-tests # or your test command
        env:
          ARGOS_SKIPPED: "true"
```

This reports a successful Argos check without uploading screenshots.

#### Using the CLI

You can also explicitly create a skipped build using the CLI.

{% code title=".github/workflows/ci.yml" %}
```yaml
jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
      - name: Skip Argos build
        run: npx @argos-ci/cli skip
```
{% endcode %}

This immediately creates a successful Argos build with no visual testing.

{% hint style="info" %}
For [parallel builds in finalize mode](parallel-testing-sharding.md#finalize-mode) where every upload step may be skipped (e.g. by a task cache), use `argos finalize --skip-if-empty` instead: it finalizes the build when shards were uploaded, and creates a skipped build otherwise. See [Cached CI pipelines (Turborepo, Nx)](cached-pipelines.md).
{% endhint %}
