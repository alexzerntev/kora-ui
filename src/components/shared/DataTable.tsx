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
    <div>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns,
          padding: '0 4px 10px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {columns.map((col) => (
          <span
            key={col.key}
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--color-foreground-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {col.header}
          </span>
        ))}
      </div>

      {/* Rows */}
      {data.map((item, index) => (
        <div
          key={rowKey(item)}
          onClick={onRowClick ? () => onRowClick(item) : undefined}
          style={{
            display: 'grid',
            gridTemplateColumns,
            padding: '14px 4px',
            borderBottom: index < data.length - 1 ? '1px solid rgba(0, 0, 0, 0.04)' : 'none',
            cursor: onRowClick ? 'pointer' : 'default',
            transition: 'background 0.15s ease',
            alignItems: 'center',
            borderRadius: 6,
            margin: '0 -4px',
            paddingLeft: 8,
            paddingRight: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {columns.map((col) => (
            <div
              key={col.key}
              style={{
                fontSize: 13,
                color: 'var(--color-foreground)',
                lineHeight: 1.5,
              }}
            >
              {col.render(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
