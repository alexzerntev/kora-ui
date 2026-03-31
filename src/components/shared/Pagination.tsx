import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const rangeStart = total === 0 ? 0 : page * pageSize + 1
  const rangeEnd = Math.min((page + 1) * pageSize, total)
  const isFirst = page === 0
  const isLast = page >= totalPages - 1

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        padding: '0 4px',
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: 'var(--color-foreground-muted)',
        }}
      >
        Showing {rangeStart}-{rangeEnd} of {total}
      </span>

      <div style={{ display: 'flex', gap: 6 }}>
        <button
          disabled={isFirst}
          onClick={() => onPageChange(Math.max(0, page - 1))}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: isFirst ? 'var(--color-foreground-subtle)' : 'var(--color-foreground-secondary)',
            cursor: isFirst ? 'default' : 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.12s ease',
          }}
        >
          <TbChevronLeft size={16} />
        </button>
        <button
          disabled={isLast}
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: isLast ? 'var(--color-foreground-subtle)' : 'var(--color-foreground-secondary)',
            cursor: isLast ? 'default' : 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.12s ease',
          }}
        >
          <TbChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
