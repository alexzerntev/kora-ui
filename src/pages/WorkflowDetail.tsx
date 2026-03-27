import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  ConnectionLineType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DeskNode } from '../components/DeskNode'
import { WorkflowEdge } from '../components/WorkflowEdge'
import { WORKFLOWS } from '../data/workflows'
import { TbArrowLeft } from 'react-icons/tb'

const nodeTypes = { desk: DeskNode }
const edgeTypes = { workflow: WorkflowEdge }

export function WorkflowDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const workflow = WORKFLOWS.find((w) => w.id === id)

  const nodes: Node[] = useMemo(() => {
    if (!workflow) return []

    const nodeWidth = 240
    const nodeHeight = 330
    const colGap = 220
    const rowGap = 60

    const hasIncoming = new Set(workflow.edges.map((e) => e.to))
    const roots = workflow.tasks.filter((t) => !hasIncoming.has(t.id))

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
            const maxParentLayer = Math.max(...parents.map((p) => layerMap[p]))
            layerMap[edge.to] = maxParentLayer + 1
            nextLayer.push(edge.to)
          }
        }
      }
      nextLayer.forEach((id) => placed.add(id))
      currentLayer = nextLayer
    }

    const layers: Record<number, string[]> = {}
    for (const [nodeId, layer] of Object.entries(layerMap)) {
      if (!layers[layer]) layers[layer] = []
      layers[layer].push(nodeId)
    }

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

      const state = isActive ? 'active' : isDone ? 'done' : 'idle'

      return {
        id: `e-${i}`,
        source: e.from,
        target: e.to,
        type: 'workflow',
        data: { state },
      }
    })
  }, [workflow])

  if (!workflow) {
    return <p style={{ padding: 32, color: 'var(--color-ink-secondary)' }}>Workflow not found.</p>
  }

  const doneCount = workflow.tasks.filter((t) => t.status === 'done').length
  const totalCount = workflow.tasks.length
  const isRunning = workflow.tasks.some((t) => t.status === 'running')

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
      position: 'relative',
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
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        borderRadius: 14,
        padding: '12px 20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid var(--color-border-light)',
      }}>
        <button
          onClick={() => navigate('/processes')}
          className="back-btn"
          style={{ margin: 0, width: 32, height: 32, justifyContent: 'center' }}
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
      <div style={{ flex: 1, overflow: 'hidden', background: '#fff' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.4 }}
          connectionLineType={ConnectionLineType.Bezier}
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
        >
          <Background gap={32} size={1} color="#e8e8e8" />
          <Controls
            showInteractive={false}
            position="bottom-right"
            style={{ borderRadius: 12, border: '1px solid var(--color-border-light)', overflow: 'hidden', background: '#fff' }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
