import { TbInbox } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { CardNode, SocketArea, TitleArea } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function ReceiveNode({ data }: { data: ActivityNodeData }) {
  const catchMessage = data.meta?.catch

  return (
    <CardNode color="#0891b2" tabIcon={<TbInbox size={10} />} tabLabel="Receive" status={data.status}>
      {/* Socket area — inbox icon */}
      <SocketArea bg="#ecfeff" borderColor="#0891b215">
        <TbInbox size={28} style={{ color: '#0891b2' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#0891b2' }}>Inbox</span>
      </SocketArea>

      {/* Title + message type */}
      <TitleArea label={data.label} meta={catchMessage} />
    </CardNode>
  )
}
