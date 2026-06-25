---
description: >-
  Page through large collections such as builds and diffs using Argos's
  page-based pagination.
icon: list-ol
---

# Pagination

List endpoints — such as listing a project's builds or a build's diffs — can return more results than fit in a single response. These endpoints use **page-based pagination** so you can fetch results one page at a time.

## Query parameters

Control pagination with two optional query parameters:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | integer | `1` | The page number to retrieve, starting at `1`. |
| `perPage` | integer | `30` | The number of items per page. Must be between `1` and `100`. |

## Response shape

Every paginated endpoint returns the same envelope: a `pageInfo` object describing the current page and a `results` array containing the items.

```json
{
  "pageInfo": {
    "total": 248,
    "page": 1,
    "perPage": 30
  },
  "results": [
    {
      "id": "123",
      "number": 248
      // ...
    }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `pageInfo.total` | integer | The total number of items across all pages. |
| `pageInfo.page` | integer | The current page number. |
| `pageInfo.perPage` | integer | The number of items per page. |
| `results` | array | The items for the current page. |

## Fetching a page

Request the second page of builds, 50 at a time:

{% tabs %}
{% tab title="cURL" %}
```bash
curl "https://api.argos-ci.com/v2/projects/my-team/my-project/builds?page=2&perPage=50" \
  -H "Authorization: Bearer $ARGOS_TOKEN"
```
{% endtab %}

{% tab title="JavaScript" %}
```js
const url = new URL(
  "https://api.argos-ci.com/v2/projects/my-team/my-project/builds",
);
url.searchParams.set("page", "2");
url.searchParams.set("perPage", "50");

const response = await fetch(url, {
  headers: { Authorization: `Bearer ${process.env.ARGOS_TOKEN}` },
});

const { pageInfo, results } = await response.json();
```
{% endtab %}
{% endtabs %}

## Iterating over all pages

Use `pageInfo.total` and `perPage` to compute how many pages exist, then loop until you've fetched them all.

```js
async function fetchAllBuilds(owner, project) {
  const perPage = 100;
  let page = 1;
  const builds = [];

  while (true) {
    const url = new URL(
      `https://api.argos-ci.com/v2/projects/${owner}/${project}/builds`,
    );
    url.searchParams.set("page", String(page));
    url.searchParams.set("perPage", String(perPage));

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.ARGOS_TOKEN}` },
    });
    const { pageInfo, results } = await response.json();

    builds.push(...results);

    if (page * pageInfo.perPage >= pageInfo.total) {
      break;
    }
    page += 1;
  }

  return builds;
}
```

{% hint style="info" %}
When iterating over many pages, keep the [rate limits](rate-limits.md) in mind and pick a larger `perPage` (up to `100`) to reduce the number of requests.
{% endhint %}
