import { Handle, Position } from '@xyflow/react'
import { TbTable } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function DecisionNode({ data }: { data: ActivityNodeData }) {
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'
  const capability = data.meta?.decision

  return (
    <div style={{ position: 'relative' }}>
      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 26,
            border: '2px solid rgba(234,88,12,0.1)',
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          width: 220,
          background: '#fff',
          borderRadius: 20,
          border: `2px solid ${isRunning ? 'rgba(234,88,12,0.25)' : '#ea580c'}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          opacity: isDone ? 0.5 : 1,
          overflow: 'visible',
          position: 'relative',
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
        />

        {/* Type tab */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 16,
            zIndex: 1,
            background: '#ea580c',
            color: '#fff',
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px 3px',
            borderRadius: '6px 6px 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <TbTable size={10} />
          Decision
        </div>

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
              <span style={{ flex: 3, padding: '5px 10px', color: '#444' }}>score ≥ 80</span>
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
              <span style={{ flex: 3, padding: '5px 10px', color: '#444' }}>score ≥ 50</span>
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
            <span style={{ fontSize: 9, color: '#ccc', fontFamily: 'ui-monospace, Consolas, monospace' }}>
              +10 more
            </span>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
        />
      </div>
    </div>
  )
}
