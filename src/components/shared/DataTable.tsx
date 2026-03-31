import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  width?: string // e.g., '200px', '1fr'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  rowKey: (item: T) => string
}

export function DataTable<T>({ columns, data, onRowClick, rowKey }: DataTableProps<T>) {
  const gridTemplateColumns = columns.map((col) => col.width ?? '1fr').join(' ')

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns,
          padding: '10px 20px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-hover)',
        }}
      >
        {columns.map((col) => (
          <span
            key={col.key}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-foreground-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {col.header}
          </span>
        ))}
      </div>

      {/* Rows */}
      {data.map((item) => (
        <div
          key={rowKey(item)}
          onClick={onRowClick ? () => onRowClick(item) : undefined}
          style={{
            display: 'grid',
            gridTemplateColumns,
            padding: '14px 20px',
            borderBottom: '1px solid var(--color-border-light)',
            cursor: onRowClick ? 'pointer' : 'default',
            transition: 'background 0.1s ease',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {columns.map((col) => (
            <div key={col.key}>{col.render(item)}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
