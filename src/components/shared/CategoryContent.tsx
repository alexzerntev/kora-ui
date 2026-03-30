interface CategoryContentProps {
  category: {
    title: string
    count: number
    icon: React.ReactNode
    color: string
    bg: string
    description: string
  }
}

export function CategoryContent({ category }: CategoryContentProps) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: category.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: category.color,
          }}
        >
          {category.icon}
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-ink)' }}>{category.title}</h2>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
        {category.description}
      </p>

      <div
        style={{
          background: 'var(--color-bg-hover)',
          borderRadius: 12,
          padding: '20px 24px',
          color: 'var(--color-ink-muted)',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        {category.count} {category.title.toLowerCase()} configured
      </div>
    </div>
  )
}
