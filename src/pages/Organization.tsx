import { useMemo, useState, useCallback } from 'react'
import { ReactFlow, Background, Controls, type Node, type Edge, Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { TEAM, TYPE_COLORS } from '../data/team'
import { ROLES } from '../data/roles'
import { TASKS } from '../data/tasks'
import { ASSIGNMENTS } from '../data/assignments'
import type { TeamMember, AgentMember } from '../data/team'
import { Avatar } from '../components/Avatar'
import { HiUser } from 'react-icons/hi2'
import { RiRobot2Fill } from 'react-icons/ri'

/* ------------------------------------------------------------------ */
/*  Person/Agent Card Node                                             */
/* ------------------------------------------------------------------ */

function MemberNode({ data }: { data: { member: TeamMember | AgentMember } }) {
  const { member } = data
  const isHuman = member.type === 'human'
  const colors = TYPE_COLORS[member.type]

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        width: 180,
        height: 210,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column' as const,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
      {/* Avatar area */}
      <div
        style={{
          background: colors.light,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '14px 14px 0 0',
          margin: 4,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        {isHuman ? (
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.7)',
              border: `1.5px solid ${colors.dark}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: colors.dark,
            }}
          >
            {member.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </span>
        ) : (
          <Avatar seed={(member as AgentMember).avatarSeed} size={64} />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{member.name}</span>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: colors.dark,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 8,
              flexShrink: 0,
            }}
          >
            {isHuman ? <HiUser /> : <RiRobot2Fill />}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-ink-secondary)' }}>{member.role}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
          {member.capabilities.slice(0, 2).map((cap) => (
            <span
              key={cap}
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: colors.dark,
                background: colors.light,
                padding: '2px 6px',
                borderRadius: 5,
              }}
            >
              {cap}
            </span>
          ))}
          {member.capabilities.length > 2 && (
            <span style={{ fontSize: 10, color: 'var(--color-ink-muted)' }}>+{member.capabilities.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Group Node (container for people or agents)                        */
/* ------------------------------------------------------------------ */

function GroupNode({ data }: { data: { label: string; count: number; color: string } }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#fafaf9',
        borderRadius: 16,
        border: `1px solid #e8e8e6`,
      }}
    >
      <div
        style={{
          padding: '10px 16px',
          fontSize: 12,
          fontWeight: 700,
          color: data.color,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {data.label}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--color-ink-muted)',
            background: '#fff',
            padding: '1px 7px',
            borderRadius: 8,
          }}
        >
          {data.count}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Role Node                                                          */
/* ------------------------------------------------------------------ */

function RoleNode({ data }: { data: { title: string; name: string; aiEligible: boolean; capabilities: string[] } }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1.5px solid #7c3aed',
        padding: '12px 14px',
        width: 160,
        height: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 3 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{data.title}</div>
        {data.aiEligible && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: '#0891b2',
              background: '#ecfeff',
              padding: '1px 5px',
              borderRadius: 3,
            }}
          >
            AI
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 10,
          color: 'var(--color-ink-muted)',
          fontFamily: 'ui-monospace, Consolas, monospace',
          marginBottom: 6,
        }}
      >
        {data.name}
      </div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.capabilities.slice(0, 2).map((cap) => (
          <span
            key={cap}
            style={{
              fontSize: 9,
              fontWeight: 500,
              color: '#7c3aed',
              background: '#f5f3ff',
              padding: '1px 5px',
              borderRadius: 4,
            }}
          >
            {cap}
          </span>
        ))}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Task Node                                                          */
/* ------------------------------------------------------------------ */

function TaskNode({ data }: { data: { name: string; description: string } }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1.5px solid #2563eb',
        padding: '12px 14px',
        width: 160,
        height: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>{data.name}</div>
      <div
        style={{
          fontSize: 10,
          color: 'var(--color-ink-muted)',
          lineHeight: 1.4,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
        }}
      >
        {data.description}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
    </div>
  )
}

const nodeTypes = {
  member: MemberNode,
  group: GroupNode,
  role: RoleNode,
  task: TaskNode,
}

