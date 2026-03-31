import {
  TbSettings,
  TbCode,
  TbTable,
  TbSend,
  TbInbox,
  TbClock,
  TbStack2,
  TbExternalLink,
  TbCreditCard,
} from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { ServiceNode } from './ServiceNode'
import { ScriptNode } from './ScriptNode'
import { DecisionNode } from './DecisionNode'
import { SendNode } from './SendNode'
import { ReceiveNode } from './ReceiveNode'
import { TimerNode } from './TimerNode'
import { CallNode } from './CallNode'
import { SubprocessNode } from './SubprocessNode'
import { TransactionNode } from './TransactionNode'
import { NodeHandles } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; subtitle: string }> = {
  service: { icon: <TbSettings size={16} />, color: '#2563eb', bg: '#eff6ff', subtitle: 'Service' },
  script: { icon: <TbCode size={16} />, color: '#7c3aed', bg: '#f5f3ff', subtitle: 'Script' },
  decision: { icon: <TbTable size={16} />, color: '#ea580c', bg: '#fff7ed', subtitle: 'Decision' },
  send: { icon: <TbSend size={16} />, color: '#16a34a', bg: '#f0fdf4', subtitle: 'Send' },
  receive: { icon: <TbInbox size={16} />, color: '#0891b2', bg: '#ecfeff', subtitle: 'Receive' },
  timer: { icon: <TbClock size={16} />, color: '#d97706', bg: '#fffbeb', subtitle: 'Timer' },
  subprocess: { icon: <TbStack2 size={16} />, color: '#4f46e5', bg: '#eef2ff', subtitle: 'Subprocess' },
  call: { icon: <TbExternalLink size={16} />, color: '#0e7490', bg: '#ecfeff', subtitle: 'Call Activity' },
  transaction: { icon: <TbCreditCard size={16} />, color: '#059669', bg: '#ecfdf5', subtitle: 'Transaction' },
}

/* -- Generic Activity Node -- */

function GenericActivityNode({ data }: { data: ActivityNodeData }) {
  const config = ACTIVITY_CONFIG[data.kind] ?? ACTIVITY_CONFIG.service
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'

  let subtitle = config.subtitle
  if (data.meta) {
    const detail =
      data.meta.operation ||
      data.meta.language ||
      data.meta.decision ||
      data.meta.channel ||
      data.meta.catch ||
      data.meta.duration ||
      data.meta.process ||
      data.meta.mode
    if (detail) subtitle += ` · ${detail}`
  }

  return (
    <div style={{ position: 'relative' }}>
      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 20,
            border: '2px solid rgba(37,99,235,0.12)',
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          width: 220,
          background: '#fff',
          borderRadius: 14,
          border: `1.5px solid ${isRunning ? 'rgba(37,99,235,0.25)' : '#e5e7eb'}`,
          boxShadow: isRunning
            ? '0 0 0 4px rgba(37,99,235,0.04), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 1px 4px rgba(0,0,0,0.05)',
          opacity: isDone ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          position: 'relative',
        }}
      >
        <NodeHandles />

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: config.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.color,
            flexShrink: 0,
          }}
        >
          {config.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 650,
              color: 'var(--color-ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.label}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--color-ink-muted)',
              marginTop: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </div>
        </div>

        {isRunning && (
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              border: '2px solid #dbeafe',
              borderTopColor: '#2563eb',
              animation: 'spin 0.8s linear infinite',
              flexShrink: 0,
            }}
          />
        )}
        {isDone && (
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 9,
              flexShrink: 0,
            }}
          >
            ✓
          </div>
        )}
      </div>
    </div>
  )
}

/* -- Router -- */

export function ActivityNode({ data }: { data: ActivityNodeData }) {
  if (data.kind === 'service') return <ServiceNode data={data} />
  if (data.kind === 'script') return <ScriptNode data={data} />
  if (data.kind === 'decision') return <DecisionNode data={data} />
  if (data.kind === 'send') return <SendNode data={data} />
  if (data.kind === 'receive') return <ReceiveNode data={data} />
  if (data.kind === 'timer') return <TimerNode data={data} />
  if (data.kind === 'call') return <CallNode data={data} />
  if (data.kind === 'subprocess') return <SubprocessNode data={data} />
  if (data.kind === 'transaction') return <TransactionNode data={data} />
  return <GenericActivityNode data={data} />
}
