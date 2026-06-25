---
description: >-
  Learn how the Argos API reports errors, the shape of an error response,
  and what each HTTP status code means.
icon: triangle-exclamation
---

# Errors

Argos uses conventional HTTP status codes to indicate whether a request succeeded or failed, and returns a consistent JSON body describing what went wrong.

## Error response shape

When a request fails, the response body contains an `error` message. For validation failures, an optional `details` array breaks down each problem.

```json
{
  "error": "Invalid request",
  "details": [
    {
      "message": "perPage must be less than or equal to 100"
    }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `error` | string | A human-readable description of the error. |
| `details` | array | Optional. A list of `{ "message": string }` objects with field-level details, typically present on validation errors. |

## Status codes

| Status | Meaning | What to do |
| --- | --- | --- |
| `400 Bad Request` | The request body or a query parameter was invalid. | Check the `details` array and fix the offending fields. |
| `401 Unauthorized` | The token is missing or invalid. | Verify the `Authorization` header and that your token is correct. |
| `403 Forbidden` | The token is valid but lacks access to this resource. | Make sure the token belongs to the project you're targeting. |
| `404 Not Found` | The requested resource doesn't exist. | Check the URL, including the owner and project slugs. |
| `409 Conflict` | The request conflicts with the resource's current state. | For example, finalizing a build that's already finalized — fetch the latest state and retry if needed. |
| `429 Too Many Requests` | You've exceeded the [rate limit](rate-limits.md). | Wait for the `Retry-After` window, then retry. |
| `500 Internal Server Error` | Something went wrong on Argos's side. | Retry after a short delay. If it persists, [contact support](https://argos-ci.com/contact). |
| `503 Service Unavailable` | Argos is temporarily unavailable. | Retry after a short delay. |

## Handling errors

Always check the response status before parsing the result. Status codes in the `2xx` range indicate success; anything else carries an error body you can inspect.

```javascript
const response = await fetch("https://api.argos-ci.com/v2/project", {
  headers: { Authorization: `Bearer ${process.env.ARGOS_TOKEN}` },
});

if (!response.ok) {
  const { error, details } = await response.json();
  throw new Error(
    details?.length
      ? `${error}: ${details.map((d) => d.message).join(", ")}`
      : error,
  );
}

const project = await response.json();
```

{% hint style="info" %}
For `429` and `5xx` responses, retrying with a short delay is usually the right move. For `4xx` responses other than `429`, the request won't succeed until you change something, so inspect the `error` message instead of retrying.
{% endhint %}
