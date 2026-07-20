---
description: >-
  Connect AI assistants to Argos with the official MCP server: inspect builds,
  review visual changes, and manage projects straight from your agent.
---

# MCP server

Connect your AI tools to Argos using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io), an open standard that lets AI assistants interact with your Argos projects.

MCP defines a common way for an AI assistant to discover the tools a service exposes and call them on your behalf. Instead of a bespoke plugin for each assistant, a service publishes one MCP server, and every MCP-compatible client — Claude, Cursor, VS Code, and others — can use it.

## What is the Argos MCP server?

The Argos MCP server is the official remote MCP server for Argos, available at:

```
https://mcp.argos-ci.com
```

It integrates with popular AI assistants like Claude, enabling them to:

- List builds and inspect their screenshot diffs
- Approve or reject builds and dismiss reviews
- Read and post comments on builds
- Retrieve project metadata and account analytics

The server is remote and uses the **streamable HTTP** transport — there is no package to install or process to run locally. Configure your client with the transport `http` (sometimes labeled `streamable-http`) and the URL above. It implements the latest [MCP Authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization) and [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) specifications.

## Available tools

Tools are generated directly from the [Argos REST API](https://argos-ci.com/docs/api-reference): every API operation that a user can call is exposed as an MCP tool with the same name, parameters, and permissions. When the API gains an endpoint, the MCP server gains the matching tool.

Agents can list builds and inspect their screenshot diffs, approve or reject changes, read and post comments, manage projects, and retrieve account analytics. Ask your client to list the server's tools, or see the [API reference](https://argos-ci.com/docs/api-reference) for the underlying operations.

## Authentication

The MCP server supports two authentication methods:

### OAuth (recommended)

Most MCP clients handle OAuth automatically: add the server URL, and your client opens a browser window where you sign in to Argos, choose which organizations to share, and select the scopes to grant. Tokens are scoped to the organizations and permissions you approve, and you can revoke an authorization at any time from your Argos settings under **Authorized applications**.

### Personal access token

For clients or scripts where OAuth is impractical, authenticate with a [personal access token](https://app.argos-ci.com/settings/personal-access-tokens) sent as a bearer token:

```
Authorization: Bearer <personal-access-token>
```

{% hint style="info" %}
Project tokens (the ones used by CI to upload screenshots) are not accepted by the MCP server — they identify a project, not a user.
{% endhint %}

## Setup

### Claude Code

```bash
# Add the Argos MCP server
claude mcp add --transport http argos https://mcp.argos-ci.com

# Start Claude Code
claude

# Authenticate by typing /mcp
/mcp
```

### Claude.ai and Claude for desktop

1. Open **Settings** in the sidebar
2. Navigate to **Connectors** and select **Add custom connector**
3. Configure the connector:
   - Name: `Argos`
   - URL: `https://mcp.argos-ci.com`

### Cursor

Add the snippet below to your project-specific or global `.cursor/mcp.json` file. See the [Cursor documentation](https://docs.cursor.com/en/context/mcp) for details.

```json
{
  "mcpServers": {
    "argos": {
      "url": "https://mcp.argos-ci.com"
    }
  }
}
```

Once the server is added, Cursor displays a `Needs login` prompt. Click it to authorize Cursor to access your Argos account.

### VS Code with Copilot

1. Open the Command Palette
2. Run **MCP: Add Server**
3. Select **HTTP**
4. Enter the following details:
   - **URL:** `https://mcp.argos-ci.com`
   - **Name:** `Argos`
5. Select **Global** or **Workspace** depending on your needs
6. Click **Add**, then start the server and complete the sign-in flow when prompted

### Codex CLI

```bash
codex mcp add argos --url https://mcp.argos-ci.com
```

When adding the server, Codex detects OAuth support and opens your browser to authorize the connection.

### Windsurf

Add the snippet below to your `mcp_config.json` file. See the [Windsurf documentation](https://docs.windsurf.com/windsurf/cascade/mcp#adding-a-new-mcp-plugin) for details.

```json
{
  "mcpServers": {
    "argos": {
      "serverUrl": "https://mcp.argos-ci.com"
    }
  }
}
```

{% hint style="info" %}
Setup steps may vary based on your MCP client version. Always check your client's documentation for the latest instructions.
{% endhint %}

## Security best practices

- **Verify the official endpoint.** Always confirm you're connecting to Argos's official MCP endpoint: `https://mcp.argos-ci.com`.
- **Grant only what you need.** During the OAuth consent, share only the organizations the agent needs, and prefer read-only scopes when the agent only inspects builds.
- **Review authorized applications.** Audit and revoke authorizations from your Argos settings under **Authorized applications**.
- **Enable human confirmation.** Keep your agent's approval prompts on for write actions like approving builds or posting comments, so you review each change before it happens.
