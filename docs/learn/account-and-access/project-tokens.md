---
description: "Create the project tokens CI uses to upload to Argos, choose their permissions and expiration, and rotate them without downtime."
---

# Project tokens

A project token authenticates your CI with Argos. Store it as a CI secret and expose it as the `ARGOS_TOKEN` environment variable: the Argos SDK and CLI use it to upload builds and deployments, and to read project data.

A project can have several tokens. Each one has:

* a **name**, to recognize where it is used, such as "GitHub Actions";
* the **projects** it is linked to: usually one, or several projects of the same account;
* its **permissions**, which decide what it can do on those projects;
* an **expiration** date, or none;
* a **last used** date, refreshed when CI authenticates with it.

Argos shows a token once, when it is created, and only stores a hash of it. Nobody can display it again, administrators included. If you lose a token, create a new one and revoke the old one.

{% hint style="info" %}
On GitHub Actions, you can skip the token: [OIDC or tokenless authentication](../integrations/github-actions-authentication.md) authenticates uploads without a secret to store or rotate.
{% endhint %}

### Where tokens are managed

Tokens belong to the account, team or personal, that owns the projects.

* **Project settings → Authentication**, on the **Project tokens** card, lists the tokens linked to the project, including tokens linked to other projects too. [Project reviewers and administrators](team-members-and-roles.md) see the list. Project administrators create tokens for the project, and rename or revoke the tokens linked only to projects they administer.
* **Team Settings → Tokens** lists every project token of the team. Team owners create, rename and revoke any of them there, including tokens linked to several projects. On a personal account, the same list is in your account's **Settings → Tokens**.

The list shows each token's name, permissions, other linked projects, and when it was created, last used, and expires. It never shows the token itself.

### Create a token

{% stepper %}
{% step %}

### Open the token settings

For a token used by one project, open the project's **Settings → Authentication** and, on the **Project tokens** card, select **Create token**.

For a token linked to several projects, open **Team Settings → Tokens** and select **Create token**.
{% endstep %}

{% step %}

### Name the token

Enter a **Token name** that says where the token is used, such as "GitHub Actions". In team settings, also tick the **Projects** to link it to.
{% endstep %}

{% step %}

### Choose its permissions and expiration

