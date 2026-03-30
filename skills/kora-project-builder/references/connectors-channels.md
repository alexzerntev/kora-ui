# Connectors and Channels — Configuration Reference

## Table of Contents

1. [HTTP Connector](#http-connector)
2. [SQL Connector](#sql-connector)
3. [CLI Connector](#cli-connector)
4. [Slack Channel](#slack-channel)
5. [Email Channel](#email-channel)
6. [Teams Channel](#teams-channel)
7. [WhatsApp Channel](#whatsapp-channel)
8. [Webhook Channel](#webhook-channel)

---

Authoritative stock-built-in contract note:
- The machine-readable source of truth for shipped connector/channel types is `builtInIntegrationCatalog` from `@kora/builtin-integration-catalog`.
- Use this reference for authoring guidance; use the catalog when tooling or sibling repos need to know exactly which built-ins, actions, and config schemas Core supports.

## HTTP Connector

**Type:** `http` | **Action:** `request`

Built-in connector actions and effective params are compile-time checked. Unsupported actions or invalid param shapes fail project validation.

### Connector Config

```yaml
apiVersion: kora/v1
kind: Connector
metadata: { name: main-api, scopeId: org_acme }
spec:
  type: http
  config:
    baseUrl:                           # REQUIRED — base URL literal or valueFrom
      valueFrom:
        secretRef: api-base-url
    defaultHeaders:                    # optional — headers on every request
      Authorization: "Bearer ${token}"
      Accept: application/json
```

`baseUrl` is required. It may be a literal string or a `valueFrom` object.

### Operation Config (action: `request`)

```yaml
spec:
  connector: main-api
  action: request
  config:
    method: GET                        # GET, POST, PUT, DELETE, PATCH
    path: /api/v1/leads
    headers: { X-Custom: value }       # optional — per-request headers
    query: { limit: 10 }              # optional — query parameters
    body: { data: value }             # optional — request body (auto JSON)
```

**Returns:** `{ status, headers, body }` — body auto-parsed as JSON if content-type is JSON.

---

## SQL Connector

**Type:** `sql` | **Actions:** `query` (read), `execute` (write)

### Connector Config

```yaml
spec:
  type: sql
  config:
    dialect: postgres                  # REQUIRED — currently only "postgres"
    connectionString:                  # REQUIRED — literal or valueFrom
      valueFrom:
        runtimeVariable: ERP_DB_URL
    max: 10                            # optional — connection pool max
    idleTimeoutMs: 30000               # optional — idle timeout
    ssl: true                          # optional
```

### Operation Config

```yaml
spec:
  connector: main-db
  action: query                        # or "execute"
  config:
    sql: "SELECT * FROM leads WHERE score >= $minScore"
    minScore: 80                       # named parameters use $paramName syntax
```

Named parameters: use `$paramName` in SQL, provide values as additional keys in config or via `paramBindings`.

**query returns:** `{ rows, rowCount }`
**execute returns:** `{ rowCount, returning? }`

---

## CLI Connector

**Type:** `cli` | **Action:** `run`

### Connector Config

```yaml
spec:
  type: cli
  config:
    allowedCommands:                   # REQUIRED — whitelist of executable commands
      - node
      - python3
    aliases:                           # optional — command aliases
      py: python3
    env:                               # optional — static environment variables
      NODE_ENV: production
    envFromSecrets:                    # optional — env vars from secrets
      API_KEY: api-key-secret
    maxStdoutBytes: 1000000            # optional (default 1MB)
    maxStderrBytes: 64000              # optional (default 64KB)
    cwd: .                             # optional — working directory
```

### Operation Config

```yaml
spec:
  connector: local-cli
  action: run
  config:
    command: node
    args:
      - scripts/my-script.mjs
  paramBindings:
    stdin:                             # pipe process data as JSON to stdin
      from: input
      path: $
  resultMapping:
    result:
      from: $.stdout.result            # stdout is auto-parsed as JSON
```

**Returns:** `{ exitCode, stdout (parsed as JSON by default), stderr }`

The `stdin` param is auto-serialized to JSON if not a string. Set `parseStdoutAsJson: false` in params to get raw stdout text.
Current implementation note: CLI operations run in the configured sandbox host, not on the worker host. The command must be allowlisted in the connector config and available in the sandbox image/environment.
Operational note:
- Any external host reached by the CLI command must be covered by the project sandbox network policy in `kora.yaml`.
- In local Docker dev, do not assume `localhost` from the sandbox can reach your host machine; use a sandbox-reachable hostname such as `host.docker.internal` when needed.

---

## Slack Channel

Two modes: `webhook` and `token`.

```yaml
# Webhook mode
channel:
  type: slack
  config:
    mode: webhook
    webhookUrl:
      valueFrom:
        secretRef: slack-webhook-secret
    # or a literal string webhookUrl: https://hooks.slack.com/...

# Token mode
channel:
  type: slack
  config:
    mode: token
    token:
      valueFrom:
        secretRef: slack-bot-token
    # or a literal string token: xoxb-...
    target: C0ABCDEF123             # Slack channel ID
```

**Rules:**
- `mode` is required.
- `mode: webhook` requires `webhookUrl` and may optionally set `target`.
- `mode: token` requires `token`; if `target` is omitted, Kora derives the Slack destination from the assignee on a human task, or from `send.owner` when available.
- Channel config here controls outbound Slack delivery only.
- Slack interactive callbacks are inbound/public-edge configuration, not `kora.yaml` sandbox configuration.
- In local dev, expose the public gateway and point Slack Interactivity Request URL to `/inbound/v1/callbacks/slack` on that public gateway. Do not point Slack directly at the inbound service port.

---

## Email Channel

```yaml
channel:
  type: email
  config:
    from: noreply@acme.com
    smtpUrl:
      valueFrom:
        secretRef: smtp-secret
    # if `to` is omitted, Kora falls back to assignee email / send.owner email when available
```

---

## Teams Channel

```yaml
channel:
  type: teams
  config:
    webhookUrl:
      valueFrom:
        secretRef: teams-webhook-secret
    # or a literal string webhookUrl: https://outlook.office.com/webhook/...
```

---

## WhatsApp Channel

```yaml
channel:
  type: whatsapp
  config:
    accessToken:
      valueFrom:
        secretRef: whatsapp-api-secret
    phoneNumberId: "1234567890"
    to: "+1234567890"
    # if `to` is omitted, Kora falls back to assignee/send.owner channels.whatsapp when available
```

---

## Webhook Channel (Generic)

```yaml
channel:
  type: webhook
  config:
    url:
      valueFrom:
        runtimeVariable: CALLBACK_URL
    # or a literal string url: https://my-service.com/callback
```

The same registered channel validators apply in both places Kora uses channel configs:
- `capability.spec.humanConfig.channel.config`
- process `send` nodes under `flow[*].channel.config`

So if a Slack/email/Teams/WhatsApp/webhook config is invalid for a human task channel, the same config is also invalid in a `send` node.
