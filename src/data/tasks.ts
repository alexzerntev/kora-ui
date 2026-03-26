export interface Task {
  id: string
  name: string
  description: string
  papers: string[]   // documents/instructions inside the folder
  color: string
}

export const TASKS: Task[] = [
  {
    id: 't1',
    name: 'Research Topic',
    description: 'Gather information from multiple sources and compile findings',
    papers: ['Research Brief', 'Source List', 'Findings Summary'],
    color: '#e0e7ff',
  },
  {
    id: 't2',
    name: 'Draft Report',
    description: 'Write a structured document based on gathered inputs',
    papers: ['Outline', 'First Draft', 'Style Guide Reference'],
    color: '#dbeafe',
  },
  {
    id: 't3',
    name: 'Review Document',
    description: 'Check for accuracy, compliance, and quality standards',
    papers: ['Review Checklist', 'Feedback Form', 'Compliance Matrix'],
    color: '#dcfce7',
  },
  {
    id: 't4',
    name: 'Stakeholder Approval',
    description: 'Route document for sign-off from decision makers',
    papers: ['Approval Form', 'Signature Sheet'],
    color: '#fef9c3',
  },
  {
    id: 't5',
    name: 'Data Analysis',
    description: 'Process and analyse datasets to extract insights',
    papers: ['Data Schema', 'Query Templates', 'Analysis Report'],
    color: '#fce7f3',
  },
]
