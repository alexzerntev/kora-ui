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

    const hasIncoming = new Set(workflow.edges.map((e) => e.to))
    const roots = workflow.tasks.filter((t) => !hasIncoming.has(t.id))

    const positions: Record<string, { x: number; y: number }> = {}
    const colWidth = 240
    const rowHeight = 220

    const rootStartX = ((roots.length - 1) * colWidth) / 2
    roots.forEach((task, i) => {
      positions[task.id] = { x: i * colWidth - rootStartX + 200, y: 0 }
    })

    const placed = new Set(roots.map((r) => r.id))
    let currentLayer = roots.map((r) => r.id)
    let layerY = 1

    while (currentLayer.length > 0) {
      const nextLayer: string[] = []
      for (const edge of workflow.edges) {
        if (currentLayer.includes(edge.from) && !placed.has(edge.to)) {
          const parents = workflow.edges.filter((e) => e.to === edge.to).map((e) => e.from)
          const allParentsPlaced = parents.every((p) => placed.has(p))
          if (allParentsPlaced && !nextLayer.includes(edge.to)) {
            nextLayer.push(edge.to)
          }
        }
      }

      nextLayer.forEach((nodeId) => {
        const parents = workflow.edges.filter((e) => e.to === nodeId).map((e) => e.from)
        if (parents.length > 0 && parents.every((p) => positions[p])) {
          const avgX = parents.reduce((sum, p) => sum + positions[p].x, 0) / parents.length
          positions[nodeId] = { x: avgX, y: layerY * rowHeight }
        } else {
          positions[nodeId] = { x: 200, y: layerY * rowHeight }
        }
        placed.add(nodeId)
      })

      currentLayer = nextLayer
      layerY++
    }

    return workflow.tasks.map((task) => ({
      id: task.id,
      type: 'desk',
      position: positions[task.id] || { x: 0, y: 0 },
      data: {
        taskName: task.taskName,
        assigneeName: task.assigneeName,
        assigneeSeed: task.assigneeSeed,
        assigneeType: task.assigneeType,
        status: task.status,
      },
    }))
  }, [workflow])

  const edges: Edge[] = useMemo(() => {
    if (!workflow) return []
    return workflow.edges.map((e, i) => ({
      id: `e-${i}`,
      source: e.from,
      target: e.to,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#c4c4c4', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#c4c4c4', width: 16, height: 16 },
    }))
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

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Back */}
      <button
        onClick={() => navigate('/workflows')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 500, color: 'var(--color-ink-muted)',
          padding: 0, marginBottom: 24,
        }}
      >
        <TbArrowLeft size={16} />
        Back to Workflows
      </button>

      {/* Header */}
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
          {workflow.name}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-ink-secondary)', marginTop: 4 }}>
          {workflow.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink-secondary)' }}>
            {doneCount}/{totalCount} tasks complete
          </span>
          <div style={{ width: 120, height: 4, background: 'var(--color-bg)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(doneCount / totalCount) * 100}%`,
              background: 'var(--color-status-done)',
              borderRadius: 2,
            }} />
          </div>
        </div>
      </header>

      {/* Graph */}
      <div style={{
        height: 600,
        background: 'var(--color-bg)',
        borderRadius: 16,
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
        >
          <Background gap={20} size={1} color="#e5e5e5" />
          <Controls
            showInteractive={false}
            style={{ borderRadius: 10, border: '1px solid var(--color-border)', overflow: 'hidden' }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
