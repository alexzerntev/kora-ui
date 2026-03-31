interface FilterChipsProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function FilterChips<T extends string>({ options, value, onChange }: FilterChipsProps<T>) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          style={{
            padding: '5px 14px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: value === option.value ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.06)',
            background: value === option.value ? 'var(--color-foreground)' : 'var(--color-surface)',
            color: value === option.value ? '#fff' : 'var(--color-foreground-muted)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
            lineHeight: 1.4,
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
