import { useNavigate } from 'react-router-dom'
import { TEAM, TYPE_COLORS } from '../data/team'
import type { TeamMember, AgentMember } from '../data/team'
import { Avatar } from '../components/Avatar'
import { HiUser, HiUsers } from 'react-icons/hi2'
import { RiRobot2Fill, RiRobot2Line } from 'react-icons/ri'
import { TbCircleFilled } from 'react-icons/tb'

function MemberCard({ member }: { member: TeamMember | AgentMember }) {
  const navigate = useNavigate()
  const { light: colorLight } = TYPE_COLORS[member.type]
  const isHuman = member.type === 'human'

  return (
    <div
      onClick={() => navigate(`/team/${member.id}`)}
      className="content-card"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Avatar area — colored background block on top */}
      <div
        style={{
          background: colorLight,
          borderRadius: 16,
          margin: 6,
          height: 170,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {isHuman ? (
          <span
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'rgba(255,255,255,0.7)',
              border: `1.5px solid ${TYPE_COLORS.human.dark}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 700,
              color: TYPE_COLORS.human.dark,
              letterSpacing: '-0.02em',
              userSelect: 'none',
            }}
          >
            {member.name.split(' ').map((n) => n[0]).join('')}
          </span>
        ) : (
          <Avatar seed={member.avatarSeed} size={120} />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 16px 16px' }}>
        {/* Name + type badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)' }}>
            {member.name}
          </h3>
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: isHuman ? 'var(--color-human)' : 'var(--color-agent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#fff',
              fontSize: 11,
            }}
          >
            {isHuman ? <HiUser /> : <RiRobot2Fill />}
          </span>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-ink-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
          {member.role}
        </p>

        {/* Bottom row: capabilities */}
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          paddingTop: 12,
          borderTop: '1px solid var(--color-border-light)',
        }}>
          {member.capabilities.slice(0, 3).map((cap) => (
            <span
              key={cap}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--color-ink-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <TbCircleFilled size={5} style={{ opacity: 0.3 }} />
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-ink-secondary)' }}>
        {icon}
        <h2 style={{ fontSize: 15, fontWeight: 650, color: 'var(--color-ink)' }}>{title}</h2>
      </div>
      <span style={{
        fontSize: 12, fontWeight: 600, color: 'var(--color-ink-muted)',
        background: 'var(--color-bg-hover)', padding: '3px 10px', borderRadius: 20,
      }}>
        {count}
      </span>
    </div>
  )
}

export function Team() {
  const people = TEAM.filter((m) => m.type === 'human')
  const agents = TEAM.filter((m) => m.type === 'agent')

  return (
    <div style={{ maxWidth: 1100 }}>
      <header className="page-header">
        <h1>Team</h1>
        <p>People and agents collaborating on workflows</p>
      </header>

      <section style={{ marginBottom: 32 }}>
        <SectionHeader title="People" count={people.length} icon={<HiUsers size={16} />} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {people.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Agents" count={agents.length} icon={<RiRobot2Line size={16} />} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
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
