import { useState } from 'react'
import { useDrafts, useReleases } from '../providers/hooks'
import { useDataProvider } from '../providers/context'
import { DataTable } from '../components/shared/DataTable'
import { StatusBadge } from '../components/shared/StatusBadge'
import type { Column } from '../components/shared/DataTable'
import type { Draft, Release } from '../providers/types'
import { TbRocket, TbTrash, TbArrowBackUp, TbChevronDown, TbChevronRight } from 'react-icons/tb'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ChangesSummary({ changes }: { changes: { action: string }[] }) {
  const added = changes.filter((c) => c.action === 'added').length
  const modified = changes.filter((c) => c.action === 'modified').length
  const removed = changes.filter((c) => c.action === 'removed').length
  const parts: string[] = []
  if (added > 0) parts.push(`${added} added`)
  if (modified > 0) parts.push(`${modified} modified`)
  if (removed > 0) parts.push(`${removed} removed`)
  return <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{parts.join(', ')}</span>
}

function ChangeBadge({ action }: { action: string }) {
  const cfg: Record<string, { color: string; bg: string }> = {
    added: { color: 'var(--color-status-done)', bg: '#ecfdf5' },
    modified: { color: 'var(--color-status-processing)', bg: '#fffbeb' },
    removed: { color: 'var(--color-status-failed)', bg: '#fef2f2' },
  }
  const style = cfg[action] ?? { color: 'var(--color-foreground-muted)', bg: '#f3f4f6' }
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        color: style.color,
        background: style.bg,
        padding: '2px 7px',
        borderRadius: 4,
        textTransform: 'capitalize',
      }}
    >
      {action}
    </span>
  )
}

function ExpandableChanges({ changes }: { changes: { type: string; entity: string; action: string }[] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 12,
          color: 'var(--color-primary)',
          fontWeight: 500,
          padding: 0,
        }}
      >
        {expanded ? <TbChevronDown size={14} /> : <TbChevronRight size={14} />}
        {changes.length} change{changes.length !== 1 ? 's' : ''}
      </button>
      {expanded && (
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {changes.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ChangeBadge action={c.action} />
              <span style={{ fontSize: 12, color: 'var(--color-foreground-muted)' }}>{c.type}</span>
              <span style={{ fontSize: 12, color: 'var(--color-foreground-secondary)', fontWeight: 500 }}>
                {c.entity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  variant,
  onClick,
}: {
  icon: typeof TbRocket
  label: string
  variant: 'primary' | 'danger' | 'default'
  onClick: () => void
}) {
  const styles: Record<string, { color: string; bg: string; hoverBg: string; border: string }> = {
    primary: {
      color: '#fff',
      bg: 'var(--color-primary)',
      hoverBg: '#1e40af',
      border: 'var(--color-primary)',
    },
    danger: {
      color: 'var(--color-status-failed)',
      bg: 'transparent',
      hoverBg: '#fef2f2',
      border: 'var(--color-border)',
    },
    default: {
      color: 'var(--color-foreground-secondary)',
      bg: 'transparent',
      hoverBg: 'rgba(0,0,0,0.03)',
      border: 'var(--color-border)',
    },
  }
  const s = styles[variant]
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 12px',
        borderRadius: 7,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontSize: 12,
        fontWeight: 550,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 0.12s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = s.hoverBg
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = s.bg
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

export function Releases() {
  const [tab, setTab] = useState<'drafts' | 'releases'>('drafts')
  const { data: drafts, loading: draftsLoading } = useDrafts()
  const { data: releases, loading: releasesLoading } = useReleases()
  const provider = useDataProvider()

  const draftColumns: Column<Draft>[] = [
    {
      key: 'source',
      header: 'Source',
      width: '1.5fr',
      render: (d) => (
        <div>
          <span style={{ fontSize: 13, fontWeight: 550, color: 'var(--color-foreground)' }}>{d.chatTitle}</span>
        </div>
      ),
    },
    {
      key: 'changes',
      header: 'Changes',
      width: '1.5fr',
      render: (d) => <ExpandableChanges changes={d.changes} />,
    },
    {
      key: 'created',
      header: 'Created',
      width: '1fr',
      render: (d) => (
        <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{formatDate(d.createdAt)}</span>
      ),
    },
    {
      key: 'creator',
      header: 'Creator',
      width: '0.8fr',
      render: (d) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{d.createdBy}</span>,
    },
    {
      key: 'actions',
      header: '',
      width: '200px',
      render: (d) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <ActionButton icon={TbRocket} label="Publish" variant="primary" onClick={() => provider.publishDraft(d.id)} />
          <ActionButton icon={TbTrash} label="Discard" variant="danger" onClick={() => provider.discardDraft(d.id)} />
        </div>
      ),
    },
  ]

  const releaseColumns: Column<Release>[] = [
    {
      key: 'version',
      header: 'Version',
      width: '120px',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>v{r.version}</span>
          {r.status === 'active' && (
            <StatusBadge status="active" color="var(--color-status-done)" backgroundColor="#ecfdf5" />
          )}
        </div>
      ),
    },
    {
      key: 'publishedBy',
      header: 'Published by',
      width: '1fr',
      render: (r) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{r.publishedBy}</span>,
    },
    {
      key: 'publishedAt',
      header: 'Published',
      width: '1fr',
      render: (r) => (
        <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{formatDate(r.publishedAt)}</span>
      ),
    },
    {
      key: 'changes',
      header: 'Changes',
      width: '1.5fr',
      render: (r) => <ChangesSummary changes={r.changes} />,
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      render: (r) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {r.status === 'inactive' && (
            <ActionButton
              icon={TbArrowBackUp}
              label="Restore"
              variant="default"
              onClick={() => provider.restoreRelease(r.id)}
            />
          )}
        </div>
      ),
    },
  ]

  const loading = tab === 'drafts' ? draftsLoading : releasesLoading

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          Releases
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-foreground-muted)',
            marginTop: 4,
          }}
        >
          Manage drafts and published releases
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: 20,
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {(['drafts', 'releases'] as const).map((t) => {
          const isActive = tab === t
          const count = t === 'drafts' ? (drafts?.length ?? 0) : (releases?.length ?? 0)
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-foreground)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: isActive ? 600 : 450,
                color: isActive ? 'var(--color-foreground)' : 'var(--color-foreground-muted)',
                transition: 'all 0.12s ease',
                textTransform: 'capitalize',
                marginBottom: -1,
              }}
            >
              {t}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: isActive ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.04)',
                  color: isActive ? 'var(--color-foreground-secondary)' : 'var(--color-foreground-muted)',
                  borderRadius: 6,
                  padding: '1px 7px',
                  lineHeight: '18px',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ padding: 32, textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</p>
      ) : tab === 'drafts' ? (
        drafts && drafts.length > 0 ? (
          <DataTable columns={draftColumns} data={drafts} rowKey={(d) => d.id} />
        ) : (
          <div
            style={{
              padding: 48,
              textAlign: 'center',
              color: 'var(--color-foreground-muted)',
              fontSize: 14,
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}
          >
            No pending drafts. All changes have been published.
          </div>
        )
      ) : releases && releases.length > 0 ? (
        <DataTable columns={releaseColumns} data={releases} rowKey={(r) => r.id} />
      ) : (
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            color: 'var(--color-foreground-muted)',
            fontSize: 14,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          No releases yet.
        </div>
      )}
    </div>
  )
}
