export interface Role {
  id: string
  name: string
  title: string
  team?: string
  aiEligible: boolean
  requiredCapabilities: string[]
  optionalCapabilities: string[]
  reportsTo?: string
  isDraft?: boolean
}

export const ROLES: Role[] = [
  {
    id: 'r1',
    name: 'researcher',
    title: 'Research Specialist',
    team: 'Operations',
    aiEligible: true,
    requiredCapabilities: ['Research Topic', 'Data Analysis'],
    optionalCapabilities: [],
    reportsTo: 'r5',
  },
  {
    id: 'r2',
    name: 'content-writer',
    title: 'Content Writer',
    team: 'Operations',
    aiEligible: true,
    requiredCapabilities: ['Draft Report'],
    optionalCapabilities: ['Research Topic'],
    reportsTo: 'r5',
  },
  {
    id: 'r3',
    name: 'reviewer',
    title: 'Quality Reviewer',
    team: 'Operations',
    aiEligible: true,
    requiredCapabilities: ['Review Document'],
    optionalCapabilities: [],
    reportsTo: 'r5',
  },
  {
    id: 'r4',
    name: 'approver',
    title: 'Stakeholder Approver',
    team: 'Management',
    aiEligible: false,
    requiredCapabilities: ['Stakeholder Approval'],
    optionalCapabilities: [],
    reportsTo: undefined,
  },
  {
    id: 'r5',
    name: 'project-lead',
    title: 'Project Lead',
    team: 'Management',
    aiEligible: false,
    requiredCapabilities: ['Stakeholder Approval', 'Review Document'],
    optionalCapabilities: ['Data Analysis'],
    reportsTo: undefined,
  },
  {
    id: 'r6',
    name: 'qa-reviewer',
    title: 'QA Reviewer',
    team: 'Operations',
    aiEligible: true,
    requiredCapabilities: ['Testing', 'Bug Reporting'],
    optionalCapabilities: [],
    reportsTo: 'r5',
    isDraft: true,
  },
]

export function getRoleById(id: string) {
  return ROLES.find((r) => r.id === id)
}
