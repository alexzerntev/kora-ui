import { Outlet, Link } from 'react-router-dom'
import { Chat } from './Chat'

export function Layout() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#fff',
      overflow: 'hidden',
    }}>
      {/* Navbar */}
      <nav style={{
        height: 48,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid #ebebeb',
      }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: '#0d0d0d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 11, fontWeight: 700,
          }}>
            O
          </div>
          <span style={{
            fontSize: 14, fontWeight: 600, color: '#0d0d0d',
          }}>
            Offload
          </span>
        </Link>
      </nav>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Workspace */}
        <div style={{
          width: '50%',
          overflowY: 'auto',
          borderRight: '1px solid #ebebeb',
        }}>
          <div style={{ padding: '24px 28px' }}>
            <Outlet />
          </div>
        </div>

        {/* Right: Chat */}
        <div style={{
          width: '50%',
          flexShrink: 0,
          background: '#f9f9f8',
        }}>
          <Chat />
        </div>
      </div>
    </div>
  )
}
