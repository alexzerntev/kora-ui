import { useMemo, useState, useCallback } from 'react'
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { OrgNode } from '../components/nodes/OrgNode'
import { EntityDetailModal, type EntityData } from '../components/EntityDetailModal'
import { useTeam, useRoles, useTasks, useAssignments } from '../providers/hooks'
import type { TeamMember, AgentMember } from '../providers/types'
import type { Role } from '../providers/types'
import type { Task } from '../providers/types'
import type { Assignment } from '../providers/types'
import { isAgent } from '../data/team'
import { optimizeNodeOrder, type Connection } from '../utils/orgLayout'
import { OrgHoverContext, type OrgHoverState } from '../contexts/OrgHoverContext'
import { FloatingHeader } from '../components/shared/FloatingHeader'

/* ------------------------------------------------------------------ */
/*  Group label node                                                   */
/* ------------------------------------------------------------------ */

function GroupLabelNode({ data }: { data: { label: string; width: number; height: number; color: string } }) {
  return (
    <div
      style={{
        width: data.width,
        height: data.height,
        background: data.color,
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.04)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '10px 14px',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-foreground-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {data.label}
      </div>
    </div>
  )
}

const nodeTypes = {
  orgNode: OrgNode,
  groupLabel: GroupLabelNode,
}

/* ------------------------------------------------------------------ */
/*  Layout constants                                                   */
/* ------------------------------------------------------------------ */

const CARD_W = 280
const CARD_H = 68
const COL_GAP = 200 // horizontal gap between columns
const ROW_GAP = 16 // vertical gap between cards in a column
const GROUP_PAD_X = 16 // horizontal padding inside group
const GROUP_PAD_TOP = 40 // space for group label at top
const GROUP_PAD_BOTTOM = 16 // padding at bottom of group
const GROUP_GAP = 40 // vertical gap between People and Agents groups

/* ------------------------------------------------------------------ */
/*  Build the horizontal org graph                                     */
/* ------------------------------------------------------------------ */

function buildGraph(
  team: (TeamMember | AgentMember)[],
  roles: Role[],
  tasks: Task[],
  assignments: Assignment[],
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // Separate people and agents
  const people = team.filter((m) => m.type === 'human')
  const agents = team.filter((m) => m.type === 'agent')

  // Build role -> task connections based on capabilities
  const roleToTasks = new Map<string, string[]>()
  for (const role of roles) {
    const allCaps = [...role.requiredCapabilities, ...role.optionalCapabilities]
    const connectedTaskIds: string[] = []
    for (const task of tasks) {
      if (allCaps.includes(task.name)) {
        connectedTaskIds.push(task.id)
      }
    }
    roleToTasks.set(role.id, connectedTaskIds)
  }

  // Build edge lists for the optimizer
  const memberToRoleEdges: Connection[] = assignments.map((a) => ({ source: a.memberId, target: a.roleId }))
  const roleToTaskEdges: Connection[] = []
  for (const role of roles) {
    for (const taskId of roleToTasks.get(role.id) ?? []) {
      roleToTaskEdges.push({ source: role.id, target: taskId })
    }
  }

  // Run barycenter optimization to minimize edge crossings
  const optimized = optimizeNodeOrder(
    people.map((m) => m.id),
    agents.map((m) => m.id),
    roles.map((r) => r.id),
    tasks.map((t) => t.id),
    memberToRoleEdges,
    roleToTaskEdges,
  )

  // Build lookup maps so we can retrieve full objects by id
  const peopleById = new Map(people.map((m) => [m.id, m]))
  const agentsById = new Map(agents.map((m) => [m.id, m]))
  const rolesById = new Map(roles.map((r) => [r.id, r]))
  const tasksById = new Map(tasks.map((t) => [t.id, t]))

  // Re-order arrays according to optimized ordering
  const orderedPeople = optimized.people.map((id) => peopleById.get(id)!).filter(Boolean)
  const orderedAgents = optimized.agents.map((id) => agentsById.get(id)!).filter(Boolean)
  const orderedRoles = optimized.roles.map((id) => rolesById.get(id)!).filter(Boolean)
  const orderedTasks = optimized.tasks.map((id) => tasksById.get(id)!).filter(Boolean)

  /* ── Column X positions ── */
  const col0X = 0 // People + Agents (stacked)
  const col1X = CARD_W + COL_GAP + GROUP_PAD_X * 2 // Roles
  const col2X = 2 * (CARD_W + COL_GAP + GROUP_PAD_X * 2) // Tasks

  /* ── Compute group dimensions ── */
  const groupWidth = CARD_W + GROUP_PAD_X * 2

  // People group
  const peopleContentH = orderedPeople.length * CARD_H + (orderedPeople.length - 1) * ROW_GAP
  const peopleGroupH = GROUP_PAD_TOP + peopleContentH + GROUP_PAD_BOTTOM

  // Agents group (positioned below people)
  const agentsContentH = orderedAgents.length * CARD_H + (orderedAgents.length - 1) * ROW_GAP
  const agentsGroupH = GROUP_PAD_TOP + agentsContentH + GROUP_PAD_BOTTOM
  const agentsGroupY = peopleGroupH + GROUP_GAP

  // Total col0 height
  const col0TotalH = agentsGroupY + agentsGroupH

  // Roles group
  const rolesContentH = orderedRoles.length * CARD_H + (orderedRoles.length - 1) * ROW_GAP
  const rolesGroupH = GROUP_PAD_TOP + rolesContentH + GROUP_PAD_BOTTOM

  // Tasks group
  const tasksContentH = orderedTasks.length * CARD_H + (orderedTasks.length - 1) * ROW_GAP
  const tasksGroupH = GROUP_PAD_TOP + tasksContentH + GROUP_PAD_BOTTOM

  // Center all columns vertically based on max total height
  const maxHeight = Math.max(col0TotalH, rolesGroupH, tasksGroupH)

  const col0StartY = (maxHeight - col0TotalH) / 2
  const col1StartY = (maxHeight - rolesGroupH) / 2
  const col2StartY = (maxHeight - tasksGroupH) / 2

  /* ── Group background nodes ── */
  nodes.push({
    id: 'group-people',
    type: 'groupLabel',
    position: { x: col0X, y: col0StartY },
    data: { label: 'People', width: groupWidth, height: peopleGroupH, color: 'rgba(124, 58, 237, 0.03)' },
    selectable: false,
    draggable: false,
    zIndex: -1,
  })

  nodes.push({
    id: 'group-agents',
    type: 'groupLabel',
    position: { x: col0X, y: col0StartY + agentsGroupY },
    data: { label: 'Agents', width: groupWidth, height: agentsGroupH, color: 'rgba(8, 145, 178, 0.03)' },
    selectable: false,
    draggable: false,
    zIndex: -1,
  })

  nodes.push({
    id: 'group-roles',
    type: 'groupLabel',
    position: { x: col1X, y: col1StartY },
    data: { label: 'Roles', width: groupWidth, height: rolesGroupH, color: 'rgba(29, 78, 216, 0.03)' },
    selectable: false,
    draggable: false,
    zIndex: -1,
  })

  nodes.push({
    id: 'group-tasks',
    type: 'groupLabel',
    position: { x: col2X, y: col2StartY },
    data: { label: 'Tasks', width: groupWidth, height: tasksGroupH, color: 'rgba(22, 163, 106, 0.03)' },
    selectable: false,
    draggable: false,
    zIndex: -1,
  })

  /* ── People nodes (column 0, top group) ── */
  orderedPeople.forEach((m, i) => {
    nodes.push({
      id: `member-${m.id}`,
      type: 'orgNode',
      position: {
        x: col0X + GROUP_PAD_X,
        y: col0StartY + GROUP_PAD_TOP + i * (CARD_H + ROW_GAP),
      },
      data: {
        name: m.name,
        type: 'person' as const,
        capabilities: m.capabilities,
      },
    })
  })

  /* ── Agent nodes (column 0, bottom group) ── */
  orderedAgents.forEach((m, i) => {
    nodes.push({
      id: `member-${m.id}`,
      type: 'orgNode',
      position: {
        x: col0X + GROUP_PAD_X,
        y: col0StartY + agentsGroupY + GROUP_PAD_TOP + i * (CARD_H + ROW_GAP),
      },
      data: {
        name: m.name,
        type: 'agent' as const,
        avatar: (m as AgentMember).avatarSeed,
        capabilities: m.capabilities,
      },
    })
  })

  /* ── Role nodes (column 1) ── */
  orderedRoles.forEach((role, i) => {
    nodes.push({
      id: `role-${role.id}`,
      type: 'orgNode',
      position: {
        x: col1X + GROUP_PAD_X,
        y: col1StartY + GROUP_PAD_TOP + i * (CARD_H + ROW_GAP),
      },
      data: {
        name: role.title,
        type: 'role' as const,
        capabilities: role.requiredCapabilities,
      },
    })
  })

  /* ── Task nodes (column 2) ── */
  orderedTasks.forEach((task, i) => {
    nodes.push({
      id: `task-${task.id}`,
      type: 'orgNode',
      position: {
        x: col2X + GROUP_PAD_X,
        y: col2StartY + GROUP_PAD_TOP + i * (CARD_H + ROW_GAP),
      },
      data: {
        name: task.name,
        type: 'task' as const,
        capabilities: task.refs,
      },
    })
  })

  /* ── Edges: Members -> Roles ── */
  for (const a of assignments) {
    edges.push({
      id: `e-member-role-${a.memberId}-${a.roleId}`,
      source: `member-${a.memberId}`,
      target: `role-${a.roleId}`,
      type: 'step',
      style: { strokeDasharray: '5 3' },
    })
  }

  /* ── Edges: Roles -> Tasks ── */
  for (const role of orderedRoles) {
    const taskIds = roleToTasks.get(role.id) ?? []
    for (const taskId of taskIds) {
      edges.push({
        id: `e-role-task-${role.id}-${taskId}`,
        source: `role-${role.id}`,
        target: `task-${taskId}`,
        type: 'step',
        style: { strokeDasharray: '5 3' },
      })
    }
  }

  return { nodes, edges }
}

/* ------------------------------------------------------------------ */
/*  Organization Page                                                  */
/* ------------------------------------------------------------------ */

export function Organization() {
  const { data: team } = useTeam()
  const { data: roles } = useRoles()
  const { data: tasks } = useTasks()
  const { data: assignments } = useAssignments()

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<EntityData | null>(null)

  const { nodes: baseNodes, edges: baseEdges } = useMemo(() => {
    if (!team || !roles || !tasks || !assignments) {
      return { nodes: [], edges: [] }
    }
    return buildGraph(team, roles, tasks, assignments)
  }, [team, roles, tasks, assignments])

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.id.startsWith('group-')) return
    setHoveredNodeId(node.id)
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
  }, [])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.id.startsWith('group-')) return
      if (!team || !roles || !tasks) return

      // Parse the node ID to find the entity
      if (node.id.startsWith('member-')) {
        const memberId = node.id.replace('member-', '')
        const member = team.find((m) => m.id === memberId)
        if (member) {
          if (isAgent(member)) {
            setSelectedEntity({ kind: 'agent', data: member })
          } else {
            setSelectedEntity({ kind: 'person', data: member })
          }
        }
      } else if (node.id.startsWith('role-')) {
        const roleId = node.id.replace('role-', '')
        const role = roles.find((r) => r.id === roleId)
        if (role) {
          setSelectedEntity({ kind: 'role', data: role })
        }
      } else if (node.id.startsWith('task-')) {
        const taskId = node.id.replace('task-', '')
        const task = tasks.find((t) => t.id === taskId)
        if (task) {
          setSelectedEntity({ kind: 'task', data: task })
        }
      }
    },
    [team, roles, tasks],
  )

  // Directional 2-hop highlight: follow edges forward AND backward from hovered node,
  // but only along the actual connection chain — not pulling in unrelated branches.
  const { connectedNodeIds, connectedEdgeIds } = useMemo(() => {
    const nodeIds = new Set<string>()
    const edgeIds = new Set<string>()
    if (!hoveredNodeId) return { connectedNodeIds: nodeIds, connectedEdgeIds: edgeIds }

    nodeIds.add(hoveredNodeId)

    // 1st hop: direct connections (both directions)
    const forwardNodes = new Set<string>() // nodes reached going source→target
    const backwardNodes = new Set<string>() // nodes reached going target→source

    baseEdges.forEach((e) => {
      if (e.source === hoveredNodeId) {
        edgeIds.add(e.id)
        nodeIds.add(e.target)
        forwardNodes.add(e.target)
      }
      if (e.target === hoveredNodeId) {
        edgeIds.add(e.id)
        nodeIds.add(e.source)
        backwardNodes.add(e.source)
      }
    })

    // 2nd hop forward: from nodes reached forward, continue forward
    baseEdges.forEach((e) => {
      if (forwardNodes.has(e.source)) {
        edgeIds.add(e.id)
        nodeIds.add(e.target)
      }
    })

    // 2nd hop backward: from nodes reached backward, continue backward
    baseEdges.forEach((e) => {
      if (backwardNodes.has(e.target)) {
        edgeIds.add(e.id)
        nodeIds.add(e.source)
      }
    })

    return { connectedNodeIds: nodeIds, connectedEdgeIds: edgeIds }
  }, [baseEdges, hoveredNodeId])

  // Edges: apply className for dimming instead of creating new style objects.
  // Edge re-renders don't cause the blink loop (no mouse interaction on edges),
  // but we use className + CSS for consistency and performance.
  const edges = useMemo(() => {
    if (!hoveredNodeId) return baseEdges
    return baseEdges.map((e) => ({
      ...e,
      className: connectedEdgeIds.has(e.id) ? 'org-edge-highlight' : 'org-edge-dimmed',
    }))
  }, [baseEdges, hoveredNodeId, connectedEdgeIds])

  const hoverState = useMemo<OrgHoverState>(
    () => ({ hoveredNodeId, connectedNodeIds }),
    [hoveredNodeId, connectedNodeIds],
  )

  if (!team || !roles || !tasks || !assignments) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          color: 'var(--color-foreground-muted)',
          fontSize: 14,
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        position: 'relative',
      }}
    >
      <FloatingHeader title="Organization" subtitle="People, agents, roles, and task assignments" />

      {/* ReactFlow canvas */}
      <div style={{ flex: 1, overflow: 'hidden', background: '#fff' }}>
        <OrgHoverContext.Provider value={hoverState}>
          <ReactFlow
            nodes={baseNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable
            nodesConnectable={false}
            elementsSelectable
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodeClick={onNodeClick}
          >
            <Background gap={32} size={1} color="#e8e8e8" />
            <Controls
              showInteractive={false}
              position="bottom-right"
              style={{
                borderRadius: 12,
                border: '1px solid var(--color-border-light)',
                overflow: 'hidden',
                background: '#fff',
              }}
            />
          </ReactFlow>
        </OrgHoverContext.Provider>
      </div>

      {/* Entity detail modal */}
      {selectedEntity && <EntityDetailModal entity={selectedEntity} onClose={() => setSelectedEntity(null)} />}
    </div>
  )
}
