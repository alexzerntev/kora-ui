interface FloatingHeaderProps {
  title: string
  subtitle?: string
  left?: React.ReactNode
  right?: React.ReactNode
}

export function FloatingHeader({ title, subtitle, left, right }: FloatingHeaderProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 14,
        padding: '12px 20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      {left}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
