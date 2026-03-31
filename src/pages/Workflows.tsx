import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Workflow } from '../providers/types'
import { useProcesses, useAllRuns } from '../providers/hooks'
import { DataTable } from '../components/shared/DataTable'
import type { Column } from '../components/shared/DataTable'

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

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str
}

export function Workflows() {
  const navigate = useNavigate()
  const { data: workflows, loading } = useProcesses()
  const { data: runs } = useAllRuns()

  // Count active (running) runs per workflow
  const activeRunsByWorkflow = useMemo(() => {
    if (!runs) return {} as Record<string, number>
    const counts: Record<string, number> = {}
    for (const run of runs) {
      if (run.status === 'running') {
        counts[run.workflowId] = (counts[run.workflowId] ?? 0) + 1
      }
    }
    return counts
  }, [runs])

  const columns: Column<Workflow>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        width: '1.5fr',
        render: (w) => (
          <span style={{ fontSize: 13, fontWeight: 550, color: 'var(--color-foreground)' }}>{w.name}</span>
        ),
      },
      {
        key: 'description',
        header: 'Description',
        width: '2fr',
        render: (w) => (
          <span
            style={{
              fontSize: 13,
              color: 'var(--color-foreground-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {truncate(w.description, 50)}
          </span>
        ),
      },
      {
        key: 'nodes',
        header: 'Nodes',
        width: '80px',
        render: (w) => (
          <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {w.nodes.length}
          </span>
        ),
      },
      {
        key: 'lastRun',
        header: 'Last Run',
        width: '100px',
        render: (w) => (
          <span style={{ fontSize: 12, color: 'var(--color-foreground-muted)' }}>
            {w.lastRunAt ? formatRelativeTime(w.lastRunAt) : 'Never'}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        width: '100px',
        render: (w) => {
          const active = activeRunsByWorkflow[w.id] ?? 0
          if (active > 0) {
            return (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-status-processing)',
                  background: '#fffbeb',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-sm)',
                  whiteSpace: 'nowrap',
                }}
              >
                {active} active
              </span>
            )
          }
          return <span style={{ fontSize: 12, color: 'var(--color-foreground-muted)' }}>Idle</span>
        },
      },
    ],
    [activeRunsByWorkflow],
  )

  return (
    <div style={{ maxWidth: 1100 }}>
      <header className="page-header">
        <h1>Processes</h1>
        <p>Orchestrated flows of work across your team</p>
      </header>

      {loading ? (
        <p style={{ color: 'var(--color-foreground-muted)', padding: 32 }}>Loading processes...</p>
      ) : (
        <DataTable
          columns={columns}
          data={workflows ?? []}
          onRowClick={(w) => navigate(`/processes/${w.id}`)}
          rowKey={(w) => w.id}
        />
      )}
    </div>
  )
}
