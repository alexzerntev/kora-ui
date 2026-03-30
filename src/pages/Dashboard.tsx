export function Dashboard() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <header style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.025em',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {greeting}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#6b7280',
            marginTop: 6,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          Here is what is happening across your workspace today.
        </p>
      </header>
    </div>
  )
}
