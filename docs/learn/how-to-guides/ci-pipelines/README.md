---
description: Patterns for running Argos efficiently in CI, from monorepos and sharding to preview deployments and subset builds.
---

# CI pipelines

Patterns for running Argos efficiently inside your continuous integration pipeline.

* [Monorepos setup](monorepos-setup.md) — run Argos for multiple projects in a single repository.
* [Parallel testing (sharding)](parallel-testing-sharding.md) — collect screenshots from sharded or parallelized test runs into a single build.
* [Run on preview deployments](run-on-preview-deployments.md) — trigger Argos against a deployed preview environment.
* [Skipping a build](skipping-a-build.md) — skip an Argos build when a visual comparison isn't needed.
* [Subset builds](subset-builds.md) — upload a partial run without affecting the baseline of screenshots it didn't cover.
