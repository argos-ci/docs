---
description: >-
  Hand a flaky test to an AI agent: it reads the flakiness metrics and recurring
  changes from Argos, finds what makes the screenshot unstable, and fixes it in
  your repository.
---

# Fix flaky tests with AI agents

Fixing a flaky visual test is mostly investigation: work out which change keeps coming back, look at what moves in the screenshot, then find the non-determinism in the test or the UI. An AI agent working in your repository can do all of it, because Argos exposes the evidence it needs over the CLI, the MCP server, and the REST API.

The [test page](test-page.md) hands you a prompt that does exactly that.

### What you need

- A flaky test on the [Tests dashboard](tests-dashboard.md).
- An AI agent with access to the repository that contains the test.
- The [Argos CLI](../../sdks-reference/argos-command-line-interface-cli.md), the [MCP server](../../agents/mcp-server.md), or plain HTTP access to the [REST API](https://argos-ci.com/docs/api-reference) — whichever your agent already has.
- A token the agent can read with. A **project token** is enough to read a test and its changes; ignoring a change needs a [personal access token](../../sdks-reference/argos-command-line-interface-cli.md#project-tokens-and-personal-access-tokens).

### Quick start

{% stepper %}
{% step %}

#### Open the flaky test

From the [Tests dashboard](tests-dashboard.md), select the test you want to fix.
{% endstep %}

{% step %}

#### Give the agent a token

```bash
export ARGOS_TOKEN=<project-token>
```

Skip this if your agent is already connected to the [MCP server](../../agents/mcp-server.md) or signed in with `argos login`.
{% endstep %}

{% step %}

#### Copy the prompt

In the **Fix with AI** card, select **Copy prompt**. It is filled in with this test's id, its measured flakiness, and the calls to make.
{% endstep %}

{% step %}

#### Paste it into your agent

Run it in a session that has your repository checked out, so the agent can find the test and change it.
{% endstep %}
{% endstepper %}

### What the agent does

The prompt walks the agent through the same investigation you would run by hand:

1. **Read the evidence.** It fetches the test's flakiness metrics and its changes, most frequent first, with the diff mask, baseline, and captured screenshot for each.
2. **Look at what moves.** The changes with the highest occurrence count are the flaky ones — a difference that keeps reappearing while nothing in the UI changed.
3. **Find the non-determinism.** It locates the test in your repository from its name and build name, then looks for the usual culprits: animations and transitions still running, dates and times, random or unordered data, fonts or images that haven't loaded, network timing, scrollbars, and text carets.
4. **Fix the root cause.** Waiting for the real end state instead of a fixed delay, freezing the clock and the random source, ordering the data. The prompt asks it to prefer making the UI deterministic over masking the region.
5. **Report back** what was non-deterministic and what it changed.

If a change turns out to be noise that genuinely cannot be made deterministic, the prompt tells the agent to [ignore it](flaky-test-detection.md#ignore-changes) instead of contorting the test.

{% hint style="info" %}
[Stabilize screenshots](flaky-tests/README.md) documents the same fixes for a human reader. It's worth pointing your agent at when it needs the details for a specific framework.
{% endhint %}

### Without the prompt

The prompt is a convenience, not a requirement — any agent that can reach Argos can do this. The two calls that carry the evidence are:

```bash
argos test get <testId> --json      # flakiness, stability, consistency, and the trend over time
argos test changes <testId> --json  # each change with its occurrence count and screenshot URLs
```

Over MCP, they're the `getTest` and `listTestChanges` tools. Over HTTP, they're `GET /projects/{owner}/{project}/tests/{testId}` and `GET /projects/{owner}/{project}/tests/{testId}/changes`.

Install the [Argos agent skills](../../agents/agent-skills.md) to teach your assistant the CLI's commands, flags, and token rules up front:

```bash
npx skills add https://argos-ci.com
```

### Limits

An agent is good at spotting non-determinism and proposing a fix, but it is guessing at intent from a screenshot. Review its change like any other: a test that stops changing because it stopped asserting anything is worse than a flaky one. Argos keeps doing the deterministic comparison either way — a fix that doesn't work will show up as a change again on the next build.

### Related

- [Test page](test-page.md) — where the prompt lives, and the rest of what Argos knows about a test.
- [Review builds with AI agents](../review-workflow/review-builds-with-ai-agents.md) — the same idea applied to reviewing a pull request's visual changes.
- [Flaky test detection](flaky-test-detection.md) — how Argos scores flakiness and what ignoring a change does.
