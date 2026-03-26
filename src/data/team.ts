export interface TeamMember {
  id: string
  name: string
  type: 'human' | 'agent'
  role: string
  capabilities: string[]
  status: 'idle' | 'busy'
  emoji: string
  emojiCodepoints: string
  avatarSeed: string
}

export interface AgentMember extends TeamMember {
  type: 'agent'
  prompt: string
  memory: MemoryEntry[]
  taskRuns: TaskRun[]
}

export interface MemoryEntry {
  id: string
  content: string
  timestamp: string
}

export interface TaskRun {
  id: string
  taskName: string
  status: 'completed' | 'running' | 'failed'
  startedAt: string
  duration?: string
}

export const TYPE_COLORS = {
  human: { light: '#f5f3ff', dark: '#7c3aed' },
  agent: { light: '#ecfeff', dark: '#0891b2' },
} as const

export const TEAM: (TeamMember | AgentMember)[] = [
  {
    id: '1', name: 'Alice Chen', type: 'human', role: 'Project Manager',
    capabilities: ['Planning', 'Stakeholder Comms', 'Risk Assessment'],
    status: 'idle', emoji: '\u{1F60E}', emojiCodepoints: '1f60e', avatarSeed: 'Alice Chen work',
  },
  {
    id: '2', name: 'Bob Martinez', type: 'human', role: 'Analyst',
    capabilities: ['Data Analysis', 'SQL', 'Reporting'],
    status: 'busy', emoji: '\u{1F914}', emojiCodepoints: '1f914', avatarSeed: 'Bob Martinez lead',
  },
  {
    id: '3', name: 'Nora', type: 'agent', role: 'Research Specialist',
    capabilities: ['Web Research', 'Data Gathering', 'Summarisation'],
    status: 'idle', emoji: '\u{1F9D0}', emojiCodepoints: '1f9d0', avatarSeed: 'Nora sr',
    prompt: 'You are a research specialist. Your job is to find accurate, up-to-date information from multiple sources. Always cite your sources and flag conflicting data. Prioritise recency and authority of sources.',
    memory: [
      { id: 'm1', content: 'User prefers bullet-point summaries over long paragraphs', timestamp: '2026-03-25 14:30' },
      { id: 'm2', content: 'Project Alpha requires data from SEC filings only', timestamp: '2026-03-24 09:15' },
      { id: 'm3', content: 'Competitor analysis should include market cap data', timestamp: '2026-03-22 16:45' },
    ],
    taskRuns: [
      { id: 'r1', taskName: 'Market Research - Q4 Report', status: 'completed', startedAt: '2026-03-25 10:00', duration: '4m 12s' },
      { id: 'r2', taskName: 'Vendor Background Check', status: 'completed', startedAt: '2026-03-24 15:30', duration: '2m 45s' },
      { id: 'r3', taskName: 'Compliance Data Pull', status: 'failed', startedAt: '2026-03-23 11:00', duration: '1m 03s' },
    ],
  },
  {
    id: '4', name: 'Felix', type: 'agent', role: 'Content Writer',
    capabilities: ['Drafting', 'Editing', 'Tone Matching'],
    status: 'busy', emoji: '\u{1F913}', emojiCodepoints: '1f913', avatarSeed: 'Felix dir',
    prompt: 'You are a content writer. Match the tone and style of existing documents. Write clearly and concisely. Avoid jargon unless the audience expects it. Always produce a draft first, then refine.',
    memory: [
      { id: 'm4', content: 'Company style guide mandates Oxford commas', timestamp: '2026-03-25 11:00' },
      { id: 'm5', content: 'CEO prefers active voice in all comms', timestamp: '2026-03-23 08:30' },
    ],
    taskRuns: [
      { id: 'r4', taskName: 'Draft Q4 Summary Report', status: 'running', startedAt: '2026-03-26 09:15' },
      { id: 'r5', taskName: 'Rewrite Vendor Proposal', status: 'completed', startedAt: '2026-03-25 14:00', duration: '6m 30s' },
      { id: 'r6', taskName: 'Client Onboarding Email', status: 'completed', startedAt: '2026-03-24 10:45', duration: '1m 58s' },
    ],
  },
  {
    id: '5', name: 'Mira', type: 'agent', role: 'Quality Reviewer',
    capabilities: ['Proofreading', 'Fact Checking', 'Compliance'],
    status: 'idle', emoji: '\u{1F928}', emojiCodepoints: '1f928', avatarSeed: 'Mira head',
    prompt: 'You are a quality reviewer. Check all documents for factual accuracy, grammar, compliance with internal policies, and consistency. Flag issues with severity levels: critical, warning, suggestion.',
    memory: [
      { id: 'm6', content: 'Compliance team updated data retention policy on 2026-03-20', timestamp: '2026-03-21 09:00' },
      { id: 'm7', content: 'Legal requires all client-facing docs to include disclaimer v3.2', timestamp: '2026-03-19 14:20' },
    ],
    taskRuns: [
      { id: 'r7', taskName: 'Review Q4 Summary Report', status: 'completed', startedAt: '2026-03-25 16:00', duration: '3m 22s' },
      { id: 'r8', taskName: 'Audit Vendor Contracts', status: 'completed', startedAt: '2026-03-24 13:00', duration: '8m 15s' },
    ],
  },
]

export function isAgent(member: TeamMember | AgentMember): member is AgentMember {
  return member.type === 'agent'
}

export function getMemberById(id: string) {
  return TEAM.find((m) => m.id === id)
}
