import { useNavigate } from 'react-router-dom'
import { TEAM } from '../data/team'
import { ROLES } from '../data/roles'
import { TASKS } from '../data/tasks'
import { WORKFLOWS } from '../data/workflows'
import { StatCard } from '../components/shared/StatCard'
import { TbRoute, TbUsers, TbSitemap } from 'react-icons/tb'
import { HiUsers } from 'react-icons/hi2'
import { RiRobot2Line } from 'react-icons/ri'

function ActivityItem({ text, time, dot }: { text: string; time: string; dot: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border-light)',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: dot,
          marginTop: 5,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5 }}>{text}</div>
        <div style={{ fontSize: 11, color: 'var(--color-ink-muted)', marginTop: 2 }}>{time}</div>
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
    <div style={{ maxWidth: 1100 }}>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your workspace</p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
          marginBottom: 36,
        }}
      >
        <StatCard
          title="Processes"
          value={WORKFLOWS.length}
          icon={<TbRoute size={18} />}
          color="#2563eb"
          bg="#eff6ff"
          onClick={() => navigate('/processes')}
        />
        <StatCard
          title="People"
          value={people.length}
          icon={<HiUsers size={18} />}
          color="#7c3aed"
          bg="#f5f3ff"
          onClick={() => navigate('/team')}
        />
        <StatCard
          title="Agents"
          value={agents.length}
          icon={<RiRobot2Line size={18} />}
          color="#0891b2"
          bg="#ecfeff"
          onClick={() => navigate('/team')}
        />
        <StatCard
          title="Roles"
          value={ROLES.length}
          icon={<TbSitemap size={18} />}
          color="#ea580c"
          bg="#fff7ed"
          onClick={() => navigate('/admin')}
        />
        <StatCard
          title="Tasks"
          value={TASKS.length}
          icon={<TbUsers size={18} />}
          color="#059669"
          bg="#ecfdf5"
          onClick={() => navigate('/admin')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 14 }}>
            Active Processes
          </h2>
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              border: '1px solid var(--color-border-light)',
              padding: '4px 20px',
            }}
          >
            {runningProcesses.length > 0 ? (
              runningProcesses.map((w) => {
                const done = w.nodes.filter((n) => n.status === 'done').length
                const total = w.nodes.length
                return (
                  <div
                    key={w.id}
                    style={{
                      padding: '14px 0',
                      borderBottom: '1px solid var(--color-border-light)',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/processes/${w.id}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>{w.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-ink-muted)' }}>
                        {done}/{total}
                      </span>
                    </div>
                    <div
                      style={{ height: 4, background: 'var(--color-bg-hover)', borderRadius: 2, overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(done / total) * 100}%`,
                          background: 'var(--color-status-done)',
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-ink-muted)', fontSize: 13 }}>
                No processes running
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 14 }}>
            Recent Activity
          </h2>
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              border: '1px solid var(--color-border-light)',
              padding: '4px 20px',
            }}
          >
            <ActivityItem text="Nora completed Market Research — Q4 Report" time="2 hours ago" dot="#22c55e" />
            <ActivityItem text="Felix started drafting Q4 Summary Report" time="3 hours ago" dot="#f59e0b" />
            <ActivityItem text="Mira reviewed and approved Vendor Contracts" time="Yesterday" dot="#22c55e" />
            <ActivityItem text="Alice assigned Bob to Project Lead role" time="Yesterday" dot="#3b82f6" />
          </div>
        </section>
      </div>
    </div>
  )
}
