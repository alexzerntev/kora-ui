import { useNavigate } from 'react-router-dom'
import { TEAM } from '../data/team'
import { ROLES } from '../data/roles'
import { TASKS } from '../data/tasks'
import { WORKFLOWS } from '../data/workflows'
import {
  TbRoute,
  TbUsers,
  TbSitemap,
  TbChevronRight,
  TbArrowUpRight,
  TbArrowDownRight,
  TbMinus,
  TbCircleCheckFilled,
  TbPlayerPlayFilled,
  TbAlertTriangleFilled,
  TbUserPlus,
} from 'react-icons/tb'
import { HiUsers } from 'react-icons/hi2'
import { RiRobot2Line } from 'react-icons/ri'

/* ── Stat Card — minimal, airy ── */

function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  onClick,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  accentColor?: string
  onClick?: () => void
}) {
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#9ca3af'
  const TrendIcon = trend === 'up' ? TbArrowUpRight : trend === 'down' ? TbArrowDownRight : TbMinus

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        borderRadius: 12,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        background: '#ffffff',
        padding: '20px',
        textAlign: 'left' as const,
        fontFamily: 'inherit',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.15s ease',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 0,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)'
        e.currentTarget.style.transform = 'translateY(0)'
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
        <span
          style={{
            fontSize: 13,
            fontWeight: 450,
            color: '#6b7280',
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </span>
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
      {trendLabel && (
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 450,
            color: trendColor,
          }}
        >
          <TrendIcon size={13} strokeWidth={2.5} />
          <span>{trendLabel}</span>
        </div>
      )}
    </button>
  )
}

/* ── Activity item ── */

interface ActivityEvent {
  text: string
  time: string
  type: 'completed' | 'started' | 'failed' | 'assigned'
}

const ACTIVITY_ICON_MAP = {
  completed: {
    icon: TbCircleCheckFilled,
    color: '#10b981',
  },
  started: {
    icon: TbPlayerPlayFilled,
    color: '#6b7280',
  },
  failed: {
    icon: TbAlertTriangleFilled,
    color: '#ef4444',
  },
  assigned: {
    icon: TbUserPlus,
    color: '#6b7280',
  },
}

function ActivityItem({ event, isLast }: { event: ActivityEvent; isLast?: boolean }) {
  const config = ACTIVITY_ICON_MAP[event.type]
  const IconComp = config.icon

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 0',
        borderBottom: isLast ? 'none' : '1px solid rgba(0, 0, 0, 0.04)',
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
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: '#374151',
            fontWeight: 400,
          }}
        >
          {event.text}
        </div>
        <div
          style={{
            marginTop: 2,
            fontSize: 12,
            color: '#9ca3af',
            fontWeight: 400,
          }}
        >
          {event.time}
        </div>
      </div>
    </div>
  )
}

/* ── Process table row ── */

function ProcessRow({
  name,
  pct,
  nodesDone,
  nodesTotal,
  onClick,
  isLast,
}: {
  name: string
  pct: number
  nodesDone: number
  nodesTotal: number
  onClick: () => void
  isLast?: boolean
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 100px 60px 16px',
        alignItems: 'center',
        gap: 16,
        padding: '11px 0',
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
      <span
        style={{
          fontSize: 13,
          fontWeight: 450,
          color: '#374151',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>
      {/* Progress bar */}
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
            background: pct === 100 ? '#10b981' : '#6b7280',
            width: `${pct}%`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 400,
          color: '#9ca3af',
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'right' as const,
        }}
      >
        {nodesDone}/{nodesTotal}
      </span>
      <TbChevronRight size={13} style={{ color: '#d1d5db' }} />
    </div>
  )
}

/* ── Main Dashboard ── */

