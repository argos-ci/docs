---
description: Track builds, screenshots, change rate, and approval rate across every project in your Argos account — from the dashboard, the REST API, or the CLI.
---

# Analytics

The **Analytics** dashboard gives you an account-wide view of your visual testing activity: how many builds and screenshots you run, how often Argos detects changes, and how your team reviews them — across every project you can access.

The same metrics are available programmatically through the [REST API](analytics.md#rest-api) and the [CLI](analytics.md#cli).

### Open the dashboard

1. Select your account or team in Argos.
2. Select the **Analytics** tab.

Use the filters at the top to scope the whole page to specific projects, and to pick a time period — **last 7, 30, 90, or 365 days**, or a custom range. Data points are grouped by day, week, or month depending on the period.

### Key metrics

The summary band at the top answers the big questions at a glance:

* **Builds**: Total builds created over the period, with a trend sparkline and a per-period average.
* **Screenshots**: Total screenshots captured over the period, with a trend sparkline and a per-period average.
* **Change rate**: The share of concluded builds where Argos detected visual changes.
* **Approval rate**: The share of reviewed builds that were approved rather than rejected.

### Sections

Below the summary, themed sections let you explore where activity concentrates:

* **Activity**: Builds created and screenshots captured over time, broken down by project.
* **Build outcomes**: Changes detected vs. no changes, and approved vs. rejected builds over time, using the same status colors as builds.
* **Breakdown**: Screenshots by project, and screenshots per build.

### Export to CSV

Every chart can export its underlying data as CSV. The builds export includes changes detected, no changes, approved, and rejected columns, so you can build your own reports on top of it.

### REST API

The [`GET /accounts/{accountSlug}/analytics`](https://argos-ci.com/docs/api-reference/reference/analytics) endpoint returns the build and screenshot metrics that power the dashboard: totals and a per-period series, broken down by project. You can filter by project name, set a custom date range (up to 365 days), and group data points by day, week, or month.

The endpoint requires a **personal access token** scoped to the account — project tokens won't work. See the [API reference](https://argos-ci.com/docs/api-reference/reference/analytics) for details.

### CLI

The [`argos analytics`](../../sdks-reference/argos-command-line-interface-cli.md#analytics) command wraps the REST endpoint in a single command:

```bash
argos analytics --account my-team --from 2026-01-01 --group-by week
```

It prints a human-readable summary with a per-project breakdown, or machine-readable JSON with `--json` — handy when a script, a dashboard, or an AI agent needs to parse the result. See the [CLI reference](../../sdks-reference/argos-command-line-interface-cli.md#analytics) for all options.
