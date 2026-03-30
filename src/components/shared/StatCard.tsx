import { TbArrowRight } from 'react-icons/tb'

export function StatCard({
  title,
  value,
  icon,
  color,
  bg,
  onClick,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  bg: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid var(--color-border-light)',
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        fontFamily: 'inherit',
        width: '100%',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          {icon}
        </div>
        {onClick && <TbArrowRight size={14} style={{ color: 'var(--color-ink-muted)' }} />}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--color-ink-secondary)' }}>{title}</div>
    </button>
  )
}
