---
description: >-
  Upload screenshots programmatically from Node.js scripts, or build your own
  Argos integration with @argos-ci/core.
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

`upload` accepts the same options as the [CLI `upload` command](argos-command-line-interface-cli.md#upload) — files globs, build name, mode, parallel settings, threshold, and more.

### API reference

For a detailed breakdown of the available functions and options, see the [SDK reference documentation](https://js-sdk-reference.argos-ci.com/).
