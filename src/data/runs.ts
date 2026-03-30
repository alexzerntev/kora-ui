/**
 * Process run instances — represents actual executions of workflow definitions.
 * Each run references a workflow (process) and tracks its runtime status.
 */

export type RunStatus = 'running' | 'completed' | 'failed' | 'paused'

export interface ProcessRun {
  id: string
  workflowId: string
  workflowName: string
  status: RunStatus
  startedAt: string
  completedAt?: string
  progress: number // 0-100
  currentStep: string
  stepsCompleted: number
  stepsTotal: number
  triggeredBy: string
}

export const PROCESS_RUNS: ProcessRun[] = [
  {
    id: 'run-1',
    workflowId: 'w1',
    workflowName: 'Lead Processing Pipeline',
    status: 'running',
    startedAt: '2026-03-30T08:15:00Z',
    progress: 45,
    currentStep: 'Score Lead',
    stepsCompleted: 5,
    stepsTotal: 11,
    triggeredBy: 'Incoming lead webhook',
  },
  {
    id: 'run-2',
    workflowId: 'w2',
    workflowName: 'Client Onboarding',
    status: 'running',
    startedAt: '2026-03-30T09:00:00Z',
    progress: 72,
    currentStep: 'Review Document',
    stepsCompleted: 3,
    stepsTotal: 4,
    triggeredBy: 'Alice Chen',
  },
  {
    id: 'run-3',
    workflowId: 'w1',
    workflowName: 'Lead Processing Pipeline',
    status: 'completed',
    startedAt: '2026-03-30T06:00:00Z',
    completedAt: '2026-03-30T06:42:00Z',
    progress: 100,
    currentStep: 'Finish',
    stepsCompleted: 11,
    stepsTotal: 11,
    triggeredBy: 'Scheduled trigger',
  },
  {
    id: 'run-4',
    workflowId: 'w2',
    workflowName: 'Client Onboarding',
    status: 'completed',
    startedAt: '2026-03-29T14:00:00Z',
    completedAt: '2026-03-29T14:35:00Z',
    progress: 100,
    currentStep: 'Stakeholder Approval',
    stepsCompleted: 4,
    stepsTotal: 4,
    triggeredBy: 'Bob Martinez',
  },
  {
    id: 'run-5',
    workflowId: 'w1',
    workflowName: 'Lead Processing Pipeline',
    status: 'failed',
    startedAt: '2026-03-30T07:30:00Z',
    completedAt: '2026-03-30T07:38:00Z',
    progress: 27,
    currentStep: 'Fetch CRM Data',
    stepsCompleted: 3,
    stepsTotal: 11,
    triggeredBy: 'Incoming lead webhook',
  },
  {
    id: 'run-6',
    workflowId: 'w2',
    workflowName: 'Client Onboarding',
    status: 'completed',
    startedAt: '2026-03-30T05:00:00Z',
    completedAt: '2026-03-30T05:22:00Z',
    progress: 100,
    currentStep: 'Stakeholder Approval',
    stepsCompleted: 4,
    stepsTotal: 4,
    triggeredBy: 'Alice Chen',
  },
  {
    id: 'run-7',
    workflowId: 'w1',
    workflowName: 'Lead Processing Pipeline',
    status: 'paused',
    startedAt: '2026-03-30T07:00:00Z',
    progress: 55,
    currentStep: 'Await Reply',
    stepsCompleted: 6,
    stepsTotal: 11,
    triggeredBy: 'Incoming lead webhook',
  },
]

/**
 * Pending actions — tasks waiting for human input
 */

export type PendingActionType = 'approval' | 'review' | 'decision' | 'input'

export interface PendingAction {
  id: string
  title: string
  description: string
  type: PendingActionType
  assigneeId: string
  assigneeName: string
  processRunId: string
  processName: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  dueAt?: string
}

export const PENDING_ACTIONS: PendingAction[] = [
  {
    id: 'pa-1',
    title: 'Approve vendor contract',
    description: 'Review and sign off on the Q2 vendor services agreement',
    type: 'approval',
    assigneeId: '1',
    assigneeName: 'Alice Chen',
    processRunId: 'run-2',
    processName: 'Client Onboarding',
    priority: 'high',
    createdAt: '2026-03-30T09:30:00Z',
    dueAt: '2026-03-31T17:00:00Z',
  },
  {
    id: 'pa-2',
    title: 'Review compliance report',
    description: 'Check Q4 compliance findings before distribution',
    type: 'review',
    assigneeId: '2',
    assigneeName: 'Bob Martinez',
    processRunId: 'run-1',
    processName: 'Lead Processing Pipeline',
    priority: 'medium',
    createdAt: '2026-03-30T08:45:00Z',
  },
  {
    id: 'pa-3',
    title: 'Select routing strategy',
    description: 'Choose lead routing: round-robin or score-based',
    type: 'decision',
    assigneeId: '1',
    assigneeName: 'Alice Chen',
    processRunId: 'run-1',
    processName: 'Lead Processing Pipeline',
    priority: 'medium',
    createdAt: '2026-03-30T08:20:00Z',
  },
  {
    id: 'pa-4',
    title: 'Provide client details',
    description: 'Enter billing and contact info for new client setup',
    type: 'input',
    assigneeId: '2',
    assigneeName: 'Bob Martinez',
    processRunId: 'run-2',
    processName: 'Client Onboarding',
    priority: 'low',
    createdAt: '2026-03-30T09:10:00Z',
    dueAt: '2026-04-02T17:00:00Z',
  },
]
