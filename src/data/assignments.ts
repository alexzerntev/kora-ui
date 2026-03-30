/**
 * Static role → member assignments.
 * Maps role IDs to assigned member IDs (from team.ts).
 */
export interface Assignment {
  roleId: string
  memberId: string
}

export const ASSIGNMENTS: Assignment[] = [
  { roleId: 'r1', memberId: '3' }, // Research Specialist → Nora (agent)
  { roleId: 'r2', memberId: '4' }, // Content Writer → Felix (agent)
  { roleId: 'r3', memberId: '5' }, // Quality Reviewer → Mira (agent)
  { roleId: 'r4', memberId: '1' }, // Stakeholder Approver → Alice (human)
  { roleId: 'r5', memberId: '2' }, // Project Lead → Bob (human)
]

export function getAssignmentsForRole(roleId: string): string[] {
  return ASSIGNMENTS.filter((a) => a.roleId === roleId).map((a) => a.memberId)
}

export function getRoleForMember(memberId: string): string | undefined {
  return ASSIGNMENTS.find((a) => a.memberId === memberId)?.roleId
}
