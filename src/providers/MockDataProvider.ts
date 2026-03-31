import type { DataProvider, DataEvent } from './types'
import { TEAM, getMemberById } from '../data/team'
import { ROLES, getRoleById } from '../data/roles'
import { TASKS } from '../data/tasks'
import { WORKFLOWS } from '../data/workflows'
import { ASSIGNMENTS } from '../data/assignments'
import { PROJECT } from '../data/project'
import { PROCESS_RUNS, PENDING_ACTIONS, RUN_LOGS } from '../data/runs'
import { ACTIVITY_FEED } from '../data/activity'
import { DRAFTS, RELEASES } from '../data/releases'

const EVENT_TEMPLATES: (() => DataEvent)[] = [
  () => ({
    type: 'process.completed' as const,
    processId: 'run-1',
    timestamp: new Date(),
  }),
  () => ({
    type: 'task.completed' as const,
    taskId: 'pa-2',
    assignee: 'Bob Martinez',
    timestamp: new Date(),
  }),
  () => ({
    type: 'task.assigned' as const,
    taskId: 'pa-3',
    assignee: 'Alice Chen',
    timestamp: new Date(),
  }),
  () => ({
    type: 'activity' as const,
    text: 'Nora completed lead scoring for Acme Corp',
    timestamp: new Date(),
  }),
  () => ({
    type: 'activity' as const,
    text: 'Felix finished drafting the Q4 executive summary',
    timestamp: new Date(),
  }),
  () => ({
    type: 'process.started' as const,
    processId: 'w1',
    timestamp: new Date(),
  }),
  () => ({
    type: 'process.failed' as const,
    processId: 'run-5',
    error: 'CRM API rate limit exceeded',
    timestamp: new Date(),
  }),
  () => ({
    type: 'task.completed' as const,
    taskId: 'pa-1',
    assignee: 'Alice Chen',
    timestamp: new Date(),
  }),
  () => ({
    type: 'activity' as const,
    text: 'Mira flagged 2 compliance issues in vendor agreement',
    timestamp: new Date(),
  }),
  () => ({
    type: 'activity' as const,
    text: 'Client Onboarding progressed to final review stage',
    timestamp: new Date(),
  }),
]

export class MockDataProvider implements DataProvider {
  async getWorkflows() {
    return WORKFLOWS
  }

  async getWorkflow(id: string) {
    return WORKFLOWS.find((w) => w.id === id)
  }

  async getTeam() {
    return TEAM
  }

  async getTeamMember(id: string) {
    return getMemberById(id)
  }

  async getRoles() {
    return ROLES
  }

  async getRole(id: string) {
    return getRoleById(id)
  }

  async getTasks() {
    return TASKS
  }

  async getAssignments() {
    return ASSIGNMENTS
  }

  async getProject() {
    return PROJECT
  }

  async getProcessRuns() {
    return PROCESS_RUNS
  }

  async getAllRuns() {
    return PROCESS_RUNS
  }

  async getRunsForWorkflow(workflowId: string) {
    return PROCESS_RUNS.filter((r) => r.workflowId === workflowId)
  }

  async getRun(runId: string) {
    return PROCESS_RUNS.find((r) => r.id === runId)
  }

  async getRunLogs(runId: string) {
    return RUN_LOGS[runId] ?? []
  }

  async getPendingActions() {
    return PENDING_ACTIONS
  }

  async getActivityFeed() {
    return ACTIVITY_FEED
  }

  async runProcess(id: string, args?: Record<string, string>) {
    console.log(`[MockDataProvider] runProcess called`, { id, args })
  }

  async getDrafts() {
    return DRAFTS
  }

  async getReleases() {
    return RELEASES
  }

  async publishDraft(draftId: string) {
    console.log(`[MockDataProvider] publishDraft called`, { draftId })
  }

  async discardDraft(draftId: string) {
    console.log(`[MockDataProvider] discardDraft called`, { draftId })
  }

  async restoreRelease(releaseId: string) {
    console.log(`[MockDataProvider] restoreRelease called`, { releaseId })
  }

  subscribe(callback: (event: DataEvent) => void): () => void {
    let timer: ReturnType<typeof setTimeout> | null = null

    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000 // 8-15 seconds
      timer = setTimeout(() => {
        const idx = Math.floor(Math.random() * EVENT_TEMPLATES.length)
        callback(EVENT_TEMPLATES[idx]())
        scheduleNext()
      }, delay)
    }

    scheduleNext()

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
    }
  }
}
