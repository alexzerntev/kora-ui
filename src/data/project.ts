export interface SandboxEgressRule {
  action: 'allow' | 'deny'
  target: string
}

export interface SandboxNetwork {
  inheritManaged: boolean
  defaultAction: 'allow' | 'deny'
  egress: SandboxEgressRule[]
}

export interface ExecutionLimits {
  maxTurns: number
  maxBudgetUsd: number
  maxDurationMs: number
}

export interface MachineExecutionDefaults {
  tools: {
    builtin: {
      allow: string[]
    }
  }
  limits: ExecutionLimits
  sandbox: {
    network: SandboxNetwork
  }
}

export interface Project {
  name: string
  scopeId: string
  description: string
  machineExecution: {
    defaults: MachineExecutionDefaults
  }
}

export const PROJECT: Project = {
  name: 'acme-workflows',
  scopeId: 'org_acme',
  description: 'End-to-end workflow automation for Acme Corp — research, reporting, client onboarding, and outreach pipelines.',
  machineExecution: {
    defaults: {
      tools: {
        builtin: {
          allow: ['read', 'bash', 'edit', 'write', 'grep', 'find', 'ls'],
        },
      },
      limits: {
        maxTurns: 10,
        maxBudgetUsd: 2.0,
        maxDurationMs: 300000,
      },
      sandbox: {
        network: {
          inheritManaged: true,
          defaultAction: 'deny',
          egress: [
            { action: 'allow', target: 'api.github.com' },
            { action: 'allow', target: 'slack.com' },
            { action: 'allow', target: 'api.openai.com' },
          ],
        },
      },
    },
  },
}
