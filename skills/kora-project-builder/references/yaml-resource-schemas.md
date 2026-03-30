# Kora YAML Resource Schemas — Complete Field Reference

## Table of Contents

1. [Project Manifest](#31-project-manifest)
2. [Organization](#32-organization)
3. [Role](#33-role)
4. [Agent](#34-agent)
5. [Person](#35-person)
6. [Assignments](#36-assignments)
7. [Capability](#37-capability)
8. [Process](#38-process)
9. [Connector](#39-connector)
10. [Operation](#310-operation)
11. [Decision](#311-decision)
12. [MCP Server](#312-mcp-server)
13. [Model Profiles](#313-model-profiles)
14. [Templates (plain files)](#314-templates)
15. [Skills (plain files)](#315-skills)

---

## 3.1 Project Manifest (`kora.yaml`)

**Kind:** `Project` | **Location:** Project root, exactly one file.

```yaml
apiVersion: kora/v1
kind: Project
metadata:
  name: my-project                     # REQUIRED — project name (1-128 chars)
  scopeId: org_acme                    # REQUIRED — scope identifier, all entities must match
  description: A short description     # optional (max 1000 chars)
spec:                                    # optional
  machineExecution:                      # optional — project-wide agent execution defaults
    defaults:
      tools:                             # optional — default builtin tools for agents
        builtin:
          allow: [read, bash, edit, write, grep, find, ls]
      limits:                            # optional — default budget/time limits
        maxTurns: 10
        maxBudgetUsd: 2.0
        maxDurationMs: 300000
      sandbox:                           # optional — default sandbox network policy
        network:
          inheritManaged: true           # inherit managed LLM provider endpoints
          defaultAction: deny            # allow | deny, defaults to deny
          egress:
            - action: allow
              target: api.github.com
```

Operational note:
- This sandbox baseline applies to hosted agent execution and sandboxed CLI service execution.
- It controls outbound egress only. Inbound provider callbacks such as Slack interactivity are configured through public callback URLs/gateway routing, not through this policy.

---

## 3.2 Organization (`org/org.yaml`)

**Kind:** `Organization` | **Location:** `org/org.yaml`, exactly one file.

```yaml
apiVersion: kora/v1
kind: Organization
metadata:
  name: acme-corp                      # REQUIRED
  scopeId: org_acme                    # REQUIRED
  description: optional                # optional (max 1000 chars)
spec:
  teams:                               # optional — hierarchical team structure
    - name: engineering                # REQUIRED per team (1-128 chars)
      lead: engineering-lead           # optional — role name of team lead
      teams:                           # optional — nested sub-teams (recursive)
        - name: backend
          lead: backend-lead
```

---

## 3.3 Role (`org/roles/*.yaml`)

**Kind:** `Role` | **Location:** `org/roles/` directory, one file per role.

Roles define who can perform work — what capabilities a role requires and whether AI agents can fill it.

```yaml
apiVersion: kora/v1
kind: Role
metadata:
  name: sdr                            # REQUIRED — becomes the lane name in processes
  scopeId: org_acme                    # REQUIRED
  team: sales                          # optional — links to org team structure
spec:
  title: Sales Development Rep         # optional — human-readable title (max 256)
  reportsTo: sales-manager             # optional — another role name
  aiEligible: true                     # optional (default false) — can an agent fill this role?
  requiredCapabilities:                # REQUIRED — capabilities the assignee MUST have
    - web-research
    - email-drafting
  optionalCapabilities:                # optional — capabilities the assignee MAY use
    - crm-update
  authority: {}                        # optional — extensible authority metadata
  sla: {}                              # optional — extensible SLA metadata
  notifications: {}                    # optional — extensible notification prefs
```

**Key rules:**
- If `aiEligible` is false/omitted, assigning an agent to that lane is a compile error.
- Every capability used by a `task` node in a process must appear in the role's `requiredCapabilities` or `optionalCapabilities`.

---

## 3.4 Agent (`org/agents/*.yaml`)

**Kind:** `Agent` | **Location:** `org/agents/` directory.

Agents are AI identities that can be assigned to AI-eligible roles.

```yaml
apiVersion: kora/v1
kind: Agent
metadata:
  name: research-agent                 # REQUIRED
  scopeId: org_acme                    # REQUIRED
spec:
  description: Researches leads        # optional (max 4000 chars)
  capabilities:                        # REQUIRED — what this agent can do
    - web-research                     # must be defined capabilities
    - email-drafting
  model: claude-sonnet-4-5             # optional — default model override
  budget: {}                           # optional — extensible budget controls
  requiresApproval:                    # optional — capabilities requiring human approval
    - financial-action
```

The agent's capabilities must be a superset of the role's `requiredCapabilities` for any lane it's assigned to.

---

## 3.5 Person (`org/people/*.yaml`)

**Kind:** `Person` | **Location:** `org/people/` directory.

```yaml
apiVersion: kora/v1
kind: Person
metadata:
  name: maria                          # REQUIRED
  scopeId: org_acme                    # REQUIRED
spec:
  email: maria@acme.com                # optional — email address (validated format)
  capabilities:                        # REQUIRED — what this person can do
    - email-review
    - manual-review
  availability: {}                     # optional — extensible availability metadata
  channels:                            # optional — notification channel routing hints
    slack: C0ABCDEF123                 # key=channel type, value=target ID
    email: maria@acme.com
```

The `channels` map is used when a built-in outbound channel omits its explicit recipient field and falls back to the person's channel address — for example Slack and WhatsApp human-task notifications, or `send` nodes with an `owner`.

---

## 3.6 Assignments (`org/assignments.yaml`)

**Kind:** `Assignments` | **Location:** `org/assignments.yaml`, exactly one file.

Maps each role to a specific assignee.

```yaml
apiVersion: kora/v1
kind: Assignments
metadata:
  name: acme-assignments               # REQUIRED
  version: 1                           # REQUIRED — integer >= 1
  scopeId: org_acme                    # REQUIRED
spec:
  roles:
    sdr:                               # key = role name
      type: agent                      # REQUIRED — "agent" or "human"
      id: research-agent               # REQUIRED — name of Agent or Person resource
      overflow:                        # optional — overflow assignees
        - type: human
          id: backup-person
    sales-manager:
      type: human
      id: maria
```

**Validation:**
- Every lane key must match a defined Role.
- If `type: agent`, the role must have `aiEligible: true`.
- The assignee's capabilities must cover the role's `requiredCapabilities`.
- If an agent may require human fallback, model that explicitly with an `agent_needs_human` task boundary that routes to a human task node.

---

## 3.7 Capability (`capabilities/*.yaml`)

**Kind:** `Capability` | **Location:** `capabilities/` directory.

Capabilities define what work can be done and how — by an AI agent, a human, or both.

At least one of `spec.agentConfig` or `spec.humanConfig` must be present. A capability with neither is invalid.

```yaml
apiVersion: kora/v1
kind: Capability
metadata:
  name: generate-social-draft          # REQUIRED
  scopeId: org_acme                    # REQUIRED
  category: agent                      # optional — freeform category tag (max 128)
spec:
  description: Generate social post    # optional (max 4000 chars)

  # ─── Agent Configuration (for AI execution) ───
  agentConfig:
    # See references/agent-config.md for the complete agentConfig reference
    mode: agentic                      # optional — "prompt" | "agentic"
    systemPrompt: |
      You are a social media copywriter...
    modelProfile: fast-draft           # optional — references ModelProfiles entry
    thinkingLevel: medium              # optional — off|minimal|low|medium|high|xhigh
    limits:
      maxTurns: 5
      maxBudgetUsd: 1.0
      maxDurationMs: 120000
    tools:
      builtin:
        allow: [read, bash, edit, write, grep, find, ls]
    skills:
      - social-writing
    output:
      schemaRef: DraftOutput           # optional — type name for output validation
      maxRepairAttempts: 2             # optional — retries if output doesn't match
    execution:
      sandbox:
        network:
          inheritManaged: true
          defaultAction: deny
          egress:
            - action: allow
              target: api.example.com

  # ─── Human Configuration (for human task execution) ───
  humanConfig:
    summary: Review the draft          # optional (max 4000 chars)
    taskSummary: Review needed         # optional (max 4000 chars)
    guide: |                           # optional (max 8000 chars) — completion instructions
      Open the form, make your decision...
    completionUrl: https://...         # optional — URL for web-based completion
    completionCommand: kora complete   # optional — CLI command for completion
    dueAt: "2024-12-31T00:00:00Z"     # optional — ISO 8601 datetime deadline
    priority: high                     # optional — "low" | "normal" | "high" | "urgent"
    template: review-notification      # optional — template name reference
    form:                              # optional — structured form for task completion
      fields:
        - name: decision               # REQUIRED per field
          type: enum                   # REQUIRED — "string" | "number" | "boolean" | "enum"
          label: Your Decision         # optional (max 256)
          required: true               # optional
          options:                     # REQUIRED for type: enum
            - approve
            - reject
            - revise
        - name: feedback
          type: string
          label: Feedback
    channel:                           # optional — notification channel
      type: slack                      # "slack" | "email" | "teams" | "whatsapp" | "webhook"
      config:                          # channel-specific config (see connectors-channels.md)
        mode: token
        token:
          valueFrom:
            secretRef: slack-bot-token
```

**Validation:**
- A capability must define at least one of `agentConfig` or `humanConfig`.
- If `agentConfig.modelProfile` is not set, a `ModelProfiles` resource must be defined (uses `defaultProfile`).
- All `agentConfig.mcpServers[].server` references must match defined McpServer resources.
- All `agentConfig.skills[]` entries must have a corresponding `skills/<name>/SKILL.md` file.
- `agentConfig.tools.builtin.allow` values must be from: `read`, `bash`, `edit`, `write`, `grep`, `find`, `ls`.
- `humanConfig.channel.config` is validated by the registered channel validator for that `type`.

---

## 3.8 Process (`processes/*.yaml`)

**Kind:** `Process` | **Location:** `processes/` directory.

See `references/process-flow-nodes.md` for the complete flow node reference. Here is the process envelope:

```yaml
apiVersion: kora/v1
kind: Process
metadata:
  name: sales-outreach                 # REQUIRED (1-128 chars)
  version: 1                           # REQUIRED — integer >= 1
  scopeId: org_acme                    # REQUIRED
  description: Outreach workflow       # optional (max 1000 chars)
types:                                 # optional — process-scoped data schemas
  LeadInput:
    type: object
    properties:
      leadName: { type: string }
      score: { type: integer, minimum: 0 }
    required: [leadName, score]
start:                                 # REQUIRED — at least one start event
  - type: message
    name: new-lead
    input: LeadInput
    goto: first-step
flow:                                  # REQUIRED — at least one flow node
  - id: first-step
    type: task
    # ...
```

Process `types:` are inline JSON-Schema-like fragments, but Core only supports a defined subset. Use explicit typed schema fragments with `type: object|array|string|number|integer|boolean|null`. Do not use `$ref`, boolean schemas (`true` / `false`), or composition keywords such as `oneOf` / `anyOf` / `allOf` inside process types.

---

## 3.9 Connector (`connectors/*.yaml`)

**Kind:** `Connector` | **Location:** `connectors/` directory.

See `references/connectors-channels.md` for detailed connector type configs.

```yaml
apiVersion: kora/v1
kind: Connector
metadata:
  name: main-api
  scopeId: org_acme
spec:
  type: http                           # REQUIRED — built-ins are "http", "sql", "cli"; custom types need registered validators/runtime plugins
  config: {}                           # REQUIRED — type-specific config
```

---

## 3.10 Operation (`operations/*.yaml`)

**Kind:** `Operation` | **Location:** `operations/` directory.

Operations define a specific call to a connector.

```yaml
apiVersion: kora/v1
kind: Operation
metadata:
  name: fetch-lead-data
  scopeId: org_acme
spec:
  description: Fetch lead data         # optional (max 4000 chars)
  connector: main-api                  # REQUIRED — connector name (must exist)
  action: request                      # REQUIRED — built-in connectors only accept their cataloged actions
  config:                              # REQUIRED — action-specific config
    method: GET
    path: /api/v1/leads
  paramBindings:                       # optional — map process data into params
    query:
      from: input                      # "input" or "literal"
      path: $.searchParams             # JSONPath (required for from=input)
    apiKey:
      from: literal
      value: "my-key"                  # static value (required for from=literal)
  resultMapping:                       # optional — map output to process data
    leadName:
      from: $.body.name                # JSONPath into connector result
      transform: "leadName"            # optional FEEL transform
    score:
      from: $.body.score
  timeoutMs: 30000                     # optional
  retry:                               # optional
    maxAttempts: 3
    initialIntervalMs: 1000
    backoffMultiplier: 2.0
    nonRetryableErrors: ["connector_error"]
```

For built-in connectors, validation now checks the action name and the effective action params at compile time. If a service node's input shape is unknown, Kora emits a warning instead of pretending the params are fully type-checked.

---

## 3.11 Decision (`decisions/*.yaml`)

**Kind:** `Decision` | **Location:** `decisions/` directory.

Decision tables implement business rules (DMN-like).

```yaml
apiVersion: kora/v1
kind: Decision
metadata:
  name: lead-routing
  scopeId: org_acme
spec:
  description: Route leads by score    # optional
  hitPolicy: first                     # optional — "first" (default) | "unique" | "collect"
  rules:                               # option A: rule-based
    - condition: "score >= 80"         # FEEL expression or boolean
      output: { route: high, priority: urgent }
      annotation: Hot lead             # optional
    - condition: true                  # default/catch-all
      output: { route: nurture, priority: low }
  expression: |                        # option B: expression-based (alternative to rules)
    if score >= 80 then "hot" else "cold"
```

**Hit policies:** `first` = first match; `unique` = exactly one must match; `collect` = all matches as array.

---

## 3.12 MCP Server (`mcp-servers/*.yaml`)

**Kind:** `McpServer` | **Location:** `mcp-servers/` directory.

```yaml
apiVersion: kora/v1
kind: McpServer
metadata:
  name: github-tools
  scopeId: org_acme
spec:
  transport: streamable-http           # REQUIRED — only "streamable-http" supported
  url: https://mcp.example.com/tools   # REQUIRED — server URL
  headers:                             # optional — auth headers
    - name: Authorization
      scheme: Bearer                   # optional — prepended to value (e.g., "Bearer <token>")
      valueFrom:
        secretRef: github-api-key      # resolve value from secret
    - name: X-Custom
      valueFrom:
        runtimeVariable: CUSTOM_VAR    # resolve value from runtime variable
  timeoutMs: 30000                     # optional — request timeout
```

**Validation:** `transport` must be `streamable-http`. `url` is required. `headers[].valueFrom` must be either `{ secretRef }` or `{ runtimeVariable }` (not both).

---

## 3.13 Model Profiles (`model-profiles.yaml`)

**Kind:** `ModelProfiles` | **Location:** `model-profiles.yaml` or `model-profiles/model-profiles.yaml` (singleton).

```yaml
apiVersion: kora/v1
kind: ModelProfiles
metadata:
  scopeId: org_acme                    # no name field for this kind
spec:
  defaultProfile: standard             # REQUIRED — must be a key in profiles
  profiles:
    standard:
      provider: anthropic              # REQUIRED
      model: claude-sonnet-4-5         # REQUIRED
      temperature: 0.3                 # optional
      maxOutputTokens: 1000            # optional (>= 1)
    powerful:
      provider: anthropic
      model: claude-opus-4-6
```

Capabilities reference profiles via `agentConfig.modelProfile: standard`.

---

## 3.14 Templates (`templates/*.yaml`) — plain files, not resources

Templates define notification content for `send` nodes. They are **plain YAML files** — no `apiVersion`/`kind` envelope. They use **Handlebars syntax** (`{{variableName}}`).

```yaml
subject: "Task: {{taskName}}"
body: >-
  You have a new task to complete.
channels:
  slack:
    text: |
      *New task:* {{taskName}}
      Complete with: `kora complete {{workflowId}} {{taskId}}`
  email:
    subject: "Action required: {{taskName}}"
    html: "<p>New task: <b>{{taskName}}</b></p>"
```

Referenced by name (filename without extension) from `send` nodes. **Size limits:** 256KB per file, 2MB total.

---

## 3.15 Skills (`skills/<name>/SKILL.md`) — plain files, not resources

Skills are markdown files providing agent context. Each skill is a directory under `skills/` containing a `SKILL.md` with frontmatter:

```markdown
---
name: social-writing
description: Convert commit summaries into concise social post drafts.
---

# Social Writing
## Role
You are a product marketing copywriter.
## Rules
1. Use only information in the input.
2. Keep copy concise and factual.
## Output
Return valid JSON matching the task output schema.
```

Referenced from `agentConfig.skills: [social-writing]`. The compiler validates that `skills/<name>/SKILL.md` exists.
