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
      style={{
        background: 'var(--color-bg-surface)',
        borderRadius: 24,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--color-border-light)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-6px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Avatar area */}
      <div
        style={{
          background: colorLight,
          borderRadius: 20,
          margin: 8,
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Avatar seed={member.avatarSeed} size={150} />
      </div>

      {/* Info */}
      <div style={{ padding: '16px 20px 20px' }}>
        {/* Name + type badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-ink)' }}>
            {member.name}
          </h3>
          <span
            style={{
              width: 22, height: 22,
              borderRadius: '50%',
              background: isHuman ? 'var(--color-human)' : 'var(--color-agent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#fff',
              fontSize: 12,
            }}
          >
            {isHuman ? <HiUser /> : <RiRobot2Fill />}
          </span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
          {member.role}
        </p>

        {/* Bottom row: capabilities */}
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          paddingTop: 14,
          borderTop: '1px solid var(--color-border-light)',
        }}>
          {member.capabilities.slice(0, 2).map((cap) => (
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
              <TbCircleFilled size={6} style={{ opacity: 0.3 }} />
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
        background: 'var(--color-bg)', padding: '3px 10px', borderRadius: 20,
      }}>
        {count}
      </span>
    </div>
  )
}

export function Team() {
  const humans = TEAM.filter((m) => m.type === 'human')
  const agents = TEAM.filter((m) => m.type === 'agent')

  return (
    <div style={{ maxWidth: 1100 }}>
      <header style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.03em' }}>Team</h1>
        <p style={{ fontSize: 14, color: 'var(--color-ink-secondary)', marginTop: 4 }}>People and agents collaborating on workflows</p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <SectionHeader title="People" count={humans.length} icon={<HiUsers size={16} />} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {humans.map((m) => <MemberCard key={m.id} member={m} />)}
        </div>
      </section>

      <section>
        <SectionHeader title="Agents" count={agents.length} icon={<RiRobot2Line size={16} />} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {agents.map((m) => <MemberCard key={m.id} member={m} />)}
        </div>
      </section>
    </div>
  )
}
