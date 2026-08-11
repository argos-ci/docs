---
description: >-
  Upload screenshots and standalone media programmatically from Node.js
  scripts, or build your own Argos integration with @argos-ci/core.
---

# Node.js SDK

`@argos-ci/core` is the low-level SDK every Argos integration builds on. Use it to upload screenshots from your own Node.js scripts or to build a custom integration. It is available as an [npm package](https://www.npmjs.com/package/@argos-ci/core); the source code is on [GitHub](https://github.com/argos-ci/argos-javascript/tree/main/packages/core).

### Installation

```bash
npm install --save-dev @argos-ci/core
```

### Usage

To upload screenshots from a `./screenshots` directory, use the `upload` function:

```js
import { upload } from "@argos-ci/core";

await upload({ root: "./screenshots" });
```

`upload` accepts the same options as the [CLI `upload` command](argos-command-line-interface-cli.md#uploading-from-ci) — files globs, build name, mode, parallel settings, threshold, and more.

### Uploading standalone media

`uploadMedia` uploads images or videos on their own — no build, no comparison — and returns each one's share URL and a ready-to-paste Markdown embed:

```js
import { uploadMedia } from "@argos-ci/core";

const [media] = await uploadMedia({
  files: ["checkout-after.png"],
  // Stage the media on the branch: Argos publishes it — and posts the pull
  // request comment — by itself once a pull request opens for that branch.
  branch: "feat/checkout",
});

// The `-after` suffix is lifted off the name: this media is
// `checkout.png`, labelled `after`.
console.log(media.url); // https://app.argos-ci.com/m/…
console.log(media.markdown); // ![checkout.png](https://app.argos-ci.com/m/…)
```

Re-uploading the same name adds a **version** and keeps the URL, so Markdown already posted to a pull request shows the newest upload. Options mirror the [CLI `media upload` command](argos-command-line-interface-cli.md#sharing-images-and-videos): `token`, `project`, `branch`, `prNumber`, `state`, `description`, `visibility`, and `compress` (`true` by default — images are converted to WebP before upload). It returns one media per file, uploaded sequentially in input order. See [Media sharing](../learn/media/) for retention, visibility and billing.

### API reference

For a detailed breakdown of the available functions and options, see the [SDK reference documentation](https://js-sdk-reference.argos-ci.com/).
