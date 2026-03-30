import { useNavigate } from 'react-router-dom'
import { useProcessRuns, usePendingActions, useActivityFeed, useTeam, useSubscription } from '../providers'
import type { DataEvent, ProcessRun, PendingAction, ActivityEntry } from '../providers'
import {
  TbCircleCheckFilled,
  TbPlayerPlayFilled,
  TbAlertTriangleFilled,
  TbUserPlus,
  TbChevronRight,
  TbClock,
  TbActivity,
  TbUsers,
  TbChecklist,
  TbShieldCheck,
  TbAlertCircle,
  TbInfoCircle,
  TbClockHour4,
  TbPlayerPause,
} from 'react-icons/tb'

/* ── Helpers ── */

function timeAgo(iso: string): string {
  const now = new Date()
  const then = new Date(iso)
  const diffMs = now.getTime() - then.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

function eventToActivity(event: DataEvent): { text: string; type: ActivityEntry['type'] } {
  switch (event.type) {
    case 'process.started':
      return { text: `Process ${event.processId} started`, type: 'started' }
    case 'process.completed':
      return { text: `Process ${event.processId} completed`, type: 'completed' }
    case 'process.failed':
      return { text: `Process ${event.processId} failed: ${event.error}`, type: 'failed' }
    case 'task.assigned':
      return { text: `${event.assignee} assigned to task`, type: 'assigned' }
    case 'task.completed':
      return { text: `${event.assignee} completed a task`, type: 'completed' }
    case 'activity':
      return { text: event.text, type: 'completed' }
  }
}

/* ── Health Banner ── */

function HealthBanner({ failedCount, pendingCount }: { failedCount: number; pendingCount: number }) {
  const level = failedCount > 0 ? 'red' : pendingCount > 0 ? 'yellow' : 'green'
  const config = {
    green: {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      color: '#166534',
      icon: TbShieldCheck,
      text: 'All systems operational',
    },
    yellow: {
      bg: '#fffbeb',
      border: '#fde68a',
      color: '#92400e',
      icon: TbInfoCircle,
      text: `${pendingCount} item${pendingCount !== 1 ? 's' : ''} need${pendingCount === 1 ? 's' : ''} attention`,
    },
    red: {
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#991b1b',
      icon: TbAlertCircle,
      text: `${failedCount} process${failedCount !== 1 ? 'es' : ''} failed`,
    },
  }[level]

  const IconComp = config.icon

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 18px',
        borderRadius: 10,
        background: config.bg,
        border: `1px solid ${config.border}`,
        marginBottom: 28,
      }}
    >
      <IconComp size={18} style={{ color: config.color, flexShrink: 0 }} />
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: config.color,
        }}
      >
        {config.text}
      </span>
    </div>
  )
}

/* ── Metric Card ── */

function MetricCard({
  title,
  value,
  icon,
  subtitle,
  accentColor,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  subtitle?: string
  accentColor: string
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        background: '#ffffff',
        padding: '20px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 450, color: '#6b7280' }}>{title}</span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: accentColor + '10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: '#111827',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            fontWeight: 450,
            color: '#9ca3af',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  )
}

/* ── Run status badge ── */

function RunStatusBadge({ status }: { status: ProcessRun['status'] }) {
  const config = {
    running: { bg: '#eff6ff', color: '#1d4ed8', label: 'Running' },
    completed: { bg: '#f0fdf4', color: '#16a34a', label: 'Completed' },
    failed: { bg: '#fef2f2', color: '#dc2626', label: 'Failed' },
    paused: { bg: '#fefce8', color: '#ca8a04', label: 'Paused' },
  }[status]

  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '3px 8px',
        borderRadius: 6,
        background: config.bg,
        color: config.color,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  )
}

/* ── Active Process Row ── */

