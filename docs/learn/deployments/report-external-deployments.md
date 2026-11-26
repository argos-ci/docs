---
description: >-
  Link a deployment hosted on Vercel, Netlify or Cloudflare to your builds:
  Argos detects the deployment your tests ran against, or you report it.
---

# Link a deployment hosted elsewhere

If Vercel, Netlify, Cloudflare or another host serves your previews, Argos links each deployment to the builds of the same commit, like the deployments it hosts. When your tests run against the deployment, Argos detects it. Otherwise, report it with its URL.

Argos then shows the deployment:

* **On the build page**, with its URL.
* **On each screenshot.** The screenshot's URL opens on the deployment: Argos keeps the path and query of the page your test captured and replaces the origin. A screenshot of `http://localhost:3000/settings?tab=billing` links to `https://my-app-git-feature-login.vercel.app/settings?tab=billing`.
* **In the pull request comment**, next to your builds.
* **On the project card** of the projects list, when it's the latest production deployment.
* **In the Deployments tab** of your project.

{% hint style="info" %}
Reporting a deployment replaces `ARGOS_PREVIEW_BASE_URL` and the SDK `previewUrl` option, which are deprecated. See [Replace the preview base URL](#replace-the-preview-base-url).
{% endhint %}

### Let Argos detect the deployment

When your tests run against the deployment, you don't need to report it. Once a build is complete, Argos reads the URL of the page each screenshot captured, and records the deployment at the origin most of them share, such as `https://my-app-git-feature-login.vercel.app/`.

Argos records the deployment when all of these hold:

* **One origin covers at least 80% of the screenshots that have a URL.** A test that leaves your app for a sign-in or payment page doesn't prevent it. A suite split between two sites does.
* **The origin is public:** `http` or `https` on a domain name. Argos skips `localhost`, IP addresses, private domains such as `.local`, `.test` or `.internal`, and the URLs of the deployments it hosts.
* **The build doesn't use [tokenless authentication](../integrations/github-actions-authentication.md#tokenless-authentication).** Authenticate with a project token or [GitHub Actions OIDC](../integrations/github-actions-authentication.md#oidc). This keeps the pull request of a fork from putting its URL in your pull request comment.
* **The commit has no deployment yet.** A deployment you report takes precedence, even one you report after the build.
* **On a branch other than the production branch, the origin isn't your production site:** the URL or a domain of your latest `production` deployment. Smoke tests of a pull request against production don't make production its preview.
* **The build runs in [CI mode](../platform-fundamentals/build-modes.md#ci-mode).** Argos skips [Monitoring mode](../platform-fundamentals/build-modes.md#monitoring-mode) builds, which capture a live site on a schedule.

Argos picks the [environment](#choose-the-environment) from the branch of the build.

To run your tests on a Vercel, Netlify or Cloudflare preview from GitHub Actions, see [Run on preview deployments](../how-to-guides/ci-pipelines/run-on-preview-deployments.md).

Report the deployment instead when your tests run on a local server, or when they span several sites.

### Report the deployment

You need a [project token](../account-and-access/project-tokens.md) with the **Upload deployments** permission, stored as the `ARGOS_TOKEN` secret of your CI.

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
| `branch`      | Yes      | The branch of that commit. Argos picks the [environment](#choose-the-environment) from it.                   |
| `url`         | Yes      | The deployment URL, `http` or `https` on a domain name. Argos answers `400 Bad Request` to `localhost` or an IP address, and normalizes the URL, for example by adding a trailing slash. |
| `prNumber`    | No       | The pull request number. With it, Argos updates the pull request comment as soon as you report the deployment. |
| `environment` | No       | `preview` or `production`. Overrides the [environment](#choose-the-environment) Argos picks from the branch. |

A deployment has either files that Argos hosts or a URL: don't send `files` and `url` in the same request. See the [API reference](https://argos-ci.com/docs/api-reference/reference/deployments#post-deployments) for every field.

### Choose the environment

A deployment is either `preview` or `production`. There are no other environments: Argos answers `400 Bad Request` to any other value, such as GitHub's `staging`.

When you leave out `environment`, Argos picks it from `branch`:

* A branch that matches the project's production branch is `production`. The production branch is a glob, set in **Settings → Deployments → Production deployment branch**. It follows your repository's default branch unless you change it.
* Any other branch is `preview`.

Send `environment` to override what the branch gives. See [Environments](environments.md) for the production branch setting.

The environment decides where Argos shows the deployment:

* **Pull request comment:** Argos lists the latest deployment of each environment, per project.
* **Projects list:** the project card shows the latest `production` deployment and links to its URL.
* **Build page:** Argos shows the latest deployment of the build's commit, whatever its environment.

{% hint style="warning" %}
[Tokenless authentication](../integrations/github-actions-authentication.md#tokenless-authentication) can't report a `production` deployment, nor a deployment of the production branch: Argos answers `403 Forbidden`. Use a project token or [GitHub Actions OIDC](../integrations/github-actions-authentication.md#oidc).
{% endhint %}

### How Argos links builds

Argos links a build to the latest deployment of its commit. For a build of a pull request merge commit, such as the one GitHub Actions checks out, Argos also looks at the head commit of the pull request. Report the commit your host deployed, before or after the build: Argos links them either way.

### Differences from deployments hosted by Argos

* Argos posts no `argos-deploy/<project>` commit status and no [GitHub deployment](../integrations/github-integration.md#github-deployments) for it. Your host reports its own.
* Argos doesn't serve the deployment, so it gets no [branch URL, production domain](urls-and-domains.md) or [access protection](access-protection.md). Argos links to the deployment URL, from the project card too.
* Turning off [hosting](README.md#turn-off-hosting) doesn't affect it. Argos takes only the deployments it hosts offline, and a deployment hosted elsewhere keeps showing on builds, project cards, pull request comments and the Deployments tab. The production branch still picks its environment.

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
