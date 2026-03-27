import { useState, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  ConnectionLineType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DeskNode } from './DeskNode'
import { WorkflowEdge } from './WorkflowEdge'

const nodeTypes = { desk: DeskNode }
const edgeTypes = { workflow: WorkflowEdge }

const NODE_WIDTH = 240
const COL_GAP = 220

const ALL_NODES: Node[] = [
  {
    id: 'an1',
    type: 'desk',
    position: { x: 0, y: 0 },
    data: {
      taskId: 't1',
      taskName: 'Research Topic',
      assigneeId: '3',
      assigneeName: 'Nora',
      assigneeSeed: 'Nora sr',
      assigneeType: 'agent',
      status: 'idle',
    },
  },
  {
    id: 'an2',
    type: 'desk',
    position: { x: NODE_WIDTH + COL_GAP, y: 0 },
    data: {
      taskId: 't2',
      taskName: 'Draft Report',
      assigneeId: '4',
      assigneeName: 'Felix',
      assigneeSeed: 'Felix dir',
      assigneeType: 'agent',
      status: 'idle',
    },
  },
  {
    id: 'an3',
    type: 'desk',
    position: { x: (NODE_WIDTH + COL_GAP) * 2, y: 0 },
    data: {
      taskId: 't3',
      taskName: 'Review Document',
      assigneeId: '5',
      assigneeName: 'Mira',
      assigneeSeed: 'Mira head',
      assigneeType: 'agent',
      status: 'idle',
    },
  },
]

const ALL_EDGES: Edge[] = [
  { id: 'ae1', source: 'an1', target: 'an2', type: 'workflow', data: { state: 'idle' } },
  { id: 'ae2', source: 'an2', target: 'an3', type: 'workflow', data: { state: 'idle' } },
]

function WorkflowCanvas() {
  const [visibleCount, setVisibleCount] = useState(0)
  const { fitView } = useReactFlow()

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleCount(1), 600),
      setTimeout(() => setVisibleCount(2), 1800),
      setTimeout(() => setVisibleCount(3), 3000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (visibleCount > 0) {
      const timer = setTimeout(() => fitView({ padding: 0.4, duration: 600 }), 100)
      return () => clearTimeout(timer)
    }
  }, [visibleCount, fitView])

  const nodes = ALL_NODES.slice(0, visibleCount)
  const edges = ALL_EDGES.filter((e) => {
    const srcIdx = ALL_NODES.findIndex((n) => n.id === e.source)
    const tgtIdx = ALL_NODES.findIndex((n) => n.id === e.target)
    return srcIdx < visibleCount && tgtIdx < visibleCount
  })

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.4 }}
      connectionLineType={ConnectionLineType.Bezier}
      proOptions={{ hideAttribution: true }}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable
    >
      <Background gap={32} size={1} color="#e8e8e8" />
      <Controls
        showInteractive={false}
        position="bottom-right"
        style={{
          borderRadius: 12,
          border: '1px solid var(--color-border-light)',
          overflow: 'hidden',
          background: '#fff',
        }}
      />
    </ReactFlow>
  )
}

export function WorkflowArtifact() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <WorkflowCanvas />
      </div>
    </ReactFlowProvider>
  )
}
