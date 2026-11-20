---
description: "Receive a signed POST request when a build completes or gets reviewed, or when a deployment is created or ready. Read the same events from the REST API or an MCP client."
---

# Webhooks

A webhook sends a `POST` request to your endpoint each time something happens in your projects: a build completes or gets reviewed, a deployment is created or becomes ready. Use webhooks to connect Argos to your own systems, such as a release pipeline that waits for an approved build, a tool Argos doesn't integrate with, or an internal dashboard.

Argos signs each request with the webhook secret, following [Standard Webhooks](https://www.standardwebhooks.com), so your endpoint can check that it comes from Argos.

{% hint style="info" %}
Can't expose a public endpoint? Poll the [events feed](#read-events-from-the-api) instead. It returns the same events, in the same shape.
{% endhint %}

### Events

| Event                | Sent when                                                                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build.completed`    | A build finishes comparing its screenshots.                                                                                                                                                                          |
| `build.reviewed`     | A build receives a review: an approval, a rejection or a comment. This includes the [automatic approvals](../review-workflow/review-a-build.md#when-new-commits-are-pushed) Argos makes when new commits are pushed. |
| `deployment.created` | A [deployment](../deployments/README.md) starts uploading its files.                                                                                                                                                 |
| `deployment.ready`   | A deployment is ready to be served.                                                                                                                                                                                  |

### Add a webhook

Webhooks belong to an account, team or personal, and receive the events of its projects. On a team, only [owners](../account-and-access/team-members-and-roles.md#owner-role) see and manage webhooks.

{% stepper %}
{% step %}

#### Open the webhook settings

Open **Team Settings → Webhooks**, or your account's **Settings → Webhooks** for a personal account. Select **Add webhook**.
{% endstep %}

{% step %}

#### Enter the endpoint URL

The **Endpoint URL** must:

* start with `https://`;
* point to a public address: Argos refuses `localhost`, private networks, and any domain name that resolves to them;
* have no username or password. If your endpoint needs a credential, put it in the path or the query string.

Argos doesn't follow redirects, so enter the final URL.
{% endstep %}

{% step %}

#### Choose the events

Every event is selected by default. Untick the ones your endpoint doesn't need.
{% endstep %}

{% step %}

#### Choose the projects

Select **All projects** to receive the events of every project of the account, including the projects you create later, or **Specific projects** to pick them.
{% endstep %}

{% step %}

#### Copy the webhook secret

Select **Add webhook**. Argos shows the webhook secret, which starts with `whsec_`. Copy it and store it with your endpoint's other secrets: Argos shows it only once. If you lose it, add a new webhook and delete this one.
{% endstep %}
{% endstepper %}

An account can have up to 20 webhooks.

### Manage webhooks

The **Webhooks** list shows each webhook's endpoint, events and projects, and its last delivery:

* **Sending**: Argos is sending the event.
* **Retrying**: an attempt failed and Argos will try again.
* **Delivered**: your endpoint answered with a `2xx` status.
* **Failed**: every attempt failed, or the failure can't be fixed by retrying.

**Retrying** and **Failed** show the reason, such as "Your endpoint responded with HTTP 500." or "Your endpoint did not respond within 10 seconds."

You can't edit a webhook. To change its URL, events or projects, or to rotate its secret, add a new webhook, update your endpoint with the new secret, then delete the old one. Deleting a webhook also cancels its deliveries waiting for a retry.

To test your endpoint, run a build on a project the webhook covers, then [open the webhook's deliveries](#inspect-deliveries) to see the request Argos sent and your endpoint's response.

### Inspect deliveries

Select a webhook's endpoint URL in the **Webhooks** list to open its deliveries, most recent first. Each delivery shows your endpoint's response status code, the event, and when it was sent. Filter the deliveries by status (**Failed**, **Pending** or **Delivered**), or enter an event ID to find the deliveries of that event. Select **Refresh** to load the latest ones.

Select a delivery to see:

* its status, its number of attempts, and the date and duration of the last attempt;
* the event ID and when the event happened;
* the response: its HTTP status code, the failure reason if there is one, and the first 4 KB of its body;
* the request body Argos sent.

Argos keeps deliveries for 7 days, like events.

#### Resend a delivery

Select **Resend** on a delivery to send its event to the webhook again, as a new delivery. Use it for an event your endpoint failed to process, once you've fixed the endpoint.

A resent delivery keeps the same `webhook-id`, so an endpoint that [skips duplicates](#delivery-and-retries) skips an event it already processed. Record an event's `webhook-id` only after you've processed it: a resent event your endpoint failed on then goes through.

### Manage webhooks from the CLI

The [Argos CLI](../../sdks-reference/argos-command-line-interface-cli.md#managing-webhooks) creates, lists and deletes webhooks with `argos webhook`, and looks into their deliveries with `argos webhook delivery`. It needs a [personal access token](../../sdks-reference/argos-command-line-interface-cli.md#project-tokens-and-personal-access-tokens) or an `argos login` session with administrator access to the account, and takes the account from `--account <slug>` or `ARGOS_ACCOUNT`.

Create a webhook. `--events` and `--projects` take several values. Without `--projects`, the webhook covers every project of the account. The command prints the webhook secret once:

```bash
argos webhook create --account acme --url https://example.com/webhooks/argos --events build.completed build.reviewed --projects web
```

Find the deliveries that failed, check what your endpoint answered, then [resend](#resend-a-delivery) them once it's fixed:

```bash
argos webhook delivery list <webhookId> --status failed --account acme
argos webhook delivery get <webhookId> <deliveryId> --account acme
argos webhook delivery resend <webhookId> <deliveryId> --account acme
```

### Manage webhooks from the API

With the [Argos REST API](https://argos-ci.com/docs/api-reference/reference/webhooks), you can create, list and delete webhooks, and look into their deliveries. These endpoints authenticate with a [personal access token](../../sdks-reference/argos-command-line-interface-cli.md#project-tokens-and-personal-access-tokens), or OAuth with the `account:admin` scope, not with a project token. They require administrator access to the account.

| Endpoint                                                                           | Does                                                                       |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `GET /accounts/{accountSlug}/webhooks`                                             | Lists the account's webhooks, newest first.                                |
| `POST /accounts/{accountSlug}/webhooks`                                            | Creates a webhook and returns its secret.                                  |
| `GET /accounts/{accountSlug}/webhooks/{webhookId}`                                 | Gets a webhook.                                                            |
| `DELETE /accounts/{accountSlug}/webhooks/{webhookId}`                              | Deletes a webhook and cancels its pending retries.                        |
| `GET /accounts/{accountSlug}/webhooks/{webhookId}/deliveries`                      | Lists a webhook's deliveries, most recent first.                           |
| `GET /accounts/{accountSlug}/webhooks/{webhookId}/deliveries/{deliveryId}`         | Gets a delivery, with the request body and the start of the response body. |
| `POST /accounts/{accountSlug}/webhooks/{webhookId}/deliveries/{deliveryId}/resend` | [Resends](#resend-a-delivery) a delivery's event, as a new delivery.       |

To create a webhook, send its `url`, its `events`, and its `projects`: a list of project names, or `null` (the default) for every project of the account, including the ones created later.

```bash
curl https://api.argos-ci.com/v2/accounts/acme/webhooks \
  -H "Authorization: Bearer $ARGOS_PERSONAL_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/webhooks/argos",
    "events": ["build.completed", "build.reviewed"],
    "projects": ["web"]
  }'
```

The webhook secret is only in the response to the creation, in the `secret` field:

```json
{
  "id": "312",
  "url": "https://example.com/webhooks/argos",
  "events": ["build.completed", "build.reviewed"],
  "projects": ["web"],
  "createdAt": "2026-11-20T10:12:44.381Z",
  "secret": "whsec_…"
}
```

To find the deliveries that failed, filter the list with `status` (`pending`, `success` or `failed`), or with `eventId` for the deliveries of one event. The list is [paginated](https://argos-ci.com/docs/api-reference/pagination) with `page` and `perPage`.

The [Argos MCP server](../../agents/mcp-server.md) exposes the same operations as tools, so an AI agent can create a webhook or look into its failed deliveries with the permissions you grant it.

### Request format

Each request is a `POST` with these headers:

| Header              | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| `Content-Type`      | `application/json`                                       |
| `User-Agent`        | `Argos-Webhooks`                                         |
| `webhook-id`        | The event `id`. See [Verify requests](#verify-requests). |
| `webhook-timestamp` | When the request was sent, in Unix seconds.              |
| `webhook-signature` | The signature of the request.                            |

The body is a JSON object:

| Field       | Description                                                                             |
| ----------- | --------------------------------------------------------------------------------------- |
| `id`        | The event's unique identifier. It stays the same on every attempt to deliver the event. |
| `type`      | The event, such as `build.completed`.                                                   |
| `timestamp` | When the event happened, in ISO 8601 format.                                            |
| `data`      | The objects the event is about.                                                         |

`data` always contains the `project` the event happened in: its `id`, `name`, `url` in Argos, and the `account` that owns it (`id` and `slug`). It also contains:

* `build` for `build.completed` and `build.reviewed`: the build, in the same shape as a build returned by the [REST API](https://argos-ci.com/docs/api-reference), with its `status`, `conclusion`, screenshot `stats`, `head` and `base` commits, and `url`.
* `review` for `build.reviewed`: the review, with its `state` (`approved`, `rejected` or `commented`), the `user` who submitted it, and the coding `agent` that submitted it on their behalf, if any.
* `deployment` for `deployment.created` and `deployment.ready`: the deployment, with its `status`, `environment`, `branch`, `commitSha` and `url`.

`data` describes the objects as they were when the event happened: a `build.completed` event delivered after a retry still shows the build before anyone reviewed it.

{% tabs %}
{% tab title="Build event" %}
A `build.completed` event:

```json
{
  "id": "1084522",
  "type": "build.completed",
  "timestamp": "2026-11-16T14:32:08.512Z",
  "data": {
    "project": {
      "id": "4815",
      "name": "web",
      "account": { "id": "1623", "slug": "acme" },
      "url": "https://app.argos-ci.com/acme/web"
    },
    "build": {
      "id": "908172",
      "number": 1342,
      "head": {
        "sha": "9f2c1d7e4b8a6035c1e2f3a4b5c6d7e8f9a0b1c2",
        "branch": "feat/new-checkout"
      },
      "base": {
        "sha": "3b7e0a9c2d4f6e8a1b3c5d7e9f0a2b4c6d8e0f1a",
        "branch": "main"
      },
      "status": "changes-detected",
      "conclusion": "changes-detected",
      "stats": {
        "added": 2,
        "removed": 0,
        "unchanged": 214,
        "changed": 3,
        "ignored": 0,
        "failure": 0,
        "retryFailure": 0,
        "total": 219
      },
      "metadata": {
        "testReport": {
          "status": "passed",
          "stats": { "startTime": "2026-11-16T14:29:51.004Z", "duration": 94210 }
        }
      },
      "url": "https://app.argos-ci.com/acme/web/builds/1342",
      "notification": {
        "description": "3 changed, 2 added, waiting for your decision",
        "context": "argos",
        "github": { "state": "pending" },
        "gitlab": { "state": "running" },
        "origin": { "status": "in_progress", "conclusion": null },
        "url": "https://app.argos-ci.com/acme/web/builds/1342"
      }
    }
  }
}
```

A `build.reviewed` event has the same `build`, with its `status` after the review, such as `accepted`, and adds the `review`:

```json
"review": {
  "id": "77120",
  "buildId": "908172",
  "state": "approved",
  "user": { "id": "2051", "slug": "jane", "name": "Jane Cooper" },
  "dismissedAt": null,
  "dismissedBy": null,
  "agent": null,
  "date": "2026-11-16T14:40:12.208Z"
}
```
{% endtab %}

{% tab title="Deployment event" %}
A `deployment.ready` event. A `deployment.created` event has the same shape, with the `status` `pending`.

```json
{
  "id": "1084530",
  "type": "deployment.ready",
  "timestamp": "2026-11-16T14:35:41.092Z",
  "data": {
    "project": {
      "id": "4815",
      "name": "web",
      "account": { "id": "1623", "slug": "acme" },
      "url": "https://app.argos-ci.com/acme/web"
    },
    "deployment": {
      "id": "5521",
      "status": "ready",
      "environment": "preview",
      "branch": "feat/new-checkout",
      "commitSha": "9f2c1d7e4b8a6035c1e2f3a4b5c6d7e8f9a0b1c2",
      "url": "https://web-gdhgxamjo-acme.argos-ci.live/",
      "createdAt": "2026-11-16T14:34:58.731Z"
    }
  }
}
```
{% endtab %}
{% endtabs %}

The [OpenAPI specification](https://api.argos-ci.com/v2/openapi.yaml) describes every request in its `webhooks` section, so you can generate types for these bodies.

### Verify requests

Argos signs requests following [Standard Webhooks](https://www.standardwebhooks.com). Check the signature before you trust a request:

* `webhook-id` is the event `id`, the same on every attempt.
* `webhook-timestamp` is when Argos sent this attempt, in seconds since the Unix epoch.
* `webhook-signature` is `v1,` followed by the base64-encoded HMAC-SHA256 of `{webhook-id}.{webhook-timestamp}.{body}`. The key is the part of your webhook secret after `whsec_`, base64-decoded.

When you verify a request:

* Use the **raw body**, byte for byte as received. A body parsed and serialized again doesn't match the signature.
* Refuse a `webhook-timestamp` more than 5 minutes away from your clock, so a captured request can't be replayed later.
* Compare signatures in constant time.

An official [Standard Webhooks library](https://github.com/standard-webhooks/standard-webhooks/tree/main/libraries) does all three. Libraries exist for JavaScript, Python, Go, Ruby, PHP, Rust, Java, C# and Elixir.

{% tabs %}
{% tab title="standardwebhooks" %}
Install the library:

```bash
npm install standardwebhooks
```

With Express, read the body as raw bytes on the webhook route:

{% code title="server.js" %}
```js
import express from "express";
import { Webhook } from "standardwebhooks";

// The secret Argos showed when you added the webhook, "whsec_" included.
const webhook = new Webhook(process.env.ARGOS_WEBHOOK_SECRET);

const app = express();

app.post(
  "/webhooks/argos",
  express.raw({ type: "application/json" }),
  (req, res) => {
    let event;
    try {
      // Checks the signature and the timestamp, then parses the body.
      event = webhook.verify(req.body, req.headers);
    } catch {
      return res.status(400).send("Invalid signature");
    }

    // Answer within 10 seconds, then process the event.
    res.sendStatus(204);
    handleEvent(event);
  },
);
```
{% endcode %}
{% endtab %}

{% tab title="node:crypto" %}
Without a dependency, using Node.js's `crypto` module:

{% code title="verify.js" %}
```js
import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCE_SECONDS = 5 * 60;

/**
 * Verify an Argos webhook request and return its event.
 * `body` is the raw request body, as a Buffer.
 */
export function verifyArgosWebhook({ body, headers, secret }) {
  const id = headers["webhook-id"];
  const timestamp = headers["webhook-timestamp"];
  const signatures = headers["webhook-signature"];
  if (!id || !timestamp || !signatures) {
    throw new Error("Missing webhook headers");
  }

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) {
    throw new Error("Timestamp out of tolerance");
  }

  const key = Buffer.from(secret.slice("whsec_".length), "base64");
  const expected = Buffer.from(
    "v1," +
      createHmac("sha256", key)
        .update(`${id}.${timestamp}.`)
        .update(body)
        .digest("base64"),
  );

  // The header can hold several space-separated signatures.
  const isValid = signatures.split(" ").some((signature) => {
    const received = Buffer.from(signature);
    return (
      received.length === expected.length && timingSafeEqual(received, expected)
    );
  });
  if (!isValid) {
    throw new Error("Invalid signature");
  }

  return JSON.parse(body.toString("utf8"));
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

### Delivery and retries

Answer with any `2xx` status within 10 seconds. Argos ignores the response body. If your processing takes longer, answer first and process the event in the background.

An attempt fails when your endpoint answers with another status, doesn't answer within 10 seconds, or can't be reached. Argos retries it up to 3 more times, after 10 seconds, 1 minute and 5 minutes, then marks the delivery as **Failed**. Each attempt is signed again with a new `webhook-timestamp`, and keeps the same `webhook-id`.

Some failures stop the delivery at once, without retries:

* Your endpoint answers with a redirect (`3xx`). Argos doesn't follow redirects: add a webhook with the final URL.
* The domain name resolves to a private address. Argos checks the address on every attempt.

Delivery is at least once: your endpoint can receive the same event more than once, for example when it processed a request but its answer didn't reach Argos in time. Once you've processed an event, store its `webhook-id`, and skip the events whose `webhook-id` you already stored.

Events are delivered independently, so they can arrive out of order, especially after a retry. Use the `timestamp` of the body to order them.

### Read events from the API

The events feed serves the same events through the REST API. Poll it when you can't expose a public endpoint, or to catch up on events your endpoint missed:

```
GET https://api.argos-ci.com/v2/projects/{owner}/{project}/events
```

Authenticate with a [project token](../account-and-access/project-tokens.md) that has the **Read projects** permission (`projects:read`), or with a personal access token. Each item of `events` has the same shape as a webhook body.

```bash
curl "https://api.argos-ci.com/v2/projects/acme/web/events?cursor=1084522" \
  -H "Authorization: Bearer $ARGOS_TOKEN"
```

```json
{
  "events": [
    {
      "id": "1084530",
      "type": "deployment.ready",
      "timestamp": "2026-11-16T14:35:41.092Z",
      "data": { "project": { … }, "deployment": { … } }
    }
  ],
  "cursor": "1084530",
  "truncated": false,
  "hasMore": false
}
```

The query takes these parameters, all optional:

| Parameter  | Description                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `cursor`   | The `cursor` of the previous response. Without it, the feed starts now: the response has no events, only a `cursor`. |
| `maxAgeMs` | Skip the events older than this many milliseconds. Without a `cursor`, the feed starts that long ago instead of now. |
| `name`     | Only return the events of this type, such as `build.completed`.                                                      |
| `limit`    | The maximum number of events to return, up to 100. Defaults to 100.                                                  |

To follow the feed, store the `cursor` of each response and pass it to the next request. When `hasMore` is `true`, request again right away; otherwise, wait before the next poll.

* Events are returned oldest first, as soon as Argos records them.
* Argos keeps events for 7 days. `truncated` is `true` when some events after your `cursor` were deleted before you read them.

See the [API reference](https://argos-ci.com/docs/api-reference/reference/events) for the full schema.

### Receive events in an MCP client

The [Argos MCP server](../../agents/mcp-server.md) supports the draft [MCP Events extension](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3415) (`io.modelcontextprotocol/events`). An MCP client that supports it calls `events/list` to discover the four events, and `events/poll` to read them, with the arguments `{ "owner": "acme", "project": "web" }`. Only poll delivery is available: `events/poll` reads the events feed, with the same `projects:read` scope as the other read tools.

Any MCP client can also read the feed with the `listProjectEvents` tool.

### FAQ

<details>

<summary>Can I send webhooks to localhost?</summary>

No. Argos only sends requests to public HTTPS addresses. To receive events on your machine, expose your local server through a tunnel with a public HTTPS URL, or poll the [events feed](#read-events-from-the-api).

</details>

<details>

<summary>Why did my endpoint receive the same event twice?</summary>

Argos retries an attempt that failed or timed out, even when your endpoint processed the request, and a [resent delivery](#resend-a-delivery) sends the event again. Both keep the same `webhook-id`: skip the events whose `webhook-id` you already processed.

</details>

<details>

<summary>What's the difference between webhooks and automations?</summary>

[Automations](../review-workflow/automations.md) post build notifications to Slack, Microsoft Teams or Discord, with conditions set per project. Webhooks send every selected event of the account's projects to your own endpoint, as JSON, for your code to act on.

</details>
