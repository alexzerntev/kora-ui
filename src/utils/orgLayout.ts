/**
 * Barycenter heuristic for minimizing edge crossings in a layered graph.
 *
 * The Organization chart has three logical columns:
 *   Column 0 – People (top) + Agents (bottom)
 *   Column 1 – Roles
 *   Column 2 – Tasks
 *
 * Edges: members->roles, roles->tasks.
 *
 * The algorithm:
 *  1. Assign initial indices to column 0 (people first, agents second).
 *  2. For each node in column 1, compute the average index (barycenter) of
 *     its neighbours in column 0, then sort column 1 by that value.
 *  3. For each node in column 2, compute the barycenter of its neighbours
 *     in column 1 (using updated indices), then sort column 2.
 *  4. Iterate: re-order column 0 based on column 1, then repeat 2-3.
 *     People and agents are re-ordered independently within their own sub-groups
 *     so the two groups never intermingle.
 */

export interface Connection {
  source: string
  target: string
}

export interface OptimizedOrder {
  people: string[]
  agents: string[]
  roles: string[]
  tasks: string[]
}

/**
 * Given the initial ordering of people, agents, roles, and tasks plus all
 * edges between them, return re-ordered arrays that minimise edge crossings.
 */
export function optimizeNodeOrder(
  people: string[],
  agents: string[],
  roles: string[],
  tasks: string[],
  memberToRoleEdges: Connection[],
  roleToTaskEdges: Connection[],
): OptimizedOrder {
  // Work with mutable copies
  let orderedPeople = [...people]
  let orderedAgents = [...agents]
  let orderedRoles = [...roles]
  let orderedTasks = [...tasks]

  // Build adjacency maps (both directions)
  const memberNeighbours = new Map<string, string[]>() // member -> roles
  const roleMemberNeighbours = new Map<string, string[]>() // role -> members
  const roleTaskNeighbours = new Map<string, string[]>() // role -> tasks
  const taskNeighbours = new Map<string, string[]>() // task -> roles

  for (const e of memberToRoleEdges) {
    if (!memberNeighbours.has(e.source)) memberNeighbours.set(e.source, [])
    memberNeighbours.get(e.source)!.push(e.target)
    if (!roleMemberNeighbours.has(e.target)) roleMemberNeighbours.set(e.target, [])
    roleMemberNeighbours.get(e.target)!.push(e.source)
  }

  for (const e of roleToTaskEdges) {
    if (!roleTaskNeighbours.has(e.source)) roleTaskNeighbours.set(e.source, [])
    roleTaskNeighbours.get(e.source)!.push(e.target)
    if (!taskNeighbours.has(e.target)) taskNeighbours.set(e.target, [])
    taskNeighbours.get(e.target)!.push(e.source)
  }

  // Helper: build an index map from an ordered array (or concatenation)
  function indexMap(arr: string[]): Map<string, number> {
    const m = new Map<string, number>()
    arr.forEach((id, i) => m.set(id, i))
    return m
  }

  // Helper: compute barycenter of a node's neighbours given a position map.
  // Returns Infinity for nodes with no neighbours (they stay at end).
  function barycenter(nodeId: string, neighbours: Map<string, string[]>, positions: Map<string, number>): number {
    const nbrs = neighbours.get(nodeId)
    if (!nbrs || nbrs.length === 0) return Infinity
    const sum = nbrs.reduce((acc, nId) => acc + (positions.get(nId) ?? 0), 0)
    return sum / nbrs.length
  }

  // Helper: stable sort an array by a numeric key (preserve original order for ties)
  function stableSort(arr: string[], key: (id: string) => number): string[] {
    const indexed = arr.map((id, i) => ({ id, val: key(id), orig: i }))
    indexed.sort((a, b) => {
      const d = a.val - b.val
      return d !== 0 ? d : a.orig - b.orig
    })
    return indexed.map((x) => x.id)
  }

  const ITERATIONS = 3

  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Column 0 positions: people then agents, continuous indexing
    const col0 = [...orderedPeople, ...orderedAgents]
    const col0Pos = indexMap(col0)

    // --- Order column 1 (roles) by barycenter of connected members ---
    orderedRoles = stableSort(orderedRoles, (roleId) => barycenter(roleId, roleMemberNeighbours, col0Pos))

    // --- Order column 2 (tasks) by barycenter of connected roles ---
    const col1Pos = indexMap(orderedRoles)
    orderedTasks = stableSort(orderedTasks, (taskId) => barycenter(taskId, taskNeighbours, col1Pos))

    // --- Backward pass: re-order column 0 based on column 1 positions ---
    const col1PosUpdated = indexMap(orderedRoles)
    orderedPeople = stableSort(orderedPeople, (memberId) => barycenter(memberId, memberNeighbours, col1PosUpdated))
    orderedAgents = stableSort(orderedAgents, (memberId) => barycenter(memberId, memberNeighbours, col1PosUpdated))
  }

  return {
    people: orderedPeople,
    agents: orderedAgents,
    roles: orderedRoles,
    tasks: orderedTasks,
  }
}
