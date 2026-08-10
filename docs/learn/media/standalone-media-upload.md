---
description: Upload images and videos to Argos from the CLI, the Node.js SDK, the REST API or an AI agent, and get them into a pull request with a managed comment.
---

# Upload media

Every surface uses the same three-step flow described in [How it works](./#how-it-works). The CLI is the shortest path; the API is there when you are not in a Node.js environment.

### From the CLI

```bash
argos media upload before.png after.png
```

Pass as many files as you like. Each one is validated up front — an unsupported type, an unreadable path or a name collision fails the batch before anything is transferred — then uploaded in turn and printed with its own share URL and Markdown embed. Add `--json` when you parse the output.

| Flag                        | What it does                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `--branch <branch>`         | Stage the media on a branch. Argos publishes it — and posts the pull request comment — by itself once a pull request opens for that branch. |
| `--pr <number>`             | Publish the media to an existing pull request.                                                                                         |
| `--state <before\|after>`   | Which half of a before/after pair these files are. Inferred from a file name ending in `-before` or `-after`.                          |
| `--description <text>`      | Prose shown under the media in the pull request comment.                                                                               |
| `--visibility <team\|public>` | Who can open the share page. Defaults to the most private option your plan allows. See [Share links](share-links-retention-and-limits.md). |
| `--no-compress`             | Upload images exactly as they are instead of converting them to WebP.                                                                  |
| `--project <owner/project>` | Project to upload to. Required with a personal access token; also `ARGOS_PROJECT`.                                                     |

Media belongs to a **project**, so it inherits that project's access and moves with it when the project is transferred. In CI, `media upload` authenticates like every other Argos command: `ARGOS_TOKEN`, or tokenless GitHub Actions authentication with no token at all. See [Tokens and permissions](#tokens-and-permissions) for the other commands.

### Getting media into a pull request

An agent produces screenshots while it is still doing the work; the pull request comes after, if it comes at all. So a media attaches to a **branch** or to a **pull request**:

* `--branch <branch>` — the media is **staged**. It is real from the start: shareable, listed, with its URL. When a pull request opens for that branch, Argos attaches everything staged there and posts its comment, unasked. Naming a branch needs no GitHub connection and no open pull request.
* `--pr <number>` — the media is **published** to that pull request immediately.

```bash
argos media upload checkout-before.png checkout-after.png --branch feat/checkout
```

Neither flag is inferred from the environment, CI included — pass the one you mean. A media keeps its branch after publishing, as a record of where it came from, so `argos media list --branch <branch>` finds everything uploaded for the work in hand across the moment the pull request opens.

Two boundaries: publishing needs the project connected to a GitHub repository with [pull request comments](../review-workflow/pull-request-comments.md) enabled, and a pull request opened from a **fork** never claims a branch's staged media.

#### The managed comment

Argos maintains **one** comment per pull request — "Media uploaded by Argos" — listing every media published to it in a table, and edits it in place on each change. Attaching a media to a pull request and showing it there are the same act, not two. A [before/after pair](#before-and-after-pairs) shares a single row, descriptions appear in a Notes column, and the table lists up to 20 media.

The comment is separate from the [Argos build comment](../review-workflow/pull-request-comments.md): standalone media has no build behind it, and a media upload never rewrites a status comment reviewers rely on. If a reviewer deletes the comment, Argos takes the hint and never recreates it on that pull request. Deleting a media removes its row immediately.

### Before and after pairs

A file named `checkout-before.png` uploads as `checkout.png` labelled `before` — the suffix is lifted off the name, case-insensitively, and the extension stays. Uploading `checkout-after.png` alongside it gives the pair one identity, one row in the pull request comment, and a share page that compares the two side by side with synced pan and zoom.

`--state before` or `--state after` sets the label for files not named that way. It applies to **every** file in the invocation — passing it to an already-suffixed pair would make both files collide on one identity, which the CLI refuses rather than silently versioning:

```bash
argos media upload before/checkout.png --state before
argos media upload after/checkout.png --state after
```

### Versions: re-upload, same link

A media's identity within its pull request (or on its branch) is its **name**. Re-uploading the same name adds a **version** rather than a second media: the id, the share token and therefore the URL are unchanged, and the share page — and any Markdown already pasted in a pull request — shows the newest upload. The version a reviewer commented on survives underneath, in the share page's history.

Re-uploading a file whose bytes haven't changed does nothing: Argos recognizes the content hash, skips the transfer, and adds no version.

While a media is **staged**, `argos media update` can rename it, edit its description, or move it to another branch (`--no-branch` detaches it, so no pull request will publish it). Once **published**, name and branch are fixed — the pull request comment and its review threads are built on them:

```bash
argos media update 4821 --description "After the alignment fix"
argos media update 4821 --name checkout-v2.png     # staged media only
```

### Image compression

The CLI converts PNG and JPEG images to WebP before uploading — a 252 KB PNG screenshot typically goes out at a tenth of the size, at a quality (85) where text and 1-pixel borders survive. The media's name keeps your file's extension: `checkout.png` stays `checkout.png` even when WebP bytes are sent, so a `--no-compress` re-run adds a version instead of creating a second media.

Compression is skipped whenever it would not help: videos, already-efficient WebP and AVIF, GIFs and animated PNGs, images past WebP's 16383-pixel dimension limit (a long full-page capture reaches it), and conversions that came out no smaller. A file that can't be converted is uploaded as-is rather than failing the upload. Pass `--no-compress` to upload every image untouched.

Converting applies a photo's EXIF orientation, then drops the rest of its metadata — including GPS coordinates. A file uploaded untouched keeps its metadata in the stored original; see [What Argos does to your file](share-links-retention-and-limits.md#what-argos-does-to-your-file).

### Embedding the result

Copy the `Markdown` line the command prints. Do not hand-write the embed — the correct form differs by type:

* An **image** embeds directly: `![name](url)`.
* A **video** embeds its **poster frame wrapped in a link** to the share page: `[![name](posterUrl)](url)`.

That difference is not cosmetic. GitHub renders an inline video player only for media it hosts itself, so a `<video>` tag or a bare `.mp4` link pointing at Argos renders as a dead link. The poster-in-a-link is the form that shows something and plays when clicked.

{% hint style="info" %}
The poster frame is derived by the CDN from the video itself, so it is available immediately — there is nothing to wait for and no second file to manage.
{% endhint %}

### Reading the feedback left on a media

An uploaded media has its own comment threads, on its share page. A comment can be **pinned to a point** on the image, so a reviewer can say "this button is misaligned" about a specific pixel rather than describing where to look.

That matters most for the agent that produced the screenshot. It cannot see the image, but it can read the coordinates. Find the media uploaded for the branch, then list its open threads:

```bash
argos media list --branch feat/checkout
argos media comment list 4821
```

```
Comments (1)

#comment-xf23d [thread] Alice (@alice)
  Pinned: point 0.62,0.34
  Media version: media-version-9
  The primary button is misaligned here.
```

`Pinned` coordinates are normalized to the image's own width and height, so `0.62,0.34` is 62% across and 34% down whatever size it is displayed at. A comment also records the **version** it was written against: a pin describes a spot on the bytes its author was looking at, so once the media has been re-uploaded, resolve that version with `argos media versions 4821` and fetch *that* file rather than the newest.

Only open threads are listed — what comes back is what is left to do. Add `--all` to include threads already resolved.

Answer and close each thread as you deal with it:

```bash
argos media comment create 4821 --reply-to comment-xf23d --body "Fixed in abc1234."
argos media comment resolve 4821 comment-xf23d
```

`argos media comment` also covers `get`, `edit`, `delete`, `unresolve`, `react`, `unreact`, `subscribe` and `unsubscribe`, mirroring [build comments](../review-workflow/review-a-build.md#comment-on-exactly-what-changed). A new comment can carry its own pin with `--anchor-point <x,y>` (normalized 0–1); a reply inherits the spot its thread already points at. Every `media comment` command — reading included — needs a personal access token, because a comment has an author.

{% hint style="info" %}
Resolve only what you actually fixed. A resolved thread drops out of the next `media comment list`, so resolving something you skipped is how feedback gets silently dropped.
{% endhint %}

### Tokens and permissions

| Command                          | Token                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `media upload`, `media update`   | Project token (`ARGOS_TOKEN`, or tokenless CI for upload), or a personal access token with review access. |
| `media get`, `list`, `versions`  | Either token type, with access to the project.                                                 |
| `media delete`                   | Project token, or a personal access token with **administrator** rights on the project — a share URL may already be pasted somewhere, and deleting the media breaks it. |
| `media comment …`                | Personal access token, reading included.                                                       |

With a personal access token, `media upload` and `media list` need the project named: `--project <owner/project>` or `ARGOS_PROJECT`. A project token already identifies its project.

### From the Node.js SDK

```javascript
import { uploadMedia } from "@argos-ci/core";

const [media] = await uploadMedia({
  files: ["checkout-after.png"],
  branch: "feat/checkout",
});

console.log(media.url, media.markdown);
```

Options mirror the CLI: `token`, `project`, `branch`, `prNumber`, `state`, `description`, `visibility` and `compress` (`true` by default). It returns one media per file, uploaded sequentially in input order. See the [Node.js SDK reference](../../sdks-reference/node.js-sdk.md).

### From the REST API

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

`state`, `description`, `visibility`, `branch` and `prNumber` are optional. With a personal access token, add `"project": "acme/web"`; a project token already identifies its project.

`POST` the file to `upload.url` as `multipart/form-data`, appending every entry of `upload.fields` **before** the `file` part — the target stays valid for 30 minutes — then call `POST /media/{mediaId}/finalize`. Finalizing checks the file is what it claims to be, records an image's dimensions, bills the upload, and makes it reachable. When `upload` comes back `null`, Argos already holds this exact file and both steps are unnecessary.

The rest of the surface:

| Endpoint                                  | What it does                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `GET /media/{mediaId}`                    | Read one media.                                                                    |
| `PATCH /media/{mediaId}`                  | Edit `name`, `description` or `branch` — **staged media only**; `null` clears.     |
| `DELETE /media/{mediaId}`                 | Delete the media, its versions and its comments. Project administrators only.      |
| `GET /media/{mediaId}/versions`           | The upload history, newest first — when `versionCount` says there is one.          |
| `GET /projects/{owner}/{project}/media`   | List, filtered by `branch`, `prNumber`, `stage`, `search`, `type`.                 |
| `/media/{mediaId}/comments/…`             | The full comment surface — threads, reactions, resolution, subscriptions. Personal access token only. |

See the [API reference](https://argos-ci.com/docs/api-reference) for the full schemas.

### From an AI agent

The [MCP server](../../agents/mcp-server.md) exposes every one of these endpoints as a tool automatically — `createMedia`, `finalizeMedia`, `getMedia`, `updateMedia`, `deleteMedia`, `listMedia`, `listMediaVersions` under the `media:read` and `media:write` OAuth scopes, and the media comment tools under `comments:read` and `comments:write`.

For agents with a shell, the [`argos-upload` skill](../../agents/agent-skills.md) is the better path: it teaches *when* to attach media to a pull request, how to embed the result so it renders, and how to read back the feedback a human left on it. Install it with:

```bash
npx skills add https://argos-ci.com
```
