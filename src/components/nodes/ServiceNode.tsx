import { TbSettings, TbWorld, TbDatabase, TbTerminal2 } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { IconNode } from './shared'

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

  return <IconNode icon={style.icon} label={data.label} color={style.color} status={data.status} />
}
