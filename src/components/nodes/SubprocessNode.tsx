import { TbStack2 } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { GroupNode } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function SubprocessNode({ data }: { data: ActivityNodeData }) {
  return (
    <GroupNode
      color="#6366f1"
      tabIcon={<TbStack2 size={10} />}
      tabLabel="Subprocess"
      label={data.label}
      status={data.status}
    />
  )
}
