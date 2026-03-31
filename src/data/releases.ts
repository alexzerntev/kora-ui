export interface DraftChange {
  type: string
  entity: string
  action: 'added' | 'modified' | 'removed'
}

export interface Draft {
  id: string
  chatSessionId: string
  chatTitle: string
  changes: DraftChange[]
  createdAt: string
  createdBy: string
}

export interface ReleaseChange {
  type: string
  entity: string
  action: 'added' | 'modified' | 'removed'
}

export interface Release {
  id: string
  version: number
  status: 'active' | 'inactive'
  publishedBy: string
  publishedAt: string
  changes: ReleaseChange[]
}

export const DRAFTS: Draft[] = [
  {
    id: 'draft-1',
    chatSessionId: 'c1',
    chatTitle: 'Set up onboarding workflow',
    changes: [
      { type: 'process', entity: 'Client Onboarding', action: 'added' },
      { type: 'role', entity: 'Onboarding Specialist', action: 'added' },
    ],
    createdAt: '2026-03-29T14:22:00Z',
    createdBy: 'Alice Chen',
  },
  {
    id: 'draft-2',
    chatSessionId: 'c2',
    chatTitle: 'Add QA agent to team',
    changes: [
      { type: 'agent', entity: 'QA Bot', action: 'added' },
      { type: 'process', entity: 'Code Review Pipeline', action: 'modified' },
      { type: 'role', entity: 'Quality Assurance', action: 'modified' },
    ],
    createdAt: '2026-03-30T09:15:00Z',
    createdBy: 'Bob Martinez',
  },
  {
    id: 'draft-3',
    chatSessionId: 'c4',
    chatTitle: 'Configure Slack connector',
    changes: [{ type: 'connector', entity: 'Slack Integration', action: 'added' }],
    createdAt: '2026-03-30T11:05:00Z',
    createdBy: 'Alice Chen',
  },
]

export const RELEASES: Release[] = [
  {
    id: 'rel-5',
    version: 5,
    status: 'active',
    publishedBy: 'Alice Chen',
    publishedAt: '2026-03-28T16:00:00Z',
    changes: [
      { type: 'process', entity: 'Lead Qualification', action: 'modified' },
      { type: 'agent', entity: 'Nora', action: 'modified' },
    ],
  },
  {
    id: 'rel-4',
    version: 4,
    status: 'inactive',
    publishedBy: 'Bob Martinez',
    publishedAt: '2026-03-25T10:30:00Z',
    changes: [
      { type: 'process', entity: 'Quarterly Report', action: 'added' },
      { type: 'role', entity: 'Report Author', action: 'added' },
      { type: 'agent', entity: 'Felix', action: 'modified' },
    ],
  },
  {
    id: 'rel-3',
    version: 3,
    status: 'inactive',
    publishedBy: 'Alice Chen',
    publishedAt: '2026-03-20T14:00:00Z',
    changes: [
      { type: 'connector', entity: 'Salesforce CRM', action: 'added' },
      { type: 'process', entity: 'Lead Qualification', action: 'added' },
    ],
  },
  {
    id: 'rel-2',
    version: 2,
    status: 'inactive',
    publishedBy: 'Alice Chen',
    publishedAt: '2026-03-15T09:00:00Z',
    changes: [
      { type: 'agent', entity: 'Nora', action: 'added' },
      { type: 'agent', entity: 'Felix', action: 'added' },
      { type: 'role', entity: 'Lead Analyst', action: 'added' },
    ],
  },
  {
    id: 'rel-1',
    version: 1,
    status: 'inactive',
    publishedBy: 'Alice Chen',
    publishedAt: '2026-03-10T08:00:00Z',
    changes: [
      { type: 'process', entity: 'Client Onboarding v0', action: 'added' },
      { type: 'role', entity: 'Account Manager', action: 'added' },
      { type: 'person', entity: 'Alice Chen', action: 'added' },
      { type: 'person', entity: 'Bob Martinez', action: 'added' },
    ],
  },
]
