---
name: kora-project-builder
description: >
  Comprehensive guide for building Kora projects — YAML-based workflow
  orchestration with BPMN processes, human-AI collaboration, connectors,
  and channels. Use this skill whenever the user wants to create, modify,
  or understand Kora YAML files, define workflows or processes, set up
  roles/capabilities/assignments, configure connectors or channels, or
  describes any business problem that should be modeled as a Kora project.
  Also use when the user mentions kora.yaml, capabilities, operations,
  assignments, process definitions, decision tables, or any Kora resource kind.
---

# Kora Project Builder

A Kora project is a directory of YAML files and optional scripts that define an organization, its capabilities, and the BPMN-like workflows that orchestrate work between humans and AI agents. The Kora compiler validates all cross-references and the runtime executes processes on a durable workflow engine (Temporal).

## How to think about building a Kora project

When a user describes a business problem, decompose it into these layers:

1. **Who does the work?** → Roles, People, Agents
2. **What work can be done?** → Capabilities (each a distinct unit of work)
3. **How is the work orchestrated?** → Processes (BPMN flow: tasks, gateways, events)
4. **What external systems are involved?** → Connectors + Operations
5. **What business rules apply?** → Decisions (DMN-style rule tables)
6. **How are humans notified?** → Channels (Slack, email, Teams, WhatsApp, webhook)
7. **What context do agents need?** → Skills, MCP servers, model profiles

The key mental model is the **capability chain**:

```
Role  ──requires──▶  Capability  ◀──referenced by──  Process task node
  │                      │                                   │
  ▼                      ▼                                   ▼
Assignment          agentConfig /               role + capability + input/output
(maps role →        humanConfig
person or agent)    (how the work is done)
```

Every task node in a process references a `role` and a `capability`. The role must list that capability. The assignment must map that role to a person or agent who has that capability. Break any link and the compiler catches it.

## Project directory layout

```
my-project/
├── kora.yaml                    # REQUIRED — project manifest
├── model-profiles.yaml          # optional — LLM model config (singleton)
├── org/
│   ├── org.yaml                 # REQUIRED — organization definition
│   ├── assignments.yaml         # REQUIRED — role-to-assignee mapping
│   ├── roles/*.yaml             # one per role (= process lane)
│   ├── agents/*.yaml            # one per AI agent identity
│   └── people/*.yaml            # one per human
├── capabilities/*.yaml          # one per capability
├── processes/*.yaml             # one per process definition
├── connectors/*.yaml            # one per external system binding
├── operations/*.yaml            # one per connector call
├── decisions/*.yaml             # one per business rule table
├── mcp-servers/*.yaml           # one per MCP tool server
├── templates/*.yaml             # notification content (no apiVersion/kind, Handlebars syntax)
├── skills/<name>/SKILL.md       # skill files for agent context
└── scripts/*.mjs                # project scripts invoked by sandboxed CLI operations
```

All YAML files are recursively discovered. Entity names come from `metadata.name`, not filenames. All entities must share the same `scopeId` as the project manifest.

## YAML resource envelope

Every resource follows this pattern:

```yaml
apiVersion: kora/v1
kind: <ResourceKind>       # Project | Organization | Role | Agent | Person |
                           # Capability | Process | Connector | Operation |
                           # Decision | McpServer | ModelProfiles | Assignments
metadata:
  name: <string>           # 1-128 chars, unique within kind
  scopeId: <string>        # must match project manifest scopeId
spec:
  # kind-specific fields
```

Note: Templates and Skills are not resource kinds — they are plain files referenced by name.

For the complete field reference for each resource kind, read `references/yaml-resource-schemas.md`.

## Build workflow

When creating a project from a problem description, follow this order because each step depends on the previous ones:

### Step 1: Project manifest (`kora.yaml`)

Choose a `scopeId` (lowercase alphanumeric + hyphens/underscores, 3-64 chars). Every other resource must use this exact same `scopeId`.

