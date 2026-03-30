# Agent Configuration — Complete Reference

The `agentConfig` field on a Capability controls how an AI agent executes the capability. When a task node runs and the assigned role has an agent, the runtime constructs an execution context from these settings.

## Full agentConfig Schema

```yaml
agentConfig:
  # ─── Mode ───
  mode: agentic                          # optional — "prompt" | "agentic"
  # "prompt" = single-shot LLM call (no tool loop)
  # "agentic" = multi-turn tool-using agent loop (default behavior)

  # ─── Prompt and Model ───
  systemPrompt: |                        # optional (max 65536 chars)
    You are a social media copywriter...
  modelProfile: fast-draft               # optional — reference to ModelProfiles entry
  # If not set, uses ModelProfiles.defaultProfile.

  # ─── Thinking Level ───
  thinkingLevel: medium                  # optional — controls extended thinking
  # "off" | "minimal" | "low" | "medium" | "high" | "xhigh"

  # ─── Budget and Limits ───
  limits:                                # optional
    maxTurns: 5                          # optional — max agent conversation turns (>= 1)
    maxBudgetUsd: 1.0                    # optional — max cost in USD (>= 0)
    maxDurationMs: 120000                # optional — timeout in ms (>= 1)

  # ─── Builtin Tools ───
  tools:                                 # optional — control which builtin tools the agent can use
    builtin:
      allow:                             # optional — whitelist of builtin tool names
        - read                           # read files
        - bash                           # run shell commands
        - edit                           # edit files
        - write                          # write files
        - grep                           # search file contents
        - find                           # find files
        - ls                             # list directories

  # ─── Skills ───
  skills:                                # optional — skill folder names under skills/
    - social-writing                     # must have skills/<name>/SKILL.md

  # ─── MCP Servers (External Tools) ───
  mcpServers:                            # optional — MCP server references
    - server: github-tools               # must match McpServer metadata.name
      tools:                             # optional — restrict to specific tools
        - search_repos

  # ─── Structured Output ───
  output:                                # optional — validate agent output
    schemaRef: DraftOutput               # optional — type name from process types
    maxRepairAttempts: 2                 # optional — retries if output doesn't match schema

  # ─── Execution / Sandbox ───
  execution:                             # optional — sandbox configuration
    sandbox:
      network:
        inheritManaged: true             # optional — inherit managed LLM provider endpoints
        defaultAction: deny              # optional — allow | deny, defaults to deny
        egress:                          # optional — ordered egress rules
          - action: allow
            target: api.github.com
          - action: deny
            target: "*.tracking.example.com"
```

## Agent Execution Flow

When a `task` node runs with an agent assignee:

1. The runtime resolves the capability's `agentConfig`
2. It constructs a machine execution request with: input data, system prompt, tools, limits, sandbox policy
3. The agent executes inside an OpenSandbox environment with:
   - Domain-level egress policy (`defaultAction` + ordered `egress` rules, plus optional managed endpoints)
   - Builtin tools (read, bash, edit, write, grep, find, ls) as configured
   - MCP server tools discovered at runtime
   - Skills projected into the agent's filesystem
4. Budget/time/turn limits are enforced
5. The agent executes and returns a status:
   - **`success`** — output advances the flow
   - **`needs_human`** — runtime surfaces `agent_needs_human`; handle it with an explicit task boundary if you want a human review/fallback path
   - **`failed`** — follows error/retry policy
   - **`vetoed`** — policy/decision rejection

## Agent Modes

### `prompt` mode
Single-shot LLM call. The agent receives the input and system prompt, produces one response, and returns. No tool use, no multi-turn conversation. Best for simple transformations, classifications, and drafting tasks.

### `agentic` mode
Multi-turn tool-using agent loop. The agent can use builtin tools and MCP server tools across multiple turns to research, analyze, and produce output. Best for complex tasks requiring tool interaction.

## Thinking Levels

Controls the agent's extended thinking capability:

| Level | Description |
|-------|-------------|
| `off` | No extended thinking |
| `minimal` | Very brief reasoning |
| `low` | Light reasoning |
| `medium` | Balanced reasoning (good default) |
| `high` | Deep reasoning |
| `xhigh` | Maximum reasoning depth |

## Sandbox Network Policy

Agent execution runs inside an OpenSandbox with network isolation:

- **`inheritManaged: true`** (default) — automatically allows egress to managed LLM provider endpoints (Anthropic, OpenAI, Google, Groq, Cerebras, Mistral, etc.)
- **`defaultAction`** — `deny` by default; set `allow` for allow-all with targeted deny rules
- **`egress`** — ordered `allow` / `deny` rules for exact or wildcard FQDN targets like `api.example.com` or `*.example.com`
- Rules are evaluated before inherited managed endpoints; unmatched traffic follows `defaultAction`

Project-level defaults can be set in `kora.yaml` under `spec.machineExecution.defaults.sandbox.network`.

## Skills Best Practices

- Keep skills focused on a single domain
- Include concrete examples in `examples/` subdirectories
- The `SKILL.md` frontmatter `description` should be specific enough for the agent to understand when to apply it
- Skills are available as context, not as executable tools

## MCP Server Best Practices

- MCP servers are the exclusive source of external tools for agents
- Use the `tools` filter to restrict which tools an agent can access from a server
- MCP servers must use `streamable-http` transport with proper auth headers
- Tools are discovered at runtime; connection opened at task start, closed at completion
