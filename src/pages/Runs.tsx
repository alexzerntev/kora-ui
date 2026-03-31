import { useState, useMemo } from 'react'
import { useAllRuns } from '../providers/hooks'
import type { ProcessRun, RunStatus } from '../providers/types'
import { TbCircleFilled, TbCircleCheck, TbCircleX, TbPlayerPause, TbChevronLeft, TbChevronRight } from 'react-icons/tb'

const PAGE_SIZE = 10

const STATUS_FILTERS: { label: string; value: RunStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Running', value: 'running' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Paused', value: 'paused' },
]

const STATUS_CONFIG: Record<
  RunStatus,
  { color: string; bg: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }
> = {
  running: { color: '#10b981', bg: '#ecfdf5', icon: TbCircleFilled },
  completed: { color: '#10b981', bg: '#ecfdf5', icon: TbCircleCheck },
  failed: { color: '#ef4444', bg: '#fef2f2', icon: TbCircleX },
  paused: { color: '#f59e0b', bg: '#fffbeb', icon: TbPlayerPause },
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date('2026-03-30T12:00:00Z')
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay === 1) return 'yesterday'
  return `${diffDay}d ago`
}

function formatDuration(startStr: string, endStr?: string): string {
  if (!endStr) return '--'
  const start = new Date(startStr)
  const end = new Date(endStr)
  const diffMs = end.getTime() - start.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin}m`
  const hr = Math.floor(diffMin / 60)
  const min = diffMin % 60
  return min > 0 ? `${hr}h ${min}m` : `${hr}h`
}

export function Runs() {
  const { data: runs, loading } = useAllRuns()
  const [statusFilter, setStatusFilter] = useState<RunStatus | 'all'>('all')
  const [processFilter, setProcessFilter] = useState<string>('all')
  const [page, setPage] = useState(0)

  const processNames = useMemo(() => {
    if (!runs) return []
    const names = [...new Set(runs.map((r) => r.workflowName))]
    return names.sort()
  }, [runs])

  const filteredRuns = useMemo(() => {
    if (!runs) return []
    let result = runs
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter)
    }
    if (processFilter !== 'all') {
      result = result.filter((r) => r.workflowName === processFilter)
    }
    // Sort by startedAt descending (most recent first)
    return [...result].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
  }, [runs, statusFilter, processFilter])

  const totalPages = Math.ceil(filteredRuns.length / PAGE_SIZE)
  const pagedRuns = filteredRuns.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const rangeStart = filteredRuns.length === 0 ? 0 : page * PAGE_SIZE + 1
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, filteredRuns.length)

  // Reset page when filters change
  const handleStatusFilter = (value: RunStatus | 'all') => {
    setStatusFilter(value)
    setPage(0)
  }
  const handleProcessFilter = (value: string) => {
    setProcessFilter(value)
    setPage(0)
  }

  const handleRowClick = (run: ProcessRun) => {
    console.log(`Navigate to /runs/${run.id}`, run)
    alert(`Run detail coming soon: ${run.id} (${run.workflowName})`)
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <header className="page-header">
        <h1>Runs</h1>
        <p>All process execution instances</p>
      </header>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        {/* Status chips */}
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleStatusFilter(f.value)}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: statusFilter === f.value ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.06)',
                background: statusFilter === f.value ? 'var(--color-foreground)' : 'var(--color-surface)',
                color: statusFilter === f.value ? '#fff' : 'var(--color-foreground-muted)',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                lineHeight: 1.4,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Process filter dropdown */}
        <select
          value={processFilter}
          onChange={(e) => handleProcessFilter(e.target.value)}
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'var(--color-surface)',
            color: 'var(--color-foreground-secondary)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            outline: 'none',
            appearance: 'auto',
          }}
        >
          <option value="all">All processes</option>
          {processNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: 'var(--color-foreground-muted)', padding: 32 }}>Loading runs...</p>
      ) : filteredRuns.length === 0 ? (
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            color: 'var(--color-foreground-muted)',
            fontSize: 14,
          }}
        >
          No runs match the current filters.
        </div>
      ) : (
        <>
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 100px 90px 80px',
                padding: '10px 20px',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-surface-hover)',
              }}
            >
              {['Process', 'Triggered by', 'Progress', 'Started', 'Duration', 'Status'].map((col) => (
                <span
                  key={col}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--color-foreground-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Rows */}
            {pagedRuns.map((run) => {
              const cfg = STATUS_CONFIG[run.status]
              const StatusIcon = cfg.icon
              return (
                <div
                  key={run.id}
                  onClick={() => handleRowClick(run)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 100px 90px 80px',
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--color-border-light)',
                    cursor: 'pointer',
                    transition: 'background 0.1s ease',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-surface-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {/* Process name + status icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <StatusIcon size={14} style={{ color: cfg.color, flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 550,
                        color: 'var(--color-foreground)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {run.workflowName}
                    </span>
                  </div>

                  {/* Triggered by */}
                  <span
                    style={{
                      fontSize: 13,
                      color: 'var(--color-foreground-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {run.triggeredBy}
                  </span>

                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        flex: 1,
                        height: 4,
                        background: 'var(--color-surface-active)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        maxWidth: 80,
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(run.stepsCompleted / run.stepsTotal) * 100}%`,
                          background: cfg.color,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--color-foreground-muted)',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {run.stepsCompleted}/{run.stepsTotal}
                    </span>
                  </div>

                  {/* Started */}
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--color-foreground-muted)',
                    }}
                  >
                    {formatRelativeTime(run.startedAt)}
                  </span>

                  {/* Duration */}
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--color-foreground-muted)',
                    }}
                  >
                    {formatDuration(run.startedAt, run.completedAt)}
                  </span>

                  {/* Status label */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: cfg.color,
                      background: cfg.bg,
                      padding: '3px 9px',
                      borderRadius: 6,
                      textTransform: 'capitalize',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {run.status}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16,
              padding: '0 4px',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: 'var(--color-foreground-muted)',
              }}
            >
              Showing {rangeStart}-{rangeEnd} of {filteredRuns.length}
            </span>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: page === 0 ? 'var(--color-foreground-subtle)' : 'var(--color-foreground-secondary)',
                  cursor: page === 0 ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.12s ease',
                }}
              >
                <TbChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color:
                    page >= totalPages - 1 ? 'var(--color-foreground-subtle)' : 'var(--color-foreground-secondary)',
                  cursor: page >= totalPages - 1 ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.12s ease',
                }}
              >
                <TbChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
