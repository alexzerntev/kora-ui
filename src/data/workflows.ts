export type FlowNodeKind =
  | 'task'
  | 'service'
  | 'script'
  | 'decision'
  | 'send'
  | 'receive'
  | 'timer'
  | 'gateway.exclusive'
  | 'gateway.parallel'
  | 'subprocess'
  | 'call'
  | 'transaction'
  | 'start.message'
  | 'start.timer'
  | 'start.manual'
  | 'end.none'
  | 'end.error'

export interface WorkflowNode {
  id: string
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  // Task-specific (kind: 'task')
  taskId?: string
  assigneeId?: string
  assigneeName?: string
  assigneeSeed?: string
  assigneeType?: 'human' | 'agent'
  // Extra display info
  meta?: Record<string, string>
  // Group/subprocess
  parentId?: string
  extent?: 'parent'
  style?: { width: number; height: number }
}

export interface Workflow {
  id: string
  name: string
  description: string
  lastRunAt?: string
  nodes: WorkflowNode[]
  edges: { from: string; to: string; label?: string }[]
}

export const WORKFLOWS: Workflow[] = [
  {
    id: 'w1',
    name: 'Lead Processing Pipeline',
    description: 'Full lead intake with scoring, routing, and follow-up — all node types',
    lastRunAt: '2026-03-22T09:15:00Z',
    nodes: [
      {
        id: 's1',
        kind: 'start.message',
        label: 'New Lead Received',
        status: 'idle',
        meta: {
          message: 'new-lead-received',
          schedule: '0 9 * * MON',
          'input.name': 'string',
          'input.email': 'string',
          'input.company': 'string',
          'input.source': 'string',
        },
      },
      {
        id: 't1',
        kind: 'task',
        label: 'Research Lead',
        taskId: 't1',
        status: 'idle',
        meta: { role: 'sdr,researcher', capability: 'web-research' },
      },
      {
        id: 't2',
        kind: 'task',
        label: 'Research Lead',
        taskId: 't1',
        assigneeId: '3',
        assigneeName: 'Nora',
        assigneeSeed: 'Nora sr',
        assigneeType: 'agent',
        status: 'idle',
        meta: { role: 'sdr,researcher', capability: 'web-research' },
      },
      {
        id: 'sv1',
        kind: 'service',
        label: 'Fetch CRM Data',
        status: 'idle',
        meta: { operation: 'fetch-lead-data', connector: 'http', method: 'GET', path: '/api/v1/leads' },
      },
      {
        id: 'sv2',
        kind: 'service',
        label: 'Query Lead History',
        status: 'idle',
        meta: { operation: 'lead-history', connector: 'sql', sql: 'SELECT * FROM leads WHERE email = $email' },
      },
      {
        id: 'sv3',
        kind: 'service',
        label: 'Run Enrichment Script',
        status: 'idle',
        meta: { operation: 'enrich-lead', connector: 'cli', command: 'node scripts/enrich.mjs' },
      },
      { id: 'sc1', kind: 'script', label: 'Score Lead', status: 'idle', meta: { language: 'feel' } },
      {
        id: 'dc1',
        kind: 'decision',
        label: 'Route Lead',
        status: 'idle',
        meta: { decision: 'lead-routing', ruleCount: '12', hitPolicy: 'first' },
      },
      { id: 'xg', kind: 'gateway.exclusive', label: 'Qualified?', status: 'idle' },
      {
        id: 'sd1',
        kind: 'send',
        label: 'Notify Sales Team',
        status: 'idle',
        meta: { channel: 'slack', template: 'lead-notification' },
      },
      { id: 'tm1', kind: 'timer', label: 'Wait 7 Days', status: 'idle', meta: { duration: 'P7D' } },
      { id: 'rc1', kind: 'receive', label: 'Await Reply', status: 'idle', meta: { catch: 'prospect-replied' } },
      { id: 'cl1', kind: 'call', label: 'Nurture Sequence', status: 'idle', meta: { process: 'nurture-flow' } },
      { id: 'sp1', kind: 'subprocess', label: 'Onboard Client', status: 'idle', style: { width: 500, height: 160 } },
      { id: 'sp1-s', kind: 'start.manual', label: 'Start', status: 'idle', parentId: 'sp1', extent: 'parent' },
      {
        id: 'sp1-a',
        kind: 'service',
        label: 'Verify Data',
        status: 'idle',
        meta: { connector: 'http', operation: 'verify' },
        parentId: 'sp1',
        extent: 'parent',
      },
      {
        id: 'sp1-b',
        kind: 'script',
        label: 'Create Account',
        status: 'idle',
        meta: { language: 'typescript' },
        parentId: 'sp1',
        extent: 'parent',
      },
      { id: 'sp1-e', kind: 'end.none', label: 'Done', status: 'idle', parentId: 'sp1', extent: 'parent' },
      { id: 'tx1', kind: 'transaction', label: 'Process Payment', status: 'idle', style: { width: 420, height: 160 } },
      { id: 'tx1-s', kind: 'start.manual', label: 'Start', status: 'idle', parentId: 'tx1', extent: 'parent' },
      {
        id: 'tx1-a',
        kind: 'service',
        label: 'Charge Card',
        status: 'idle',
        meta: { connector: 'http', operation: 'charge-card' },
        parentId: 'tx1',
        extent: 'parent',
      },
      { id: 'tx1-e', kind: 'end.none', label: 'Done', status: 'idle', parentId: 'tx1', extent: 'parent' },
      { id: 'e1', kind: 'end.none', label: 'Finish', status: 'idle' },
    ],
    edges: [
      { from: 's1', to: 't1' },
      { from: 't1', to: 't2' },
      { from: 't2', to: 'sv1' },
      { from: 'sv1', to: 'sv2' },
      { from: 'sv2', to: 'sv3' },
      { from: 'sv3', to: 'sc1' },
      { from: 'sv3', to: 'dc1' },
      { from: 'sc1', to: 'xg' },
      { from: 'dc1', to: 'xg' },
      { from: 'xg', to: 'sd1', label: 'score ≥ 80' },
      { from: 'xg', to: 'tm1', label: 'default' },
      { from: 'sd1', to: 'rc1' },
      { from: 'rc1', to: 'sp1' },
      { from: 'sp1', to: 'tx1' },
      { from: 'tx1', to: 'e1' },
      { from: 'tm1', to: 'cl1' },
      { from: 'cl1', to: 'e1' },
      { from: 'sp1-s', to: 'sp1-a' },
      { from: 'sp1-a', to: 'sp1-b' },
      { from: 'sp1-b', to: 'sp1-e' },
      { from: 'tx1-s', to: 'tx1-a' },
      { from: 'tx1-a', to: 'tx1-e' },
    ],
  },
  {
    id: 'w2',
    name: 'Client Onboarding',
    description: 'New client intake, background check, and welcome package',
    nodes: [
      {
        id: 'n10',
        kind: 'task',
        label: 'Research Topic',
        taskId: 't1',
        assigneeId: '3',
        assigneeName: 'Nora',
        assigneeSeed: 'Nora sr',
        assigneeType: 'agent',
        status: 'done',
      },
      {
        id: 'n11',
        kind: 'task',
        label: 'Draft Report',
        taskId: 't2',
        assigneeId: '4',
        assigneeName: 'Felix',
        assigneeSeed: 'Felix dir',
        assigneeType: 'agent',
        status: 'done',
      },
      {
        id: 'n12',
        kind: 'task',
        label: 'Review Document',
        taskId: 't3',
        assigneeId: '5',
        assigneeName: 'Mira',
        assigneeSeed: 'Mira head',
        assigneeType: 'agent',
        status: 'running',
      },
      {
        id: 'n13',
        kind: 'task',
        label: 'Stakeholder Approval',
        taskId: 't4',
        assigneeId: '1',
        assigneeName: 'Alice',
        assigneeSeed: 'Alice Chen work',
        assigneeType: 'human',
        status: 'idle',
      },
    ],
    edges: [
      { from: 'n10', to: 'n11' },
      { from: 'n11', to: 'n12' },
      { from: 'n12', to: 'n13' },
    ],
  },
]
