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
  TbHistory,
  TbArchive,
  TbBell,
  TbAlertCircle,
} from 'react-icons/tb'

const NAV_ITEMS = [
  { to: '/chat', icon: TbEdit, label: 'Assistant' },
  { to: '/organization', icon: TbSitemap, label: 'Organization' },
  { to: '/processes', icon: TbRoute, label: 'Processes' },
  { to: '/runs', icon: TbPlayerPlay, label: 'Runs' },
  { to: '/admin', icon: TbBuildingCommunity, label: 'Administration' },
  { to: '/releases', icon: TbHistory, label: 'Versions', badge: 'pending' as const },
]

const RECENT_CHATS = [
  { id: 'c1', title: 'Set up onboarding workflow', pendingChanges: 2 },
  { id: 'c2', title: 'Add QA agent to team', pendingChanges: 0 },
  { id: 'c3', title: 'Review task dependencies', pendingChanges: 4 },
  { id: 'c4', title: 'Configure Slack connector', pendingChanges: 0 },
  { id: 'c5', title: 'Sprint planning automation', pendingChanges: 0 },
]

function SidebarNavItem({
  to,
  icon: Icon,
  label,
  collapsed,
  active,
  badge,
}: {
  to: string
  icon: React.ComponentType<{ size: number; strokeWidth?: number }>
  label: string
  collapsed: boolean
  active: boolean
  badge?: string
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
      {!collapsed && (
        <>
          <span className="truncate" style={{ flex: 1 }}>
            {label}
          </span>
          {badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--color-status-processing)',
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '1px 6px',
                borderRadius: 4,
                flexShrink: 0,
              }}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [archivedChats, setArchivedChats] = useState<Set<string>>(new Set())
  const [panelOpen, setPanelOpen] = useState(false)
  const location = useLocation()

  const visibleChats = RECENT_CHATS.filter((chat) => !archivedChats.has(chat.id))

  const handleArchiveChat = (chatId: string) => {
    setArchivedChats((prev) => new Set(prev).add(chatId))
  }

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
                badge={'badge' in item ? (item.badge as string) : undefined}
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
            {visibleChats.map((chat) => {
              const chatActive = location.pathname === `/chat/${chat.id}`
              return (
                <div
                  key={chat.id}
                  className="chat-sidebar-item group"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 8,
                  }}
                >
                  <NavLink
                    to={`/chat/${chat.id}`}
                    title={collapsed ? chat.title : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: collapsed ? 'center' : undefined,
                      padding: collapsed ? '7px 0' : '7px 12px',
                      paddingRight: collapsed ? undefined : '28px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: chatActive ? 500 : 400,
                      color: chatActive ? '#111827' : '#9ca3af',
                      background: chatActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                      transition: 'all 0.12s ease',
                      textDecoration: 'none',
                      letterSpacing: '-0.01em',
                      flex: 1,
                      minWidth: 0,
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
                      <div style={{ position: 'relative' }}>
                        <TbMessage size={16} strokeWidth={1.7} />
                        {chat.pendingChanges > 0 && (
                          <span
                            style={{
                              position: 'absolute',
                              top: -4,
                              right: -6,
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: 'var(--color-status-processing)',
                              border: '1.5px solid rgba(255,255,255,0.8)',
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <>
                        <span className="truncate" style={{ flex: 1 }}>
                          {chat.title}
                        </span>
                        {chat.pendingChanges > 0 && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: 'var(--color-status-processing)',
                              background: 'rgba(245, 158, 11, 0.1)',
                              padding: '1px 6px',
                              borderRadius: 4,
                              flexShrink: 0,
                            }}
                          >
                            {chat.pendingChanges}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>

                  {/* Archive button — visible on hover only */}
                  {!collapsed && (
                    <button
                      className="chat-menu-trigger"
                      title="Archive"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleArchiveChat(chat.id)
                      }}
                      style={{
                        position: 'absolute',
                        right: 6,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-foreground-muted)',
                        cursor: 'pointer',
                        transition: 'opacity 0.12s ease, background 0.12s ease',
                        padding: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.06)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <TbArchive size={13} />
                    </button>
                  )}
                </div>
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

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: 48,
            padding: '0 16px',
            background: '#fff',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        >
          {/* Notifications button */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            title="Notifications"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: panelOpen ? 'rgba(0,0,0,0.04)' : 'transparent',
              cursor: 'pointer',
              color: panelOpen ? 'var(--color-foreground)' : 'var(--color-foreground-muted)',
              position: 'relative',
              transition: 'all 0.12s ease',
              marginLeft: 4,
            }}
            onMouseEnter={(e) => {
              if (!panelOpen) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'
            }}
            onMouseLeave={(e) => {
              if (!panelOpen) e.currentTarget.style.background = 'transparent'
            }}
          >
            <TbBell size={18} strokeWidth={1.8} />
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                background: 'var(--color-status-failed)',
                border: '2px solid #fff',
                fontSize: 9,
                fontWeight: 700,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                lineHeight: 1,
              }}
            >
              4
            </span>
          </button>

          {/* Profile avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--color-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              flexShrink: 0,
              marginLeft: 12,
              cursor: 'pointer',
            }}
          >
            AZ
          </div>
        </div>

        {/* Content + Notifications panel */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Page content */}
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

          {/* Notifications panel */}
          <div
            style={{
              width: panelOpen ? 340 : 0,
              flexShrink: 0,
              borderLeft: panelOpen ? '1px solid rgba(0,0,0,0.06)' : 'none',
              background: '#fff',
              transition: 'width 0.2s ease',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-foreground)' }}>Notifications</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {/* Actions section */}
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--color-foreground-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '4px 4px 8px',
                }}
              >
                Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {/* Pending approval */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(29, 78, 216, 0.15)',
                    background: 'rgba(29, 78, 216, 0.02)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <TbAlertCircle size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>
                      Approval needed
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-foreground-muted)', lineHeight: 1.5, margin: 0 }}>
                    Vendor contract in Client Onboarding requires your approval.
                  </p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                        background: 'rgba(29,78,216,0.08)',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Review
                    </button>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--color-foreground-muted)',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                {/* Review required */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    background: 'rgba(245, 158, 11, 0.03)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <TbAlertCircle size={15} style={{ color: 'var(--color-status-processing)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>
                      Review required
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-foreground-muted)', lineHeight: 1.5, margin: 0 }}>
                    Q4 Summary Report drafted by Felix needs your review before sending.
                  </p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-status-processing)',
                        background: 'rgba(245,158,11,0.08)',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Review
                    </button>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--color-foreground-muted)',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications section */}
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--color-foreground-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '4px 4px 8px',
                }}
              >
                Notifications
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Failed process */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    background: 'rgba(239, 68, 68, 0.02)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <TbAlertCircle size={15} style={{ color: 'var(--color-status-failed)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>
                      Process failed
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-foreground-muted)', lineHeight: 1.5, margin: 0 }}>
                    Lead Processing Pipeline failed at "Fetch CRM Data". Connection timeout.
                  </p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-status-failed)',
                        background: 'rgba(239,68,68,0.08)',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      View Run
                    </button>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--color-foreground-muted)',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Completed process */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <TbAlertCircle size={15} style={{ color: 'var(--color-status-done)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>
                      Process completed
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-foreground-muted)', lineHeight: 1.5, margin: 0 }}>
                    Client Onboarding completed successfully in 22 minutes.
                  </p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-status-done)',
                        background: 'rgba(16,185,129,0.08)',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      View Run
                    </button>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--color-foreground-muted)',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