/* ------------------------------------------------------------------ */
/*  Build the graph                                                    */
/* ------------------------------------------------------------------ */

function buildGraph() {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const people = TEAM.filter((m) => m.type === 'human')
  const agents = TEAM.filter((m) => m.type === 'agent')

  const cardW = 190
  const cardH = 210
  const gapX = 20
  const padding = 20
  const headerH = 40
  const gapY = 100

  const peopleGroupW = people.length * (cardW + gapX) - gapX + padding * 2
  const peopleGroupH = cardH + headerH + padding
  const agentsGroupW = agents.length * (cardW + gapX) - gapX + padding * 2
  const agentsGroupH = cardH + headerH + padding

  const groupGap = 60
  const agentsStartX = peopleGroupW + groupGap

  // People group
  nodes.push({
    id: 'group-people',
    type: 'group',
    position: { x: 0, y: 0 },
    style: { width: peopleGroupW, height: peopleGroupH },
    data: { label: 'People', count: people.length, color: '#7c3aed' },
  })

  // People cards inside group
  people.forEach((m, i) => {
    nodes.push({
      id: `member-${m.id}`,
      type: 'member',
      position: { x: padding + i * (cardW + gapX), y: headerH },
      parentId: 'group-people',
      extent: 'parent' as const,
      data: { member: m },
    })
  })

  // Agents group
  nodes.push({
    id: 'group-agents',
    type: 'group',
    position: { x: agentsStartX, y: 0 },
    style: { width: agentsGroupW, height: agentsGroupH },
    data: { label: 'Agents', count: agents.length, color: '#0891b2' },
  })

  // Agent cards inside group
  agents.forEach((m, i) => {
    nodes.push({
      id: `member-${m.id}`,
      type: 'member',
      position: { x: padding + i * (cardW + gapX), y: headerH },
      parentId: 'group-agents',
      extent: 'parent' as const,
      data: { member: m },
    })
  })

  // Order roles by assigned member position to minimize crossings
  const totalWidth = agentsStartX + agentsGroupW
  const roleGap = 20
  const roleNodeW = 160
  const roleNodeH = 100

  const memberXMap: Record<string, number> = {}
  people.forEach((m, i) => {
    memberXMap[m.id] = i * (cardW + gapX)
  })
  agents.forEach((m, i) => {
    memberXMap[m.id] = agentsStartX + i * (cardW + gapX)
  })

  const orderedRoles = [...ROLES].sort((a, b) => {
    const aAssign = ASSIGNMENTS.find((x) => x.roleId === a.id)
    const bAssign = ASSIGNMENTS.find((x) => x.roleId === b.id)
    const aX = aAssign ? (memberXMap[aAssign.memberId] ?? 0) : 0
    const bX = bAssign ? (memberXMap[bAssign.memberId] ?? 0) : 0
    return aX - bX
  })

  // Roles group
  const rolesGroupW = orderedRoles.length * (roleNodeW + roleGap) - roleGap + padding * 2
  const rolesGroupH = roleNodeH + headerH + padding
  const rolesGroupX = (totalWidth - rolesGroupW) / 2
  const rolesGroupY = Math.max(peopleGroupH, agentsGroupH) + gapY

  nodes.push({
    id: 'group-roles',
    type: 'group',
    position: { x: rolesGroupX, y: rolesGroupY },
    style: { width: rolesGroupW, height: rolesGroupH },
    data: { label: 'Roles', count: ROLES.length, color: '#7c3aed' },
  })

  orderedRoles.forEach((role, i) => {
    nodes.push({
      id: `role-${role.id}`,
      type: 'role',
      position: { x: padding + i * (roleNodeW + roleGap), y: headerH },
      parentId: 'group-roles',
      extent: 'parent' as const,
      data: {
        title: role.title,
        name: role.name,
        aiEligible: role.aiEligible,
        capabilities: role.requiredCapabilities,
      },
    })

    const assignedIds = ASSIGNMENTS.filter((a) => a.roleId === role.id).map((a) => a.memberId)
    assignedIds.forEach((memberId) => {
      edges.push({
        id: `e-${role.id}-${memberId}`,
        source: `member-${memberId}`,
        target: `role-${role.id}`,
        style: { stroke: '#e5e5e5', strokeWidth: 1.5 },
        data: { activeColor: '#7c3aed' },
        type: 'default',
      })
    })
  })

  // Order tasks to minimize crossings
  const taskGap = 20
  const taskNodeW = 160
  const taskNodeH = 100

  const roleXMap: Record<string, number> = {}
  orderedRoles.forEach((role, i) => {
    roleXMap[role.id] = padding + i * (roleNodeW + roleGap)
  })

  const orderedTasks = [...TASKS].sort((a, b) => {
    const aRoles = orderedRoles.filter(
      (r) => r.requiredCapabilities.includes(a.name) || r.optionalCapabilities.includes(a.name),
    )
    const bRoles = orderedRoles.filter(
      (r) => r.requiredCapabilities.includes(b.name) || r.optionalCapabilities.includes(b.name),
    )
    const aAvgX = aRoles.length > 0 ? aRoles.reduce((sum, r) => sum + (roleXMap[r.id] ?? 0), 0) / aRoles.length : 0
    const bAvgX = bRoles.length > 0 ? bRoles.reduce((sum, r) => sum + (roleXMap[r.id] ?? 0), 0) / bRoles.length : 0
    return aAvgX - bAvgX
  })

  // Tasks group
  const tasksGroupW = orderedTasks.length * (taskNodeW + taskGap) - taskGap + padding * 2
  const tasksGroupH = taskNodeH + headerH + padding
  const tasksGroupX = (totalWidth - tasksGroupW) / 2
  const tasksGroupY = rolesGroupY + rolesGroupH + gapY

  nodes.push({
    id: 'group-tasks',
    type: 'group',
    position: { x: tasksGroupX, y: tasksGroupY },
    style: { width: tasksGroupW, height: tasksGroupH },
    data: { label: 'Tasks', count: TASKS.length, color: '#2563eb' },
  })

  orderedTasks.forEach((task, i) => {
    nodes.push({
      id: `task-${task.id}`,
      type: 'task',
      position: { x: padding + i * (taskNodeW + taskGap), y: headerH },
      parentId: 'group-tasks',
      extent: 'parent' as const,
      data: { name: task.name, description: task.description },
    })
  })

  // Connect roles to tasks
  orderedRoles.forEach((role) => {
    orderedTasks.forEach((task) => {
      const taskCap = task.name
      if (role.requiredCapabilities.includes(taskCap) || role.optionalCapabilities.includes(taskCap)) {
        edges.push({
          id: `e-role-task-${role.id}-${task.id}`,
          source: `role-${role.id}`,
          target: `task-${task.id}`,
          style: { stroke: '#e5e5e5', strokeWidth: 1.5 },
          data: { activeColor: '#2563eb' },
          type: 'default',
        })
      }
    })
  })

  return { nodes, edges }
}

/* ------------------------------------------------------------------ */
/*  Organization Page                                                  */
/* ------------------------------------------------------------------ */

export function Organization() {
  const { nodes, edges: baseEdges } = useMemo(() => buildGraph(), [])
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    // Only highlight for member, role, and task nodes (not groups)
    if (node.type === 'member' || node.type === 'role' || node.type === 'task') {
      setHoveredNodeId(node.id)
    }
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
  }, [])

  // Compute which edges to highlight
  const edges = useMemo(() => {
    if (!hoveredNodeId) return baseEdges

    // Find all edges connected to the hovered node
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

    // Also highlight edges connected to the connected nodes (2 hops for full chain)
    baseEdges.forEach((e) => {
      if (connectedNodeIds.has(e.source) || connectedNodeIds.has(e.target)) {
        connectedEdgeIds.add(e.id)
      }
    })

    return baseEdges.map((e) => ({
      ...e,
      style: connectedEdgeIds.has(e.id)
        ? { stroke: (e.data as { activeColor: string })?.activeColor ?? '#7c3aed', strokeWidth: 2.5 }
        : { stroke: '#efefef', strokeWidth: 1 },
    }))
  }, [baseEdges, hoveredNodeId])

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
