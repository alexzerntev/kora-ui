export type { TeamMember, AgentMember, MemoryEntry, TaskRun } from '../data/team'
export type { Role } from '../data/roles'
export type { Task } from '../data/tasks'
export type { FlowNodeKind, WorkflowNode, Workflow, WorkflowInputField } from '../data/workflows'
export type { Assignment } from '../data/assignments'
export type {
  Project,
  ExecutionLimits,
  MachineExecutionDefaults,
  SandboxNetwork,
  SandboxEgressRule,
} from '../data/project'
export type {
  ProcessRun,
  RunStatus,
  NodeRunState,
  PendingAction,
  PendingActionType,
  RunLogEntry,
  RunLogEntryType,
} from '../data/runs'
export type { ActivityEntry } from '../data/activity'
export type { Draft, DraftChange, Release, ReleaseChange } from '../data/releases'
export type { Decision, Skill, Connector, Operation, McpServer, Template } from '../data/admin'

export { TYPE_COLORS } from '../data/team'

import type { TeamMember, AgentMember } from '../data/team'
import type { Role } from '../data/roles'
import type { Task } from '../data/tasks'
import type { Workflow } from '../data/workflows'
import type { Assignment } from '../data/assignments'
import type { Project } from '../data/project'
import type { ProcessRun, PendingAction, RunLogEntry } from '../data/runs'
import type { ActivityEntry } from '../data/activity'
import type { Draft, Release } from '../data/releases'
import type { Decision, Skill, Connector, Operation, McpServer, Template } from '../data/admin'

/** Real-time events emitted by the data provider */
export type DataEvent =
  | { type: 'process.started'; processId: string; timestamp: Date }
  | { type: 'process.completed'; processId: string; timestamp: Date }
  | { type: 'process.failed'; processId: string; error: string; timestamp: Date }
  | { type: 'task.assigned'; taskId: string; assignee: string; timestamp: Date }
  | { type: 'task.completed'; taskId: string; assignee: string; timestamp: Date }
  | { type: 'activity'; text: string; timestamp: Date }

export interface DataProvider {
  /** List all workflows/processes */
  getWorkflows(): Promise<Workflow[]>

  /** Get a single workflow by ID */
  getWorkflow(id: string): Promise<Workflow | undefined>

  /** List all team members (people + agents) */
  getTeam(): Promise<(TeamMember | AgentMember)[]>

  /** Get a single team member by ID */
  getTeamMember(id: string): Promise<(TeamMember | AgentMember) | undefined>

  /** List all roles */
  getRoles(): Promise<Role[]>

  /** Get a single role by ID */
  getRole(id: string): Promise<Role | undefined>

  /** List all tasks/capabilities */
  getTasks(): Promise<Task[]>

  /** List all role-to-member assignments */
  getAssignments(): Promise<Assignment[]>

  /** Get project settings */
  getProject(): Promise<Project>

  /** List active process runs with status */
  getProcessRuns(): Promise<ProcessRun[]>

  /** List ALL process runs across all workflows */
  getAllRuns(): Promise<ProcessRun[]>

  /** List process runs for a specific workflow */
  getRunsForWorkflow(workflowId: string): Promise<ProcessRun[]>

  /** Get a single run by ID */
  getRun(runId: string): Promise<ProcessRun | undefined>

  /** Get audit log entries for a run */
  getRunLogs(runId: string): Promise<RunLogEntry[]>

  /** List pending actions requiring human input */
  getPendingActions(): Promise<PendingAction[]>

  /** Get recent activity feed entries */
  getActivityFeed(): Promise<ActivityEntry[]>

  /** Run a process with optional input arguments */
  runProcess(id: string, args?: Record<string, string>): Promise<void>

  /** List all active drafts */
  getDrafts(): Promise<Draft[]>

  /** List all releases */
  getReleases(): Promise<Release[]>

  /** Publish a draft (promotes it to a release) */
  publishDraft(draftId: string): Promise<void>

  /** Discard a draft */
  discardDraft(draftId: string): Promise<void>

  /** Restore a previous release as active */
  restoreRelease(releaseId: string): Promise<void>

  /** List all decisions */
  getDecisions(): Promise<Decision[]>

  /** List all skills */
  getSkills(): Promise<Skill[]>

  /** List all connectors */
  getConnectors(): Promise<Connector[]>

  /** List all operations */
  getOperations(): Promise<Operation[]>

  /** List all MCP servers */
  getMcpServers(): Promise<McpServer[]>

  /** List all templates */
  getTemplates(): Promise<Template[]>

  /** Subscribe to real-time events — returns an unsubscribe function */
  subscribe(callback: (event: DataEvent) => void): () => void
}
