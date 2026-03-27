import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HiUsers } from 'react-icons/hi2'
import {
  TbLayoutList,
  TbRoute,
  TbMessage,
  TbPlus,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
  TbSettings,
} from 'react-icons/tb'

const WORKSPACE_NAV = [
  { to: '/processes', icon: <TbRoute size={18} />, label: 'Processes' },
  { to: '/team', icon: <HiUsers size={18} />, label: 'Organization' },
  { to: '/tasks', icon: <TbLayoutList size={18} />, label: 'Tasks' },
]

const RECENT_CHATS = [
  { id: 'c1', title: 'Set up onboarding workflow' },
  { id: 'c2', title: 'Add QA agent to team' },
  { id: 'c3', title: 'Review task dependencies' },
  { id: 'c4', title: 'Configure Slack connector' },
  { id: 'c5', title: 'Sprint planning automation' },
]

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isChat = location.pathname === '/chat' || location.pathname.startsWith('/chat/')
  const isWorkflowDetail = /^\/processes\/\w+/.test(location.pathname)
  const isTeam = location.pathname === '/team'
  const isFullBleed = isChat || isWorkflowDetail || isTeam
  const sidebarWidth = collapsed ? 56 : 252

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#fff' }}>
      {/* ── Sidebar ── */}
      <aside
        className="sidebar"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'var(--sidebar-bg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {/* Header — logo + collapse toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '14px 0' : '14px 14px 14px 16px',
            height: 56,
            flexShrink: 0,
          }}
        >
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <div className="sidebar-logo">O</div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: 'var(--sidebar-ink)',
                  whiteSpace: 'nowrap',
                }}
              >
                Offload
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-toggle"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <TbLayoutSidebarLeftExpand size={18} />
            ) : (
              <TbLayoutSidebarLeftCollapse size={18} />
            )}
          </button>
        </div>

        {/* ── Workspace section ── */}
        <div style={{ padding: collapsed ? '8px 8px' : '8px 10px', flexShrink: 0 }}>
          {!collapsed && <div className="sidebar-section-label">Workspace</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {WORKSPACE_NAV.map((item) => {
              const isActive = location.pathname.startsWith(item.to)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  style={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '8px 0' : '7px 10px',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'var(--sidebar-border)',
            margin: collapsed ? '6px 8px' : '6px 14px',
            flexShrink: 0,
          }}
        />

        {/* ── Chat section ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: collapsed ? '8px 8px' : '8px 10px',
          }}
        >
          {/* New Chat button */}
          <button
            onClick={() => navigate('/chat')}
            className={`sidebar-new-chat ${collapsed ? 'collapsed' : ''}`}
            title={collapsed ? 'New Chat' : undefined}
          >
            <TbPlus size={16} strokeWidth={2.5} />
            {!collapsed && <span>New Chat</span>}
          </button>

          {/* Recent chats */}
          {!collapsed && <div className="sidebar-section-label" style={{ marginTop: 16 }}>Recent</div>}

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              marginTop: collapsed ? 8 : 0,
            }}
          >
            {RECENT_CHATS.map((chat) => {
              const chatActive = location.pathname === `/chat/${chat.id}`
              return (
                <NavLink
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className={`sidebar-nav-item ${chatActive ? 'active' : ''}`}
                  style={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '8px 0' : '7px 10px',
                  }}
                  title={collapsed ? chat.title : undefined}
                >
                  {collapsed ? (
                    <TbMessage size={16} />
                  ) : (
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {chat.title}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>

        {/* ── Settings button ── */}
        <div
          style={{
            padding: collapsed ? '8px 8px' : '8px 10px',
            flexShrink: 0,
            borderTop: '1px solid var(--sidebar-border)',
          }}
        >
          <NavLink
            to="/settings"
            className={`sidebar-nav-item ${location.pathname.startsWith('/settings') ? 'active' : ''}`}
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '8px 0' : '7px 10px',
            }}
            title={collapsed ? 'Settings' : undefined}
          >
            <span style={{ flexShrink: 0, display: 'flex' }}>
              <TbSettings size={18} />
            </span>
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {isFullBleed ? (
          <Outlet />
        ) : (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '28px 36px', maxWidth: 1200, margin: '0 auto' }}>
              <Outlet />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
