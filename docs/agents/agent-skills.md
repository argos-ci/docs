---
description: >-
  Installable agent skills that teach your AI assistant the Argos CLI and a
  complete pull-request visual review workflow.
---

# Agent skills

Argos publishes [agent skills](https://skills.sh) — reusable instruction packs your AI assistant loads to perform Argos tasks reliably, without you writing long prompts. They work with assistants that support skills, such as Claude Code, Codex, and Cursor.

## Available skills

| Skill             | What it teaches the agent                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `argos-cli`       | The [Argos CLI](../sdks-reference/argos-command-line-interface-cli.md): commands, flags, authentication rules, and output formats.          |
| `argos-pr-review` | A complete pull-request visual review workflow: find the Argos build, inspect snapshots, summarize changes, and approve or request changes. |

## Installation

```bash
npx skills add argos-ci/argos-javascript@argos-cli
npx skills add argos-ci/argos-javascript@argos-pr-review
```

The skills live in the [argos-javascript](https://github.com/argos-ci/argos-javascript) repository.

## Usage

Reference a skill in your prompt to activate it:

```
Use $argos-pr-review to review this pull request with its Argos build.
https://github.com/acme/app/pull/123
```

For the full workflow — tokens to set, what the agent does, and how to phrase prompts when your assistant does not support skills — see [Review builds with AI agents](../learn/review-workflow/review-builds-with-ai-agents.md).

{% hint style="info" %}
Skills drive the CLI, so they run wherever the agent has a terminal. If your assistant connects to remote services instead, use the [MCP server](mcp-server.md).
{% endhint %}
