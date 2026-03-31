import { TbSend, TbBrandSlack, TbMail, TbBrandTeams, TbBrandWhatsapp, TbWebhook } from 'react-icons/tb'
import { Avatar } from '../Avatar'
import { TEAM, TYPE_COLORS } from '../../data/team'
import { HiUser } from 'react-icons/hi2'
import { RiRobot2Fill } from 'react-icons/ri'
import type { FlowNodeKind } from '../../data/workflows'
import { CardNode } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

const CHANNEL_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  slack: { icon: <TbBrandSlack size={28} />, color: '#611f69', bg: '#f5f0f6', label: 'Slack' },
  email: { icon: <TbMail size={28} />, color: '#2563eb', bg: '#eff6ff', label: 'Email' },
  teams: { icon: <TbBrandTeams size={28} />, color: '#5b5fc7', bg: '#eef0ff', label: 'Teams' },
  whatsapp: { icon: <TbBrandWhatsapp size={28} />, color: '#25d366', bg: '#f0fdf4', label: 'WhatsApp' },
  webhook: { icon: <TbWebhook size={28} />, color: '#666', bg: '#f5f5f5', label: 'Webhook' },
}

export function SendNode({ data }: { data: ActivityNodeData }) {
  const channelType = data.meta?.channel
  const ownerId = data.meta?.owner
  const ownerMember = ownerId ? TEAM.find((m) => m.id === ownerId) : undefined
  const channel = channelType ? CHANNEL_ICONS[channelType] : undefined
  const template = data.meta?.template

  return (
    <CardNode color="#16a34a" tabIcon={<TbSend size={10} />} tabLabel="Send" status={data.status}>
      {/* Socket area — channel icon or owner */}
      <div
        style={{
          margin: 8,
          borderRadius: 14,
          padding: '16px 12px',
          background: channel ? channel.bg : ownerMember ? TYPE_COLORS[ownerMember.type].light : '#f5f5f5',
          border: `1px solid ${channel ? channel.color + '15' : '#e5e5e5'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {channel ? (
          <>
            <div style={{ color: channel.color }}>{channel.icon}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: channel.color }}>{channel.label}</span>
          </>
        ) : ownerMember ? (
          <>
            <Avatar seed={ownerMember.avatarSeed} size={48} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink)' }}>{ownerMember.name}</span>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: ownerMember.type === 'human' ? 'var(--color-human)' : 'var(--color-agent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 8,
                }}
              >
                {ownerMember.type === 'human' ? <HiUser /> : <RiRobot2Fill />}
              </span>
            </div>
          </>
        ) : (
          <>
            <TbSend size={28} style={{ color: '#16a34a' }} />
            <span style={{ fontSize: 11, color: '#aaa' }}>Send</span>
          </>
        )}
      </div>

      {/* Title + template */}
      <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{data.label}</div>
        {template && (
          <div
            style={{
              fontSize: 11,
              color: '#999',
              fontFamily: 'ui-monospace, Consolas, monospace',
            }}
          >
            {template}
          </div>
        )}
      </div>
    </CardNode>
  )
}
