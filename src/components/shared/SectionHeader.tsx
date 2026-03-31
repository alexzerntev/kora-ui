export function SectionHeader({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <span style={{ color: 'var(--color-foreground-secondary)', display: 'flex' }}>{icon}</span>
      <h2 className="section-heading">{title}</h2>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-foreground-muted)',
          background: 'var(--color-surface-hover)',
          padding: '2px 8px',
          borderRadius: 10,
        }}
      >
        {count}
      </span>
    </div>
  )
}
