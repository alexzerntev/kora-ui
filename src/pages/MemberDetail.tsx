import { useParams, useNavigate } from 'react-router-dom'
import { getMemberById, isAgent, TYPE_COLORS } from '../data/team'
import type { AgentMember, TaskRun } from '../data/team'
import { Avatar } from '../components/Avatar'

function StatusDot({ status }: { status: TaskRun['status'] }) {
  const color = status === 'completed' ? 'var(--color-status-done)'
    : status === 'running' ? 'var(--color-status-processing)'
    : 'var(--color-status-failed)'
  return (
    <span style={{
      width: 8, height: 8, borderRadius: '50%', background: color,
      display: 'inline-block',
      animation: status === 'running' ? 'pulse 2s infinite' : undefined,
    }} />
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 650, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function AgentDetails({ member }: { member: AgentMember }) {
  const { light, dark } = TYPE_COLORS.agent

  return (
    <>
      {/* Prompt */}
      <Section title="System Prompt">
        <div style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          padding: 16,
          fontSize: 13,
          lineHeight: 1.7,
          color: 'var(--color-ink-secondary)',
          fontFamily: 'ui-monospace, Consolas, monospace',
          whiteSpace: 'pre-wrap',
        }}>
          {member.prompt}
        </div>
      </Section>

      {/* Memory */}
      <Section title="Memory">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {member.memory.map((entry) => (
            <div key={entry.id} style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
            }}>
              <p style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5 }}>
                {entry.content}
              </p>
              <span style={{ fontSize: 11, color: 'var(--color-ink-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {entry.timestamp}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Task Runs */}
      <Section title="Task Runs">
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          {member.taskRuns.map((run, i) => (
            <div key={run.id} style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderTop: i > 0 ? '1px solid var(--color-border-light)' : undefined,
            }}>
              <StatusDot status={run.status} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>
                  {run.taskName}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-ink-muted)', marginTop: 2 }}>
                  {run.startedAt}{run.duration ? ` \u00B7 ${run.duration}` : ''}
                </div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                color: run.status === 'completed' ? 'var(--color-status-done)'
                  : run.status === 'running' ? '#b45309'
                  : 'var(--color-status-failed)',
                background: run.status === 'completed' ? '#ecfdf5'
                  : run.status === 'running' ? '#fffbeb'
                  : '#fef2f2',
                padding: '3px 9px', borderRadius: 6,
              }}>
                {run.status}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

export function MemberDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const member = getMemberById(id!)

  if (!member) {
    return (
      <div style={{ padding: '32px 40px' }}>
        <p>Member not found.</p>
      </div>
    )
  }

  const { light, dark } = TYPE_COLORS[member.type]
  const agent = isAgent(member) ? member : null

  return (
    <div style={{ padding: '32px 40px', maxWidth: 800 }}>
      {/* Back link */}
      <button
        onClick={() => navigate('/team')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 500, color: 'var(--color-ink-muted)',
          padding: 0, marginBottom: 24,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
        </svg>
        Back to Team
      </button>

      {/* Header card */}
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
      }}>
        {/* Emoji banner */}
        <div style={{
          background: light,
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Avatar seed={member.avatarSeed} size={150} />
        </div>

        {/* Info */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-ink)' }}>
              {member.name}
            </h1>
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-ink-secondary)', marginBottom: 14 }}>
            {member.role}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {member.capabilities.map((cap) => (
              <span key={cap} style={{
                fontSize: 12, fontWeight: 500, color: dark,
                background: light, padding: '4px 10px', borderRadius: 6,
              }}>
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Type-specific content */}
      {agent ? (
        <AgentDetails member={agent} />
      ) : (
        <Section title="Role">
          <div style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            padding: 16,
            fontSize: 14,
            color: 'var(--color-ink-secondary)',
            lineHeight: 1.6,
          }}>
            {member.name} works as a <strong>{member.role}</strong> on this team, contributing expertise in{' '}
            {member.capabilities.join(', ').replace(/, ([^,]*)$/, ' and $1')}.
          </div>
        </Section>
      )}
    </div>
  )
}
