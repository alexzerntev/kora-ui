import { TbClock } from 'react-icons/tb'
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

export function TimerNode({ data }: { data: ActivityNodeData }) {
  const duration = data.meta?.duration

  // Parse ISO duration to human readable
  const humanDuration = duration
    ? duration
        .replace(/^P/, '')
        .replace(/T/, '')
        .replace(/(\d+)D/, '$1 days')
        .replace(/(\d+)H/, '$1h')
        .replace(/(\d+)M/, '$1m')
    : ''

  return (
    <IconNode
      icon={<TbClock size={56} strokeWidth={1.2} />}
      label={data.label}
      color="#d97706"
      status={data.status}
      runState={data.runState}
      subLabel={
        humanDuration ? (
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: '#d97706',
              fontFamily: 'ui-monospace, Consolas, monospace',
            }}
          >
            {humanDuration}
          </span>
        ) : undefined
      }
    />
  )
}
