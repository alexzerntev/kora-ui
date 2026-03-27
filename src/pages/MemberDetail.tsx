import { useParams, useNavigate } from 'react-router-dom'
import { getMemberById, isAgent, TYPE_COLORS } from '../data/team'
import type { AgentMember, TeamMember, TaskRun } from '../data/team'
import { Avatar } from '../components/Avatar'
import { TbArrowLeft } from 'react-icons/tb'

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
      <h2 className="section-label">{title}</h2>
      {children}
    </section>
  )
}

function PersonDetails({ member }: { member: TeamMember }) {
  return (
    <>
      {/* Email */}
      <Section title="Email">
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 12,
          padding: '12px 16px',
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-ink)' }}>
            {member.email}
          </span>
        </div>
      </Section>

      {/* Channels */}
      <Section title="Channels">
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {Object.entries(member.channels).map(([channel, target], i) => (
            <div key={channel} style={{
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: i > 0 ? '1px solid var(--color-border-light)' : undefined,
            }}>
              <span style={{ fontSize: 13, color: 'var(--color-ink-secondary)', fontWeight: 500 }}>
                {channel}
              </span>
              <span style={{ fontSize: 13, color: 'var(--color-ink)', fontFamily: 'ui-monospace, Consolas, monospace' }}>
                {target}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Role */}
      <Section title="Role">
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 12,
          padding: 16,
          fontSize: 14,
          color: 'var(--color-ink-secondary)',
          lineHeight: 1.6,
        }}>
          {member.name} works as a <strong>{member.role}</strong> on this team, contributing expertise in{' '}
          {member.capabilities.join(', ').replace(/, ([^,]*)$/, ' and $1')}.
        </div>
      </Section>
    </>
  )
}

function AgentDetails({ member }: { member: AgentMember }) {
  return (
    <>
      {/* Model */}
      <Section title="Model">
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 12,
          padding: '12px 16px',
        }}>
          <span style={{
            fontSize: 13,
            fontFamily: 'ui-monospace, Consolas, monospace',
            color: 'var(--color-ink)',
            background: 'var(--color-bg-hover)',
            padding: '4px 10px',
            borderRadius: 6,
            fontWeight: 500,
          }}>
            {member.model}
          </span>
        </div>
      </Section>

      {/* Budget */}
      <Section title="Budget">
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--color-ink-secondary)' }}>Max Budget</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'ui-monospace, Consolas, monospace' }}>
              ${member.budget.maxBudgetUsd.toFixed(2)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--color-ink-secondary)' }}>Max Turns</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'ui-monospace, Consolas, monospace' }}>
              {member.budget.maxTurns}
            </span>
          </div>
        </div>
      </Section>

      {/* Requires Approval */}
      <Section title="Requires Approval">
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 12,
          padding: '12px 16px',
        }}>
          {member.requiresApproval.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {member.requiresApproval.map((cap) => (
                <span key={cap} style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                  background: 'var(--color-bg-hover)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontFamily: 'ui-monospace, Consolas, monospace',
                }}>
                  {cap}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>None</span>
          )}
        </div>
      </Section>

      {/* Prompt */}
      <Section title="System Prompt">
        <div style={{
          background: 'var(--color-bg-hover)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 12,
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
              border: '1px solid var(--color-border-light)',
              borderRadius: 12,
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
          border: '1px solid var(--color-border-light)',
          borderRadius: 12,
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
              <span
                className="status-badge"
                style={{
                  color: run.status === 'completed' ? 'var(--color-status-done)'
                    : run.status === 'running' ? '#b45309'
                    : 'var(--color-status-failed)',
                  background: run.status === 'completed' ? '#ecfdf5'
                    : run.status === 'running' ? '#fffbeb'
                    : '#fef2f2',
                }}
              >
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
    return <p style={{ color: 'var(--color-ink-secondary)' }}>Member not found.</p>
  }

  const { light, dark } = TYPE_COLORS[member.type]
  const agent = isAgent(member) ? member : null

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Back link */}
      <button onClick={() => navigate('/team')} className="back-btn">
        <TbArrowLeft size={16} />
        Back to Team
      </button>

      {/* Header card */}
      <div className="content-card" style={{ overflow: 'hidden', marginBottom: 32, cursor: 'default' }}>
        {/* Avatar banner */}
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
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>
            {member.name}
          </h1>
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
        <PersonDetails member={member} />
      )}
    </div>
  )
}
