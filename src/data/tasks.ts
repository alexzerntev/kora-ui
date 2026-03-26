export interface Task {
  id: string
  name: string
  description: string
  refs: string[]
}

export const TASKS: Task[] = [
  {
    id: 't1',
    name: 'Research Topic',
    description: 'Gather information from multiple sources and compile findings',
    refs: ['Google Search API', 'Notion'],
  },
  {
    id: 't2',
    name: 'Draft Report',
    description: 'Write a structured document based on gathered inputs',
    refs: ['Google Docs', 'Style Guide v2.1'],
  },
  {
    id: 't3',
    name: 'Review Document',
    description: 'Check for accuracy, compliance, and quality standards',
    refs: ['Compliance Matrix.xlsx', 'Jira'],
  },
  {
    id: 't4',
    name: 'Stakeholder Approval',
    description: 'Route document for sign-off from decision makers',
    refs: ['Gmail', 'DocuSign'],
  },
  {
    id: 't5',
    name: 'Data Analysis',
    description: 'Process and analyse datasets to extract insights',
    refs: ['BigQuery', 'Sheets connector'],
  },
]
