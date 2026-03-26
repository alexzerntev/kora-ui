import { NavLink } from 'react-router-dom'
import { HiUsers } from 'react-icons/hi2'
import { TbArrowsShuffle, TbFolders } from 'react-icons/tb'

const NAV_ITEMS = [
  { to: '/team', label: 'Team', icon: <HiUsers size={18} /> },
  { to: '/tasks', label: 'Tasks', icon: <TbFolders size={18} /> },
  { to: '/workflows', label: 'Workflows', icon: <TbArrowsShuffle size={18} /> },
]

export function SideNav() {
  return (
    <nav
      style={{
        width: 240,
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        padding: '16px 12px',
      }}
    >
      {/* Brand */}
      <div style={{ padding: '8px 14px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'var(--color-ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            W
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.2 }}>
              Workflow
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-ink-muted)', fontWeight: 500 }}>
              Agentic Platform
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-ink-muted)', padding: '8px 14px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Workspace
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                style={{ textDecoration: 'none' }}
                className={({ isActive }) =>
                  isActive ? 'sidenav-link sidenav-active' : 'sidenav-link'
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