```yaml
apiVersion: kora/v1
kind: Project
metadata:
  name: my-project
  scopeId: org_acme
  description: What this project does
spec:                                      # optional
  machineExecution:                        # optional — project-wide agent defaults
    defaults:
      tools:
        builtin:
          allow: [read, bash, edit, write, grep, find, ls]
      limits:
        maxTurns: 10
        maxBudgetUsd: 2.0
        maxDurationMs: 300000
      sandbox:
        network:
          inheritManaged: true             # inherit managed LLM provider endpoints
          defaultAction: deny              # allow | deny, defaults to deny
          egress:
            - action: allow
              target: api.github.com
```

Current implementation note: the project-level sandbox baseline is shared by hosted agent execution and sandboxed CLI service execution.

Sandbox mental model:
- `kora.yaml` sandbox network policy controls outbound egress from hosted agent execution and sandboxed CLI service execution.
- They do **not** configure inbound provider callbacks such as Slack interactivity or webhook delivery.
- In local Docker dev, `localhost` inside the sandbox is the sandbox itself. If sandboxed code must call a host-local service, use a sandbox-reachable hostname such as `host.docker.internal` and add an explicit egress rule for that hostname.

### Step 2: Organization and roles

Define the org (`org/org.yaml`), then create one role per "swim lane" you need in your processes. Each role declares which capabilities it requires, and critically, whether an AI agent can fill it:

```yaml
# org/roles/sdr.yaml
apiVersion: kora/v1
kind: Role
metadata:
  name: sdr
  scopeId: org_acme
spec:
  aiEligible: true                 # can an agent fill this role?
  requiredCapabilities:
    - web-research
    - email-drafting
```

If `aiEligible` is false or omitted, only humans can be assigned to this role.

### Step 3: Capabilities

One capability per distinct unit of work. Each capability can have an `agentConfig` (for AI execution) and/or a `humanConfig` (for human execution):

```yaml
# capabilities/web-research.yaml
apiVersion: kora/v1
kind: Capability
metadata:
  name: web-research
  scopeId: org_acme
spec:
  description: Research a lead online
  agentConfig:
    mode: agentic                          # "prompt" (single-shot) or "agentic" (tool loop)
    systemPrompt: |
      You research leads and return structured findings...
    modelProfile: standard                 # references a ModelProfiles entry
    thinkingLevel: medium                  # off | minimal | low | medium | high | xhigh
    limits:
      maxTurns: 5
      maxBudgetUsd: 1.0
      maxDurationMs: 120000
    tools:
      builtin:
        allow: [read, bash, grep]          # read | bash | edit | write | grep | find | ls
    skills:
      - research-skill
```

For the full agent config reference (thinking, sandbox, tools, skills, MCP servers, output), read `references/agent-config.md`.

For human config (forms and channels), read `references/yaml-resource-schemas.md` section 3.7.

### Step 4: People, agents, assignments

Create people and agents under `org/`, then wire them together in `org/assignments.yaml`:

```yaml
# org/assignments.yaml
apiVersion: kora/v1
kind: Assignments
metadata: { name: assignments, version: 1, scopeId: org_acme }
spec:
  roles:
    sdr:
      type: agent
      id: research-agent
    sales-manager:
      type: human
      id: maria
```

Validation enforces: the role exists, the assignee exists, the assignee has all required capabilities, and agent assignments require `aiEligible: true` on the role.
If an agent can return `agent_needs_human`, model that with an explicit task boundary and route to a human task node.

### Step 5: Process definition

This is the heart of Kora — a BPMN-like flow definition. Define typed data schemas, start events, and a sequence of flow nodes:

