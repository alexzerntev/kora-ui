import { Handle, Position } from '@xyflow/react'

const HANDLE_STYLE: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  width: 1,
  height: 1,
}

/**
 * Standard transparent left/right handles used by most process flow nodes.
 * Pass `top` to override the vertical position (used by icon-style nodes).
 * Pass `target={false}` or `source={false}` to omit one side.
 */
export function NodeHandles({
  top,
  target = true,
  source = true,
}: {
  top?: number
  target?: boolean
  source?: boolean
}) {
  const style = top !== undefined ? { ...HANDLE_STYLE, top } : HANDLE_STYLE

  return (
    <>
      {target && <Handle type="target" position={Position.Left} style={style} />}
      {source && <Handle type="source" position={Position.Right} style={style} />}
    </>
  )
}
