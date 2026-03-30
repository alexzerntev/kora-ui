interface NavItemCategory {
  id: string
  title: string
  count: number
  icon: React.ReactNode
  color: string
  bg: string
}

export function NavItem({
  category,
  selected,
  onClick,
}: {
  category: NavItemCategory
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 8,
        border: 'none',
        background: selected ? 'var(--color-bg-hover)' : 'transparent',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.background = 'var(--color-bg-hover)'
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.background = 'transparent'
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: category.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: category.color,
          flexShrink: 0,
        }}
      >
        {category.icon}
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: selected ? 650 : 500,
          color: selected ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
          flex: 1,
        }}
      >
        {category.title}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-ink-muted)',
          background: selected ? '#fff' : 'var(--color-bg-hover)',
          padding: '1px 7px',
          borderRadius: 8,
        }}
      >
        {category.count}
      </span>
    </button>
  )
}