function ActiveProcessRow({ run, onClick, isLast }: { run: ProcessRun; onClick: () => void; isLast?: boolean }) {
  const StatusIcon =
    run.status === 'running'
      ? TbPlayerPlayFilled
      : run.status === 'paused'
        ? TbPlayerPause
        : run.status === 'failed'
          ? TbAlertTriangleFilled
          : TbCircleCheckFilled

  const iconColor =
    run.status === 'running'
      ? '#2563eb'
      : run.status === 'paused'
        ? '#ca8a04'
        : run.status === 'failed'
          ? '#ef4444'
          : '#10b981'

  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '20px 1fr 90px 80px 16px',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: isLast ? 'none' : '1px solid rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        transition: 'opacity 0.12s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.6'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1'
      }}
    >
      <StatusIcon size={14} style={{ color: iconColor }} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {run.workflowName}
        </div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{run.currentStep}</div>
      </div>
      {/* Progress bar */}
      <div>
        <div
          style={{
            height: 4,
            borderRadius: 999,
            background: 'rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 999,
              background: run.status === 'failed' ? '#ef4444' : run.progress === 100 ? '#10b981' : '#2563eb',
              width: `${run.progress}%`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        <div
          style={{
            fontSize: 10,
            color: '#9ca3af',
            marginTop: 3,
            textAlign: 'right' as const,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {run.stepsCompleted}/{run.stepsTotal}
        </div>
      </div>
      <RunStatusBadge status={run.status} />
      <TbChevronRight size={13} style={{ color: '#d1d5db' }} />
    </div>
  )
}

/* ── Pending Action Row ── */

function PendingActionRow({ action, isLast }: { action: PendingAction; isLast?: boolean }) {
  const typeConfig = {
    approval: { icon: TbShieldCheck, color: '#7c3aed', label: 'Approval' },
    review: { icon: TbChecklist, color: '#2563eb', label: 'Review' },
    decision: { icon: TbAlertCircle, color: '#ea580c', label: 'Decision' },
    input: { icon: TbInfoCircle, color: '#6b7280', label: 'Input' },
  }[action.type]

  const priorityConfig = {
    high: { color: '#dc2626', bg: '#fef2f2' },
    medium: { color: '#ca8a04', bg: '#fefce8' },
    low: { color: '#6b7280', bg: '#f3f4f6' },
  }[action.priority]

  const TypeIcon = typeConfig.icon

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 0',
        borderBottom: isLast ? 'none' : '1px solid rgba(0, 0, 0, 0.04)',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: typeConfig.color + '10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <TypeIcon size={15} style={{ color: typeConfig.color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            marginBottom: 2,
          }}
        >
          {action.title}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>
          {action.assigneeName} &middot; {action.processName}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 4 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: 4,
            background: priorityConfig.bg,
            color: priorityConfig.color,
            textTransform: 'uppercase' as const,
          }}
        >
          {action.priority}
        </span>
        {action.dueAt && (
          <span style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3 }}>
            <TbClockHour4 size={11} /> {timeAgo(action.dueAt)}
          </span>
        )}
      </div>
    </div>
  )
}

/* ── Activity Row ── */

const ACTIVITY_ICON_MAP = {
  completed: { icon: TbCircleCheckFilled, color: '#10b981' },
  started: { icon: TbPlayerPlayFilled, color: '#6b7280' },
  failed: { icon: TbAlertTriangleFilled, color: '#ef4444' },
  assigned: { icon: TbUserPlus, color: '#6b7280' },
}

function ActivityRow({
  text,
  type,
  time,
  isLast,
  isNew,
}: {
  text: string
  type: keyof typeof ACTIVITY_ICON_MAP
  time: string
  isLast?: boolean
  isNew?: boolean
}) {
  const config = ACTIVITY_ICON_MAP[type]
  const IconComp = config.icon

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 0',
        borderBottom: isLast ? 'none' : '1px solid rgba(0, 0, 0, 0.04)',
        background: isNew ? 'rgba(37, 99, 235, 0.02)' : 'transparent',
        transition: 'background 1s ease',
      }}
    >
      <div
        style={{
          color: config.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <IconComp size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: '#374151', fontWeight: 400 }}>{text}</div>
        <div style={{ marginTop: 2, fontSize: 12, color: '#9ca3af', fontWeight: 400 }}>{time}</div>
      </div>
      {isNew && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: 4,
            background: '#eff6ff',
            color: '#2563eb',
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          NEW
        </span>
      )}
    </div>
  )
}

/* ── Section Header ── */

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}
    >
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>{title}</h2>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            fontSize: 12,
            fontWeight: 400,
            color: '#9ca3af',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: 0,
            transition: 'color 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6b7280'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9ca3af'
          }}
        >
          {actionLabel} <TbChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

/* ── Card wrapper ── */

function Card({ children, padding }: { children: React.ReactNode; padding?: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        background: '#ffffff',
        padding: padding ?? '2px 20px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      }}
    >
      {children}
    </div>
  )
}

/* ── Main Dashboard ── */

