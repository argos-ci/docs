---
description: Who can open an Argos media share link, how long an uploaded file is kept, the formats and sizes accepted, and how uploads are billed.
---

# Share links, retention and limits

### Who can open a share link

`visibility` controls the **share page** — the page with the file, its version history, its comment threads, and the copy-Markdown button:

| Visibility | Who can open the share page                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| `team`     | Anyone signed in to Argos with access to the owning project. **Pro plans only.** |
| `public`   | Anyone holding the URL. No sign-in.                                             |

A share URL carries an unguessable token rather than the media's id, so a link cannot be found by guessing and does not reveal how much a project has uploaded. The token survives re-uploads: new versions never change the URL. Share pages are `noindex`, so they don't turn up in search results.

#### The default follows your project

An upload that doesn't choose gets **its project's** visibility: `public` for a public project, `team` for a private one. So the everyday upload needs no flag — a public project's screenshots produce links a reviewer can open, and a private project's don't become world-readable by being uploaded.

Requesting `team` on Hobby is rejected — a team-scoped link is what the paid tier sells — so on Hobby every share page is public, including a private project's.

Two things this default does **not** do:

* **It doesn't follow the project afterwards.** The visibility is fixed when the media is created, not looked up each time somebody opens the link. Making a project private closes the share pages of media uploaded from then on; the ones already pasted into pull requests keep working. To close one of those, upload it again with `--visibility team`, or delete it.
* **It doesn't override a choice you made.** Re-uploading the same name keeps the visibility the media already has unless that upload passes `--visibility` itself, so a screenshot deliberately kept team-only on a public project stays team-only.

#### Unfurling

A `public` link unfurls wherever it is pasted. Argos serves OpenGraph and Twitter card tags with the page itself, and answers [oEmbed](https://oembed.com) at `/oembed`, so Slack, Discord, Notion, Linear and the rest show the screenshot rather than a bare URL. Images answer as an oEmbed `photo`; videos answer as a `link` with a thumbnail, because a `video` response means an embedded player and Argos pages refuse to be framed.

A `team` link does not unfurl, on purpose. That metadata is read by a crawler carrying no session, so everything in it is public to whoever holds the link — the file name included, which is often the whole of what a private link was protecting.

{% hint style="warning" %}
**The file itself is always reachable without signing in**, at an unguessable URL on the Argos CDN, whatever the visibility.

That is a consequence of what the feature is for. GitHub renders an embedded image by fetching it **server-side**, through a proxy that carries no Argos session — so a file that required authentication could not appear in a pull request at all. Argos protects the bytes with an unguessable content-addressed URL rather than with a session, exactly as it already serves build screenshots.

Treat a media file as "anyone with the link", and the share page as the part that respects your project's access. If a file must never be reachable by an outsider who obtains its URL, don't upload it.
{% endhint %}

### Retention

An uploaded file is kept for a fixed window, then deleted:

| Plan  | Retention |
| ----- | --------- |
| Hobby | 30 days   |
| Pro   | 1 year    |

Retention is the plan's, not the upload's — there is no per-request setting, so "this link works for 30 days" is something you can reason about when you paste it somewhere. The countdown runs from the **upload**, not from the last view.

It applies **per version**: each upload of a media gets its own expiry, so an old version ages out of the share page's history while the media — and its share URL — live on with the newer ones. When the last version expires, the media disappears with its comment threads. Expired files are purged hourly, bytes included.

An expired link renders an "unavailable" page instead of a 404 — the same page a deleted media or a `team` page opened without access shows — so an embed in a pull request degrades visibly rather than into a broken image.

{% hint style="info" %}
Deleting a media takes effect immediately. Any share link or pull request embed pointing at it stops working, its row drops out of the managed pull request comment, and the file is removed from storage.
{% endhint %}

### Accepted formats

| Type   | Formats                    |
| ------ | -------------------------- |
| Images | PNG, JPEG, WebP, AVIF, GIF |
| Videos | MP4, WebM, MOV (QuickTime) |

Anything else is refused before the upload starts. SVG is deliberately excluded: it can carry scripts, and a share page serves media inline.

Argos verifies the bytes, not the extension: finalizing reads the file's first 64 KB and identifies the actual container. A file declared as an image that turns out not to be one — or the reverse — is rejected and its bytes are deleted, even if the name and the content type both said otherwise. Since the file URL is reachable without a session, this check is what keeps active content off an Argos domain.

### File size

| Plan  | Largest single file |
| ----- | ------------------- |
| Hobby | 50 MB               |
| Pro   | 500 MB              |

The limit is checked when the upload is registered, and enforced again by storage itself before the bytes land — so an oversized upload fails fast instead of transferring and then being rejected. A long screen recording is the usual thing that trips it; trim it before uploading.

### What Argos does to your file

Nothing, server-side. Argos stores the bytes it received and never rewrites them — there is no transcoding, no re-encoding, and no processing queue to wait on. A media is usable the moment the upload finishes.

Two things do transform your file, both outside the stored original:

* **The CLI compresses images before upload.** PNG and JPEG are converted to WebP client-side unless you pass `--no-compress` — see [Image compression](standalone-media-upload.md#image-compression). What Argos stores in that case is the WebP the CLI produced.
* **The CDN works at delivery time.** Images are converted to WebP or AVIF for browsers that prefer them and resized on demand; a **video's poster frame** is derived from the video itself (a second in, where there is something to see), so it is available immediately and can never drift from the file it represents.

Two consequences worth knowing:

* **Embedded metadata survives in the stored file.** A photo's EXIF — including GPS coordinates, if the device recorded them — stays in the original and is readable by anyone with the file URL. The CDN drops it from the converted variants a browser fetches, but not from the original. The CLI's WebP conversion strips it (after applying the orientation), but a file uploaded untouched — a video, a GIF, or anything under `--no-compress` — keeps it. Strip it yourself before uploading if it matters.
* **Video plays only if the browser can decode it.** Most MP4 and WebM is fine, and so is the H.264 that screen recorders normally produce. ProRes and some HEVC exports will not play inline — the viewer gets a download instead. Export to H.264 if you need inline playback.

### Billing

Uploads draw on the **screenshot allowance you already have** — there is no second quota to track and no new line on the invoice, and the usage detail breaks media out so four screen recordings never read as a hundred unexplained screenshots.

| Upload | Screenshot units |
| ------ | ---------------- |
| Image  | 1                |
| Video  | 25               |

A video costs more because it costs more to store and to serve. An upload is billed when it finalizes; re-uploading a file whose bytes haven't changed adds no version and costs nothing.

Because uploads share the screenshot meter, they also share the existing [spend management](../billing-and-subscription/spend-management.md) thresholds and alerts — an upload is rejected when the account is over capacity or past its spend limit, exactly as a build would be.

Plans differ on retention, file size, and who can open a share page — not on volume. See [Pricing plans](../billing-and-subscription/pricing-plans.md).
