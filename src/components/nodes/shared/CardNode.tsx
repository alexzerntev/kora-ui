import { NodeHandles } from './NodeHandles'
import { hexToRgba } from './utils'

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
  width = 220,
  children,
}: {
  color: string
  tabIcon: React.ReactNode
  tabLabel: string
  status: 'idle' | 'running' | 'done'
  width?: number
  children: React.ReactNode
}) {
  const isRunning = status === 'running'
  const isDone = status === 'done'

  // Derive a 25%-opacity version of the color for the running border
  const runningBorderColor = hexToRgba(color, 0.25)
  // Derive a 10%-opacity version for the pulse ring
  const pulseRingColor = hexToRgba(color, 0.1)

  return (
    <div style={{ position: 'relative' }}>
      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 26,
            border: `2px solid ${pulseRingColor}`,
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
          border: `2px solid ${isRunning ? runningBorderColor : color}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          opacity: isDone ? 0.5 : 1,
          overflow: 'visible',
          position: 'relative',
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
