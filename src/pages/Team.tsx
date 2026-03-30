import { useNavigate } from 'react-router-dom'
import { TEAM, TYPE_COLORS } from '../data/team'
import type { TeamMember, AgentMember } from '../data/team'
import { Avatar } from '../components/Avatar'
import { SectionHeader } from '../components/shared/SectionHeader'
import { HiUser, HiUsers } from 'react-icons/hi2'
import { RiRobot2Fill, RiRobot2Line } from 'react-icons/ri'

/* ------------------------------------------------------------------ */
/*  Member Card — large avatar style                                   */
/* ------------------------------------------------------------------ */

function MemberCard({ member }: { member: TeamMember | AgentMember }) {
  const navigate = useNavigate()
  const isHuman = member.type === 'human'
  const colors = TYPE_COLORS[member.type]

  return (
    <button
      onClick={() => navigate(`/team/${member.id}`)}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid var(--color-border-light)',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'inherit',
        padding: 0,
        overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.25s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'none'
      }}
    >
      {/* Avatar area */}
      <div
        style={{
          background: colors.light,
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: '18px 18px 0 0',
          margin: 6,
          borderBottomLeftRadius: 14,
          borderBottomRightRadius: 14,
        }}
      >
        {isHuman ? (
          <span
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'rgba(255,255,255,0.7)',
              border: `1.5px solid ${colors.dark}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 700,
              color: colors.dark,
            }}
          >
            {member.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </span>
        ) : (
          <Avatar seed={(member as AgentMember).avatarSeed} size={120} />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 18px 18px' }}>
        {/* Name + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, height: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)' }}>{member.name}</h3>
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: colors.dark,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 10,
              flexShrink: 0,
            }}
          >
            {isHuman ? <HiUser /> : <RiRobot2Fill />}
          </span>
        </div>

        {/* Role — fixed height */}
        <p
          style={{
            fontSize: 13,
            color: 'var(--color-ink-secondary)',
            lineHeight: 1.5,
            height: 20,
            overflow: 'hidden',
            marginBottom: 14,
          }}
        >
          {member.role}
        </p>

        {/* Capabilities — fixed 2 lines */}
        <div
          style={{
            paddingTop: 12,
            borderTop: '1px solid var(--color-border-light)',
            height: 60,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <CapabilityPills capabilities={member.capabilities} color={colors.dark} bg={colors.light} />
        </div>
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Capability Pills — 2 lines max                                     */
/* ------------------------------------------------------------------ */

function CapabilityPills({ capabilities, color, bg }: { capabilities: string[]; color: string; bg: string }) {
  const maxVisible = Math.min(capabilities.length, 4)
  const remaining = capabilities.length - maxVisible

  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {capabilities.slice(0, maxVisible).map((cap) => (
        <span
          key={cap}
          style={{
            fontSize: 11,
            fontWeight: 500,
            color,
            background: bg,
            padding: '3px 8px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
          }}
        >
          {cap}
        </span>
      ))}
      {remaining > 0 && (
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-ink-muted)', padding: '3px 4px' }}>
          +{remaining}
        </span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Team Page                                                          */
/* ------------------------------------------------------------------ */

export function Team() {
  const people = TEAM.filter((m) => m.type === 'human')
  const agents = TEAM.filter((m) => m.type === 'agent')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        padding: '28px 36px',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        overflow: 'auto',
      }}
    >
      <header className="page-header" style={{ flexShrink: 0 }}>
        <h1>Team</h1>
        <p>People and agents in your organization</p>
      </header>

      {/* People */}
      <section style={{ marginBottom: 40 }}>
        <SectionHeader title="People" count={people.length} icon={<HiUsers size={16} />} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {people.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </section>

      {/* Agents */}
      <section style={{ paddingBottom: 32 }}>
        <SectionHeader title="Agents" count={agents.length} icon={<RiRobot2Line size={16} />} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {agents.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </section>
    </div>
  )
}
