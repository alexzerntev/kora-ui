import { PROJECT } from '../data/project.ts'
import { TbTool, TbClock, TbNetwork, TbCheck, TbX, TbInfoCircle, TbCpu } from 'react-icons/tb'

const mono = 'ui-monospace, Consolas, monospace'

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <span style={{ display: 'flex', color: 'var(--color-ink-secondary)' }}>{icon}</span>
      <h2 style={{ fontSize: 15, fontWeight: 650, color: 'var(--color-ink)' }}>{title}</h2>
    </div>
  )
}

function FieldRow({ label, value, mono: useMono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border-light)',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-ink-secondary)' }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--color-ink)',
          fontFamily: useMono ? mono : 'inherit',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function ToolPill({ name }: { name: string }) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        fontFamily: mono,
        color: 'var(--color-ink-secondary)',
        background: 'var(--color-bg-hover)',
        padding: '4px 12px',
        borderRadius: 8,
        border: '1px solid var(--color-border-light)',
      }}
    >
      {name}
    </span>
  )
}

function EgressRow({ rule, isLast }: { rule: { action: 'allow' | 'deny'; target: string }; isLast: boolean }) {
  const isAllow = rule.action === 'allow'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 0',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border-light)',
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: isAllow ? '#ecfdf5' : '#fef2f2',
          color: isAllow ? 'var(--color-status-done)' : 'var(--color-status-failed)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 13,
        }}
      >
        {isAllow ? <TbCheck /> : <TbX />}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: 'var(--color-ink)' }}>{rule.target}</span>
      <span
        style={{
          marginLeft: 'auto',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          color: isAllow ? 'var(--color-status-done)' : 'var(--color-status-failed)',
        }}
      >
        {rule.action}
      </span>
    </div>
  )
}

export function Settings() {
  const { name, scopeId, description } = PROJECT
  const { limits, tools, sandbox } = PROJECT.machineExecution.defaults
  const { network } = sandbox

  const budgetFormatted = `$${limits.maxBudgetUsd.toFixed(2)}`
  const durationMinutes = `${limits.maxDurationMs / 60000} min`

  return (
    <div style={{ maxWidth: 720 }}>
      <header className="page-header">
        <h1>Settings</h1>
        <p>Project configuration and execution defaults</p>
      </header>

      {/* General */}
      <section style={{ marginBottom: 36 }}>
        <SectionHeading icon={<TbInfoCircle size={17} />} title="General" />
        <div className="content-card" style={{ cursor: 'default', padding: '4px 24px' }}>
          <FieldRow label="Project Name" value={name} mono />
          <FieldRow label="Scope ID" value={scopeId} mono />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '12px 0',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-ink-secondary)' }}>Description</span>
            <span style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.6 }}>{description}</span>
          </div>
        </div>
      </section>

      {/* Execution Limits */}
      <section style={{ marginBottom: 36 }}>
        <SectionHeading icon={<TbClock size={17} />} title="Execution Limits" />
        <div className="content-card" style={{ cursor: 'default', padding: '4px 24px' }}>
          <FieldRow label="Max Turns" value={limits.maxTurns} mono />
          <FieldRow label="Max Budget" value={budgetFormatted} mono />
          <FieldRow label="Max Duration" value={durationMinutes} mono />
        </div>
      </section>

      {/* Builtin Tools */}
      <section style={{ marginBottom: 36 }}>
        <SectionHeading icon={<TbTool size={17} />} title="Builtin Tools" />
        <div className="content-card" style={{ cursor: 'default', padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tools.builtin.allow.map((tool) => (
              <ToolPill key={tool} name={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Model Profiles */}
      <section style={{ marginBottom: 36 }}>
        <SectionHeading icon={<TbCpu size={17} />} title="Model Profiles" />
        <div className="content-card" style={{ cursor: 'default', padding: '4px 24px' }}>
          <FieldRow label="Default Profile" value="standard" mono />
          <FieldRow label="Model" value="claude-sonnet-4-5" mono />
          <FieldRow label="Max Tokens" value="4096" mono />
          <FieldRow label="Temperature" value="0.7" mono />
        </div>
      </section>

      {/* Sandbox Network */}
      <section style={{ marginBottom: 36 }}>
        <SectionHeading icon={<TbNetwork size={17} />} title="Sandbox Network" />
        <div className="content-card" style={{ cursor: 'default', padding: '4px 24px' }}>
          <FieldRow label="Inherit Managed" value={network.inheritManaged ? 'Yes' : 'No'} />
          <FieldRow
            label="Default Action"
            value={
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: network.defaultAction === 'allow' ? 'var(--color-status-done)' : 'var(--color-status-failed)',
                  background: network.defaultAction === 'allow' ? '#ecfdf5' : '#fef2f2',
                  padding: '3px 10px',
                  borderRadius: 6,
                }}
              >
                {network.defaultAction}
              </span>
            }
          />

          {/* Egress Rules sub-section */}
          <div style={{ padding: '14px 0 4px' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 650,
                color: 'var(--color-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Egress Rules
            </span>
          </div>
          {network.egress.map((rule, i) => (
            <EgressRow key={rule.target} rule={rule} isLast={i === network.egress.length - 1} />
          ))}
        </div>
      </section>
    </div>
  )
}
