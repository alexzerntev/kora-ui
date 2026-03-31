import { useState, useRef, useCallback } from 'react'
import {
  TbChevronDown,
  TbPlayerPlay,
  TbCircleCheck,
  TbCircleX,
  TbArrowsSplit,
  TbTableOptions,
  TbRocket,
  TbFlagFilled,
  TbSortAscending,
  TbSortDescending,
} from 'react-icons/tb'
import type { RunLogEntry, RunLogEntryType } from '../../providers/types'

interface AuditLogPanelProps {
  logs: RunLogEntry[]
  loading?: boolean
}

const LOG_TYPE_CONFIG: Record<
  RunLogEntryType,
  { icon: typeof TbPlayerPlay; color: string; bg: string; label: string }
> = {
  'step.started': {
    icon: TbPlayerPlay,
    color: 'var(--color-primary)',
    bg: '#eff6ff',
    label: 'Started',
  },
  'step.completed': {
    icon: TbCircleCheck,
    color: 'var(--color-status-done)',
    bg: '#ecfdf5',
    label: 'Completed',
  },
  'step.failed': {
    icon: TbCircleX,
    color: 'var(--color-status-failed)',
    bg: '#fef2f2',
    label: 'Failed',
  },
  'decision.evaluated': {
    icon: TbTableOptions,
    color: 'var(--color-status-processing)',
    bg: '#fffbeb',
    label: 'Decision',
  },
  'gateway.branched': {
    icon: TbArrowsSplit,
    color: 'var(--color-status-processing)',
    bg: '#fffbeb',
    label: 'Gateway',
  },
  'process.started': {
    icon: TbRocket,
    color: 'var(--color-primary)',
    bg: '#eff6ff',
    label: 'Process',
  },
  'process.completed': {
    icon: TbFlagFilled,
    color: 'var(--color-status-done)',
    bg: '#ecfdf5',
    label: 'Process',
  },
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function AuditLogPanel({ logs, loading }: AuditLogPanelProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [chronological, setChronological] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelHeight, setPanelHeight] = useState(200)
  const dragging = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const sortedLogs = chronological ? [...logs] : [...logs].reverse()

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true
      startY.current = e.clientY
      startHeight.current = panelHeight

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return
        const delta = startY.current - ev.clientY
        const newHeight = Math.max(100, Math.min(600, startHeight.current + delta))
        setPanelHeight(newHeight)
      }

      const handleMouseUp = () => {
        dragging.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [panelHeight],
  )

  return (
    <div
      ref={panelRef}
      style={{
        borderTop: '1px solid var(--color-border)',
        background: '#fff',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: collapsed ? 'auto' : panelHeight,
      }}
    >
      {/* Drag handle */}
      {!collapsed && (
        <div
          onMouseDown={handleMouseDown}
          style={{
            height: 6,
            cursor: 'row-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 3,
              borderRadius: 2,
              background: 'var(--color-border)',
            }}
          />
        </div>
      )}

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderBottom: collapsed ? 'none' : '1px solid var(--color-border)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-foreground-secondary)',
            padding: 0,
          }}
        >
          <TbChevronDown
            size={14}
            style={{
              transition: 'transform 0.2s ease',
              transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            }}
          />
          Audit Log
        </button>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(0,0,0,0.05)',
            color: 'var(--color-foreground-secondary)',
            borderRadius: 6,
            padding: '1px 7px',
            lineHeight: '18px',
          }}
        >
          {logs.length}
        </span>
        <div style={{ flex: 1 }} />
        {!collapsed && (
          <button
            onClick={() => setChronological((prev) => !prev)}
            title={chronological ? 'Showing oldest first' : 'Showing newest first'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: '#fff',
              color: 'var(--color-foreground-muted)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {chronological ? <TbSortAscending size={14} /> : <TbSortDescending size={14} />}
            {chronological ? 'Oldest first' : 'Newest first'}
          </button>
        )}
      </div>

      {/* Log entries */}
      {!collapsed && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 0',
          }}
        >
          {loading ? (
            <p
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--color-foreground-muted)',
                fontSize: 13,
              }}
            >
              Loading logs...
            </p>
          ) : sortedLogs.length === 0 ? (
            <p
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--color-foreground-muted)',
                fontSize: 13,
              }}
            >
              No log entries yet.
            </p>
          ) : (
            sortedLogs.map((entry) => {
              const config = LOG_TYPE_CONFIG[entry.type]
              const Icon = config.icon

              return (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '6px 16px',
                    transition: 'background 0.12s ease',
                  }}
                  className="audit-log-entry"
                >
                  {/* Timestamp */}
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'ui-monospace, Consolas, monospace',
                      color: 'var(--color-foreground-muted)',
                      flexShrink: 0,
                      lineHeight: '20px',
                      minWidth: 64,
                    }}
                  >
                    {formatTimestamp(entry.timestamp)}
                  </span>

                  {/* Icon */}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: config.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={12} color={config.color} />
                  </div>

                  {/* Message */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--color-foreground)',
                        lineHeight: '20px',
                      }}
                    >
                      {entry.message}
                    </span>
                    {entry.details && (
                      <p
                        style={{
                          fontSize: 11,
                          color: 'var(--color-foreground-muted)',
                          marginTop: 2,
                          lineHeight: '16px',
                        }}
                      >
                        {entry.details}
                      </p>
                    )}
                  </div>

                  {/* Duration badge */}
                  {entry.duration && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: 'var(--color-foreground-muted)',
                        background: 'rgba(0,0,0,0.04)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        flexShrink: 0,
                        lineHeight: '16px',
                        fontFamily: 'ui-monospace, Consolas, monospace',
                      }}
                    >
                      {entry.duration}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
