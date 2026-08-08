---
description: Upload a standalone image or video to Argos and get a shareable link with ready-to-paste Markdown, so a screenshot or a screen recording can go straight into a pull request.
---

# Media sharing

**Media** on Argos is a standalone image or video: uploaded on its own, with no build and no test run behind it. Argos stores it, serves it at a share URL, and hands you the Markdown to embed it.

It exists because GitHub has no public API for comment attachments. Dragging an image into a pull request needs a signed-in browser session, which an agent — or a CI job — does not have. Committing the image bloats the repository, and release assets are a workaround nobody wants to maintain.

Use media sharing to:

* Put a before/after of a UI change in the pull request that made it, so the reviewer doesn't check out the branch.
* Attach a screen recording of a bug reproduction to an issue.
* Share a screenshot with your team by link, from the terminal or by dropping a file into Argos.

{% hint style="info" %}
Media is **not** visual testing. Nothing is compared to a baseline and nothing gates a build — it is a file with a link. To detect visual changes, see [Core concepts](../platform-fundamentals/).
{% endhint %}

### How it works

An upload takes two steps, which the CLI does in one command:

1. **Register** — Argos records the file's name, type, size and content hash, and returns a signed upload target. The share URL exists from this point, before the bytes do.
2. **Upload** — the file goes straight to Argos storage, never through the API. A file Argos already holds — same contents, uploaded before — skips this step entirely.

There is no third step. Argos does not transcode, re-encode or rewrite your file: it stores the bytes you sent and serves them from its image CDN, which derives WebP and AVIF variants — and a video's poster frame — on request. **A media is fully usable the moment the upload finishes.**

The one thing Argos checks server-side is that the file really is the type it was declared as, by reading its first few bytes. A file that isn't is rejected before it becomes reachable.

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
after.png
  ID: 4821
  image/webp · 184 KB · 1440x900 · public · ready
  URL: https://app.argos-ci.com/m/kQ8vN2pXr4tYw7...
  Markdown: ![after.png](https://app.argos-ci.com/m/kQ8vN2pXr4tYw7...)
```
{% endstep %}

{% step %}
#### Paste the Markdown

Put the `Markdown` line in a pull request, an issue, or a chat message. Copy it verbatim rather than writing your own — for a video, the embed is a poster frame wrapped in a link, which is the only form GitHub renders.
{% endstep %}
{% endstepper %}

### Where to find your uploads

Team administrators get a **Media** tab on the team, listing everything uploaded across projects, with drag-and-drop upload and a copy-Markdown button on every row. It is administrator-only: the library spans projects a given member may have no access to.

### What's next

* [**Upload media**](standalone-media-upload.md) — the CLI, the API and the MCP server, plus attaching media to a pull request.
* [**Share links, retention and limits**](share-links-retention-and-limits.md) — who can open a link, how long a file lasts, accepted formats and sizes, and what an upload costs.
