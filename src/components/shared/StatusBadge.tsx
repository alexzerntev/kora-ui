interface StatusBadgeProps {
  status: string
  color: string
  backgroundColor: string
}

export function StatusBadge({ status, color, backgroundColor }: StatusBadgeProps) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color,
        background: backgroundColor,
        padding: '3px 9px',
        borderRadius: 6,
        textTransform: 'capitalize',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}
