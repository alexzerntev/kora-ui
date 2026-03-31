import { NodeHandles } from './NodeHandles'
import { hexToRgba } from './utils'

/**
 * Reusable wrapper for small icon-style process nodes.
 *
 * Provides:
 * - A centered icon with a specific color
 * - A label positioned absolutely below the icon
 * - A running pulse ring animation
 * - Done state (opacity 0.5)
 * - Standard transparent handles at vertical center
 * - Optional sub-label below the main label
 *
 * Used by: ServiceNode, TimerNode, CallNode
 * (ScriptNode is special — hexagon shape — so it keeps its own shape.)
 */
export function IconNode({
  icon,
  label,
  color,
  size = 56,
  status,
  subLabel,
  labelGap = 4,
  children,
}: {
  icon: React.ReactNode
  label: React.ReactNode
  color: string
  size?: number
  status: 'idle' | 'running' | 'done'
  subLabel?: React.ReactNode
  labelGap?: number
  children?: React.ReactNode
}) {
  const isDone = status === 'done'
  const isRunning = status === 'running'

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <NodeHandles top={size / 2} />

      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: `2px solid ${hexToRgba(color, 0.15)}`,
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {children ?? (
        <div
          style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            opacity: isDone ? 0.5 : 1,
          }}
        >
          {icon}
        </div>
      )}

      {/* Label + optional sub-label positioned below, outside the node bounds */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: labelGap,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-ink-secondary)',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          {label}
        </span>
        {subLabel}
      </div>
    </div>
  )
}
