import { useNavigate } from 'react-router-dom'
import { TEAM } from '../data/team'
import { ROLES } from '../data/roles'
import { TASKS } from '../data/tasks'
import { WORKFLOWS } from '../data/workflows'
import { TbRoute, TbUsers, TbSitemap, TbArrowRight, TbChevronRight } from 'react-icons/tb'
import { HiUsers } from 'react-icons/hi2'
import { RiRobot2Line } from 'react-icons/ri'

function StatCard({
  title,
  value,
  icon,
  color,
  bg,
  onClick,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  bg: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        borderRadius: 14,
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        padding: '24px 22px',
        textAlign: 'left' as const,
        fontFamily: 'inherit',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: bg,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        {onClick && <TbArrowRight size={15} style={{ color: '#9ca3af' }} />}
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: '#111827',
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: 500,
          color: '#6b7280',
        }}
      >
        {title}
      </div>
    </button>
  )
}

function ActivityItem({ text, time, dot }: { text: string; time: string; dot: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '16px 0',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: dot,
          marginTop: 6,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: '#111827' }}>{text}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>{time}</div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const people = TEAM.filter((m) => m.type === 'human')
  const agents = TEAM.filter((m) => m.type === 'agent')
  const runningProcesses = WORKFLOWS.filter((w) => w.nodes.some((n) => n.status === 'running'))

  return (
    <div>
      <header style={{ marginBottom: 44 }}>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#6b7280',
            marginTop: 6,
          }}
        >
          Overview of your workspace
        </p>
      </header>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
          gap: 18,
          marginBottom: 48,
        }}
      >
        <StatCard
          title="Processes"
          value={WORKFLOWS.length}
          icon={<TbRoute size={21} />}
          color="#3730a3"
          bg="#eef2ff"
          onClick={() => navigate('/processes')}
        />
        <StatCard
          title="People"
          value={people.length}
          icon={<HiUsers size={21} />}
          color="#6d28d9"
          bg="#f5f3ff"
          onClick={() => navigate('/team')}
        />
        <StatCard
          title="Agents"
          value={agents.length}
          icon={<RiRobot2Line size={21} />}
          color="#0e7490"
          bg="#ecfeff"
          onClick={() => navigate('/team')}
        />
        <StatCard
          title="Roles"
          value={ROLES.length}
          icon={<TbSitemap size={21} />}
          color="#c2410c"
          bg="#fff7ed"
          onClick={() => navigate('/admin')}
        />
        <StatCard
          title="Tasks"
          value={TASKS.length}
          icon={<TbUsers size={21} />}
          color="#047857"
          bg="#ecfdf5"
          onClick={() => navigate('/admin')}
        />
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
        {/* Active Processes */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.04em',
                color: '#9ca3af',
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
                gap: 2,
                fontSize: 12,
                fontWeight: 500,
                color: '#3730a3',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              View all <TbChevronRight size={14} />
            </button>
          </div>
          <div
            style={{
              borderRadius: 14,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              padding: '4px 22px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {runningProcesses.length > 0 ? (
              runningProcesses.map((w) => {
                const done = w.nodes.filter((n) => n.status === 'done').length
                const total = w.nodes.length
                const pct = Math.round((done / total) * 100)
                return (
                  <div
                    key={w.id}
                    onClick={() => navigate(`/processes/${w.id}`)}
                    style={{
                      padding: '18px 0',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.75'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{w.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af' }}>
                        {pct}% ({done}/{total})
                      </span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        borderRadius: 999,
                        background: '#f3f4f6',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          borderRadius: 999,
                          background: '#3730a3',
                          width: `${pct}%`,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ padding: '28px 0', textAlign: 'center' as const, fontSize: 14, color: '#9ca3af' }}>
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
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.04em',
                color: '#9ca3af',
                margin: 0,
              }}
            >
              Recent Activity
            </h2>
          </div>
          <div
            style={{
              borderRadius: 14,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              padding: '4px 22px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <ActivityItem text="Nora completed Market Research — Q4 Report" time="2 hours ago" dot="#22c55e" />
            <ActivityItem text="Felix started drafting Q4 Summary Report" time="3 hours ago" dot="#f59e0b" />
            <ActivityItem text="Mira reviewed and approved Vendor Contracts" time="Yesterday" dot="#22c55e" />
            <ActivityItem
              text="Alice assigned Bob to Project Lead role"
              time="Yesterday"
              dot="#3730a3"
              // last item — no bottom border handled by removing the style below
            />
          </div>
        </section>
      </div>
    </div>
  )
}
