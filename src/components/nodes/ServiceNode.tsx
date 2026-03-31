import { TbSettings, TbWorld, TbDatabase, TbTerminal2 } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { NodeHandles } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

/* Service nodes — circle with icon + label, like event nodes */

const SERVICE_STYLES: Record<string, { icon: React.ReactNode; color: string }> = {
  http: { icon: <TbWorld size={56} strokeWidth={1.2} />, color: '#2563eb' },
  sql: { icon: <TbDatabase size={56} strokeWidth={1.2} />, color: '#7c3aed' },
  cli: {
    icon: (
      <div
        style={{
          position: 'relative',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TbTerminal2 size={56} strokeWidth={1.2} />
        <TbSettings
          size={18}
          strokeWidth={1.8}
          style={{ position: 'absolute', bottom: 0, right: -2, background: '#fff', borderRadius: '50%', padding: 1 }}
        />
      </div>
    ),
    color: '#059669',
  },
}

export function ServiceNode({ data }: { data: ActivityNodeData }) {
  const connectorType = data.meta?.connector ?? 'http'
  const style = SERVICE_STYLES[connectorType] ?? SERVICE_STYLES.http
  const isDone = data.status === 'done'

  return (
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      <NodeHandles top={28} />

      <div
        style={{
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: style.color,
          opacity: isDone ? 0.5 : 1,
        }}
      >
        {style.icon}
      </div>

      {/* Label positioned below, outside the node bounds */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 4,
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-ink-secondary)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {data.label}
      </div>
    </div>
  )
}
