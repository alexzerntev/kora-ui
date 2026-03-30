export type { TeamMember, AgentMember, MemoryEntry, TaskRun } from '../data/team'
export type { Role } from '../data/roles'
export type { Task } from '../data/tasks'
export type { FlowNodeKind, WorkflowNode, Workflow } from '../data/workflows'
export type { Assignment } from '../data/assignments'
export type {
  Project,
  ExecutionLimits,
  MachineExecutionDefaults,
  SandboxNetwork,
  SandboxEgressRule,
} from '../data/project'

export { TYPE_COLORS } from '../data/team'

import type { TeamMember, AgentMember } from '../data/team'
import type { Role } from '../data/roles'
import type { Task } from '../data/tasks'
import type { Workflow } from '../data/workflows'
import type { Assignment } from '../data/assignments'
import type { Project } from '../data/project'

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
}
