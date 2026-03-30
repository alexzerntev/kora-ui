import { getBezierPath, type EdgeProps } from '@xyflow/react'

type EdgeState = 'idle' | 'active' | 'done'

export function WorkflowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const state = (data?.state as EdgeState) ?? 'idle'

  const colors = {
    idle: '#d4d4d4',
    active: '#3b82f6',
    done: '#4ade80',
  }
  const color = colors[state]

  return (
    <g>
      {/* Base track — always visible */}
      <path
        d={edgePath}
        fill="none"
        stroke="#ebebeb"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={state === 'idle' ? '4 6' : undefined}
      />

      {/* Done: solid colored overlay */}
      {state === 'done' && <path d={edgePath} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />}

      {/* Active: glow + traveling pulse */}
      {state === 'active' && (
        <>
          {/* Soft glow */}
          <path d={edgePath} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" opacity={0.08} />
          {/* Solid base */}
          <path d={edgePath} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.3} />
          {/* Animated pulse traveling along path */}
          <path
            d={edgePath}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="12 188"
            className="edge-pulse"
          />
        </>
      )}

      {/* Target endpoint dot */}
      <circle cx={targetX} cy={targetY} r={state === 'idle' ? 3 : 4} fill={color} />

      {/* Source endpoint dot */}
      <circle cx={sourceX} cy={sourceY} r={3} fill={state === 'idle' ? '#d4d4d4' : color} />

      {/* Edge label */}
      {label && (
        <foreignObject
          x={labelX - 50}
          y={labelY - 10}
          width={100}
          height={20}
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: '#888',
                background: '#fff',
                padding: '1px 6px',
                borderRadius: 4,
                border: '1px solid #eee',
                fontFamily: 'ui-monospace, Consolas, monospace',
                whiteSpace: 'nowrap',
              }}
            >
              {label as string}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  )
}
