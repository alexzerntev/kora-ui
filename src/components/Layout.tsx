import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  TbRoute,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
  TbSettings,
  TbSitemap,
  TbBuildingCommunity,
  TbEdit,
  TbMessage,
  TbPlayerPlay,
  TbPackages,
} from 'react-icons/tb'

const NAV_ITEMS = [
  { to: '/chat', icon: TbEdit, label: 'Assistant' },
  { to: '/organization', icon: TbSitemap, label: 'Organization' },
  { to: '/processes', icon: TbRoute, label: 'Processes' },
  { to: '/runs', icon: TbPlayerPlay, label: 'Runs' },
  { to: '/admin', icon: TbBuildingCommunity, label: 'Administration' },
  { to: '/releases', icon: TbPackages, label: 'Releases' },
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
  icon: React.ComponentType<{ size: number; strokeWidth?: number }>
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
        padding: collapsed ? '8px 0' : '8px 12px',
        justifyContent: collapsed ? 'center' : undefined,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 550 : 400,
        color: active ? '#111827' : '#6b7280',
        background: active ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        transition: 'all 0.12s ease',
        textDecoration: 'none',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'
          e.currentTarget.style.color = '#374151'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#6b7280'
        }
      }}
    >
      <span style={{ display: 'flex', flexShrink: 0 }}>
        <Icon size={17} strokeWidth={active ? 1.9 : 1.7} />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const isChat = location.pathname === '/chat' || location.pathname.startsWith('/chat/')
  const isWorkflowDetail = /^\/processes\/\w+/.test(location.pathname)
  const isRunDetail = /^\/runs\/[\w-]+$/.test(location.pathname)
  const isOrganization = location.pathname === '/organization'
  const isFullBleed = isChat || isWorkflowDetail || isRunDetail || isOrganization
  const sidebarWidth = collapsed ? 56 : 220

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f9fafb' }}>
      {/* Sidebar — frosted glass, barely-there */}
      <aside
        className="sidebar-scroll flex shrink-0 flex-col overflow-hidden transition-[width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: sidebarWidth,
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderRight: '1px solid rgba(0, 0, 0, 0.04)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            height: 52,
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : undefined,
            padding: collapsed ? '0' : '0 16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.04em',
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              K
            </span>
            {!collapsed && (
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                Kora
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            padding: collapsed ? '4px 8px' : '4px 10px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 1 }}>
            {NAV_ITEMS.map((item) => (
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
            background: 'rgba(0, 0, 0, 0.06)',
            margin: collapsed ? '6px 8px' : '6px 14px',
            flexShrink: 0,
          }}
        />

        {/* Chat section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            overflow: 'hidden',
            padding: collapsed ? '4px 8px' : '4px 10px',
          }}
        >
          {/* Recent label */}
          {!collapsed && (
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: '#9ca3af',
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                padding: '0 12px',
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              Recent
            </div>
          )}
          <div
            className="sidebar-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 1,
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
                    padding: collapsed ? '7px 0' : '7px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: chatActive ? 500 : 400,
                    color: chatActive ? '#111827' : '#9ca3af',
                    background: chatActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    transition: 'all 0.12s ease',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={(e) => {
                    if (!chatActive) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'
                      e.currentTarget.style.color = '#6b7280'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!chatActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#9ca3af'
                    }
                  }}
                >
                  {collapsed ? (
                    <TbMessage size={16} strokeWidth={1.7} />
                  ) : (
                    <span className="truncate">{chat.title}</span>
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>

        {/* Bottom: Settings + Collapse */}
        <div
          style={{
            flexShrink: 0,
            padding: collapsed ? '8px 8px' : '8px 10px',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: 1,
          }}
        >
          <SidebarNavItem
            to="/settings"
            icon={TbSettings}
            label="Settings"
            collapsed={collapsed}
            active={location.pathname.startsWith('/settings')}
          />

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : undefined,
              gap: 10,
              padding: collapsed ? '8px 0' : '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: '#9ca3af',
              cursor: 'pointer',
              flexShrink: 0,
              fontSize: 13,
              fontWeight: 400,
              fontFamily: 'inherit',
              transition: 'all 0.12s ease',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#6b7280'
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ display: 'flex', flexShrink: 0 }}>
              {collapsed ? (
                <TbLayoutSidebarLeftExpand size={17} strokeWidth={1.7} />
              ) : (
                <TbLayoutSidebarLeftCollapse size={17} strokeWidth={1.7} />
              )}
            </span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ background: '#f9fafb' }}>
        {isFullBleed ? (
          <Outlet />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl px-12 py-10">
              <Outlet />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
