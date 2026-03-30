import { useMemo, useState, useCallback } from 'react'
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { OrgNode } from '../components/nodes/OrgNode'
import { useTeam, useRoles, useTasks, useAssignments } from '../providers/hooks'
import type { TeamMember, AgentMember } from '../providers/types'
import type { Role } from '../providers/types'
import type { Task } from '../providers/types'
import type { Assignment } from '../providers/types'

const nodeTypes = {
  orgNode: OrgNode,
}

/* ------------------------------------------------------------------ */
/*  Layout constants                                                   */
/* ------------------------------------------------------------------ */

const CARD_W = 220
const CARD_H = 62 // approximate height of OrgNode
const COL_GAP = 200 // horizontal gap between columns
const ROW_GAP = 16 // vertical gap between cards in a column

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

  // Column 0: People & Agents (combined, people first)
  const people = team.filter((m) => m.type === 'human')
  const agents = team.filter((m) => m.type === 'agent')
  const membersOrdered = [...people, ...agents]

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

  // Build role → task connections based on capabilities
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

  // Order roles to minimize edge crossings with members
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

  // Order tasks to minimize edge crossings with roles
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

  // Compute column heights to center vertically
  const col0Count = membersOrdered.length
  const col1Count = orderedRoles.length
  const col2Count = orderedTasks.length

  const col0Height = col0Count * CARD_H + (col0Count - 1) * ROW_GAP
  const col1Height = col1Count * CARD_H + (col1Count - 1) * ROW_GAP
  const col2Height = col2Count * CARD_H + (col2Count - 1) * ROW_GAP

  const maxHeight = Math.max(col0Height, col1Height, col2Height)

  const col0StartY = (maxHeight - col0Height) / 2
  const col1StartY = (maxHeight - col1Height) / 2
  const col2StartY = (maxHeight - col2Height) / 2

  const col0X = 0
  const col1X = CARD_W + COL_GAP
  const col2X = 2 * (CARD_W + COL_GAP)

  // Column 0: Members
  membersOrdered.forEach((m, i) => {
    const nodeType: 'person' | 'agent' = m.type === 'human' ? 'person' : 'agent'
    nodes.push({
      id: `member-${m.id}`,
      type: 'orgNode',
      position: { x: col0X, y: col0StartY + i * (CARD_H + ROW_GAP) },
      data: {
        name: m.name,
        type: nodeType,
        avatar: m.avatarSeed,
        capabilities: m.capabilities,
      },
    })
  })

  // Column 1: Roles
  orderedRoles.forEach((role, i) => {
    nodes.push({
      id: `role-${role.id}`,
      type: 'orgNode',
      position: { x: col1X, y: col1StartY + i * (CARD_H + ROW_GAP) },
      data: {
        name: role.title,
        type: 'role' as const,
        capabilities: role.requiredCapabilities,
      },
    })
  })

  // Column 2: Tasks
  orderedTasks.forEach((task, i) => {
    nodes.push({
      id: `task-${task.id}`,
      type: 'orgNode',
      position: { x: col2X, y: col2StartY + i * (CARD_H + ROW_GAP) },
      data: {
        name: task.name,
        type: 'task' as const,
        capabilities: task.refs,
      },
    })
  })

  // Edges: Members → Roles
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

  // Edges: Roles → Tasks
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
