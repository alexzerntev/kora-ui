import { useState } from 'react'
import { TbGitBranch, TbCheck, TbHistory } from 'react-icons/tb'
import { useReleases, useDrafts } from '@/providers/hooks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type VersionSelection =
  | { type: 'main' }
  | { type: 'workspace'; draftId: string }
  | { type: 'history'; releaseId: string; version: number }

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function VersionBar() {
  const { data: releases } = useReleases()
  const { data: drafts } = useDrafts()
  const [selected, setSelected] = useState<VersionSelection>({ type: 'main' })

  const activeRelease = releases?.find((r) => r.status === 'active')
  const pastReleases = releases?.filter((r) => r.status === 'inactive') ?? []

  const currentLabel = (() => {
    switch (selected.type) {
      case 'main':
        return 'main'
      case 'workspace': {
        const draft = drafts?.find((d) => d.id === selected.draftId)
        return draft?.chatTitle ?? 'workspace'
      }
      case 'history':
        return `v${selected.version}`
    }
  })()

  const isHistorical = selected.type === 'history'
  const isWorkspace = selected.type === 'workspace'

  return (
    <div
      style={{
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        flexShrink: 0,
        fontSize: 13,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'inherit',
                color: 'var(--color-foreground)',
                transition: 'all 0.12s ease',
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-strong)'
                e.currentTarget.style.background = 'var(--color-surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.background = 'var(--color-surface)'
              }}
            >
              <TbGitBranch size={14} strokeWidth={1.8} />
              <span>{currentLabel}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 2, opacity: 0.5 }}>
                <path
                  d="M2.5 4L5 6.5L7.5 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[280px]">
            {/* Live section */}
            <DropdownMenuLabel
              className="text-[10.5px] font-semibold tracking-wider uppercase"
              style={{ color: 'var(--color-foreground-muted)' }}
            >
              Live
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSelected({ type: 'main' })} className="gap-2.5">
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--color-status-done)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 500 }}>main{activeRelease ? ` (v${activeRelease.version})` : ''}</span>
              {selected.type === 'main' && (
                <TbCheck
                  size={15}
                  strokeWidth={2}
                  style={{
                    marginLeft: 'auto',
                    color: 'var(--color-foreground)',
                  }}
                />
              )}
            </DropdownMenuItem>

            {/* Workspaces section */}
            {drafts && drafts.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel
                  className="text-[10.5px] font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--color-foreground-muted)' }}
                >
                  Workspaces
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {drafts.map((draft) => (
                    <DropdownMenuItem
                      key={draft.id}
                      onClick={() => setSelected({ type: 'workspace', draftId: draft.id })}
                      className="gap-2.5"
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: 'var(--color-status-processing)',
                          flexShrink: 0,
                        }}
                      />
                      <span className="truncate">{draft.chatTitle}</span>
                      {selected.type === 'workspace' && selected.draftId === draft.id && (
                        <TbCheck
                          size={15}
                          strokeWidth={2}
                          style={{
                            marginLeft: 'auto',
                            flexShrink: 0,
                            color: 'var(--color-foreground)',
                          }}
                        />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            {/* History section */}
            {pastReleases.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel
                  className="text-[10.5px] font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--color-foreground-muted)' }}
                >
                  History
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {pastReleases.map((release) => (
                    <DropdownMenuItem
                      key={release.id}
                      onClick={() =>
                        setSelected({
                          type: 'history',
                          releaseId: release.id,
                          version: release.version,
                        })
                      }
                      className="gap-2.5"
                    >
                      <TbHistory
                        size={14}
                        strokeWidth={1.6}
                        style={{
                          color: 'var(--color-foreground-muted)',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: 'var(--color-foreground-secondary)' }}>v{release.version}</span>
                      <span
                        style={{
                          color: 'var(--color-foreground-muted)',
                          fontSize: 12,
                        }}
                      >
                        {formatDate(release.publishedAt)}
                      </span>
                      {selected.type === 'history' && selected.releaseId === release.id && (
                        <TbCheck
                          size={15}
                          strokeWidth={2}
                          style={{
                            marginLeft: 'auto',
                            flexShrink: 0,
                            color: 'var(--color-foreground)',
                          }}
                        />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Historical version banner */}
        {isHistorical && (
          <span
            style={{
              fontSize: 12,
              color: 'var(--color-foreground-muted)',
              fontStyle: 'italic',
            }}
          >
            Viewing v{(selected as { version: number }).version} — not the current version
          </span>
        )}
      </div>

      {/* Publish button — only for workspaces */}
      {isWorkspace && (
        <Button size="sm" className="h-7 text-xs">
          Publish
        </Button>
      )}
    </div>
  )
}
