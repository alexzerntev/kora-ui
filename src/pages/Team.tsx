import { TEAM, TYPE_COLORS } from '../data/team'
import { ROLES } from '../data/roles'
import type { TeamMember, AgentMember } from '../data/team'
import type { Role } from '../data/roles'
import { Avatar } from '../components/Avatar'
import { HiUser, HiUsers } from 'react-icons/hi2'
import { RiRobot2Fill, RiRobot2Line } from 'react-icons/ri'
import { TbCircleFilled, TbUserCircle } from 'react-icons/tb'
import { useState } from 'react'
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core'

/* ------------------------------------------------------------------ */
/*  Member Card (presentational only)                                  */
/* ------------------------------------------------------------------ */

function MemberCard({ member }: { member: TeamMember | AgentMember }) {
  const { light: colorLight } = TYPE_COLORS[member.type]
  const isHuman = member.type === 'human'

  return (
    <div
      className="content-card deck-card"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Avatar area */}
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
          <Avatar seed={(member as AgentMember).avatarSeed} size={120} />
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

/* ------------------------------------------------------------------ */
/*  Draggable Member Card                                              */
/* ------------------------------------------------------------------ */

function DraggableMemberCard({ member, index }: { member: TeamMember | AgentMember; index: number }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: member.id,
    data: { member },
  })

  const style: React.CSSProperties = {
    marginLeft: index === 0 ? 0 : -160,
    position: 'relative',
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.7 : 1,
    flexShrink: 0,
    width: 220,
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="deck-wrapper">
      <MemberCard member={member} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Role Socket (drop target)                                          */
/* ------------------------------------------------------------------ */

function RoleSocket({ role, assignedMembers }: { role: Role; assignedMembers: (TeamMember | AgentMember)[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `role-${role.id}`,
    data: { role },
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        borderRadius: 20,
        border: `1.5px dashed ${isOver ? 'var(--color-agent)' : 'var(--color-border)'}`,
        background: isOver ? 'var(--color-agent-light)' : 'var(--color-bg-surface)',
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color 0.2s, background 0.2s',
        cursor: 'default',
      }}
    >
      {/* Same height area as the avatar area in cards */}
      <div style={{
        borderRadius: 16,
        height: 170,
        background: isOver ? 'rgba(8,145,178,0.05)' : 'var(--color-bg-hover)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}>
        {/* Show assigned member chips, or empty state */}
        {assignedMembers.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {assignedMembers.map((m, i) => (
              <div key={m.id} style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '2px solid #fff',
                background: m.type === 'human' ? TYPE_COLORS.human.light : TYPE_COLORS.agent.light,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: m.type === 'human' ? TYPE_COLORS.human.dark : TYPE_COLORS.agent.dark,
                marginLeft: i > 0 ? -8 : 0,
                position: 'relative',
                zIndex: assignedMembers.length - i,
              }}>
                {m.type === 'human'
                  ? m.name.split(' ').map(n => n[0]).join('')
                  : m.name[0]}
              </div>
            ))}
          </div>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--color-ink-muted)' }}>Drop members here</span>
        )}
      </div>

      {/* Info area */}
      <div style={{ padding: '12px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)' }}>{role.title}</h3>
          {role.aiEligible && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#22c55e',
              background: '#ecfdf5', padding: '2px 7px', borderRadius: 4,
            }}>AI</span>
          )}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
          <span style={{ fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 11, color: 'var(--color-ink-muted)' }}>
            {role.name}
          </span>
        </p>
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap',
          paddingTop: 12, borderTop: '1px solid var(--color-border-light)',
        }}>
          {role.requiredCapabilities.slice(0, 3).map(cap => (
            <span key={cap} style={{
              fontSize: 11, fontWeight: 500, color: 'var(--color-ink-secondary)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <TbCircleFilled size={5} style={{ opacity: 0.3 }} />
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section Header                                                     */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Team Page                                                          */
/* ------------------------------------------------------------------ */

export function Team() {
  const people = TEAM.filter((m) => m.type === 'human')
  const agents = TEAM.filter((m) => m.type === 'agent')

  // State: roleId -> array of member IDs
  const [assignments, setAssignments] = useState<Record<string, string[]>>({})

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const memberId = active.id as string
    const roleId = (over.id as string).replace('role-', '')

    setAssignments(prev => {
      const current = prev[roleId] || []
      // Don't add duplicates
      if (current.includes(memberId)) return prev
      return { ...prev, [roleId]: [...current, memberId] }
    })
  }

  const getMemberById = (id: string) => TEAM.find(m => m.id === id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: '28px 36px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <header className="page-header" style={{ flexShrink: 0 }}>
        <h1>Organization</h1>
        <p>Drag people and agents into role sockets to assign them</p>
      </header>

      <DndContext onDragEnd={handleDragEnd}>
        {/* Role Sockets — scrollable area */}
        <section style={{ flex: 1, minHeight: 0, overflow: 'auto', marginBottom: 24 }}>
          <SectionHeader title="Roles" count={ROLES.length} icon={<TbUserCircle size={16} />} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}>
            {ROLES.map(role => (
              <RoleSocket
                key={role.id}
                role={role}
                assignedMembers={(assignments[role.id] || []).map(getMemberById).filter(Boolean) as (TeamMember | AgentMember)[]}
              />
            ))}
          </div>
        </section>

        {/* People and Agents — fixed at bottom */}
        <div style={{
          flexShrink: 0,
          borderTop: '1px solid var(--color-border-light)',
          paddingTop: 20,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <section>
              <SectionHeader title="People" count={people.length} icon={<HiUsers size={16} />} />
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {people.map((m, i) => (
                  <DraggableMemberCard key={m.id} member={m} index={i} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="Agents" count={agents.length} icon={<RiRobot2Line size={16} />} />
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {agents.map((m, i) => (
                  <DraggableMemberCard key={m.id} member={m} index={i} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </DndContext>
    </div>
  )
}
