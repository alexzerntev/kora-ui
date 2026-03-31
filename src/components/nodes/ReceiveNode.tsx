import { TbInbox } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { CardNode } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function ReceiveNode({ data }: { data: ActivityNodeData }) {
  const catchMessage = data.meta?.catch

  return (
    <CardNode color="#0891b2" tabIcon={<TbInbox size={10} />} tabLabel="Receive" status={data.status}>
      {/* Socket area — inbox icon */}
      <div
        style={{
          margin: 8,
          borderRadius: 14,
          padding: '16px 12px',
          background: '#ecfeff',
          border: '1px solid #0891b215',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <TbInbox size={28} style={{ color: '#0891b2' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#0891b2' }}>Inbox</span>
      </div>

      {/* Title + message type */}
      <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{data.label}</div>
        {catchMessage && (
          <div
            style={{
              fontSize: 11,
              color: '#999',
              fontFamily: 'ui-monospace, Consolas, monospace',
            }}
          >
            {catchMessage}
          </div>
        )}
      </div>
    </CardNode>
  )
}
