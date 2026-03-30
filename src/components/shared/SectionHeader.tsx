export function SectionHeader({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <span style={{ color: 'var(--color-ink-secondary)', display: 'flex' }}>{icon}</span>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)' }}>{title}</h2>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-ink-muted)',
          background: 'var(--color-bg-hover)',
          padding: '2px 8px',
          borderRadius: 10,
        }}
      >
        {count}
      </span>
    </div>
  )
}
