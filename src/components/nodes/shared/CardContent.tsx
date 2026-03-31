/**
 * Shared content building blocks for card-style process nodes.
 *
 * SocketArea — the tinted box with centered icon/avatar content.
 * TitleArea  — label + optional monospace meta text below the socket.
 *
 * Used by: SendNode, ReceiveNode
 * (DecisionNode has unique content — a rule table — so it stays custom.)
 */

/** Tinted background area with rounded corners, centered content */
export function SocketArea({
  bg,
  borderColor,
  children,
}: {
  bg: string
  borderColor: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        margin: 8,
        borderRadius: 14,
        padding: '16px 12px',
        background: bg,
        border: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {children}
    </div>
  )
}

/** Label + optional monospace meta text */
export function TitleArea({ label, meta }: { label: string; meta?: string }) {
  return (
    <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{label}</div>
      {meta && (
        <div
          style={{
            fontSize: 11,
            color: '#999',
            fontFamily: 'ui-monospace, Consolas, monospace',
          }}
        >
          {meta}
        </div>
      )}
    </div>
  )
}
