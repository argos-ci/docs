---
description: >-
  Learn how to authenticate and make requests to the Argos REST API to
  create builds, fetch results, and automate your visual testing workflow.
icon: book-open
---

# Introduction

The Argos API is organized around [REST](https://en.wikipedia.org/wiki/REST). It has predictable, resource-oriented URLs, accepts and returns [JSON](https://www.json.org)-encoded payloads, and uses standard HTTP response codes, authentication, and verbs.

Most of the time you'll interact with Argos through one of the [SDKs](https://argos-ci.com/docs/sdks-reference/playwright) or the [CLI](https://argos-ci.com/docs/sdks-reference/argos-command-line-interface-cli), which call this API for you. You can also call it directly to build your own integrations.

## Base URL

All requests are made to the following base URL:

```
https://api.argos-ci.com/v2
```

{% hint style="info" %}
The API is served over HTTPS only. Requests made over plain HTTP will fail.
{% endhint %}

## Authentication

The Argos API authenticates requests with a **bearer token**. Add an `Authorization` header to every request, using your token as the credential:

```
Authorization: Bearer <your-token>
```

In most cases this is a **project token**, which you can find in your project settings on [argos-ci.com](https://argos-ci.com). A project token grants access to a single project, so it's safe to use in your CI environment.

{% hint style="warning" %}
Your token carries the ability to create and update builds in your project. Keep it secret: store it as a CI secret or environment variable, and never commit it to version control or expose it in client-side code.
{% endhint %}

Requests without a valid token return a [`401 Unauthorized`](errors.md) response.

## Making a request

Here's a complete example that fetches the project associated with your token:

{% tabs %}
{% tab title="cURL" %}
```bash
curl https://api.argos-ci.com/v2/project \
  -H "Authorization: Bearer $ARGOS_TOKEN"
```
{% endtab %}

{% tab title="JavaScript" %}
```javascript
const response = await fetch("https://api.argos-ci.com/v2/project", {
  headers: {
    Authorization: `Bearer ${process.env.ARGOS_TOKEN}`,
  },
});

const project = await response.json();
```
{% endtab %}
{% endtabs %}

## Response codes

Argos uses conventional HTTP response codes to indicate the success or failure of a request. In general:

- Codes in the `2xx` range indicate success.
- Codes in the `4xx` range indicate an error that resulted from the information provided (for example, a missing token, an invalid parameter, or a resource that doesn't exist).
- Codes in the `5xx` range indicate an error on Argos's side.

| Status | Meaning |
| --- | --- |
| `200 OK` | The request succeeded. |
| `201 Created` | The resource was created (for example, a new build). |
| `400 Bad Request` | The request was malformed or a parameter was invalid. |
| `401 Unauthorized` | The token is missing or invalid. |
| `403 Forbidden` | The token is valid but doesn't have access to this resource. |
| `404 Not Found` | The requested resource doesn't exist. |
| `409 Conflict` | The request conflicts with the current state of the resource. |
| `429 Too Many Requests` | You've hit the [rate limit](rate-limits.md). |
| `500 Internal Server Error` | Something went wrong on Argos's side. |
| `503 Service Unavailable` | Argos is temporarily unavailable. |

See [Errors](errors.md) for the shape of error responses and how to handle them.

## OpenAPI specification

The full API is described by an [OpenAPI 3.1](https://www.openapis.org) specification. You can download it to generate clients or explore the API in your favorite tooling:

```
https://api.argos-ci.com/v2/openapi.yaml
```

## Next steps

<table data-view="cards">
  <thead>
    <tr>
      <th>Topic</th>
      <th data-card-target data-type="content-ref">Link</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Pagination</strong> — page through large lists of results.</td>
      <td><a href="pagination.md">Pagination</a></td>
    </tr>
    <tr>
      <td><strong>Rate limits</strong> — understand request limits and headers.</td>
      <td><a href="rate-limits.md">Rate limits</a></td>
    </tr>
    <tr>
      <td><strong>Errors</strong> — handle error responses gracefully.</td>
      <td><a href="errors.md">Errors</a></td>
    </tr>
  </tbody>
</table>
