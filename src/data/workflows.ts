export interface WorkflowTask {
  id: string
  taskId: string       // references task from task library
  taskName: string
  assigneeId: string   // references team member
  assigneeName: string
  assigneeSeed: string // for avatar
  assigneeType: 'human' | 'agent'
  status: 'idle' | 'running' | 'done'
}

export interface Workflow {
  id: string
  name: string
  description: string
  tasks: WorkflowTask[]
  edges: { from: string; to: string }[]
}

export const WORKFLOWS: Workflow[] = [
  {
    id: 'w1',
    name: 'Quarterly Report',
    description: 'End-to-end quarterly report generation pipeline',
    tasks: [
      { id: 'n1', taskId: 't1', taskName: 'Research Topic', assigneeId: '3', assigneeName: 'Nora', assigneeSeed: 'Nora sr', assigneeType: 'agent', status: 'done' },
      { id: 'n2', taskId: 't5', taskName: 'Data Analysis', assigneeId: '2', assigneeName: 'Bob', assigneeSeed: 'Bob Martinez lead', assigneeType: 'human', status: 'done' },
      { id: 'n3', taskId: 't2', taskName: 'Draft Report', assigneeId: '4', assigneeName: 'Felix', assigneeSeed: 'Felix dir', assigneeType: 'agent', status: 'running' },
      { id: 'n4', taskId: 't3', taskName: 'Review Document', assigneeId: '5', assigneeName: 'Mira', assigneeSeed: 'Mira head', assigneeType: 'agent', status: 'idle' },
      { id: 'n5', taskId: 't4', taskName: 'Stakeholder Approval', assigneeId: '1', assigneeName: 'Alice', assigneeSeed: 'Alice Chen work', assigneeType: 'human', status: 'idle' },
    ],
    edges: [
      { from: 'n1', to: 'n3' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
    ],
  },
  {
    id: 'w2',
    name: 'Client Onboarding',
    description: 'New client intake, background check, and welcome package',
    tasks: [
      { id: 'n10', taskId: 't1', taskName: 'Research Topic', assigneeId: '3', assigneeName: 'Nora', assigneeSeed: 'Nora sr', assigneeType: 'agent', status: 'done' },
      { id: 'n11', taskId: 't2', taskName: 'Draft Report', assigneeId: '4', assigneeName: 'Felix', assigneeSeed: 'Felix dir', assigneeType: 'agent', status: 'done' },
      { id: 'n12', taskId: 't3', taskName: 'Review Document', assigneeId: '5', assigneeName: 'Mira', assigneeSeed: 'Mira head', assigneeType: 'agent', status: 'done' },
    ],
    edges: [
      { from: 'n10', to: 'n11' },
      { from: 'n11', to: 'n12' },
    ],
  },
]
