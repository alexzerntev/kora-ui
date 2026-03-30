# BPMN Patterns and Examples

## Table of Contents

1. [Human-in-the-Loop Pattern](#human-in-the-loop)
2. [Error Propagation Pattern](#error-propagation)
3. [Escalation Pattern](#escalation)
4. [Message Correlation Pattern](#message-correlation)
5. [Timer Patterns](#timer-patterns)
6. [Redraft Loop Pattern](#redraft-loop)
7. [Complete Example: GitHub Commit Social Assistant](#complete-example)
8. [Sandboxed Integration Checklist](#sandboxed-integration-checklist)
9. [Best Practices](#best-practices)

---

## Human-in-the-Loop

Agent drafts, human reviews, with optional revision loop:

```yaml
flow:
  - id: agent-draft
    type: task
    role: agent-role            # AI-eligible, assigned to agent
    capability: generate-draft
    output: DraftResult
    next: human-review

  - id: human-review
    type: task
    role: manager-role          # not AI-eligible, assigned to person
    capability: review-draft
    input: DraftResult
    output: ReviewDecision
    constraints:
      requiresApproval: true
    next: review-gate

  - id: review-gate
    type: gateway.exclusive
    paths:
      - condition: "decision == 'approve'"
        goto: publish
      - condition: "decision == 'revise'"
        goto: agent-draft       # loop back for revision
      - default: true
        goto: end-rejected
```

---

## Error Propagation

Catch errors with boundary events, notify via channel, propagate upward:

```yaml
flow:
  - id: risky-operation
    type: service
    operation: external-call
    boundary:
      - type: error
        code: api_failure              # catch specific error
        goto: handle-api-error
      - type: error                    # catch-all
        goto: handle-generic-error
    next: continue-happy-path

  - id: handle-api-error
    type: send
    template: api-error-notification
    channel:
      type: slack
      config:
        mode: token
        token:
          valueFrom:
            secretRef: slack-bot-token
    next: end-api-error

  - id: end-api-error
    type: error
    code: api_failure                  # propagate error upward
```

---

## Escalation

Time-based escalation if a task isn't completed:

```yaml
- id: review-task
  type: task
  role: sdr
  capability: brief-review
  constraints:
    requiresApproval: true
  escalation:
    after: PT4H                # escalate after 4 hours
    to: manager-escalation
  next: continue

- id: manager-escalation
  type: task
  role: sales-manager
  capability: escalation-review
  constraints:
    requiresApproval: true
  next: continue
```

---

## Message Correlation

Wait for an external message, correlate by a key:

```yaml
start:
  - type: message
    name: order.created
    input: OrderInput
    goto: process-order

flow:
  - id: process-order
    type: task
    role: processor
    capability: process-order
    next: wait-for-payment

  - id: wait-for-payment
    type: receive
    catch: payment.completed
    correlateOn: "orderId"             # match on this field
    resultMapping:
      paymentStatus:
        from: $.message.status         # from the inbound message
    output: PaymentResult
    next: fulfill
    timeout:
      duration: P7D                    # give up after 7 days
      goto: cancel-order
```

---

## Timer Patterns

```yaml
# Scheduled start (cron)
start:
  - type: timer
    schedule: "0 9 * * MON,THU"       # 9am Monday and Thursday
    goto: daily-scan

# Delay between steps
- id: cool-down
  type: timer
  duration: PT24H
  next: follow-up

# Interrupting timeout on a task
- id: slow-task
  type: task
  role: sdr
  capability: research
  boundary:
    - type: timer
      duration: PT30M
      interrupting: true               # cancels the task
      goto: research-timeout

# Non-interrupting periodic check
- id: long-task
  type: task
  role: analyst
  capability: deep-analysis
  boundary:
    - type: timer
      cycle: PT5M
      interrupting: false              # task continues
      goto: progress-check
```

---

## Redraft Loop

Agent generates, human reviews, loops back on revision request:

```yaml
flow:
  - id: generate
    type: task
    role: copywriter
    capability: generate-draft
    input: Context
    output: DraftResult
    next: review

  - id: redraft
    type: task
    role: copywriter
    capability: generate-draft
    input: ReviewDecision              # includes feedback
    output: DraftResult
    next: review

  - id: review
    type: task
    role: manager
    capability: review-draft
    input: DraftResult
    output: ReviewDecision
    next: decision-gate

  - id: decision-gate
    type: gateway.exclusive
    paths:
      - condition: "decision == 'publish'"
        goto: publish
      - condition: "decision == 'request-redraft'"
        goto: redraft
      - default: true
        goto: end-rejected
```

---

## Sandboxed Integration Checklist

For real integrations that combine hosted agents, sandboxed CLI operations, and external callbacks:

1. Put outbound hosts used by hosted agents or CLI operations in the project sandbox policy under `kora.yaml` using `defaultAction` plus ordered `egress` rules.
2. If sandboxed code must call a host-local dev service, use a sandbox-reachable hostname such as `host.docker.internal`, not `localhost`, and add an explicit egress rule for that hostname.
3. Treat provider callbacks separately from sandbox egress. Slack/webhook callbacks are inbound/public-edge concerns, not `kora.yaml` sandbox concerns.
4. In local dev, expose the public gateway and point provider callback URLs there. Verify the tunnel target is the actual gateway port, not an unrelated frontend/dev server.

---

## Complete Example

### GitHub Commit Social Assistant

Scans GitHub commits on a schedule, generates social media drafts with an AI agent, and routes through human review.

**Directory structure:**
```
github-commit-social-assistant/
├── kora.yaml
├── model-profiles.yaml
├── org/
│   ├── org.yaml
│   ├── assignments.yaml
│   ├── roles/{social-copywriter,marketing-manager}.yaml
│   ├── agents/social-copy-agent.yaml
│   └── people/miguel.yaml
├── capabilities/{generate-social-draft,review-social-draft}.yaml
├── connectors/local-cli.yaml
├── operations/{github-commit-scan,publish-generated-draft}.yaml
├── processes/github-commit-social-assistant.yaml
├── templates/publish-failure.yaml
├── skills/social-writing/SKILL.md
└── scripts/{github-commit-scan,publish-to-x}.mjs
```

**Key design points:**
1. **Dual start**: message (on-demand) + timer (Mon/Thu 9am cron)
2. **Flow**: service scan → agent draft → human review → exclusive gateway
3. **Redraft loop**: reviewer can request-redraft, loops back to agent with feedback
4. **Error handling**: publish has error boundary → Slack notify → error end
5. **Role separation**: `social-copywriter` is AI-eligible, `marketing-manager` is human-only
6. **Skills**: agent uses `social-writing` skill for domain context
7. **CLI connector**: operations use `node scripts/*.mjs` with stdin/stdout JSON inside the sandboxed CLI runtime

---

## Best Practices

### Process Design
1. Always define types — explicit input/output types catch mismatches at compile time
2. Use exclusive gateways with defaults — always include a `default: true` path
3. Error boundaries on service nodes — external calls can fail; handle errors
4. Error end events to propagate — `type: error` + `code` lets parent scopes catch
5. Human-in-the-loop for critical decisions — `requiresApproval: true`
6. Escalation timeouts — use `escalation.after` for SLA enforcement
7. Send + error end for failure notification — catch → notify → error end

### Agent Design
1. Specific system prompts — tell the agent exactly what format to return
2. Set budget limits — always set `maxBudgetUsd` and `maxDurationMs`
3. Use `maxTurns` — prevent runaway loops
4. Skills for domain knowledge — focused context for agents
5. `output.schemaRef` for structured output — declared process types validate agent output
6. Sandbox for security — enable with specific allowed domains/paths

### Connector Design
1. Prefer field-level `valueFrom` for secret/runtime-backed connector values
2. `allowedCommands` for CLI — security whitelist
3. Use `resultMapping` — explicitly map connector output to typed process data
4. Set `timeoutMs` and `retry` — external systems are unreliable

### Human Task Design
1. Define forms — structured fields reduce completion errors
2. Use channels — notify people where they work (Slack, email)
3. Include `guide` — clear instructions reduce task friction
4. Omit the explicit recipient field on built-in human channels when you want assignee fallback
5. `completionCommand` — provide CLI command for local completion
6. For agent fallback/review, catch `agent_needs_human` on the task boundary and route explicitly to a human task