The defaults, **Upload from CI** and **90 days**, are what CI needs to upload builds and deployments. See [Permissions](#permissions) and [Expiration](#expiration) to change them.
{% endstep %}

{% step %}

### Copy the token

Select **Create token**. Argos shows the token once: copy it right away and store it as the `ARGOS_TOKEN` secret in your CI.
{% endstep %}
{% endstepper %}

When you set up a new project, the **Getting started** page has a **Generate token** button. It creates a token named "Getting started", with the **Upload from CI** permissions, that expires in 90 days, and fills it into the commands on the page. Only project administrators see the button; other contributors are asked to get a token from an administrator.

### Permissions

When you create a token, choose a preset, or **Advanced** to tick individual permissions.

| Preset                       | Permissions                         | Use it to                                                                                       |
| ---------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Upload from CI** (default) | `builds:write`, `deployments:write` | Upload builds and deployments from CI.                                                          |
| **Read only**                | `projects:read`, `media:read`       | Read builds, screenshot diffs, tests, deployments and media, for example with the [Argos CLI](../../sdks-reference/argos-command-line-interface-cli.md). |
| **Full access**              | All five permissions                | Upload builds and deployments, read projects, and upload or delete media.                       |
| **Advanced**                 | The ones you tick                   | Combine permissions yourself.                                                                   |

| Permission          | Shown as           | Allows the token to                                              |
| ------------------- | ------------------ | ---------------------------------------------------------------- |
| `builds:write`      | Upload builds      | Create, update and finalize builds and their screenshots.        |
| `deployments:write` | Upload deployments | Create and finalize deployments.                                 |
| `projects:read`     | Read projects      | Read builds, screenshot diffs, tests and deployments.            |
| `media:read`        | Read media         | Read the images and videos uploaded to the projects.             |
| `media:write`       | Upload media       | Upload images and videos, and delete the ones already uploaded.  |

Two uses need more than one preset covers:

* [Uploading standalone media](../media/standalone-media-upload.md) needs **Upload media**, which **Upload from CI** doesn't include.
* [`argos baseline download`](../../sdks-reference/argos-command-line-interface-cli.md#downloading-screenshots-and-baselines) needs both **Read projects** and **Upload builds**.

Pick the permissions under **Advanced**, or use **Full access**.

A request that needs a permission the token lacks fails with a `403` error: "This project token lacks a permission. This endpoint requires: …", followed by the missing permission.

### Expiration

A new token expires in **90 days** by default. You can also pick 30, 60 or 180 days, 1 year, or **No expiration**. The dialog shows the date CI will stop uploading: [rotate the token](#rotate-a-token-without-downtime) before then.

**No expiration** is discouraged. Such a token stays valid until someone revokes it, so if it leaks, in a CI log, a forked workflow or a former teammate's machine, whoever holds it can upload to your projects for as long as nobody notices. Argos asks you to confirm before creating one.

Once a token has expired, its date shows as **Expired** in the list, and uploads with it fail with "This project token has expired, create a new one."

### Rotate a token without downtime

A project can have several tokens, so you can create a replacement before you revoke a token, and CI always has a valid one.

{% stepper %}
{% step %}

### Create the replacement

[Create a token](#create-a-token) with the same projects and permissions as the old one.
{% endstep %}

{% step %}

### Update the CI secret

Replace the value of the `ARGOS_TOKEN` secret with the new token, in every CI that uses the old one.
{% endstep %}

{% step %}

### Wait for the old token to go quiet

Watch the **Last used** date of both tokens. Argos refreshes it within a few minutes of each use. Once the old token's date stops moving while the new one's keeps updating, nothing uses the old token anymore.
{% endstep %}

{% step %}

### Revoke the old token

Open the old token's menu, select **Revoke**, and confirm. Anything still using it is rejected from its next upload.
{% endstep %}
{% endstepper %}

Rotate a token before it expires, and when someone who had access to it leaves. If a token leaks, revoke it right away, without waiting for its last used date: uploads fail until CI has the replacement, but nobody else can use it.

### Use a token linked to several projects

A token linked to several projects doesn't tell Argos which project an upload is for. Set `ARGOS_PROJECT` to the project's full name, `owner/project`, next to `ARGOS_TOKEN`:

{% code title=".github/workflows/argos.yml" %}
```yaml
env:
  ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
  ARGOS_PROJECT: my-team/my-project
```
{% endcode %}

Without it, the upload fails with "This project token is linked to several projects. Pass `project` as `owner/project` (`ARGOS_PROJECT` in the SDK) to choose one." A token linked to a single project doesn't need `ARGOS_PROJECT`; if you set it anyway, it must name that project, or the upload fails with a `401` error.

When you [transfer a project](../billing-and-subscription/how-to-subscribe.md#transfer-your-projects) to another account, the tokens linked only to that project move with it. A token linked to other projects too stays with the former account and stops working for the transferred project.

### Legacy tokens

Tokens created before Argos supported several tokens per project are listed as **Legacy token**. They keep every permission, never expire, and keep working: CI that uses one needs no change. Their **Last used** date reads **Never** until CI next uses them.

To limit what a legacy token can do, [rotate it](#rotate-a-token-without-downtime) to a token with **Upload from CI** permissions and an expiration date.

### Manage tokens from the CLI or the API

The [Argos CLI](../../sdks-reference/argos-command-line-interface-cli.md#configuring-a-project) lists, creates and revokes tokens with `argos project token` and, for every token of an account, `argos account project-token`. Both call the [Argos REST API](https://argos-ci.com/docs/api-reference) endpoints below, which authenticate with a [personal access token](../../sdks-reference/argos-command-line-interface-cli.md#project-tokens-and-personal-access-tokens) or OAuth, not with a project token.

| Endpoint                                                  | Does                                                    | Requires                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| `GET /projects/{owner}/{project}/tokens`                  | Lists the tokens linked to a project.                   | Reviewer role on the project.                                             |
| `POST /projects/{owner}/{project}/tokens`                 | Creates a token linked to the project.                  | Administrator of the project.                                             |
| `DELETE /projects/{owner}/{project}/tokens/{tokenId}`     | Revokes a token linked to the project.                  | Administrator of every project the token is linked to, or of the account. |
| `GET /accounts/{accountSlug}/project-tokens`              | Lists every project token of the account.               | Administrator of the account.                                             |
| `POST /accounts/{accountSlug}/project-tokens`             | Creates a token linked to the listed `projects`.        | Administrator of the account, or of every listed project.                 |
| `DELETE /accounts/{accountSlug}/project-tokens/{tokenId}` | Revokes a token of the account.                         | Administrator of the account, or of every project the token is linked to. |

The token's value is only in the response to its creation, in the `token` field. Through the API and the CLI, a token gets every permission unless you pass `permissions`, and never expires unless you pass `expireAt` (`--expires-in` or `--expire-at` in the CLI): set both.

The [Argos MCP server](../../agents/mcp-server.md) exposes the same operations as tools, so an AI agent can create, list and revoke project tokens with the permissions you grant it.
