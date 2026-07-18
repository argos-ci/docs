---
description: >-
  The Argos documentation is optimized for LLMs: Markdown for every page,
  llms.txt indexes, and a docs MCP server.
---

# AI-ready docs

This documentation is published with [GitBook](https://gitbook.com/docs/ai-and-search/llm-ready-docs), which exposes AI-friendly outputs for every page. Point your agent at these endpoints instead of letting it scrape HTML.

## Markdown for every page

Append `.md` to any page URL to get its raw Markdown:

```
https://argos-ci.com/docs/agents/mcp-server.md
```

## Site indexes: llms.txt and llms-full.txt

- [`https://argos-ci.com/docs/llms.txt`](https://argos-ci.com/docs/llms.txt) — an AI-friendly index of the whole documentation, listing every page with its Markdown URL. Give this to an agent so it can discover and fetch only the pages it needs.
- [`https://argos-ci.com/docs/llms-full.txt`](https://argos-ci.com/docs/llms-full.txt) — a full snapshot of the published documentation in one file, for tools that ingest everything at once.

## Docs MCP server

The documentation also exposes its own read-only MCP server, so MCP-compatible tools can search and read these docs directly:

```
https://argos-ci.com/docs/~gitbook/mcp
```

For example, with Claude Code:

```bash
claude mcp add --transport http argos-docs https://argos-ci.com/docs/~gitbook/mcp
```

{% hint style="info" %}
This docs MCP server answers questions about Argos from the documentation. To let an agent act on your Argos account — list builds, review changes, post comments — connect it to the [Argos MCP server](mcp-server.md) instead.
{% endhint %}
