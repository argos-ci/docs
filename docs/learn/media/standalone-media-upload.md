---
description: Upload images and videos to Argos from the CLI, the Node.js SDK, the REST API or an AI agent, and attach them to a pull request with a managed comment.
---

# Upload media

Every surface uses the same three-step flow described in [How it works](./#how-it-works). The CLI is the shortest path; the API is there when you are not in a Node.js environment.

### From the CLI

```bash
argos media upload before.png after.png
```

Pass as many files as you like. Each one is uploaded in turn and printed with its own share URL and Markdown embed. Add `--json` when you parse the output.

| Flag                     | What it does                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `--slug <slug>`          | Stable identifier. Re-uploading it replaces the file in place, keeping the same URL. |
| `--pr <number>`          | Pull request the media belongs to.                                                  |
| `--comment`              | Maintain a managed Argos comment on that pull request. Requires `--pr`.              |
| `--visibility <type>`    | `team` or `public`. See [Share links](share-links-retention-and-limits.md).          |
| `--retention <days>`     | Keep the file for fewer days than your plan's default.                              |
| `--account <slug>`       | Team to upload to. Required with a personal access token.                            |

The other commands round out the surface:

```bash
argos media list --account my-team --type video   # team administrators only
argos media get 4821
argos media delete 4821
```

`media upload`, `get` and `delete` accept a project token (`ARGOS_TOKEN`) or a personal access token. `media list` spans the whole team, so it needs a personal access token belonging to an administrator.

### Embedding the result

Copy the `Markdown` line the command prints. Do not hand-write the embed — the correct form differs by type:

* An **image** embeds directly: `![alt](url)`.
* A **video** embeds its **poster frame wrapped in a link** to the share page.

That difference is not cosmetic. GitHub renders an inline video player only for media it hosts itself, so a `<video>` tag or a bare `.mp4` link pointing at Argos renders as a dead link. The poster-in-a-link is the form that shows something and plays when clicked.

{% hint style="info" %}
The poster frame is derived by the CDN from the video itself, so it is available immediately — there is nothing to wait for and no second file to manage.
{% endhint %}

### Attaching to a pull request

With `--pr` and `--comment`, Argos maintains **one** comment on the pull request listing every media uploaded to it, editing it in place on each new upload:

```bash
argos media upload before.png after.png --pr 1234 --comment
```

This needs a project token and a project connected to a GitHub repository, which is what CI holds. The comment is separate from the [Argos build comment](../review-workflow/pull-request-comments.md): standalone media has no build behind it, and a media upload never rewrites a status comment reviewers rely on.

If a reviewer deletes the comment, Argos stops recreating it. Deleting a media removes its row from the comment on the next upload.

### Stable links across re-runs

Without a slug, every upload is a new media — so re-running a CI job leaves the pull request pointing at the previous file. Pass `--slug` to get a link that survives a re-run:

```bash
argos media upload after.png --slug pr-1234-after
```

Re-uploading the same slug replaces the bytes in place and keeps the id, the share token and therefore the URL. Markdown already posted to the pull request shows the new version. Slugs are unique per team; with several files, each gets the slug suffixed by its index (`pr-1234-after-1`, `-2`, …).

### From the Node.js SDK

```javascript
import { uploadMedia } from "@argos-ci/core";

const [media] = await uploadMedia({
  files: ["after.png"],
  slug: "pr-1234-after",
  prNumber: 1234,
  comment: true,
});

console.log(media.url, media.markdown);
```

See the [Node.js SDK reference](../../sdks-reference/node.js-sdk.md) for every parameter.

### From the REST API

Five endpoints cover the surface: `POST /media`, `POST /media/{mediaId}/finalize`, `GET /media/{mediaId}`, `DELETE /media/{mediaId}` and `GET /accounts/{accountSlug}/media`.

`POST /media` declares the file and returns the media plus an `upload` target:

```bash
curl -X POST https://api.argos-ci.com/v2/media \
  -H "Authorization: Bearer $ARGOS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "after.png",
    "contentType": "image/png",
    "size": 188416,
    "hash": "<sha256-of-the-file>"
  }'
```

`POST` the file to `upload.url` as `multipart/form-data`, appending every entry of `upload.fields` **before** the `file` part, then call `finalize`. Finalizing checks the file is what it claims to be, records its dimensions, and makes it reachable. When `upload` comes back `null`, Argos already holds this exact file and both steps are unnecessary.

See the [API reference](https://argos-ci.com/docs/api-reference) for the full schemas.

### From an AI agent

The [MCP server](../../agents/mcp-server.md) exposes all five endpoints as tools automatically — `createMedia`, `finalizeMedia`, `getMedia`, `deleteMedia`, `listMedia` — under the `media:read` and `media:write` OAuth scopes.

For agents with a shell, the [`argos-upload` skill](../../agents/agent-skills.md) is the better path: it teaches *when* to attach media to a pull request, and how to embed the result so it renders. Install it with:

```bash
npx skills add https://argos-ci.com
```
