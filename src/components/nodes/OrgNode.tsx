import { Handle, Position } from '@xyflow/react'
import { Avatar } from '../Avatar'

interface OrgNodeData {
  name: string
  type: 'person' | 'agent' | 'role' | 'task'
  avatar?: string // avatarSeed for DiceBear
  capabilities: string[]
}

const TYPE_STYLES: Record<OrgNodeData['type'], { bg: string; text: string; initials: string }> = {
  person: { bg: '#f5f3ff', text: '#7c3aed', initials: '#7c3aed' },
  agent: { bg: '#ecfeff', text: '#0891b2', initials: '#0891b2' },
  role: { bg: '#eff6ff', text: '#1d4ed8', initials: '#1d4ed8' },
  task: { bg: '#f0fdf4', text: '#16a34a', initials: '#16a34a' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function OrgNode({ data }: { data: OrgNodeData }) {
  const { name, type, avatar, capabilities } = data
  const styles = TYPE_STYLES[type]

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        border: '1px solid rgba(0,0,0,0.06)',
        width: 220,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'transparent',
          border: 'none',
          width: 1,
          height: 1,
        }}
      />

      {/* Avatar circle */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: styles.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {avatar ? (
          <Avatar seed={avatar} size={36} />
        ) : (
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: styles.initials,
              lineHeight: 1,
            }}
          >
            {getInitials(name)}
          </span>
        )}
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>
        {capabilities.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 4,
              flexWrap: 'wrap',
              marginTop: 5,
            }}
          >
            {capabilities.slice(0, 3).map((cap) => (
              <span
                key={cap}
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: '#6b7280',
                  background: '#f3f4f6',
                  padding: '2px 6px',
                  borderRadius: 4,
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                }}
              >
                {cap}
              </span>
            ))}
            {capabilities.length > 3 && (
              <span
                style={{
                  fontSize: 10,
                  color: '#9ca3af',
                  lineHeight: 1.3,
                  padding: '2px 0',
                }}
              >
                +{capabilities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'transparent',
          border: 'none',
          width: 1,
          height: 1,
        }}
      />
    </div>
  )
}
