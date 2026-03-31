import { useState, type ReactNode } from 'react'
import { TbChevronDown } from 'react-icons/tb'

interface CollapsiblePanelProps {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}

export function CollapsiblePanel({ title, count, defaultOpen = false, children }: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      style={{
        position: 'absolute',
        top: 72,
        left: 16,
        right: 16,
        zIndex: 9,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 14,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* Toggle bar */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '8px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          color: '#6b7280',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span>{title}</span>
        {count !== undefined && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: 'rgba(0,0,0,0.05)',
              color: '#374151',
              borderRadius: 6,
              padding: '1px 7px',
              lineHeight: '18px',
            }}
          >
            {count}
          </span>
        )}
        <TbChevronDown
          size={14}
          style={{
            marginLeft: 'auto',
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Collapsible content */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.25s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              borderTop: '1px solid rgba(0,0,0,0.04)',
              padding: '8px 12px 12px',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
