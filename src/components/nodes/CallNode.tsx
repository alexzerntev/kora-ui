import { TbRoute } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import type { NodeRunState } from '../../providers/types'
import { IconNode } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
  runState?: NodeRunState
}

export function CallNode({ data }: { data: ActivityNodeData }) {
  const isDone = data.status === 'done'
  const processName = data.meta?.process

  return (
    <IconNode
      icon={<TbRoute size={28} strokeWidth={1.3} />}
      label={
        <>
          <span style={{ color: '#4f46e5', fontFamily: 'ui-monospace, Consolas, monospace' }}>
            {processName ?? data.label}
          </span>{' '}
          process call
        </>
      }
      color="#4f46e5"
      size={64}
      status={data.status}
      runState={data.runState}
      labelGap={6}
    >
      {/* Portal circle */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: 'none',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDone ? 0.5 : 1,
          boxShadow: '0 0 0 2px #4f46e5, 0 4px 16px rgba(0,0,0,0.15)',
        }}
      >
        <TbRoute size={28} strokeWidth={1.3} style={{ color: '#4f46e5' }} />
      </div>
    </IconNode>
  )
}
