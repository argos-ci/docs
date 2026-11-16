---
description: >-
  Report a deployment hosted on Vercel, Netlify or Cloudflare, so Argos links
  your builds and screenshots to it.
---

# Report a deployment hosted elsewhere

If Vercel, Netlify, Cloudflare or another host serves your previews, report each deployment to Argos with its URL. Argos links it to the builds of the same commit, like the deployments it hosts.

Once you report a deployment, Argos shows it:

* **On the build page**, with its URL.
* **On each screenshot.** The screenshot's URL opens on the deployment: Argos keeps the path and query of the page your test captured and replaces the origin. A screenshot of `http://localhost:3000/settings?tab=billing` links to `https://my-app-git-feature-login.vercel.app/settings?tab=billing`.
* **In the pull request comment**, next to your builds.
* **On the Deployments page** of your project.

{% hint style="info" %}
Reporting a deployment replaces `ARGOS_PREVIEW_BASE_URL` and the SDK `previewUrl` option, which are deprecated. See [Replace the preview base URL](#replace-the-preview-base-url).
{% endhint %}

### Before you start

* Turn on **Enable deployments for this project** in your project's **Settings → Deployments**. Argos shows deployments on builds only when this setting is on.
* Store a [project token](../account-and-access/project-tokens.md) with the **Upload deployments** permission as the `ARGOS_TOKEN` secret of your CI.

### Report the deployment

Once your host has deployed a commit, send the deployment URL to the [create a deployment](https://argos-ci.com/docs/api-reference/reference/deployments#post-deployments) endpoint:

```bash
curl https://api.argos-ci.com/v2/deployments \
  -H "Authorization: Bearer $ARGOS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "commit": "a3f8c2e1b4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    "branch": "feature-login",
    "url": "https://my-app-git-feature-login.vercel.app"
  }'
```

Argos answers `201 Created` with the ID of the deployment:

```json
{ "deploymentId": "1234", "uploadFiles": [] }
```

The deployment is ready at once: there are no files to upload and nothing to finalize.

| Field         | Required | Description                                                                                                  |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `commit`      | Yes      | The SHA of the commit your host deployed.                                                                    |
| `branch`      | Yes      | The branch of that commit. Argos picks the [environment](environments.md) from it.                           |
| `url`         | Yes      | The deployment URL, over `http` or `https`.                                                                  |
| `prNumber`    | No       | The pull request number. With it, Argos updates the pull request comment as soon as you report the deployment. |
| `environment` | No       | `preview` or `production`. Overrides the environment Argos picks from the branch.                            |

A deployment has either files that Argos hosts or a URL: don't send `files` and `url` in the same request. See the [API reference](https://argos-ci.com/docs/api-reference/reference/deployments#post-deployments) for every field.

For a GitHub Actions workflow that reports a Vercel, Netlify or Cloudflare preview, see [Run on preview deployments](../how-to-guides/ci-pipelines/run-on-preview-deployments.md#report-the-deployment-to-argos).

### How Argos links builds

Argos links a build to the latest deployment of its commit. For a build of a pull request merge commit, such as the one GitHub Actions checks out, Argos also looks at the head commit of the pull request. Report the commit your host deployed, before or after the build: Argos links them either way.

### Differences from deployments hosted by Argos

* Argos doesn't post an `argos-deploy/<project>` commit status. Your host reports its own.
* Argos doesn't serve the deployment, so it gets no [branch URL, production domain](urls-and-domains.md) or [access protection](access-protection.md). Argos links to the URL you report.

### Replace the preview base URL

`ARGOS_PREVIEW_BASE_URL` and the `previewUrl` option of the Argos SDKs set a preview URL on each screenshot when you upload it. A reported deployment does the same for every screenshot of the build, with no SDK setting.

To switch:

1. Report your deployments as shown above.
2. Remove `ARGOS_PREVIEW_BASE_URL` and the `previewUrl` option. A preview URL set on a screenshot takes precedence over the deployment.

### Related

* [Run on preview deployments](../how-to-guides/ci-pipelines/run-on-preview-deployments.md)
* [Deployments overview](./)
* [Environments](environments.md)
* [Project tokens](../account-and-access/project-tokens.md)
