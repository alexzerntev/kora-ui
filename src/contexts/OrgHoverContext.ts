import { createContext } from 'react'

export interface OrgHoverState {
  hoveredNodeId: string | null
  connectedNodeIds: Set<string>
}

export const OrgHoverContext = createContext<OrgHoverState>({
  hoveredNodeId: null,
  connectedNodeIds: new Set(),
})
