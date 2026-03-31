import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { ReactFlow, Background, Controls, type Node, type Edge, ConnectionLineType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DeskNode } from '../components/nodes/DeskNode'
import { EventNode } from '../components/nodes/EventNode'
import { GatewayNode } from '../components/nodes/GatewayNode'
import { ActivityNode } from '../components/nodes/ActivityNode'
import { WorkflowEdge } from '../components/nodes/WorkflowEdge'
import { useProcess, useRunProcess, useWorkflowRuns } from '../providers/hooks'
import { getReactFlowType, getNodeDimsForNode } from '../utils/layout'
import { TbArrowLeft, TbCircleCheckFilled, TbCircleXFilled, TbPlayerPauseFilled } from 'react-icons/tb'
import { RunProcessButton } from '../components/shared/RunProcessButton'
import type { RunStatus } from '../providers/types'

function statusIcon(status: RunStatus) {
  switch (status) {
    case 'running':
      return (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#10b981',
            display: 'inline-block',
            flexShrink: 0,
            boxShadow: '0 0 0 2px rgba(16,185,129,0.2)',
          }}
        />
      )
    case 'completed':
      return <TbCircleCheckFilled size={16} color="#10b981" style={{ flexShrink: 0 }} />
    case 'failed':
      return <TbCircleXFilled size={16} color="#ef4444" style={{ flexShrink: 0 }} />
    case 'paused':
      return <TbPlayerPauseFilled size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
  }
}

