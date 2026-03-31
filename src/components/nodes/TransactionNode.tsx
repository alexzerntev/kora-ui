import { TbCreditCard } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { GroupNode } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function TransactionNode({ data }: { data: ActivityNodeData }) {
  return (
    <GroupNode
      color="#059669"
      tabIcon={<TbCreditCard size={10} />}
      tabLabel="Transaction"
      label={data.label}
      status={data.status}
    />
  )
}
