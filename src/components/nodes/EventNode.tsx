import { TbMail, TbClock, TbPlayerPlay, TbFlagCheck } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import type { NodeRunState } from '../../providers/types'
import { NodeHandles } from './shared'

interface EventNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  runState?: NodeRunState
}

const RUN_STATE_OPACITY: Record<NodeRunState, number> = {
  done: 0.85,
  running: 1,
  idle: 0.4,
  skipped: 0.15,
}

const START_KINDS = new Set(['start.message', 'start.timer', 'start.manual'])
const END_KINDS = new Set(['end.none', 'end.error'])

const ICON_MAP: Record<string, React.ReactNode> = {
  'start.message': <TbMail size={20} />,
  'start.timer': <TbClock size={20} />,
  'start.manual': <TbPlayerPlay size={20} />,
}

export function EventNode({ data }: { data: EventNodeData }) {
  const isStart = START_KINDS.has(data.kind)
  const isEnd = END_KINDS.has(data.kind)
  const isDone = data.runState ? data.runState === 'done' : data.status === 'done'
  const isRunning = data.runState ? data.runState === 'running' : data.status === 'running'

  const borderColor = data.runState === 'done' ? '#10b981' : isStart ? '#22c55e' : '#6b7280'
  const bgColor = isStart ? '#f0fdf4' : '#f9fafb'
  const iconColor = isStart ? '#16a34a' : '#374151'

  const wrapperOpacity = data.runState ? RUN_STATE_OPACITY[data.runState] : isDone ? 0.5 : 1

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: wrapperOpacity,
        transition: 'opacity 0.3s',
        filter: data.runState === 'skipped' || data.runState === 'idle' ? 'grayscale(0.6)' : undefined,
      }}
    >
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        <NodeHandles top={24} target={!isStart} source={isStart} />

        {isRunning && (
          <div
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '2px solid rgba(37,99,235,0.15)',
              animation: 'ring-pulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2.5px solid ${borderColor}`,
            background: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            boxShadow: isRunning
              ? `0 0 0 4px ${borderColor}15, 0 2px 8px rgba(0,0,0,0.08)`
              : '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {isEnd ? <TbFlagCheck size={20} /> : ICON_MAP[data.kind]}
        </div>
      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-ink-secondary)',
          whiteSpace: 'nowrap',
          maxWidth: 120,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
        }}
      >
        {data.label}
      </span>
    </div>
  )
}
