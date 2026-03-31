import { NodeHandles } from './NodeHandles'
import { hexToRgba } from './utils'
import type { NodeRunState } from '../../../providers/types'

const RUN_STATE_OPACITY: Record<NodeRunState, number> = {
  done: 0.85,
  running: 1,
  idle: 0.4,
  skipped: 0.15,
}

/**
 * Reusable card wrapper for card-style process nodes.
 *
 * Provides:
 * - Colored 2px border with rounded corners
 * - Type tab above the card (icon + label)
 * - Running pulse ring animation
 * - Done opacity
 * - Standard transparent handles (left/right)
 *
 * Used by: DecisionNode, SendNode, ReceiveNode, (and DeskNode's unassigned variant)
 */
export function CardNode({
  color,
  tabIcon,
  tabLabel,
  status,
  runState,
  width = 220,
  children,
}: {
  color: string
  tabIcon: React.ReactNode
  tabLabel: string
  status: 'idle' | 'running' | 'done'
  runState?: NodeRunState
  width?: number
  children: React.ReactNode
}) {
  // When runState is present, it overrides the visual state
  const effectiveRunning = runState ? runState === 'running' : status === 'running'
  const effectiveDone = runState ? runState === 'done' : status === 'done'

  // Derive a 25%-opacity version of the color for the running border
  const runningBorderColor = hexToRgba(color, 0.25)
  // Derive a 10%-opacity version for the pulse ring
  const pulseRingColor = hexToRgba(color, 0.1)

  // Green tint for done nodes in run mode
  const borderColor = runState === 'done' ? '#10b981' : effectiveRunning ? runningBorderColor : color

  const wrapperOpacity = runState ? RUN_STATE_OPACITY[runState] : effectiveDone ? 0.5 : 1

  return (
    <div style={{ position: 'relative', opacity: wrapperOpacity, transition: 'opacity 0.3s' }}>
      {effectiveRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 26,
            border: `2px solid ${runState ? 'rgba(37,99,235,0.15)' : pulseRingColor}`,
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          width,
          background: '#fff',
          borderRadius: 20,
          border: `2px solid ${borderColor}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          overflow: 'visible',
          position: 'relative',
          filter: runState === 'skipped' || runState === 'idle' ? 'grayscale(0.6)' : undefined,
        }}
      >
        <NodeHandles />

        {/* Type tab */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 16,
            zIndex: 1,
            background: color,
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
          {tabIcon}
          {tabLabel}
        </div>

        {children}
      </div>
    </div>
  )
}
