---
description: >-
  Investigate a single test on its own page: flakiness metrics over time, every
  change it produced, discussion with your team, and a prompt to hand to an AI
  agent.
---

# Test page

The [Tests dashboard](tests-dashboard.md) tells you _which_ tests are flaky. The test page tells you _why_. It gathers everything Argos knows about one test: how often it changed, what those changes looked like, when they started, what your team said about it, and a prompt you can hand to an AI agent to fix it.

![Test page showing history and flaky score](<../../.gitbook/assets/test page example 44fb44458d2d5a457bad6eb9d6ddb29c.png>)

_A test page with its metrics and change history_

### Open a test page

Any of these routes get you there:

- From the [Tests dashboard](tests-dashboard.md), select a row.
- From a build review, select the [flaky badge](flaky-test-detection.md) next to a changed test.
- From the [Ignored changes](ignored-changes.md) page, select the test a change belongs to.

The page header shows the test name and its status:

- **Ongoing** — the test still runs. It appeared in the latest build of its build name.
- **Removed** — it did not, so it was deleted, renamed, or skipped.

### Choose the period

Every number and chart on the page is computed over a period you pick at the top: the last 24 hours, 3 days, 7 days, 30 days, or 90 days. It defaults to the last 7 days, and it lives in the URL — so a link you share opens on the same window you were looking at.

Only **auto-approved builds** count. A change on a branch usually means someone changed the UI on purpose; a change on an auto-approved build means the test moved on its own.

### Read the metrics

| Metric          | What it means                                                                           |
| --------------- | --------------------------------------------------------------------------------------- |
| **Flakiness**   | An overall score from 0 to 100 derived from stability and consistency. Higher is worse. |
| **Builds**      | How many builds ran the test over the period.                                           |
| **Changes**     | How many times it changed over the period.                                              |
| **Stability**   | The share of builds where it did _not_ change. Lower means it changes often.            |
| **Consistency** | The share of changes that were one-offs. Lower means the same change keeps coming back. |

The chart beside them breaks the same counts down over time, which is what tells a test that has _always_ been flaky apart from one that only started recently. A cliff in the chart usually points at the commit that introduced the instability.

In the sidebar, **First change** and **Last change** link to the builds where the test first and last changed — regardless of the selected period, so you can find the origin of a long-running flake.

### Explore the changes

A **change** is one exact visual difference, not one occurrence of it. Argos groups every diff that looks the same under a single change, so a screenshot flickering between two states is two changes here — however many builds it flickered in. That grouping is what makes a recurring change visible: it's the one with a high occurrence count.

The changes list is ordered by how often each one came back, and every card tells you which kind you're looking at:

- **Recurring — N×** — it came back N times. Nothing in the UI explains a change that reappears, so this is the flakiness signal to chase.
- **One-off** — it happened once. More likely a real, intentional change.
- **Ignored** — Argos skips it when it reappears. See [Ignored changes](ignored-changes.md).

Select a card to inspect that change: the baseline next to the captured screenshot, its **Occurrences** out of the total build count, and when it was **First seen** and **Last seen**, each linking to the build.

Use the **All** / **Ignored** toggle above the list to switch between every change and only the ignored ones. Like the period, the filter is in the URL.

From the toolbar you can **Ignore** the change you're looking at, exactly as you would from a build review — see [Ignore changes](flaky-test-detection.md#ignore-changes).

{% hint style="info" %}
Comment pins aren't available in this view. The changes explorer shows a test's history rather than one build's review, so comments belong to the test as a whole — see below.
{% endhint %}

### Discuss the test with your team

The **Activity** section in the sidebar is the test's own conversation, separate from any build review. Use it for what belongs to the test rather than to one run: "this one has been flaky since we added the carousel", "waiting on the upstream fix", "safe to ignore until Q3".

- **Leave a comment** in the composer at the bottom. Comments are written in Markdown, with `/` slash commands for formatting and **@mentions** to notify a teammate.
- **Reply** to a comment to start a thread, **react** with an emoji, and **resolve** a thread once it's settled — reopening it if it comes back.
- The feed opens with when Argos first saw the test, then every thread, oldest first.

Unlike [build comments](../review-workflow/review-a-build.md#comment-on-exactly-what-changed), a comment on a test posts immediately: there's no pending review to batch it into.

Use the bell in the **Activity** header to **follow** the test and get notified of new comments. Commenting follows it for you.

Leaving comments requires a role that can review — see [Team members & roles](../account-and-access/team-members-and-roles.md).

### Fix the flakiness with an AI agent

The **Fix with AI** card gives you a prompt to copy into a coding agent working in your repository — Claude Code, Codex, Cursor, or any other. The prompt names the test, carries the flakiness Argos measured, and tells the agent how to pull the recurring changes and their screenshots for itself before it starts editing.

1. Select **Copy prompt**. Use **Preview the prompt** first if you want to read it.
2. Paste it into your agent, in a session that has access to the repository.

The card expands on its own when the test looks flaky. On a stable test there's nothing to fix, so it stays folded into its header — still one click away.

For what the agent needs to authenticate and what to expect from it, see [Fix flaky tests with AI agents](fix-flaky-tests-with-ai-agents.md).

### Read the same data from the API or CLI

Everything on this page is available outside the UI, so you can script it or hand it to an agent:

```bash
argos test get <testId> --json
argos test changes <testId> --json
```

See [Inspecting builds and tests](../../sdks-reference/argos-command-line-interface-cli.md#inspecting-builds-and-tests) in the CLI reference for what each command returns, and [Reviewing and commenting](../../sdks-reference/argos-command-line-interface-cli.md#reviewing-and-commenting) for `test comment`. The same data is available over the [REST API](https://argos-ci.com/docs/api-reference) and the [MCP server](../../agents/mcp-server.md).
