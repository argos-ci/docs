---
description: >-
  Understand the Argos API rate limits, the headers returned on every
  response, and how to handle 429 responses.
icon: gauge-high
---

# Rate limits

To keep the API fast and reliable for everyone, Argos limits how many requests you can make in a given window.

## The limit

The default rate limit is **500 requests every 5 minutes**, applied per token.

If you exceed it, the API responds with a [`429 Too Many Requests`](errors.md) status code and rejects the request until the window resets.

## Rate limit headers

Every response includes [standard rate limit headers](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/) so you can track your usage without guessing:

| Header | Description |
| --- | --- |
| `RateLimit-Limit` | The maximum number of requests allowed in the current window. |
| `RateLimit-Remaining` | The number of requests remaining in the current window. |
| `RateLimit-Reset` | The number of seconds until the window resets. |

When you receive a `429` response, a `Retry-After` header tells you how many seconds to wait before retrying.

## Handling 429 responses

The recommended way to deal with rate limits is to **respect the `Retry-After` header** and back off before retrying. Here's a small helper that retries a request once it's allowed:

```javascript
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