export function Dashboard() {
  const navigate = useNavigate()
  const { events, refetchKey } = useSubscription()
  const { data: runs, loading: runsLoading } = useProcessRuns(refetchKey)
  const { data: actions, loading: actionsLoading } = usePendingActions(refetchKey)
  const { data: feed, loading: feedLoading } = useActivityFeed(refetchKey)
  const { data: team, loading: teamLoading } = useTeam(refetchKey)

  if (runsLoading || actionsLoading || feedLoading || teamLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>Loading...</div>
  }

  const allRuns = runs ?? []
  const allActions = actions ?? []
  const allFeed = feed ?? []
  const teamData = team ?? []

  // Metrics
  const activeRuns = allRuns.filter((r) => r.status === 'running' || r.status === 'paused')
  const failedRuns = allRuns.filter((r) => r.status === 'failed')
  const completedToday = allRuns.filter((r) => {
    if (r.status !== 'completed' || !r.completedAt) return false
    const completed = new Date(r.completedAt)
    const today = new Date()
    return (
      completed.getDate() === today.getDate() &&
      completed.getMonth() === today.getMonth() &&
      completed.getFullYear() === today.getFullYear()
    )
  })
  const busyMembers = teamData.filter((m) => m.status === 'busy')

  // Merge real-time events into activity feed (newest first)
  const liveActivities: { text: string; type: ActivityEntry['type']; timestamp: string; isNew: boolean }[] = events.map(
    (e) => {
      const a = eventToActivity(e)
      return { text: a.text, type: a.type, timestamp: e.timestamp.toISOString(), isNew: true }
    },
  )
  const historicActivities = allFeed
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .map((a) => ({ text: a.text, type: a.type, timestamp: a.timestamp, isNew: false }))
  const mergedActivities = [...liveActivities, ...historicActivities].slice(0, 10)

  // Show running + paused + failed in active processes
  const visibleRuns = allRuns
    .filter((r) => r.status === 'running' || r.status === 'paused' || r.status === 'failed')
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

  return (
    <div>
      {/* ── Greeting ── */}
      <header style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.025em',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#9ca3af',
            marginTop: 6,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          Here is what is happening across your workspace today.
        </p>
      </header>

      {/* ── Health Banner ── */}
      <HealthBanner failedCount={failedRuns.length} pendingCount={allActions.length} />

      {/* ── Key Metrics ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 32,
        }}
      >
        <MetricCard
          title="Active Processes"
          value={activeRuns.length}
          icon={<TbActivity size={17} />}
          subtitle={`${allRuns.length} total runs`}
          accentColor="#2563eb"
        />
        <MetricCard
          title="Pending Tasks"
          value={allActions.length}
          icon={<TbClock size={17} />}
          subtitle={`${allActions.filter((a) => a.priority === 'high').length} high priority`}
          accentColor="#f59e0b"
        />
        <MetricCard
          title="Completed Today"
          value={completedToday.length}
          icon={<TbCircleCheckFilled size={17} />}
          subtitle="Processes finished"
          accentColor="#10b981"
        />
        <MetricCard
          title="Team Utilization"
          value={`${busyMembers.length}/${teamData.length}`}
          icon={<TbUsers size={17} />}
          subtitle={`${teamData.length - busyMembers.length} available`}
          accentColor="#7c3aed"
        />
      </div>

      {/* ── Two-column: Active Processes + Pending Actions ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          marginBottom: 32,
        }}
      >
        {/* Active Processes */}
        <section>
          <SectionHeader title="Active Processes" actionLabel="View all" onAction={() => navigate('/processes')} />
          <Card>
            {visibleRuns.length > 0 ? (
              visibleRuns.map((run, i) => (
                <ActiveProcessRow
                  key={run.id}
                  run={run}
                  onClick={() => navigate(`/processes/${run.workflowId}`)}
                  isLast={i === visibleRuns.length - 1}
                />
              ))
            ) : (
              <div
                style={{
                  padding: '28px 0',
                  textAlign: 'center' as const,
                  fontSize: 13,
                  color: '#9ca3af',
                }}
              >
                No active processes
              </div>
            )}
          </Card>
        </section>

        {/* Pending Actions */}
        <section>
          <SectionHeader title="Pending Actions" />
          <Card>
            {allActions.length > 0 ? (
              allActions.map((action, i) => (
                <PendingActionRow key={action.id} action={action} isLast={i === allActions.length - 1} />
              ))
            ) : (
              <div
                style={{
                  padding: '28px 0',
                  textAlign: 'center' as const,
                  fontSize: 13,
                  color: '#9ca3af',
                }}
              >
                No pending actions
              </div>
            )}
          </Card>
        </section>
      </div>

      {/* ── Activity Feed (full width) ── */}
      <section>
        <SectionHeader title="Recent Activity" />
        <Card>
          {mergedActivities.length > 0 ? (
            mergedActivities.map((item, i) => (
              <ActivityRow
                key={`${item.timestamp}-${i}`}
                text={item.text}
                type={item.type}
                time={timeAgo(item.timestamp)}
                isLast={i === mergedActivities.length - 1}
                isNew={item.isNew}
              />
            ))
          ) : (
            <div
              style={{
                padding: '28px 0',
                textAlign: 'center' as const,
                fontSize: 13,
                color: '#9ca3af',
              }}
            >
              No recent activity
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
