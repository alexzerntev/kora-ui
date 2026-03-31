import { useParams, useNavigate } from 'react-router-dom'
import { ReactFlow, Background, Controls, ConnectionLineType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DeskNode } from '../components/nodes/DeskNode'
import { EventNode } from '../components/nodes/EventNode'
import { GatewayNode } from '../components/nodes/GatewayNode'
import { ActivityNode } from '../components/nodes/ActivityNode'
import { WorkflowEdge } from '../components/nodes/WorkflowEdge'
import { useProcess, useRun, useRunLogs } from '../providers/hooks'
import { TbArrowLeft } from 'react-icons/tb'
import { StatusBadge } from '../components/shared/StatusBadge'
import { AuditLogPanel } from '../components/shared/AuditLogPanel'
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

function formatStartedAt(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(startStr: string, endStr?: string): string {
  if (!endStr) return '--'
  const start = new Date(startStr)
  const end = new Date(endStr)
  const diffMs = end.getTime() - start.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin}m`
  const hr = Math.floor(diffMin / 60)
  const min = diffMin % 60
  return min > 0 ? `${hr}h ${min}m` : `${hr}h`
}

export function RunDetail() {
  const { runId } = useParams<{ runId: string }>()
  const navigate = useNavigate()
  const { data: runData, loading: runLoading } = useRun(runId ?? '')
  const { data: workflow, loading: workflowLoading } = useProcess(runData?.workflowId ?? '')
  const { data: logs, loading: logsLoading } = useRunLogs(runId ?? '')

  const { nodes, edges } = useProcessGraph(workflow, runData?.nodeStates)

  const loading = runLoading || workflowLoading

  if (loading) {
    return <p style={{ padding: 32, color: 'var(--color-foreground-muted)' }}>Loading run...</p>
  }

  if (!runData) {
    return <p style={{ padding: 32, color: 'var(--color-foreground-muted)' }}>Run not found.</p>
  }

  const badgeCfg = STATUS_BADGE_COLORS[runData.status]

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Full-bleed ReactFlow Canvas */}
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
            marginBottom: 210,
          }}
        />
      </ReactFlow>

      {/* Floating top bar */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
          flexWrap: 'wrap' as const,
        }}
      >
        <button
          onClick={() => navigate('/runs')}
          className="back-btn"
          style={{ margin: 0, width: 32, height: 32, justifyContent: 'center' }}
        >
          <TbArrowLeft size={18} />
        </button>

        {/* Run ID */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-foreground)',
            fontFamily: 'ui-monospace, Consolas, monospace',
          }}
        >
          {runData.id}
        </span>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 18,
            background: 'rgba(0,0,0,0.1)',
          }}
        />

        {/* Process name */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 550,
            color: 'var(--color-foreground-secondary)',
          }}
        >
          {runData.workflowName}
        </span>

        {/* Status badge */}
        {badgeCfg && <StatusBadge status={runData.status} color={badgeCfg.color} backgroundColor={badgeCfg.bg} />}

        <div style={{ flex: 1 }} />

        {/* Metadata items */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--color-foreground-muted)', fontWeight: 500, lineHeight: '14px' }}>
              Started
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-foreground-secondary)', fontWeight: 500 }}>
              {formatStartedAt(runData.startedAt)}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--color-foreground-muted)', fontWeight: 500, lineHeight: '14px' }}>
              Duration
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-foreground-secondary)', fontWeight: 500 }}>
              {formatDuration(runData.startedAt, runData.completedAt)}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--color-foreground-muted)', fontWeight: 500, lineHeight: '14px' }}>
              Triggered by
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-foreground-secondary)', fontWeight: 500 }}>
              {runData.triggeredBy}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--color-foreground-muted)', fontWeight: 500, lineHeight: '14px' }}>
              Steps
            </span>
            <span
              style={{
                fontSize: 12,
                color: 'var(--color-foreground-secondary)',
                fontWeight: 500,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {runData.stepsCompleted}/{runData.stepsTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Audit Log Panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <AuditLogPanel logs={logs ?? []} loading={logsLoading} />
      </div>
    </div>
  )
}
