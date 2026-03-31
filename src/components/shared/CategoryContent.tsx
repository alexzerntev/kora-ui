import type { ReactNode } from 'react'

interface CategoryContentProps {
  title: string
  description: string
  children?: ReactNode
}

export function CategoryContent({ title, description, children }: CategoryContentProps) {
  return (
    <div>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--color-foreground)',
          marginBottom: 6,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 13,
          color: 'var(--color-foreground-secondary)',
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        {description}
      </p>
      {children}
    </div>
  )
}
