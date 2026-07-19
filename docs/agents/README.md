---
description: >-
  Everything Argos offers to AI agents: an MCP server, a CLI, installable agent
  skills, and AI-ready documentation.
---

# Agents

Argos is built to work with AI agents. Whether your assistant reviews visual changes in a pull request, inspects builds from your terminal, or answers questions about Argos, these are the features it can use.

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>MCP server</strong></td><td>Connect AI assistants like Claude, Cursor, or Copilot to Argos: list builds, inspect diffs, review changes, and manage projects through the Model Context Protocol.</td><td><a href="mcp-server.md">mcp-server.md</a></td></tr><tr><td><strong>CLI</strong></td><td>Upload screenshots, inspect builds, and submit reviews from scripts and local workflows — the tool agents use when they work in your terminal.</td><td><a href="../sdks-reference/argos-command-line-interface-cli.md">argos-command-line-interface-cli.md</a></td></tr><tr><td><strong>Agent skills</strong></td><td>Installable skills that teach your assistant the Argos CLI and a complete pull-request visual review workflow.</td><td><a href="agent-skills.md">agent-skills.md</a></td></tr><tr><td><strong>AI-ready docs</strong></td><td>This documentation is optimized for LLMs: Markdown for every page, <code>llms.txt</code> indexes, and its own docs MCP server.</td><td><a href="ai-ready-docs.md">ai-ready-docs.md</a></td></tr></tbody></table>

### Where to start

- To review builds with an AI agent in a pull request, follow the [Review builds with AI agents](../learn/review-workflow/review-builds-with-ai-agents.md) guide — it combines the CLI and agent skills.
- To give a general-purpose assistant access to your Argos account, connect it to the [MCP server](mcp-server.md).
- To let an agent answer questions about Argos itself, point it at the [AI-ready docs](ai-ready-docs.md).