```yaml
apiVersion: kora/v1
kind: Process
metadata: { name: sales-outreach, version: 1, scopeId: org_acme }
types:
  LeadInput:
    type: object
    properties:
      leadName: { type: string }
      score: { type: integer }
    required: [leadName, score]
start:
  - type: message
    name: new-lead
    input: LeadInput
    goto: research
flow:
  - id: research
    type: task
    role: sdr
    capability: web-research
    input: LeadInput
    output: ResearchResult
    next: qualify-gate
  - id: qualify-gate
    type: gateway.exclusive
    paths:
      - condition: "score >= 80"
        goto: draft-email
      - default: true
        goto: end-low-score
  - id: end-low-score
    type: none
```

Process type schemas are inline JSON-Schema-like fragments, but Core only supports a defined subset. Do not use `$ref` inside `types:`; process-local references such as `#/types/Foo` are rejected. Also avoid JSON Schema composition features like `oneOf` / `anyOf` / `allOf` and boolean schemas (`true` / `false`). Use explicit typed nested schemas instead.

For the complete reference of all flow node types and boundary event types, read `references/process-flow-nodes.md`.

### Step 6: Connectors, operations, decisions

Add these as needed for external system calls and business rules.

For connector types (HTTP, SQL, CLI) and their configs, read `references/connectors-channels.md`.

For decision table hit policies and examples, read `references/yaml-resource-schemas.md` section 3.13.

### Step 7: Model profiles, skills, MCP servers, templates

Add these to configure AI behavior, provide agent context, and define notification content. See the respective sections in the reference files.

## Key validation rules to remember

These are the most common compile errors — the compiler enforces a strict integrity graph:

| What breaks | Why | Fix |
|---|---|---|
| scopeId mismatch | Every resource must use the same scopeId | Copy the scopeId from kora.yaml to all files |
| Task uses unknown capability | Process task references a capability not in the role's catalog | Add it to the role's `requiredCapabilities` |
| Role assigned to agent but not aiEligible | Only AI-eligible roles can have agent assignees | Set `aiEligible: true` on the role |
| Assignee missing required capability | The person/agent doesn't declare the role's capabilities | Add the capability to the person/agent's `capabilities` list |
| Task role has no assignment | Every role used in a process must have an assignment entry | Add the role to `org/assignments.yaml` under `spec.roles` |
| Process type uses `$ref` | Process-local schema refs are not supported | Inline the referenced schema under `types:` |
| Operation references missing connector | Operations need a defined connector | Create the connector YAML |
| Missing skill file | Skill referenced but `skills/<name>/SKILL.md` doesn't exist | Create the skill directory and SKILL.md |

## Start event types

- **`message`** — triggered by inbound message (most common for external triggers)
- **`timer`** — triggered on cron schedule (5-field format: `min hour dom month dow`)
- **`manual`** — internal-only subprocess starts (top-level manual starts must have `internal: true`)

## FEEL expressions

Gateway conditions and script expressions use Kora's FEEL subset:

- Comparison: `score >= 80`, `status == 'approved'`, `count != 0`
- Logic: `and`, `or`, `not`
- Arithmetic: `+`, `-`, `*`, `/`
- Conditionals: `if score >= 80 then "hot" else "cold"`
- Built-ins: `max()`, `min()`, `sum()`, `count()`
- Member access: `obj.field`, `arr[0]`
- Literals: numbers, `"strings"`, `true`, `false`, `null`

## ISO 8601 durations

Used in timers, boundaries, and escalations:

`PT30S` (30s), `PT5M` (5min), `PT1H` (1hr), `PT4H` (4hr), `PT24H` (24hr), `P1D` (1 day), `P7D` (7 days), `P14D` (14 days)

## Reference files

For detailed schemas and examples beyond what's covered here:

- `references/yaml-resource-schemas.md` — Every field for all resource kinds
- `references/process-flow-nodes.md` — All flow node types + boundary event types
- `references/connectors-channels.md` — HTTP/SQL/CLI connector configs, channel configs
- `references/agent-config.md` — Agent config deep dive: mode, thinking, tools, sandbox, skills, MCP, output
- `references/patterns-and-examples.md` — BPMN patterns, complete annotated example, best practices
