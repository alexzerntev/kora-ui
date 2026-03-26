import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  MarkerType,
  ConnectionLineType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DeskNode } from '../components/DeskNode'
import { WORKFLOWS } from '../data/workflows'
import { TbArrowLeft } from 'react-icons/tb'

const nodeTypes = { desk: DeskNode }

export function WorkflowDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const workflow = WORKFLOWS.find((w) => w.id === id)

  const nodes: Node[] = useMemo(() => {
    if (!workflow) return []

    // Left-to-right layout: x = layer (column), y = position within layer (row)
    const nodeWidth = 240
    const nodeHeight = 420
    const colGap = 180   // horizontal gap between columns
    const rowGap = 60    // vertical gap between parallel nodes

    const hasIncoming = new Set(workflow.edges.map((e) => e.to))
    const roots = workflow.tasks.filter((t) => !hasIncoming.has(t.id))

    // Assign each node to a layer (column) via BFS
    const layerMap: Record<string, number> = {}
    roots.forEach((t) => { layerMap[t.id] = 0 })

    const placed = new Set(roots.map((r) => r.id))
    let currentLayer = roots.map((r) => r.id)

    while (currentLayer.length > 0) {
      const nextLayer: string[] = []
      for (const edge of workflow.edges) {
        if (currentLayer.includes(edge.from) && !placed.has(edge.to)) {
          const parents = workflow.edges.filter((e) => e.to === edge.to).map((e) => e.from)
          const allParentsPlaced = parents.every((p) => placed.has(p))
          if (allParentsPlaced && !nextLayer.includes(edge.to)) {
            // Layer = max parent layer + 1
            const maxParentLayer = Math.max(...parents.map((p) => layerMap[p]))
            layerMap[edge.to] = maxParentLayer + 1
            nextLayer.push(edge.to)
          }
        }
      }
      nextLayer.forEach((id) => placed.add(id))
      currentLayer = nextLayer
    }

    // Group nodes by layer
    const layers: Record<number, string[]> = {}
    for (const [nodeId, layer] of Object.entries(layerMap)) {
      if (!layers[layer]) layers[layer] = []
      layers[layer].push(nodeId)
    }

    // Position: x from layer index, y centered within layer
    const positions: Record<string, { x: number; y: number }> = {}
    for (const [layerStr, nodeIds] of Object.entries(layers)) {
      const layer = Number(layerStr)
      const totalHeight = nodeIds.length * nodeHeight + (nodeIds.length - 1) * rowGap
      const startY = -totalHeight / 2

      nodeIds.forEach((nodeId, i) => {
        positions[nodeId] = {
          x: layer * (nodeWidth + colGap),
          y: startY + i * (nodeHeight + rowGap),
        }
      })
    }

    return workflow.tasks.map((task) => ({
      id: task.id,
      type: 'desk',
      position: positions[task.id] || { x: 0, y: 0 },
      data: {
        taskId: task.taskId,
        taskName: task.taskName,
        assigneeId: task.assigneeId,
        assigneeName: task.assigneeName,
        assigneeSeed: task.assigneeSeed,
        assigneeType: task.assigneeType,
        status: task.status,
      },
    }))
  }, [workflow])

  const edges: Edge[] = useMemo(() => {
    if (!workflow) return []

    const taskStatusMap: Record<string, string> = {}
    workflow.tasks.forEach((t) => { taskStatusMap[t.id] = t.status })
    const hasRunning = workflow.tasks.some((t) => t.status === 'running')

    return workflow.edges.map((e, i) => {
      const sourceStatus = taskStatusMap[e.from]
      const targetStatus = taskStatusMap[e.to]
      const isActive = hasRunning && sourceStatus === 'done' && targetStatus === 'running'
      const isDone = hasRunning && sourceStatus === 'done' && (targetStatus === 'done' || targetStatus === 'running')

      return {
        id: `e-${i}`,
        source: e.from,
        target: e.to,
        type: 'smoothstep',
        animated: isActive,
        style: {
          stroke: isDone ? '#86efac' : isActive ? '#93c5fd' : '#d4d4d4',
          strokeWidth: 2,
          strokeLinecap: 'round' as const,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isDone ? '#86efac' : isActive ? '#93c5fd' : '#d4d4d4',
          width: 12,
          height: 12,
        },
      }
    })
  }, [workflow])

  if (!workflow) {
    return (
      <div style={{ padding: '32px 40px' }}>
        <p>Workflow not found.</p>
      </div>
    )
  }

  const doneCount = workflow.tasks.filter((t) => t.status === 'done').length
  const totalCount = workflow.tasks.length
  const isRunning = workflow.tasks.some((t) => t.status === 'running')

  return (
    <div style={{
      position: 'relative',
      margin: '-32px -40px',
      height: 'calc(100vh - 32px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Floating header */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: 14,
        padding: '12px 20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid var(--color-border-light)',
      }}>
        <button
          onClick={() => navigate('/workflows')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 8,
            color: 'var(--color-ink-secondary)',
          }}
        >
          <TbArrowLeft size={18} />
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)' }}>
            {workflow.name}
          </h1>
          <p style={{ fontSize: 12, color: 'var(--color-ink-secondary)' }}>
            {workflow.description}
          </p>
        </div>

        {isRunning ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink-secondary)' }}>
              {doneCount}/{totalCount}
            </span>
            <div style={{ width: 80, height: 4, background: 'var(--color-border-light)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(doneCount / totalCount) * 100}%`,
                background: 'var(--color-status-done)',
                borderRadius: 2,
              }} />
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ink-muted)' }}>
            {workflow.lastRunAt
              ? `Last run ${new Date(workflow.lastRunAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
              : 'Never run'}
          </span>
        )}
      </div>

      {/* Full-bleed canvas */}
      <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', background: '#fafaf9' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.4 }}
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
        >
          <Background gap={32} size={1} color="#f0efee" />
          <Controls
            showInteractive={false}
            position="bottom-right"
            style={{ borderRadius: 12, border: '1px solid #e5e5e5', overflow: 'hidden', background: '#fff' }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
