---
description: Who can open an Argos media share link, how long an uploaded file is kept, the formats and sizes accepted, and how uploads are billed.
---

# Share links, retention and limits

### Who can open a share link

`visibility` controls the **share page** — the branded page with the project it came from, the expiry, and the copy-Markdown button:

| Visibility | Who can open the share page                              |
| ---------- | -------------------------------------------------------- |
| `team`     | Anyone signed in to Argos with access to the owning team. |
| `public`   | Anyone holding the URL. No sign-in.                       |

A share URL carries an unguessable token rather than the media's id, so a link cannot be found by guessing and does not reveal how much a team has uploaded. Share pages are `noindex`, so they don't turn up in search results.

On **Pro**, `team` is the default. On **Hobby**, every share page is public.

{% hint style="warning" %}
**The file itself is always reachable without signing in**, at an unguessable URL on the Argos CDN, whatever the visibility.

That is a consequence of what the feature is for. GitHub renders an embedded image by fetching it **server-side**, through a proxy that carries no Argos session — so a file that required authentication could not appear in a pull request at all. Argos protects the bytes with an unguessable content-addressed URL rather than with a session, exactly as it already serves build screenshots.

Treat a media file as "anyone with the link", and the share page as the part that respects your team. If a file must never be reachable by an outsider who obtains its URL, don't upload it.
{% endhint %}

### Retention

An uploaded file is kept for a fixed window, then deleted:

| Plan  | Retention                                 |
| ----- | ----------------------------------------- |
| Hobby | 30 days                                   |
| Pro   | 1 year, shorter with `--retention <days>` |

The countdown runs from the **upload**, not from the last view, so "this link works for 30 days" is something you can reason about when you paste it somewhere.

`--retention` only shortens. A request longer than the plan allows is clamped rather than rejected, so an upload never fails over a flag.

An expired link renders an "unavailable" page instead of a 404, so an embed in a pull request degrades visibly rather than into a broken image.

{% hint style="info" %}
Deleting a media takes effect immediately. Any share link or pull request embed pointing at it stops working, and the file is removed from storage.
{% endhint %}

### Accepted formats

| Type   | Formats                            |
| ------ | ---------------------------------- |
| Images | PNG, JPEG, WebP, AVIF, GIF         |
| Videos | MP4, WebM, MOV (QuickTime)         |

Anything else is refused before the upload starts. SVG is deliberately excluded: it can carry scripts, and a share page serves media inline.

Argos verifies the bytes, not the extension. A file whose contents don't match its declared type is rejected and its bytes are deleted, even if the name and the content type both said otherwise.

### File size

| Plan  | Largest single file |
| ----- | ------------------- |
| Hobby | 50 MB               |
| Pro   | 500 MB              |

The limit is enforced by storage itself before the bytes land, so an oversized upload fails fast instead of transferring and then being rejected. A long screen recording is the usual thing that trips it — trim it before uploading.

### What Argos does to your file

Nothing. Argos stores the bytes you uploaded and never rewrites them — there is no transcoding, no re-encoding, and no processing queue to wait on. A media is usable the moment the upload finishes.

Delivery is where the work happens, and the CDN does it on request:

* **Images** are converted to WebP or AVIF for browsers that prefer them, and resized on demand.
* **A video's poster frame** is derived from the video itself, so it is available immediately and can never drift from the file it represents.

Two consequences worth knowing:

* **Embedded metadata is preserved.** A photo's EXIF — including GPS coordinates, if the device recorded them — stays in the stored file and is readable by anyone with the file URL. The CDN drops it from the converted variants a browser fetches, but not from the original. Strip it yourself before uploading if it matters.
* **Video plays only if the browser can decode it.** Most MP4 and WebM is fine, and so is the H.264 that screen recorders normally produce. ProRes and some HEVC exports will not play inline — the viewer gets a download instead. Export to H.264 if you need inline playback.

### Billing

Uploads draw on the **screenshot allowance you already have** — there is no second quota to track and no new line on the invoice.

| Upload | Screenshot units |
| ------ | ---------------- |
| Image  | 1                |
| Video  | 25               |

A video costs more because it costs more to store and to serve. Uploading the same file twice is free: the storage key is derived from the file's contents, so Argos recognizes it, skips the transfer and bills it once.

Because uploads share the screenshot meter, they also share the existing [spend management](../billing-and-subscription/spend-management.md) thresholds and alerts — an upload is rejected when the account is over capacity or past its spend limit, exactly as a build would be.

Plans differ on retention, file size, and who can open a share page — not on volume. See [Pricing plans](../billing-and-subscription/pricing-plans.md).
