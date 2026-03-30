# Process Flow Nodes — Complete Reference

Processes define their flow as an array of nodes. Each node has a unique `id` and a `type`. Nodes connect via `next` (sequential) or `goto` (from gateways/boundaries).

## Table of Contents

1. [Task Node](#task-node)
2. [Service Node](#service-node)
3. [Script Node](#script-node)
4. [Decision Node](#decision-node)
5. [Send Node](#send-node)
6. [Receive Node](#receive-node)
7. [Timer Node](#timer-node)
8. [Exclusive Gateway](#exclusive-gateway)
9. [Parallel Gateway](#parallel-gateway)
10. [Subprocess](#subprocess)
11. [Call Activity](#call-activity)
12. [Transaction](#transaction)
13. [End Events](#end-events)
14. [Boundary Events](#boundary-events)
15. [Start Events](#start-events)

---

## Task Node

**`type: task`** — Dispatches work to a capability owner (human or agent).

```yaml
- id: research-lead                    # REQUIRED — unique node ID
  type: task
  role: sdr                            # REQUIRED — role name (must be defined + assigned)
  capability: web-research             # REQUIRED — must be in the role's capability catalog
  input: LeadInput                     # optional — type reference
  output: ResearchResult               # optional — type reference
  constraints:                         # optional
    maxDurationMs: 300000              # execution timeout
    maxCostUsd: 2.0                    # cost limit
    requiresApproval: true             # requires human sign-off before proceeding
  next: next-step                      # optional — next node ID
  escalation:                          # optional — time-based escalation
    after: PT4H                        # ISO 8601 duration
    to: manager-review                 # node ID to escalate to
  boundary: []                         # optional — see Boundary Events
```

**Validation:** `role` must match a defined Role with an assignment entry. `capability` must exist AND be in the role's required or optional capabilities.

---

## Service Node

**`type: service`** — Invokes an operation (external system call via connector).

```yaml
- id: fetch-data
  type: service
  operation: fetch-lead-data           # REQUIRED — operation name (must exist)
  owner: sdr                           # optional — role that owns this step
  input: LeadInput                     # optional
  output: FetchResult                  # optional
  compensate:                          # optional — compensation operation (for transactions)
    operation: undo-fetch
  next: next-step
  boundary:
    - type: error
      goto: error-handler
```

**Validation:** Operation must exist with matching scope. Input/output types are checked against the operation's `paramBindings`/`resultMapping`.

---

## Script Node

**`type: script`** — Executes sandboxed code. Must define exactly ONE of `expression` or `module` (not both). The `module` field is only supported with `language: typescript`.

```yaml
# Inline FEEL expression
- id: transform-data
  type: script
  script:
    language: feel                     # REQUIRED — "feel" or "typescript"
    expression: |
      { score: input.rawScore * 10, qualified: input.rawScore >= 8 }
  input: RawData
  output: TransformedData
  next: next-step

# TypeScript module (from file)
- id: complex-transform
  type: script
  script:
    language: typescript
    module: scripts/transform.mjs      # project-relative path to .js/.mjs/.cjs
    limits:
      timeoutMs: 5000                  # default 5000ms
      memoryMb: 64                     # default 64MB
  input: RawData
  output: TransformedData
  next: next-step
```

**TypeScript modules** must `export default` an async function:

```javascript
export default async function(input, context) {
  // context = { scopeId, processInstanceId, taskId, currentTime, logger }
  return { field: value };  // must return an object
}
```

**Sandbox restrictions (TypeScript):** No `Date.now()` (use `context.currentTime`), no `Math.random()`, no `fetch()`, no `require()`/`import()`, no `process` globals.

---

## Decision Node

**`type: decision`** — Evaluates a business rule table.

```yaml
- id: route-lead
  type: decision
  decision: lead-routing               # REQUIRED — name of Decision resource
  input: ScoredLead
  output: RoutingResult
  next: next-step
```

---

## Send Node

**`type: send`** — Sends a notification via a channel.

```yaml
- id: notify-team
  type: send
  owner: miguel                        # optional
  template: task-notification          # REQUIRED — template name (under templates/)
  channel:                             # REQUIRED
    type: slack                        # "slack" | "email" | "teams" | "whatsapp" | "webhook"
    config:
      mode: token
      token:
        valueFrom:
          secretRef: slack-bot-token
  input: NotificationData
  next: next-step
```

---

## Receive Node

**`type: receive`** — Waits for an external message (correlation).

```yaml
- id: wait-for-reply
  type: receive
  catch: prospect-replied              # REQUIRED — message type to listen for
  correlateOn: "leadEmail"             # optional — FEEL expression for correlation key
  resultMapping:                       # optional — map message fields to output
    replyText:
      from: $.message.body             # MUST start with $.message. or $.state.
      transform: "replyText"           # optional FEEL transform
  output: ReplyData
  next: process-reply                  # REQUIRED
  timeout:                             # optional
    duration: P14D                     # ISO 8601 duration
    goto: follow-up                    # node ID on timeout
```

**Important:** `resultMapping.from` paths must start with `$.message.` (data from the message) or `$.state.` (current process state). The `correlateOn` path must NOT start with `$.message.` or `$.state.` — it targets the current state root `$`.

---

## Timer Node

**`type: timer`** — A simple delay.

```yaml
- id: wait-3-days
  type: timer
  duration: PT72H                      # REQUIRED — ISO 8601 duration
  next: next-step                      # REQUIRED
```

---

## Exclusive Gateway

**`type: gateway.exclusive`** — Conditional branching (XOR). Must have exactly one `default: true` path.

```yaml
- id: qualify-gate
  type: gateway.exclusive
  paths:                               # REQUIRED — at least 1
    - condition: "score >= 80"         # FEEL expression
      goto: high-priority
    - condition: "score >= 50"
      goto: medium-priority
    - default: true                    # the fallback path
      goto: low-priority
```

Conditions are FEEL expressions evaluated against the most recent output data in scope.

---

## Parallel Gateway

**`type: gateway.parallel`** — Fork and join for parallel execution. Fork branches MUST converge to exactly one join gateway.

```yaml
# Fork
- id: parallel-start
  type: gateway.parallel
  mode: fork
  gotos:                               # REQUIRED — at least 2 targets
    - research-path
    - scoring-path

# Join — merges branch results via Object.assign()
- id: parallel-end
  type: gateway.parallel
  mode: join
  output: MergedResult                 # REQUIRED — type for merged output
  next: after-parallel                 # REQUIRED
```

---

## Subprocess

**`type: subprocess`** — Inline nested process flow.

```yaml
- id: sub-flow
  type: subprocess
  input: SubInput
  output: SubOutput
  next: after-sub
  boundary:
    - type: error
      goto: sub-error-handler
  flow:                                # REQUIRED — nested flow (at least 1 node)
    - id: sub-step-1
      type: script
      script: { language: feel, expression: "{ processed: true }" }
      next: sub-end
    - id: sub-end
      type: none
```

---

## Call Activity

**`type: call`** — Invokes another named process.

```yaml
- id: call-sub-process
  type: call
  process: onboarding                  # REQUIRED — process name
  version: latest                      # optional — integer >= 1, or "latest"
  input: CallInput
  output: CallOutput
  next: after-call
```

---

## Transaction

**`type: transaction`** — Inline flow with compensation semantics. If the transaction fails, compensation operations run in reverse order.

```yaml
- id: payment-tx
  type: transaction
  input: PaymentInput
  output: PaymentOutput
  next: after-tx
  boundary:
    - type: error
      goto: compensate-handler
  flow:
    - id: charge
      type: service
      operation: charge-card
      compensate:
        operation: refund-card         # runs on transaction failure
      next: tx-end
    - id: tx-end
      type: none
```

---

## End Events

```yaml
# Normal end
- id: end-success
  type: none

# Error end — propagates a named error upward
- id: end-failed
  type: error
  code: payment_failed                 # REQUIRED — error code (1-128 chars)
```

Use `type: error` with a `code` to propagate structured errors that can be caught by boundary error events on parent scopes.

---

## Boundary Events

Boundary events attach to task, service, script, decision, send, subprocess, call, and transaction nodes.

```yaml
boundary:
  # Timer (duration) — fires after a duration
  - type: timer
    duration: PT1H                     # ISO 8601 duration
    goto: timeout-handler
    interrupting: true                 # true = cancels the activity; false = runs alongside

  # Timer (cycle) — fires repeatedly
  - type: timer
    cycle: PT5M                        # ISO 8601 cycle interval
    goto: periodic-check
    interrupting: false                # typically non-interrupting for cycles

  # Message — fires when a named message arrives
  - type: message
    name: cancel-requested
    goto: handle-cancel
    interrupting: true

  # Error — fires when the activity throws an error
  - type: error
    code: payment_failed               # optional — specific error code to catch (omit = catch all)
    goto: handle-error
```

---

## Start Events

```yaml
start:
  # Message start (most common for external triggers)
  - type: message
    name: new-lead-received            # REQUIRED — message type name
    input: LeadInput                   # optional
    goto: first-step                   # REQUIRED

  # Timer start (cron schedule)
  - type: timer
    schedule: "0 9 * * MON"           # REQUIRED — 5-field cron (min hour dom month dow)
    input: LeadInput                   # optional
    goto: first-step                   # REQUIRED

  # Manual start (internal subprocess use only)
  - type: manual
    internal: true                     # top-level manual starts MUST be internal: true
    input: LeadInput                   # optional
    goto: first-step                   # REQUIRED
```
