---
description: >-
  Understand the Argos API rate limits, the headers returned on every
  response, and how to handle 429 responses.
icon: gauge-high
---

# Rate limits

To keep the API fast and reliable for everyone, Argos limits how many requests you can make in a given window.

## The limits

Argos counts requests per client IP address, against two budgets:

| Policy | Limit | Applies to |
| --- | --- | --- |
| `ci` | **10,000 requests every 5 minutes** | The endpoints the Argos SDKs and CLI call from CI to upload builds and deployments, listed below. |
| `api` | **500 requests every 5 minutes** | Every other endpoint. |

Each request counts against one budget only. All requests from the same address share these budgets, whichever token they use: CI runners behind a shared NAT gateway, for example, count as a single client.

The `ci` budget covers these endpoints:

- `POST /auth/github-actions/oidc/exchange` and `POST /auth/github-actions/tokenless/exchange`, used for [GitHub Actions authentication](https://argos-ci.com/docs/learn/integrations/github-actions-authentication)
- `GET /project`
- `POST /baseline`
- `POST /builds`, `PUT /builds/{buildId}` and `POST /builds/finalize`
- `POST /deployments` and `POST /deployments/{deploymentId}/finalize`

If you exceed a budget, the API responds with a [`429 Too Many Requests`](errors.md) status code and rejects the requests counted against that budget until its window resets.

{% hint style="info" %}
The [MCP server](https://argos-ci.com/docs/agents/mcp-server) has a separate budget of 500 requests every 5 minutes, counted per credential (each OAuth authorization or personal access token) instead of per IP address, because hosted AI assistants send all their users' requests from a few shared addresses. Requests that fail to authenticate are counted per IP address.
{% endhint %}

## Rate limit headers

Every response includes rate limit headers in the format of the [IETF RateLimit header fields draft](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers-08) (draft 8), so you can track your usage without guessing:

```
RateLimit: "api"; r=499; t=300
RateLimit-Policy: "api"; q=500; w=300; pk=:ZmVjNTI1NjVhYTBj:
```

Both headers start with the name of the policy the request was counted against (`"api"` or `"ci"`), followed by these parameters:

| Header | Parameter | Description |
| --- | --- | --- |
| `RateLimit` | `r` | The number of requests remaining in the current window. |
| `RateLimit` | `t` | The number of seconds until the window resets. |
| `RateLimit-Policy` | `q` | The maximum number of requests allowed in a window. |
| `RateLimit-Policy` | `w` | The length of a window, in seconds. |
| `RateLimit-Policy` | `pk` | An opaque key for the client the request was counted against, derived from its IP address. Requests with the same policy name and `pk` share a budget. |

When you receive a `429` response, a `Retry-After` header tells you how many seconds to wait before retrying.

## Handling 429 responses

The recommended way to deal with rate limits is to **respect the `Retry-After` header** and back off before retrying. Here's a small helper that retries a request once it's allowed:

```js
async function requestWithRetry(url, options) {
  while (true) {
    const response = await fetch(url, options);

    if (response.status !== 429) {
      return response;
    }

    const retryAfter = Number(response.headers.get("Retry-After")) || 1;
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
  }
}
```

{% hint style="info" %}
To stay well under the limit when processing large amounts of data, increase your [page size](pagination.md) and avoid firing requests concurrently. Spacing requests out is almost always more reliable than retrying after a `429`.
{% endhint %}

## Need a higher limit?

If your integration consistently bumps into the rate limit, [contact support](https://argos-ci.com/contact) to discuss your use case.
