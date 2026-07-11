---
description: Include ARIA accessibility snapshots alongside screenshots when uploading files to Argos manually with the CLI.
---

# Adding ARIA snapshots manually

If you upload files to Argos manually, you can include ARIA snapshots alongside screenshots.

This setup is mainly useful if you are using Playwright for Python or another tool that can generate ARIA snapshots but does not have direct Argos support for them.

If you use Playwright with Node.js, use the official [Argos Playwright SDK](../../../sdks-reference/playwright.md), which supports ARIA snapshots directly.

{% hint style="info" %}
Each ARIA snapshot counts as an additional screenshot for billing.
{% endhint %}

### Configure uploaded files

When you upload a folder with the Argos CLI, pass the `--files` flag so Argos picks up both screenshot files and ARIA snapshot files:

```json
["**/*.png", "**/*.aria.yml"]
```

For example, if your screenshots are stored in `./screenshots`, upload that directory with:

{% tabs %}
{% tab title="npm" %}
```
npm exec -- argos upload --files "**/*.png" "**/*.aria.yml" ./screenshots
```
{% endtab %}

{% tab title="yarn" %}
```
yarn run argos upload --files "**/*.png" "**/*.aria.yml" ./screenshots
```
{% endtab %}

{% tab title="pnpm" %}
```
pnpm exec -- argos upload --files "**/*.png" "**/*.aria.yml" ./screenshots
```
{% endtab %}

{% tab title="bun" %}
```
bun x argos upload --files "**/*.png" "**/*.aria.yml" ./screenshots
```
{% endtab %}
{% endtabs %}

Argos will then detect every `.png` screenshot and every `.aria.yml` ARIA snapshot found in that folder tree.

### Add an ARIA snapshot

Create an ARIA snapshot file with the `.aria.yml` extension:

```
my-snapshot-name.aria.yml
```

You can also add metadata in a companion file using the `.argos.json` suffix:

```
my-snapshot-name.aria.yml.argos.json
```

For general metadata conventions, see [Screenshot metadata](../../../sdks-reference/screenshot-metadata.md). ARIA snapshot companion metadata follows the same conventions and can additionally define ARIA-specific transient fields, such as `transient.parentName`.

### Attach an ARIA snapshot to a screenshot

To associate an ARIA snapshot with a screenshot, set `transient.parentName` to the exact screenshot identifier used by Argos. This value must match the uploaded screenshot path and filename exactly, including subfolders and the file extension.

Example file structure:

```
folder/
  my-snapshot.png
  my-snapshot.png.argos.json
  my-aria-snapshot.aria.yml
  my-aria-snapshot.aria.yml.argos.json
```

{% code title="my-aria-snapshot.aria.yml.argos.json" %}
```json
{
  "transient": {
    "parentName": "folder/my-snapshot.png"
  }
}
```
{% endcode %}

When `parentName` exactly matches the screenshot identifier, Argos displays the ARIA snapshot as attached to that screenshot.
