import type { DataProvider } from './types'
import { TEAM, getMemberById } from '../data/team'
import { ROLES, getRoleById } from '../data/roles'
import { TASKS } from '../data/tasks'
import { WORKFLOWS } from '../data/workflows'
import { ASSIGNMENTS } from '../data/assignments'
import { PROJECT } from '../data/project'

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
}
