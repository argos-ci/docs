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
| `--project <owner/project>` | Project to upload to. Required with a personal access token; also `ARGOS_PROJECT`. |

The other commands round out the surface:

```bash
argos media list --type video
argos media get 4821
argos media delete 4821
```

Media belongs to a **project**, so it inherits that project's access and moves with it when the project is transferred. `media upload`, `get` and `list` accept a project token (`ARGOS_TOKEN`) or a personal access token; `media delete` needs project administrator rights, because a share URL may already be pasted somewhere and deleting the media breaks it.

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

### Commenting on media

An uploaded media has its own comment threads, on its share page. A comment can be **pinned to a point** on the image, so a reviewer can say "this button is misaligned" about a specific pixel rather than describing where to look.

That matters most for the agent that produced the screenshot. It cannot see the image, but it can read the coordinates:

```bash
argos media feedback --pr 1234
```

```
Feedback on 1 media (1 comment)

checkout-after.png
  ID: 4821
  URL: https://app.argos-ci.com/m/kQ8vN2pXr4tYw7...
  File: https://files.argos-ci.com/media/12/9f86d0…png

  Comment #comment-GY23
  Author: Alice (@alice)
  Pinned: point 0.62,0.34

    The primary button is misaligned here.
```

`Pinned` coordinates are normalized to the image's own width and height, so `0.62,0.34` is 62% across and 34% down whatever size it is displayed at. `File` is the image itself, for an agent that wants to fetch and look at it.

Only open threads are listed — what comes back is what is left to do. Add `--all` to include threads already resolved, `--pr` to narrow to one pull request.

Answer and close each thread as you deal with it:

```bash
argos media comment create 4821 --reply-to comment-GY23 --body "Fixed in abc1234."
argos media comment resolve 4821 comment-GY23
```

`argos media comment` also covers `list`, `get`, `edit`, `delete`, `unresolve`, `react`, `unreact`, `subscribe` and `unsubscribe`, mirroring [build comments](../review-workflow/review-a-build.md#comment-on-exactly-what-changed). Posting or resolving is a write on the project's review surface, so it needs a personal access token; a project token can read feedback but not answer it.

{% hint style="info" %}
Resolve only what you actually fixed. A resolved thread drops out of the next `argos media feedback`, so resolving something you skipped is how feedback gets silently dropped.
{% endhint %}

### Stable links across re-runs

Without a slug, every upload is a new media — so re-running a CI job leaves the pull request pointing at the previous file. Pass `--slug` to get a link that survives a re-run:

```bash
argos media upload after.png --slug pr-1234-after
```

Re-uploading the same slug replaces the bytes in place and keeps the id, the share token and therefore the URL. Markdown already posted to the pull request shows the new version. Slugs are unique per project; with several files, each gets the slug suffixed by its index (`pr-1234-after-1`, `-2`, …).

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

Five endpoints cover uploading and reading: `POST /media`, `POST /media/{mediaId}/finalize`, `GET /media/{mediaId}`, `DELETE /media/{mediaId}` and `GET /projects/{owner}/{project}/media`. Comments add `GET /projects/{owner}/{project}/media/comments` and the `/media/{mediaId}/comments` family — see [Commenting on media](#commenting-on-media).

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

With a personal access token, add `"project": "acme/web"`; a project token already identifies its project.

`POST` the file to `upload.url` as `multipart/form-data`, appending every entry of `upload.fields` **before** the `file` part, then call `finalize`. Finalizing checks the file is what it claims to be, records its dimensions, and makes it reachable. When `upload` comes back `null`, Argos already holds this exact file and both steps are unnecessary.

See the [API reference](https://argos-ci.com/docs/api-reference) for the full schemas.

### From an AI agent

The [MCP server](../../agents/mcp-server.md) exposes every one of these endpoints as a tool automatically — `createMedia`, `finalizeMedia`, `getMedia`, `deleteMedia`, `listMedia`, `listMediaFeedback` and the comment tools — under the `media:read` and `media:write` OAuth scopes.

For agents with a shell, the [`argos-upload` skill](../../agents/agent-skills.md) is the better path: it teaches *when* to attach media to a pull request, how to embed the result so it renders, and how to read back the feedback a human left on it. Install it with:

```bash
npx skills add https://argos-ci.com
```
