import { Outlet } from 'react-router-dom'
import { SideNav } from './SideNav'

export function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#eeedeb' }}>
      <SideNav />
      <main style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 16px 0' }}>
        <div style={{
          background: 'var(--color-bg-surface)',
          borderRadius: 20,
          minHeight: 'calc(100vh - 32px)',
          padding: '32px 40px',
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
