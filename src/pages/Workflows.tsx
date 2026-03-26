import { useNavigate, Link } from 'react-router-dom'
import { WORKFLOWS } from '../data/workflows'
import type { Workflow } from '../data/workflows'
import { TbArrowsShuffle } from 'react-icons/tb'
import { Avatar } from '../components/Avatar'

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const navigate = useNavigate()
  const doneCount = workflow.tasks.filter((t) => t.status === 'done').length
  const runningCount = workflow.tasks.filter((t) => t.status === 'running').length
  const totalCount = workflow.tasks.length

  // Unique assignees
  const assignees = workflow.tasks.reduce((acc, t) => {
    if (!acc.find((a) => a.id === t.assigneeId)) {
      acc.push({ id: t.assigneeId, seed: t.assigneeSeed, name: t.assigneeName })
    }
    return acc
  }, [] as { id: string; seed: string; name: string }[])

  return (
    <div
      onClick={() => navigate(`/workflows/${workflow.id}`)}
      style={{
        background: 'var(--color-bg-surface)',
        borderRadius: 20,
        border: '1px solid var(--color-border-light)',
        padding: 24,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>
            {workflow.name}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
            {workflow.description}
          </p>
        </div>
        <TbArrowsShuffle size={20} style={{ color: 'var(--color-ink-muted)', flexShrink: 0, marginTop: 2 }} />
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-ink-secondary)' }}>
            {doneCount}/{totalCount} tasks complete
          </span>
          {runningCount > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#b45309' }}>
              {runningCount} running
            </span>
          )}
        </div>
        <div style={{ height: 4, background: 'var(--color-bg)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(doneCount / totalCount) * 100}%`,
            background: 'var(--color-status-done)',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Footer: assignees + task count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Stacked avatars */}
        <div style={{ display: 'flex' }}>
          {assignees.map((a, i) => (
            <div
              key={a.id}
              title={a.name}
              style={{
                marginLeft: i > 0 ? -10 : 0,
                borderRadius: '50%',
                border: '2px solid #fff',
                width: 32,
                height: 32,
                overflow: 'hidden',
                position: 'relative',
                zIndex: assignees.length - i,
              }}
            >
              <Avatar seed={a.seed} size={28} />
            </div>
          ))}
        </div>

        <span style={{
          fontSize: 12, fontWeight: 600, color: 'var(--color-ink-muted)',
          background: 'var(--color-bg)', padding: '4px 12px', borderRadius: 20,
        }}>
          {totalCount} tasks
        </span>
      </div>
    </div>
  )
}

export function Workflows() {
  return (
    <div style={{ maxWidth: 1100 }}>
      <header style={{ marginBottom: 36 }}>
        <Link to="/" style={{ fontSize: 13, color: 'var(--color-ink-muted)', textDecoration: 'none', marginBottom: 12, display: 'inline-block' }}>
          &larr; Dashboard
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.03em' }}>Workflows</h1>
        <p style={{ fontSize: 14, color: 'var(--color-ink-secondary)', marginTop: 4 }}>Chains of tasks executed by your team</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {WORKFLOWS.map((w) => (
          <WorkflowCard key={w.id} workflow={w} />
        ))}
      </div>
    </div>
  )
}
