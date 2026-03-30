import type { FlowNodeKind } from '../data/workflows'

/* Map Kora node kinds to ReactFlow node types */
export function getReactFlowType(kind: FlowNodeKind): string {
  if (kind === 'task') return 'desk'
  if (kind.startsWith('start.') || kind.startsWith('end.')) return 'event'
  if (kind.startsWith('gateway.')) return 'gateway'
  return 'activity'
}

/* Node dimensions per ReactFlow type (for layout) */
const NODE_DIMS: Record<string, { w: number; h: number }> = {
  desk: { w: 220, h: 310 },
  'desk-unassigned': { w: 220, h: 310 },
  event: { w: 80, h: 80 },
  gateway: { w: 80, h: 80 },
  activity: { w: 220, h: 64 },
}

export function getNodeDimsForNode(node: {
  kind: FlowNodeKind
  assigneeId?: string
  style?: { width: number; height: number }
}): { w: number; h: number } {
  if (node.kind.startsWith('end.')) return { w: 60, h: 70 }
  if (node.kind === 'task' && !node.assigneeId) return NODE_DIMS['desk-unassigned']
  if (node.kind === 'service') return { w: 60, h: 70 }
  if (node.kind === 'send') return { w: 220, h: 200 }
  if (node.kind === 'receive') return { w: 220, h: 200 }
  if (node.kind === 'timer') return { w: 60, h: 80 }
  if (node.kind === 'call') return { w: 70, h: 80 }
  if (node.kind === 'subprocess') return node.style ? { w: node.style.width, h: node.style.height } : { w: 500, h: 160 }
  if (node.kind === 'transaction')
    return node.style ? { w: node.style.width, h: node.style.height } : { w: 420, h: 160 }
  if (node.kind === 'script') return { w: 80, h: 100 }
  if (node.kind === 'decision') return { w: 220, h: 230 }
  const rfType = getReactFlowType(node.kind)
  return NODE_DIMS[rfType] ?? NODE_DIMS.activity
}
