import { useState, useEffect } from 'react'
import { TEAM, TYPE_COLORS } from '../data/team'
import type { TeamMember, AgentMember } from '../data/team'
import { Avatar } from './Avatar'
import { HiUser, HiUsers } from 'react-icons/hi2'
import { RiRobot2Fill, RiRobot2Line } from 'react-icons/ri'
import { TbCircleFilled } from 'react-icons/tb'

const NEW_AGENT: AgentMember = {
  id: '6',
  name: 'Atlas',
  type: 'agent',
  role: 'Research Analyst',
  capabilities: ['Deep Research', 'Citation Tracking', 'Data Synthesis'],
  status: 'idle',
  emoji: '\u{1F9D0}',
  emojiCodepoints: '1f9d0',
  avatarSeed: 'Atlas analyst new',
  email: '',
  channels: {},
  prompt: 'You are a research analyst. Dig deep into topics, cross-reference sources, and produce well-cited briefs.',
  model: 'claude-sonnet-4-5',
  budget: { maxBudgetUsd: 1.0, maxTurns: 5 },
  requiresApproval: [],
  memory: [],
  taskRuns: [],
}

function SpeechBubble({ text, position = 'top' }: { text: string; position?: 'top' | 'top-right' }) {
  return (
    <div
      className="speech-bubble"
      style={{
        position: 'absolute',
        top: -8,
        ...(position === 'top-right' ? { right: 12 } : { left: 12 }),
        transform: 'translateY(-100%)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: 'var(--color-ink)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          padding: '6px 12px',
          borderRadius: 10,
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
      >
        {text}
        {/* Tail */}
        <div
          style={{
            position: 'absolute',
            bottom: -5,
            ...(position === 'top-right' ? { right: 14 } : { left: 14 }),
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--color-ink)',
          }}
        />
      </div>
    </div>
  )
}

function MiniCard({
  member,
  isNew,
  speechBubble,
}: {
  member: TeamMember | AgentMember
  isNew?: boolean
  speechBubble?: string
}) {
  const { light: colorLight } = TYPE_COLORS[member.type]
  const isHuman = member.type === 'human'

  return (
    <div
      className={`content-card ${isNew ? 'card-enter' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Speech bubble */}
      {speechBubble && <SpeechBubble text={speechBubble} position={isNew ? 'top-right' : 'top'} />}

      {/* New badge */}
      {isNew && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#fff',
            background: 'var(--color-agent)',
            padding: '3px 8px',
            borderRadius: 6,
          }}
        >
          New
        </div>
      )}

      {/* Avatar area */}
      <div
        style={{
          background: colorLight,
          borderRadius: 16,
          margin: 8,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Avatar seed={member.avatarSeed} size={120} />
      </div>

      {/* Info */}
      <div style={{ padding: '14px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)' }}>{member.name}</h3>
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
              fontSize: 10,
            }}
          >
            {isHuman ? <HiUser /> : <RiRobot2Fill />}
          </span>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-ink-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
          {member.role}
        </p>

        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            paddingTop: 12,
            borderTop: '1px solid var(--color-border-light)',
          }}
        >
          {member.capabilities.slice(0, 2).map((cap) => (
            <span
              key={cap}
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--color-ink-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
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

export function TeamArtifact() {
  const [showNewMember, setShowNewMember] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showThanks, setShowThanks] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowNewMember(true), 1200),
      setTimeout(() => setShowWelcome(true), 2200),
      setTimeout(() => setShowThanks(true), 3600),
      // Fade out welcome after Atlas replies
      setTimeout(() => setShowWelcome(false), 5500),
      setTimeout(() => setShowThanks(false), 6200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const humans = TEAM.filter((m) => m.type === 'human')
  const agents = TEAM.filter((m) => m.type === 'agent')

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-ink-secondary)' }}>
          <HiUsers size={16} />
          <h2 style={{ fontSize: 15, fontWeight: 650, color: 'var(--color-ink)' }}>People</h2>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-ink-muted)',
            background: 'var(--color-bg-hover)',
            padding: '3px 10px',
            borderRadius: 20,
          }}
        >
          {humans.length}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
          marginBottom: 32,
        }}
      >
        {humans.map((m) => (
          <MiniCard key={m.id} member={m} />
        ))}
      </div>

      {/* Agents section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-ink-secondary)' }}>
          <RiRobot2Line size={16} />
          <h2 style={{ fontSize: 15, fontWeight: 650, color: 'var(--color-ink)' }}>Agents</h2>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-ink-muted)',
            background: 'var(--color-bg-hover)',
            padding: '3px 10px',
            borderRadius: 20,
            transition: 'all 0.3s ease',
          }}
        >
          {agents.length + (showNewMember ? 1 : 0)}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        {agents.map((m) => (
          <MiniCard key={m.id} member={m} speechBubble={showWelcome ? 'Hey! Welcome to the team!' : undefined} />
        ))}
        {showNewMember && (
          <MiniCard member={NEW_AGENT} isNew speechBubble={showThanks ? 'Thanks! Excited to be here!' : undefined} />
        )}
      </div>
    </div>
  )
}
