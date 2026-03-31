import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { ReactFlow, Background, Controls, type Node, type Edge, ConnectionLineType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DeskNode } from '../components/nodes/DeskNode'
import { EventNode } from '../components/nodes/EventNode'
import { GatewayNode } from '../components/nodes/GatewayNode'
import { ActivityNode } from '../components/nodes/ActivityNode'
import { WorkflowEdge } from '../components/nodes/WorkflowEdge'
import { useProcess, useRunProcess, useRun } from '../providers/hooks'
import { getReactFlowType, getNodeDimsForNode } from '../utils/layout'
import { TbArrowLeft, TbX } from 'react-icons/tb'
import { RunProcessButton } from '../components/shared/RunProcessButton'
import { StatusBadge } from '../components/shared/StatusBadge'
import type { NodeRunState } from '../providers/types'

const nodeTypes = {
  desk: DeskNode,
  event: EventNode,
  gateway: GatewayNode,
  activity: ActivityNode,
}
const edgeTypes = { workflow: WorkflowEdge }

const STATUS_BADGE_COLORS: Record<string, { color: string; bg: string }> = {
  running: { color: 'var(--color-status-done)', bg: '#ecfdf5' },
  completed: { color: 'var(--color-status-done)', bg: '#ecfdf5' },
  failed: { color: 'var(--color-status-failed)', bg: '#fef2f2' },
  paused: { color: 'var(--color-status-processing)', bg: '#fffbeb' },
}

export function WorkflowDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const runId = searchParams.get('run')
  const { data: workflow, loading } = useProcess(id ?? '')
  const { data: runData } = useRun(runId ?? '')
  const { run, running } = useRunProcess()

  const nodeStates: Record<string, NodeRunState> | undefined = runData?.nodeStates

  const clearRun = () => {
    setSearchParams({})
  }

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
        runState: nodeStates?.[node.id],
      },
    }))
  }, [workflow, nodeStates])

  const edges: Edge[] = useMemo(() => {
    if (!workflow) return []

    // If we have run state data, use it for edge styling
    if (nodeStates) {
      return workflow.edges.map((e, i) => {
        const sourceState = nodeStates[e.from]
        const targetState = nodeStates[e.to]

        let state: string = 'idle'
        if (sourceState === 'done' && targetState === 'done') {
          state = 'done'
        } else if (sourceState === 'done' && targetState === 'running') {
          state = 'active'
        } else if (sourceState === 'skipped' || targetState === 'skipped') {
          state = 'skipped'
        } else if (sourceState === 'running' && (targetState === 'idle' || !targetState)) {
          state = 'idle'
        }

        return {
          id: `e-${i}`,
          source: e.from,
          target: e.to,
          type: 'workflow',
          label: e.label,
          data: { state },
        }
      })
    }

    // Original edge logic (no run context)
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
  }, [workflow, nodeStates])

  if (loading) {
    return <p style={{ padding: 32, color: 'var(--color-ink-secondary)' }}>Loading process...</p>
  }

  if (!workflow) {
    return <p style={{ padding: 32, color: 'var(--color-ink-secondary)' }}>Workflow not found.</p>
  }

  const doneCount = workflow.nodes.filter((n) => n.status === 'done').length
  const totalCount = workflow.nodes.length
  const isRunning = workflow.nodes.some((n) => n.status === 'running')

  const badgeCfg = runData ? STATUS_BADGE_COLORS[runData.status] : undefined

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Top bar -- in normal document flow */}
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
          onClick={() => (runId ? navigate('/runs') : navigate('/processes'))}
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
          {isRunning && !runId ? (
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
          ) : !runId ? (
            <span style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af' }}>
              {workflow.lastRunAt
                ? `Last run ${new Date(workflow.lastRunAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                : 'Never run'}
            </span>
          ) : null}
          {!runId && (
            <RunProcessButton
              schema={workflow.inputSchema}
              onRun={(args) => run(workflow.id, args)}
              disabled={running}
            />
          )}
        </div>
      </div>

      {/* Run info bar */}
      {runId && runData && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 20px',
            background: '#f9fafb',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-foreground-secondary)',
            }}
          >
            Viewing run:
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--color-foreground)',
              fontFamily: 'ui-monospace, Consolas, monospace',
            }}
          >
            {runData.id}
          </span>
          {badgeCfg && <StatusBadge status={runData.status} color={badgeCfg.color} backgroundColor={badgeCfg.bg} />}
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-foreground-muted)',
            }}
          >
            {runData.stepsCompleted}/{runData.stepsTotal} steps
          </span>
          <div style={{ flex: 1 }} />
          <button
            onClick={clearRun}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: '#fff',
              color: 'var(--color-foreground-secondary)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <TbX size={14} />
            Clear
          </button>
        </div>
      )}

      {/* Full-bleed canvas */}
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
  )
}