function relativeTime(dateStr: string): string {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d ago`
}

const statusLabel: Record<RunStatus, string> = {
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  paused: 'Paused',
}

const statusColor: Record<RunStatus, string> = {
  running: '#10b981',
  completed: '#6b7280',
  failed: '#ef4444',
  paused: '#f59e0b',
}

const nodeTypes = {
  desk: DeskNode,
  event: EventNode,
  gateway: GatewayNode,
  activity: ActivityNode,
}
const edgeTypes = { workflow: WorkflowEdge }

export function WorkflowDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: workflow, loading } = useProcess(id ?? '')
  const { data: runs } = useWorkflowRuns(id ?? '')
  const { run, running } = useRunProcess()
  const [runsSidebarOpen, setRunsSidebarOpen] = useState(true)

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const nodes: Node[] = useMemo(() => {
    if (!workflow) return []

    const colGap = 140

    // Build node map for sizing
    const nodeMap: Record<string, (typeof workflow.nodes)[0]> = {}
    workflow.nodes.forEach((n) => {
      nodeMap[n.id] = n
    })

    // Separate parent-level nodes from child nodes
    const topLevelNodes = workflow.nodes.filter((n) => !n.parentId)
    const childNodes = workflow.nodes.filter((n) => !!n.parentId)

    // Only layout top-level edges
    const topLevelNodeIds = new Set(topLevelNodes.map((n) => n.id))
    const topLevelEdges = workflow.edges.filter((e) => topLevelNodeIds.has(e.from) && topLevelNodeIds.has(e.to))

    // Topological layering (top-level only)
    const hasIncoming = new Set(topLevelEdges.map((e) => e.to))
    const roots = topLevelNodes.filter((n) => !hasIncoming.has(n.id))

    const layerMap: Record<string, number> = {}
    roots.forEach((n) => {
      layerMap[n.id] = 0
    })

    const placed = new Set(roots.map((r) => r.id))
    let currentLayer = roots.map((r) => r.id)

    while (currentLayer.length > 0) {
      const nextLayer: string[] = []
      for (const edge of topLevelEdges) {
        if (currentLayer.includes(edge.from) && !placed.has(edge.to)) {
          const parents = topLevelEdges.filter((e) => e.to === edge.to).map((e) => e.from)
          const allParentsPlaced = parents.every((p) => placed.has(p))
          if (allParentsPlaced && !nextLayer.includes(edge.to)) {
            const maxParentLayer = Math.max(...parents.map((p) => layerMap[p]))
            layerMap[edge.to] = maxParentLayer + 1
            nextLayer.push(edge.to)
          }
        }
      }
      nextLayer.forEach((nid) => placed.add(nid))
      currentLayer = nextLayer
    }

    // Group by layer
    const layers: Record<number, string[]> = {}
    for (const [nodeId, layer] of Object.entries(layerMap)) {
      if (!layers[layer]) layers[layer] = []
      layers[layer].push(nodeId)
    }

    // Compute max width per layer for x positioning
    const layerX: Record<number, number> = {}
    let x = 0
    const maxLayer = Math.max(...Object.keys(layers).map(Number))
    for (let l = 0; l <= maxLayer; l++) {
      const nodeIds = layers[l] || []
      const maxW = nodeIds.length > 0 ? Math.max(...nodeIds.map((nid) => getNodeDimsForNode(nodeMap[nid]).w)) : 220
      layerX[l] = x
      x += maxW + colGap
    }

    // Compute y positions within each layer
    const positions: Record<string, { x: number; y: number }> = {}
    const rowGap = 40

    for (const [layerStr, nodeIds] of Object.entries(layers)) {
      const layer = Number(layerStr)
      const heights = nodeIds.map((nid) => getNodeDimsForNode(nodeMap[nid]).h)
      const totalHeight = heights.reduce((sum, h) => sum + h, 0) + (nodeIds.length - 1) * rowGap
      let y = -totalHeight / 2

      nodeIds.forEach((nodeId, i) => {
        const nodeW = getNodeDimsForNode(nodeMap[nodeId]).w
        const layerMaxW = Math.max(...nodeIds.map((nid) => getNodeDimsForNode(nodeMap[nid]).w))
        // Center narrower nodes within the layer column
        const xOffset = (layerMaxW - nodeW) / 2

        positions[nodeId] = {
          x: layerX[layer] + xOffset,
          y,
        }
        y += heights[i] + rowGap
      })
    }

    // Position child nodes inside their parents
    const childPositions: Record<string, { x: number; y: number }> = {}
    const childrenByParent: Record<string, typeof childNodes> = {}
    childNodes.forEach((n) => {
      if (!childrenByParent[n.parentId!]) childrenByParent[n.parentId!] = []
      childrenByParent[n.parentId!].push(n)
    })
    for (const [parentId, children] of Object.entries(childrenByParent)) {
      const parent = nodeMap[parentId]
      const parentW = parent?.style?.width ?? 500
      const parentH = parent?.style?.height ?? 160
      const gap = 40
      const childDims = children.map((c) => getNodeDimsForNode(c))
      const totalChildW = childDims.reduce((sum, d) => sum + d.w, 0) + (children.length - 1) * gap
      let cx = (parentW - totalChildW) / 2

      children.forEach((child, i) => {
        const dims = childDims[i]
        const cy = (parentH - dims.h) / 2 + 10
        childPositions[child.id] = { x: cx, y: cy }
        cx += dims.w + gap
      })
    }

    return workflow.nodes.map((node) => ({
      id: node.id,
      type: getReactFlowType(node.kind),
      position: node.parentId ? childPositions[node.id] || { x: 0, y: 0 } : positions[node.id] || { x: 0, y: 0 },
      ...(node.parentId ? { parentId: node.parentId, extent: node.extent } : {}),
      ...(node.style ? { style: node.style } : {}),
      data: {
        kind: node.kind,
        label: node.label,
        status: node.status,
        taskId: node.taskId,
        assigneeId: node.assigneeId,
        assigneeName: node.assigneeName,
        assigneeSeed: node.assigneeSeed,
        assigneeType: node.assigneeType,
        meta: node.meta,
      },
    }))
  }, [workflow])

  const edges: Edge[] = useMemo(() => {
    if (!workflow) return []

    const statusMap: Record<string, string> = {}
    workflow.nodes.forEach((n) => {
      statusMap[n.id] = n.status
    })
    const hasRunning = workflow.nodes.some((n) => n.status === 'running')

    return workflow.edges.map((e, i) => {
      const sourceStatus = statusMap[e.from]
      const targetStatus = statusMap[e.to]
      const isActive = hasRunning && sourceStatus === 'done' && targetStatus === 'running'
      const isDone = hasRunning && sourceStatus === 'done' && (targetStatus === 'done' || targetStatus === 'running')
      const state = isActive ? 'active' : isDone ? 'done' : 'idle'

      return {
        id: `e-${i}`,
        source: e.from,
        target: e.to,
        type: 'workflow',
        label: e.label,
        data: { state },
      }
    })
  }, [workflow])

  if (loading) {
    return <p style={{ padding: 32, color: 'var(--color-ink-secondary)' }}>Loading process...</p>
  }

  if (!workflow) {
    return <p style={{ padding: 32, color: 'var(--color-ink-secondary)' }}>Workflow not found.</p>
  }

  const doneCount = workflow.nodes.filter((n) => n.status === 'done').length
  const totalCount = workflow.nodes.length
  const isRunning = workflow.nodes.some((n) => n.status === 'running')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Top bar — in normal document flow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '10px 20px',
          background: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate('/processes')}
          className="back-btn"
          style={{ margin: 0, width: 32, height: 32, justifyContent: 'center' }}
        >
          <TbArrowLeft size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{workflow.name}</h1>
          {workflow.description && (
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{workflow.description}</p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {isRunning ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                {doneCount}/{totalCount}
              </span>
              <div
                style={{
                  width: 80,
                  height: 4,
                  background: '#f3f4f6',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(doneCount / totalCount) * 100}%`,
                    background: 'var(--color-status-done)',
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          ) : (
            <span style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af' }}>
              {workflow.lastRunAt
                ? `Last run ${new Date(workflow.lastRunAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                : 'Never run'}
            </span>
          )}
          <RunProcessButton schema={workflow.inputSchema} onRun={(args) => run(workflow.id, args)} disabled={running} />
        </div>
      </div>

      {/* Content: sidebar + canvas */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Runs sidebar */}
        {runs && runs.length > 0 && (
          <div
            style={{
              width: runsSidebarOpen ? 280 : 40,
              flexShrink: 0,
              borderRight: '1px solid rgba(0,0,0,0.06)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              transition: 'width 0.2s ease',
              overflow: 'hidden',
            }}
          >
            {/* Sidebar header */}
            <button
              onClick={() => setRunsSidebarOpen(!runsSidebarOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: runsSidebarOpen ? '14px 16px' : '14px 0',
                justifyContent: runsSidebarOpen ? 'flex-start' : 'center',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                flexShrink: 0,
                width: '100%',
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                style={{
                  transform: runsSidebarOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <path d="M2 3L5 6L8 3" stroke="#6b7280" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
              {runsSidebarOpen && (
                <>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Runs</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#6b7280',
                      background: '#f3f4f6',
                      borderRadius: 4,
                      padding: '1px 6px',
                    }}
                  >
                    {runs.length}
                  </span>
                </>
              )}
            </button>

            {/* Run items */}
            {runsSidebarOpen && (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {runs.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '10px 10px',
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {statusIcon(r.status)}
                      <span
                        style={{ fontSize: 12, fontWeight: 600, color: '#111827', flex: 1, minWidth: 0 }}
                        className="truncate"
                      >
                        {r.triggeredBy}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: statusColor[r.status],
                          textTransform: 'capitalize',
                        }}
                      >
                        {statusLabel[r.status]}
                      </span>
                    </div>
                    {r.status === 'running' && (
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Step: {r.currentStep}</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 3,
                          background: '#f3f4f6',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${r.progress}%`,
                            background: statusColor[r.status],
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 10, color: '#9ca3af', flexShrink: 0 }}>
                        {r.stepsCompleted}/{r.stepsTotal}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>{relativeTime(r.startedAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ReactFlow canvas */}
        <div style={{ flex: 1, overflow: 'hidden', background: '#fff' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
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
    </div>
  )
}
