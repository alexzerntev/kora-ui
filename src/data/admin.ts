/* ------------------------------------------------------------------ */
/*  Admin entities — mock data for Decisions, Skills, Connectors,     */
/*  Operations, MCP Servers, and Templates                            */
/* ------------------------------------------------------------------ */

export interface Decision {
  id: string
  name: string
  description: string
  hitPolicy: 'first' | 'unique' | 'collect'
  rulesCount: number
}

export const DECISIONS: Decision[] = [
  {
    id: 'dec-1',
    name: 'Lead Routing',
    description: 'Route leads by score and region to the appropriate sales team',
    hitPolicy: 'first',
    rulesCount: 4,
  },
  {
    id: 'dec-2',
    name: 'Approval Threshold',
    description: 'Determine approval level required based on deal size',
    hitPolicy: 'first',
    rulesCount: 3,
  },
  {
    id: 'dec-3',
    name: 'Risk Classification',
    description: 'Classify vendor risk level based on compliance and financial data',
    hitPolicy: 'unique',
    rulesCount: 5,
  },
]

export interface Skill {
  id: string
  name: string
  description: string
}

export const SKILLS: Skill[] = [
  {
    id: 'sk-1',
    name: 'Social Writing',
    description: 'Guidelines and examples for drafting social media posts across platforms',
  },
  {
    id: 'sk-2',
    name: 'Compliance Review',
    description: 'Regulatory frameworks and checklists for document compliance review',
  },
]

export interface Connector {
  id: string
  name: string
  type: 'http' | 'sql' | 'cli'
  description: string
}

export const CONNECTORS: Connector[] = [
  {
    id: 'conn-1',
    name: 'Main API',
    type: 'http',
    description: 'Primary REST API for CRM and lead management',
  },
  {
    id: 'conn-2',
    name: 'Analytics DB',
    type: 'sql',
    description: 'PostgreSQL database for analytics and reporting queries',
  },
  {
    id: 'conn-3',
    name: 'Local CLI',
    type: 'cli',
    description: 'Sandboxed CLI runner for scripts and data processing',
  },
]

export interface Operation {
  id: string
  name: string
  connector: string
  action: string
  description: string
}

export const OPERATIONS: Operation[] = [
  {
    id: 'op-1',
    name: 'Fetch Lead Data',
    connector: 'Main API',
    action: 'GET /api/v1/leads',
    description: 'Retrieve lead details by ID from the CRM',
  },
  {
    id: 'op-2',
    name: 'Update Lead Score',
    connector: 'Main API',
    action: 'PUT /api/v1/leads/:id/score',
    description: 'Update the scoring for a specific lead',
  },
  {
    id: 'op-3',
    name: 'Query Active Deals',
    connector: 'Analytics DB',
    action: 'query',
    description: 'Fetch all deals with status active from the pipeline table',
  },
  {
    id: 'op-4',
    name: 'Run Scoring Script',
    connector: 'Local CLI',
    action: 'run',
    description: 'Execute the lead scoring Python script in sandbox',
  },
  {
    id: 'op-5',
    name: 'Send Notification',
    connector: 'Main API',
    action: 'POST /api/v1/notifications',
    description: 'Push a notification payload to the notification service',
  },
]

export interface McpServer {
  id: string
  name: string
  transport: string
  url: string
}

export const MCP_SERVERS: McpServer[] = [
  {
    id: 'mcp-1',
    name: 'GitHub Tools',
    transport: 'streamable-http',
    url: 'https://mcp.example.com/github',
  },
]

export interface Template {
  id: string
  name: string
  channel: string
  description: string
}

export const TEMPLATES: Template[] = [
  {
    id: 'tpl-1',
    name: 'Task Assignment',
    channel: 'Slack',
    description: 'Notify assignee when a new human task is created',
  },
  {
    id: 'tpl-2',
    name: 'Approval Request',
    channel: 'Email',
    description: 'Send approval request with document link to stakeholders',
  },
  {
    id: 'tpl-3',
    name: 'Process Complete',
    channel: 'Slack',
    description: 'Broadcast process completion summary to the team channel',
  },
]