export function Dashboard() {
  const navigate = useNavigate()
  const people = TEAM.filter((m) => m.type === 'human')
  const agents = TEAM.filter((m) => m.type === 'agent')
  const runningProcesses = WORKFLOWS.filter((w) => w.nodes.some((n) => n.status === 'running'))
  const busyMembers = TEAM.filter((m) => m.status === 'busy')

  const ACTIVITY_EVENTS: ActivityEvent[] = [
    {
      text: 'Nora completed Market Research \u2014 Q4 Report',
      time: '2 hours ago',
      type: 'completed',
    },
    {
      text: 'Felix started drafting Q4 Summary Report',
      time: '3 hours ago',
      type: 'started',
    },
    {
      text: 'Mira reviewed and approved Vendor Contracts',
      time: 'Yesterday',
      type: 'completed',
    },
    {
      text: 'Alice assigned Bob to Project Lead role',
      time: 'Yesterday',
      type: 'assigned',
    },
  ]

  return (
    <div>
      {/* ── Greeting ── */}
      <header style={{ marginBottom: 36 }}>
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

      {/* ── Stat cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 14,
          marginBottom: 40,
        }}
      >
        <StatCard
          title="Processes"
          value={WORKFLOWS.length}
          icon={<TbRoute size={17} />}
          trend="up"
          trendLabel={`${runningProcesses.length} active`}
          accentColor="#6b7280"
          onClick={() => navigate('/processes')}
        />
        <StatCard
          title="People"
          value={people.length}
          icon={<HiUsers size={17} />}
          trend="neutral"
          trendLabel={`${people.filter((p) => p.status === 'busy').length} busy`}
          accentColor="#6b7280"
          onClick={() => navigate('/team')}
        />
        <StatCard
          title="Agents"
          value={agents.length}
          icon={<RiRobot2Line size={17} />}
          trend="up"
          trendLabel={`${busyMembers.filter((m) => m.type === 'agent').length} active`}
          accentColor="#6b7280"
          onClick={() => navigate('/team')}
        />
        <StatCard
          title="Roles"
          value={ROLES.length}
          icon={<TbSitemap size={17} />}
          accentColor="#6b7280"
          onClick={() => navigate('/admin')}
        />
        <StatCard
          title="Capabilities"
          value={TASKS.length}
          icon={<TbUsers size={17} />}
          accentColor="#6b7280"
          onClick={() => navigate('/admin')}
        />
      </div>

      {/* ── Two-column: Processes + Activity ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}
      >
        {/* Active Processes */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#111827',
                margin: 0,
              }}
            >
              Active Processes
            </h2>
            <button
              onClick={() => navigate('/processes')}
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
              View all <TbChevronRight size={12} />
            </button>
          </div>
          <div
            style={{
              borderRadius: 12,
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: '#ffffff',
              padding: '2px 20px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 60px 16px',
                alignItems: 'center',
                gap: 16,
                padding: '10px 0',
                borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 450,
                  color: '#9ca3af',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.04em',
                }}
              >
                Name
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 450,
                  color: '#9ca3af',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.04em',
                }}
              >
                Progress
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 450,
                  color: '#9ca3af',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.04em',
                  textAlign: 'right' as const,
                }}
              >
                Nodes
              </span>
              <span />
            </div>
            {runningProcesses.length > 0 ? (
              runningProcesses.map((w, i) => {
                const done = w.nodes.filter((n) => n.status === 'done').length
                const total = w.nodes.length
                const pct = Math.round((done / total) * 100)
                return (
                  <ProcessRow
                    key={w.id}
                    name={w.name}
                    pct={pct}
                    nodesDone={done}
                    nodesTotal={total}
                    onClick={() => navigate(`/processes/${w.id}`)}
                    isLast={i === runningProcesses.length - 1}
                  />
                )
              })
            ) : (
              <div
                style={{
                  padding: '28px 0',
                  textAlign: 'center' as const,
                  fontSize: 13,
                  color: '#9ca3af',
                }}
              >
                No processes running
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#111827',
                margin: 0,
              }}
            >
              Recent Activity
            </h2>
          </div>
          <div
            style={{
              borderRadius: 12,
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: '#ffffff',
              padding: '2px 20px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            }}
          >
            {ACTIVITY_EVENTS.map((event, i) => (
              <ActivityItem key={i} event={event} isLast={i === ACTIVITY_EVENTS.length - 1} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
