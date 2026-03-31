import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllRuns } from '../providers/hooks'
import type { ProcessRun, RunStatus } from '../providers/types'
import { FilterChips } from '../components/shared/FilterChips'
import { DataTable } from '../components/shared/DataTable'
import type { Column } from '../components/shared/DataTable'
import { Pagination } from '../components/shared/Pagination'
import { StatusBadge } from '../components/shared/StatusBadge'
import { StatusIcon } from '../components/shared/StatusIcon'

const PAGE_SIZE = 10

const STATUS_FILTERS: { label: string; value: RunStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Running', value: 'running' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Paused', value: 'paused' },
]

const STATUS_COLORS: Record<RunStatus, { color: string; bg: string }> = {
  running: { color: 'var(--color-status-done)', bg: '#ecfdf5' },
  completed: { color: 'var(--color-status-done)', bg: '#ecfdf5' },
  failed: { color: 'var(--color-status-failed)', bg: '#fef2f2' },
  paused: { color: 'var(--color-status-processing)', bg: '#fffbeb' },
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

const COLUMNS: Column<ProcessRun>[] = [
  {
    key: 'process',
    header: 'Process',
    width: '1fr',
    render: (run) => {
      const cfg = STATUS_COLORS[run.status]
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <StatusIcon variant={run.status} size={14} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 550,
              color: cfg.color === '#ef4444' ? 'var(--color-foreground)' : 'var(--color-foreground)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {run.workflowName}
          </span>
        </div>
      )
    },
  },
  {
    key: 'triggeredBy',
    header: 'Triggered by',
    width: '1fr',
    render: (run) => (
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
    ),
  },
  {
    key: 'progress',
    header: 'Progress',
    width: '1fr',
    render: (run) => {
      const cfg = STATUS_COLORS[run.status]
      return (
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
      )
    },
  },
  {
    key: 'started',
    header: 'Started',
    width: '100px',
    render: (run) => (
      <span style={{ fontSize: 12, color: 'var(--color-foreground-muted)' }}>{formatRelativeTime(run.startedAt)}</span>
    ),
  },
  {
    key: 'duration',
    header: 'Duration',
    width: '90px',
    render: (run) => (
      <span style={{ fontSize: 12, color: 'var(--color-foreground-muted)' }}>
        {formatDuration(run.startedAt, run.completedAt)}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: '80px',
    render: (run) => {
      const cfg = STATUS_COLORS[run.status]
      return <StatusBadge status={run.status} color={cfg.color} backgroundColor={cfg.bg} />
    },
  },
]

export function Runs() {
  const { data: runs, loading } = useAllRuns()
  const navigate = useNavigate()
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

  const pagedRuns = filteredRuns.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

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
    navigate(`/processes/${run.workflowId}?run=${run.id}`)
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
        <FilterChips options={STATUS_FILTERS} value={statusFilter} onChange={handleStatusFilter} />

        {/* Process filter dropdown */}
        <select
          value={processFilter}
          onChange={(e) => handleProcessFilter(e.target.value)}
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
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
          <DataTable columns={COLUMNS} data={pagedRuns} onRowClick={handleRowClick} rowKey={(run) => run.id} />

          <Pagination page={page} pageSize={PAGE_SIZE} total={filteredRuns.length} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
