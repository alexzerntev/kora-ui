import { useMemo, useState, useCallback } from 'react'
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { OrgNode } from '../components/nodes/OrgNode'
import { useTeam, useRoles, useTasks, useAssignments } from '../providers/hooks'
import type { TeamMember, AgentMember } from '../providers/types'
import type { Role } from '../providers/types'
import type { Task } from '../providers/types'
import type { Assignment } from '../providers/types'

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
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontFamily: "'DM Sans', system-ui, sans-serif",
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

const CARD_W = 220
const CARD_H = 62 // approximate height of OrgNode
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

  // Build assignment lookups
  const memberToRoles = new Map<string, string[]>()
  const roleToMembers = new Map<string, string[]>()
  const roleToTasks = new Map<string, string[]>()

  for (const a of assignments) {
    if (!memberToRoles.has(a.memberId)) memberToRoles.set(a.memberId, [])
    memberToRoles.get(a.memberId)!.push(a.roleId)
    if (!roleToMembers.has(a.roleId)) roleToMembers.set(a.roleId, [])
    roleToMembers.get(a.roleId)!.push(a.memberId)
  }

  // Build role -> task connections based on capabilities
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

  // Order: all members (people first, agents second) for index map
  const membersOrdered = [...people, ...agents]
  const memberIndexMap = new Map<string, number>()
  membersOrdered.forEach((m, i) => memberIndexMap.set(m.id, i))

  const orderedRoles = [...roles].sort((a, b) => {
    const aMembers = roleToMembers.get(a.id) ?? []
    const bMembers = roleToMembers.get(b.id) ?? []
    const aAvg =
      aMembers.length > 0 ? aMembers.reduce((s, id) => s + (memberIndexMap.get(id) ?? 0), 0) / aMembers.length : 0
    const bAvg =
      bMembers.length > 0 ? bMembers.reduce((s, id) => s + (memberIndexMap.get(id) ?? 0), 0) / bMembers.length : 0
    return aAvg - bAvg
  })

  const roleIndexMap = new Map<string, number>()
  orderedRoles.forEach((r, i) => roleIndexMap.set(r.id, i))

  const orderedTasks = [...tasks].sort((a, b) => {
    const aRoles = orderedRoles.filter((r) => {
      const taskIds = roleToTasks.get(r.id) ?? []
      return taskIds.includes(a.id)
    })
    const bRoles = orderedRoles.filter((r) => {
      const taskIds = roleToTasks.get(r.id) ?? []
      return taskIds.includes(b.id)
    })
    const aAvg = aRoles.length > 0 ? aRoles.reduce((s, r) => s + (roleIndexMap.get(r.id) ?? 0), 0) / aRoles.length : 0
    const bAvg = bRoles.length > 0 ? bRoles.reduce((s, r) => s + (roleIndexMap.get(r.id) ?? 0), 0) / bRoles.length : 0
    return aAvg - bAvg
  })

  /* ── Column X positions ── */
  const col0X = 0 // People + Agents (stacked)
  const col1X = CARD_W + COL_GAP + GROUP_PAD_X * 2 // Roles
  const col2X = 2 * (CARD_W + COL_GAP + GROUP_PAD_X * 2) // Tasks

  /* ── Compute group dimensions ── */
  const groupWidth = CARD_W + GROUP_PAD_X * 2

  // People group
  const peopleContentH = people.length * CARD_H + (people.length - 1) * ROW_GAP
  const peopleGroupH = GROUP_PAD_TOP + peopleContentH + GROUP_PAD_BOTTOM

  // Agents group (positioned below people)
  const agentsContentH = agents.length * CARD_H + (agents.length - 1) * ROW_GAP
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
  people.forEach((m, i) => {
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
  agents.forEach((m, i) => {
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
        avatar: m.avatarSeed,
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
      type: 'default',
      style: { stroke: '#d1d5db', strokeWidth: 1.5 },
      data: { activeColor: '#7c3aed' },
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
        type: 'default',
        style: { stroke: '#d1d5db', strokeWidth: 1.5 },
        data: { activeColor: '#1d4ed8' },
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

  const { nodes, edges: baseEdges } = useMemo(() => {
    if (!team || !roles || !tasks || !assignments) {
      return { nodes: [], edges: [] }
    }
    return buildGraph(team, roles, tasks, assignments)
  }, [team, roles, tasks, assignments])

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id)
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
  }, [])

  // Highlight edges connected to hovered node (2-hop for full chain)
  const edges = useMemo(() => {
    if (!hoveredNodeId) return baseEdges

    const connectedEdgeIds = new Set<string>()
    const connectedNodeIds = new Set<string>([hoveredNodeId])

    // Direct connections
    baseEdges.forEach((e) => {
      if (e.source === hoveredNodeId || e.target === hoveredNodeId) {
        connectedEdgeIds.add(e.id)
        connectedNodeIds.add(e.source)
        connectedNodeIds.add(e.target)
      }
    })

    // 2nd hop: edges connected to the connected nodes
    baseEdges.forEach((e) => {
      if (connectedNodeIds.has(e.source) || connectedNodeIds.has(e.target)) {
        connectedEdgeIds.add(e.id)
      }
    })

    return baseEdges.map((e) => ({
      ...e,
      style: connectedEdgeIds.has(e.id)
        ? {
            stroke: (e.data as { activeColor?: string })?.activeColor ?? '#7c3aed',
            strokeWidth: 2.5,
          }
        : { stroke: '#efefef', strokeWidth: 1 },
    }))
  }, [baseEdges, hoveredNodeId])

  if (!team || !roles || !tasks || !assignments) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          color: '#6b7280',
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
      {/* Floating header */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(12px)',
          borderRadius: 14,
          padding: '12px 20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)' }}>Organization</h1>
        <p style={{ fontSize: 12, color: 'var(--color-ink-secondary)' }}>People, agents, roles, and task assignments</p>
      </div>

      {/* ReactFlow canvas */}
      <div style={{ flex: 1, overflow: 'hidden', background: '#fff' }}>
        <ReactFlow
          nodes={nodes}
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
      </div>
    </div>
  )
}
