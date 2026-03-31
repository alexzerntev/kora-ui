import { TbTable } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { CardNode } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function DecisionNode({ data }: { data: ActivityNodeData }) {
  const capability = data.meta?.decision

  return (
    <CardNode color="#ea580c" tabIcon={<TbTable size={10} />} tabLabel="Decision" status={data.status}>
      {/* Title + subtitle */}
      <div style={{ padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{data.label}</div>
        {capability && (
          <div
            style={{
              fontSize: 11,
              color: '#999',
              fontFamily: 'ui-monospace, Consolas, monospace',
            }}
          >
            {capability}
          </div>
        )}
      </div>

      {/* Table in socket area */}
      <div
        style={{
          margin: '0 8px 8px',
          borderRadius: 14,
          border: '1px solid #e5e5e5',
          overflow: 'hidden',
          background: '#fafaf9',
        }}
      >
        <div
          style={{
            fontFamily: 'ui-monospace, Consolas, monospace',
            fontSize: 10,
            letterSpacing: '-0.01em',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              background: '#f3f3f2',
              borderBottom: '1px solid #e5e5e5',
            }}
          >
            <span
              style={{
                flex: 3,
                padding: '5px 10px',
                color: '#999',
                fontWeight: 600,
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              when
            </span>
            <span
              style={{
                flex: 2,
                padding: '5px 10px',
                color: '#999',
                fontWeight: 600,
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderLeft: '1px solid #e5e5e5',
              }}
            >
              result
            </span>
          </div>
          {/* Row 1 */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            <span style={{ flex: 3, padding: '5px 10px', color: '#444' }}>score &ge; 80</span>
            <span
              style={{
                flex: 2,
                padding: '5px 10px',
                color: '#1a1a1a',
                fontWeight: 600,
                borderLeft: '1px solid #eee',
              }}
            >
              high
            </span>
          </div>
          {/* Row 2 */}
          <div style={{ display: 'flex' }}>
            <span style={{ flex: 3, padding: '5px 10px', color: '#444' }}>score &ge; 50</span>
            <span
              style={{
                flex: 2,
                padding: '5px 10px',
                color: '#1a1a1a',
                fontWeight: 600,
                borderLeft: '1px solid #eee',
              }}
            >
              medium
            </span>
          </div>
        </div>
        {/* Fade + more */}
        <div
          style={{
            height: 20,
            background: 'linear-gradient(to bottom, rgba(250,250,249,0) 0%, #fafaf9 70%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 3,
          }}
        >
          <span style={{ fontSize: 9, color: '#ccc', fontFamily: 'ui-monospace, Consolas, monospace' }}>+10 more</span>
        </div>
      </div>
    </CardNode>
  )
}
