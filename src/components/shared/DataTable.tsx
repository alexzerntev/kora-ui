import type { ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

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
  return (
    <Table className="[&_[data-slot=table-container]]:overflow-visible">
      <TableHeader>
        <TableRow className="border-b-border hover:bg-transparent">
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className="h-auto px-1 pb-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-foreground-muted"
              style={col.width ? { width: col.width } : undefined}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={rowKey(item)}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
            className={cn(
              'border-b-border-light transition-colors duration-150',
              onRowClick && 'cursor-pointer',
              'hover:bg-[rgba(0,0,0,0.03)]',
            )}
          >
            {columns.map((col) => (
              <TableCell
                key={col.key}
                className="px-1 py-3.5 text-[13px] leading-relaxed text-foreground"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.render(item)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
