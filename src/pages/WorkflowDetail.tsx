import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ReactFlow, Background, Controls, ConnectionLineType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DeskNode } from '../components/nodes/DeskNode'
import { EventNode } from '../components/nodes/EventNode'
import { GatewayNode } from '../components/nodes/GatewayNode'
import { ActivityNode } from '../components/nodes/ActivityNode'
import { WorkflowEdge } from '../components/nodes/WorkflowEdge'
import { useProcess, useRunProcess, useRun } from '../providers/hooks'
import { TbArrowLeft, TbX } from 'react-icons/tb'
import { RunProcessButton } from '../components/shared/RunProcessButton'
import { StatusBadge } from '../components/shared/StatusBadge'
import { useProcessGraph } from '../hooks/useProcessGraph'

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

  const nodeStates = runData?.nodeStates

  const clearRun = () => {
    setSearchParams({})
  }

  const { nodes, edges } = useProcessGraph(workflow, nodeStates)

  if (loading) {
    return <p style={{ padding: 32, color: 'var(--color-foreground-muted)' }}>Loading process...</p>
  }

  if (!workflow) {
    return <p style={{ padding: 32, color: 'var(--color-foreground-muted)' }}>Workflow not found.</p>
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
      {/* Top bar */}
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
          <h1 className="topbar-title">{workflow.name}</h1>
          {workflow.description && <p className="topbar-subtitle">{workflow.description}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {isRunning && !runId ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-foreground-muted)' }}>
                {doneCount}/{totalCount}
              </span>
              <div
                style={{
                  width: 80,
                  height: 4,
                  background: 'var(--color-surface-active)',
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
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-foreground-subtle)' }}>
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
            background: '#fafaf9',
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
              background: 'rgba(255,255,255,0.9)',
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

      {/* Canvas */}
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
