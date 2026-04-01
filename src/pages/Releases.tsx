import { useDrafts, useReleases } from '../providers/hooks'
import { useDataProvider } from '../providers/context'
import { StatusBadge } from '../components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import type { Release } from '../providers/types'
import { TbRocket, TbTrash, TbArrowBackUp, TbChevronDown, TbChevronRight } from 'react-icons/tb'
import { useState } from 'react'

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
  return <span style={{ fontSize: 12, color: 'var(--color-foreground-muted)' }}>{parts.join(', ')}</span>
}

function ExpandableChanges({ changes }: { changes: { type: string; entity: string; action: string }[] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
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
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color:
                    c.action === 'added'
                      ? 'var(--color-status-done)'
                      : c.action === 'removed'
                        ? 'var(--color-status-failed)'
                        : 'var(--color-status-processing)',
                  textTransform: 'capitalize',
                }}
              >
                {c.action}
              </span>
              <span style={{ color: 'var(--color-foreground-secondary)' }}>
                {c.type}: {c.entity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--color-foreground-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}

export function Releases() {
  const { data: drafts, loading: draftsLoading } = useDrafts()
  const { data: releases, loading: releasesLoading } = useReleases()
  const provider = useDataProvider()

  const activeRelease = releases?.find((r) => r.status === 'active')
  const pastReleases = releases?.filter((r) => r.status === 'inactive') ?? []
  const draft = drafts?.[0]

  return (
    <div style={{ maxWidth: 700 }}>
      <header className="page-header">
        <h1>Versions</h1>
        <p>Your live version, unreleased changes, and version history</p>
      </header>

      {/* Running version */}
      <SectionLabel>Running</SectionLabel>
      {activeRelease ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 20px',
            borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.06)',
            background: '#fff',
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-foreground)' }}>
            v{activeRelease.version}
          </span>
          <StatusBadge status="live" color="var(--color-status-done)" backgroundColor="#ecfdf5" />
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 12, color: 'var(--color-foreground-muted)', textAlign: 'right' }}>
            <div>{activeRelease.publishedBy}</div>
            <div>{formatDate(activeRelease.publishedAt)}</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: 20,
            textAlign: 'center',
            color: 'var(--color-foreground-muted)',
            fontSize: 13,
            marginBottom: 28,
          }}
        >
          {releasesLoading ? 'Loading...' : 'No active release'}
        </div>
      )}

      {/* Unreleased (draft) */}
      <SectionLabel>Unreleased</SectionLabel>
      {draftsLoading ? (
        <div
          style={{
            padding: 20,
            textAlign: 'center',
            color: 'var(--color-foreground-muted)',
            fontSize: 13,
            marginBottom: 28,
          }}
        >
          Loading...
        </div>
      ) : draft ? (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 10,
            border: '2px solid var(--color-status-processing)',
            background: '#fff',
            marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-foreground)' }}>{draft.chatTitle}</span>
            <StatusBadge status="unreleased" color="var(--color-status-processing)" backgroundColor="#fffbeb" />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--color-foreground-muted)' }}>{draft.createdBy}</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <ExpandableChanges changes={draft.changes} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" onClick={() => provider.publishDraft(draft.id)}>
              <TbRocket size={14} />
              Go Live
            </Button>
            <Button size="sm" variant="destructive" onClick={() => provider.discardDraft(draft.id)}>
              <TbTrash size={14} />
              Discard
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '20px',
            borderRadius: 10,
            border: '1px dashed rgba(0,0,0,0.12)',
            textAlign: 'center',
            color: 'var(--color-foreground-muted)',
            fontSize: 13,
            marginBottom: 28,
          }}
        >
          No unreleased changes.
        </div>
      )}

      {/* Older releases */}
      <SectionLabel>Older Releases</SectionLabel>
      {releasesLoading ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-foreground-muted)', fontSize: 13 }}>
          Loading...
        </div>
      ) : pastReleases.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pastReleases.map((r: Release) => (
            <div
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 8,
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-foreground)', width: 40 }}>
                v{r.version}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--color-foreground-secondary)' }}>{r.publishedBy}</div>
                <div style={{ fontSize: 11, color: 'var(--color-foreground-muted)' }}>{formatDate(r.publishedAt)}</div>
              </div>
              <ChangesSummary changes={r.changes} />
              <Button
                size="xs"
                variant="outline"
                className="text-foreground-muted"
                onClick={() => provider.restoreRelease(r.id)}
              >
                <TbArrowBackUp size={13} />
                Restore
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--color-foreground-muted)',
            fontSize: 13,
          }}
        >
          No older releases.
        </div>
      )}
    </div>
  )
}
