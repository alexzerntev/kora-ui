interface NavItemCategory {
  id: string
  title: string
  icon: React.ReactNode
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
        background: selected ? 'var(--color-sidebar-active)' : 'transparent',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.background = 'var(--color-sidebar-hover)'
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.background = 'transparent'
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: selected ? 'var(--color-foreground)' : 'var(--color-foreground-muted)',
          flexShrink: 0,
        }}
      >
        {category.icon}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: selected ? 600 : 500,
          color: selected ? 'var(--color-sidebar-active-text)' : 'var(--color-foreground-secondary)',
        }}
      >
        {category.title}
      </span>
    </button>
  )
}
