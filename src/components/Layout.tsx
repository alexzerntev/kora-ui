import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HiUsers } from 'react-icons/hi2'
import {
  TbRoute,
  TbMessage,
  TbPlus,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
  TbSettings,
  TbSitemap,
  TbLayoutDashboard,
  TbBuildingCommunity,
} from 'react-icons/tb'

const WORKSPACE_NAV = [
  { to: '/dashboard', icon: TbLayoutDashboard, label: 'Dashboard' },
  { to: '/processes', icon: TbRoute, label: 'Processes' },
  { to: '/team', icon: HiUsers, label: 'Team' },
  { to: '/organization', icon: TbSitemap, label: 'Organization' },
  { to: '/admin', icon: TbBuildingCommunity, label: 'Administration' },
]

const RECENT_CHATS = [
  { id: 'c1', title: 'Set up onboarding workflow' },
  { id: 'c2', title: 'Add QA agent to team' },
  { id: 'c3', title: 'Review task dependencies' },
  { id: 'c4', title: 'Configure Slack connector' },
  { id: 'c5', title: 'Sprint planning automation' },
]

function SidebarNavItem({
  to,
  icon: Icon,
  label,
  collapsed,
  active,
}: {
  to: string
  icon: React.ComponentType<{ size: number }>
  label: string
  collapsed: boolean
  active: boolean
}) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: collapsed ? '9px 0' : '9px 12px',
        justifyContent: collapsed ? 'center' : undefined,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
        background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
        transition: 'all 0.15s ease',
        textDecoration: 'none',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
        }
      }}
    >
      <span style={{ display: 'flex', flexShrink: 0 }}>
        <Icon size={19} />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isChat = location.pathname === '/chat' || location.pathname.startsWith('/chat/')
  const isWorkflowDetail = /^\/processes\/\w+/.test(location.pathname)
  const isTeam = location.pathname === '/team'
  const isOrganization = location.pathname === '/organization'
  const isFullBleed = isChat || isWorkflowDetail || isTeam || isOrganization
  const sidebarWidth = collapsed ? 60 : 260

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className="sidebar-scroll flex shrink-0 flex-col overflow-hidden transition-[width] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: sidebarWidth,
          background: '#1e1b4b',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            height: 56,
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '0' : '0 14px 0 18px',
            flexShrink: 0,
          }}
        >
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                K
              </div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                Kora
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              display: 'flex',
              width: 28,
              height: 28,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'color 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {collapsed ? <TbLayoutSidebarLeftExpand size={18} /> : <TbLayoutSidebarLeftCollapse size={18} />}
          </button>
        </div>

        {/* Workspace nav */}
        <div style={{ padding: collapsed ? '8px 8px' : '8px 12px', flexShrink: 0 }}>
          {!collapsed && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.35)',
                padding: '0 12px',
                marginBottom: 6,
              }}
            >
              Workspace
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 2 }}>
            {WORKSPACE_NAV.map((item) => (
              <SidebarNavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                active={location.pathname.startsWith(item.to)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.08)',
            margin: collapsed ? '4px 8px' : '4px 18px',
            flexShrink: 0,
          }}
        />

        {/* Chat section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column' as const,
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            padding: collapsed ? '8px 8px' : '8px 12px',
          }}
        >
          {/* New Chat */}
          <button
            onClick={() => navigate('/chat')}
            title={collapsed ? 'New Chat' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              justifyContent: collapsed ? 'center' : undefined,
              padding: collapsed ? '9px 0' : '9px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
            }}
          >
            <TbPlus size={16} strokeWidth={2.5} />
            {!collapsed && <span>New Chat</span>}
          </button>

          {/* Recent chats */}
          {!collapsed && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.35)',
                padding: '0 12px',
                marginTop: 16,
                marginBottom: 6,
              }}
            >
              Recent
            </div>
          )}
          <div
            className="sidebar-scroll"
            style={{
              display: 'flex',
              flexDirection: 'column' as const,
              flex: 1,
              gap: 1,
              overflowY: 'auto' as const,
              overflowX: 'hidden' as const,
              marginTop: collapsed ? 8 : 0,
            }}
          >
            {RECENT_CHATS.map((chat) => {
              const chatActive = location.pathname === `/chat/${chat.id}`
              return (
                <NavLink
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  title={collapsed ? chat.title : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : undefined,
                    padding: collapsed ? '8px 0' : '8px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: chatActive ? 600 : 400,
                    color: chatActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                    background: chatActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis' as const,
                    whiteSpace: 'nowrap' as const,
                  }}
                  onMouseEnter={(e) => {
                    if (!chatActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!chatActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {collapsed ? <TbMessage size={16} /> : <span className="truncate">{chat.title}</span>}
                </NavLink>
              )
            })}
          </div>
        </div>

        {/* Settings */}
        <div
          style={{
            flexShrink: 0,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: collapsed ? '8px 8px' : '8px 12px',
          }}
        >
          <SidebarNavItem
            to="/settings"
            icon={TbSettings}
            label="Settings"
            collapsed={collapsed}
            active={location.pathname.startsWith('/settings')}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {isFullBleed ? (
          <Outlet />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl px-10 py-10">
              <Outlet />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
