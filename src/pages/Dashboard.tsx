export function Dashboard() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <header className="page-header">
        <h1>{greeting}</h1>
        <p>Here is what is happening across your workspace today.</p>
      </header>
    </div>
  )
}
