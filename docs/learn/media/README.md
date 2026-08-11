---
description: Upload a standalone image or video to Argos and get a shareable link with ready-to-paste Markdown, so a screenshot or a screen recording can go straight into a pull request.
---

# Media sharing

**Media** on Argos is a standalone image or video: uploaded on its own, with no build and no test run behind it. Argos stores it, serves it at a share URL, and hands you the Markdown to embed it. It belongs to a project, so it inherits that project's access and moves with it when the project is transferred.

It exists because GitHub has no public API for comment attachments. Dragging an image into a pull request needs a signed-in browser session, which an agent — or a CI job — does not have. Committing the image bloats the repository, and release assets are a workaround nobody wants to maintain.

Use media sharing to:

* Put a before/after of a UI change in the pull request that made it, so the reviewer doesn't check out the branch.
* Attach a screen recording of a bug reproduction to an issue.
* Share a screenshot with your team by link, straight from the terminal.
* Point at a spot on a screenshot an agent produced and have it read your comment back — see [Reading the feedback](standalone-media-upload.md#reading-the-feedback-left-on-a-media).

{% hint style="info" %}
Media is **not** visual testing. Nothing is compared to a baseline and nothing gates a build — it is a file with a link. To detect visual changes, see [Core concepts](../platform-fundamentals/).
{% endhint %}

### How it works

A media is an **identity** — what the picture is *of* — and every upload is a **version** of it. Uploading `checkout.png` again doesn't create a second link: it adds a version under the same media, and the share URL always shows the newest one. That is what makes re-uploading after review work — the Markdown already pasted in a pull request updates itself, and the version a reviewer commented on survives underneath.

An upload takes three calls, which the CLI does in one command:

1. **Register** — Argos records the file's name, type, size and content hash, and returns a signed upload target. The share URL is allocated from this point.
2. **Upload** — the file goes straight to Argos storage, never through the API.
3. **Finalize** — Argos reads the file's first bytes back to check it really is the type it was declared as, records an image's dimensions, and makes it reachable. A file that isn't what it claims to be is rejected and its bytes are deleted.

A file Argos already holds — same contents, uploaded before — skips the last two steps entirely.

There is no processing step. Argos does not transcode, re-encode or rewrite your file: it stores the bytes you sent and serves them from its image CDN, which derives WebP and AVIF variants — and a video's poster frame — on request. **A media is fully usable the moment the upload finishes.**

### Quickstart

{% stepper %}
{% step %}
#### Install the Argos CLI

{% tabs %}
{% tab title="npm" %}
```
npm i --save-dev @argos-ci/cli
```
{% endtab %}

{% tab title="yarn" %}
```
yarn add --dev @argos-ci/cli
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm add --save-dev @argos-ci/cli
```
{% endtab %}

{% tab title="bun" %}
```
bun add --dev @argos-ci/cli
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
#### Upload a file

```bash
ARGOS_TOKEN=<your-project-token> npx argos media upload after.png
```

The CLI prints the share URL and a Markdown embed:

```
Media (1)

after.png
  ID: 4821
  staged
  image/webp · 25 KB · 1440x900 · team · ready
  Expires: 2027-08-10T09:12:00.000Z
  URL: https://app.argos-ci.com/m/kQ8vN2pXr4tYw7cD1sZ0
  File: https://files.argos-ci.com/media/42/9f86d081884c7d65…webp
  Markdown: ![after.png](https://app.argos-ci.com/m/kQ8vN2pXr4tYw7cD1sZ0)
```

The PNG went out as WebP: the CLI [compresses images before upload](standalone-media-upload.md#image-compression), and the media keeps your file's name and extension regardless.
{% endstep %}

{% step %}
#### Paste the Markdown

Put the `Markdown` line in a pull request, an issue, or a chat message. Copy it verbatim rather than writing your own — for a video, the embed is a poster frame wrapped in a link, which is the only form GitHub renders.
{% endstep %}
{% endstepper %}

### Attach it to a pull request — even one that doesn't exist yet

A media can attach to a **pull request** or to a **branch**. Pass `--pr <number>` when the pull request already exists. Pass `--branch <branch>` while you are still working: the media is **staged**, and when a pull request opens for that branch, Argos publishes everything staged there and posts a single managed comment listing it — unasked, with nothing to come back and connect. See [Getting media into a pull request](standalone-media-upload.md#getting-media-into-a-pull-request).

### Where to find your uploads

A media is reached by its link — there is no browsing UI. From the terminal, `argos media list` lists a project's uploads, and `--branch` narrows it to everything uploaded for the work in hand. Each media's share page shows the file with pan and zoom, its version history, its comment threads, and a copy-Markdown button.

### What's next

* [**Upload media**](standalone-media-upload.md) — the CLI, the SDK, the API and the MCP server, plus getting media into a pull request and reading the feedback pinned on it.
* [**Share links, retention and limits**](share-links-retention-and-limits.md) — who can open a link, how long a file lasts, accepted formats and sizes, and what an upload costs.
