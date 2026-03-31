import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { TbPlayerPlay } from 'react-icons/tb'
import type { WorkflowInputField } from '../../providers/types'

interface RunProcessButtonProps {
  schema?: WorkflowInputField[]
  onRun: (args?: Record<string, string>) => void
  disabled?: boolean
}

function getDefaults(schema?: WorkflowInputField[]): Record<string, string> {
  if (!schema) return {}
  const defaults: Record<string, string> = {}
  schema.forEach((field) => {
    if (field.defaultValue) {
      defaults[field.name] = field.defaultValue
    }
  })
  return defaults
}

export function RunProcessButton({ schema, onRun, disabled }: RunProcessButtonProps) {
  const hasInputs = schema && schema.length > 0
  const initialValues = useMemo(() => getDefaults(schema), [schema])
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>(initialValues)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setSubmitted(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSubmitted(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const validate = useCallback(() => {
    if (!schema) return true
    const newErrors: Record<string, boolean> = {}
    let valid = true
    schema.forEach((field) => {
      if (field.required && !values[field.name]?.trim()) {
        newErrors[field.name] = true
        valid = false
      }
    })
    setErrors(newErrors)
    return valid
  }, [schema, values])

  const handleButtonClick = () => {
    if (disabled) return

    if (!hasInputs) {
      onRun()
      return
    }

    if (open) {
      setOpen(false)
      setSubmitted(false)
      return
    }

    // If all required fields already have values, run directly
    const allFilled = schema!.every((f) => !f.required || values[f.name]?.trim())
    if (allFilled) {
      onRun(values)
    } else {
      setOpen(true)
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (validate()) {
      onRun(values)
      setOpen(false)
      setSubmitted(false)
    }
  }

  const handleFieldChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (submitted) {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={handleButtonClick}
        disabled={disabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'inherit',
          color: '#ffffff',
          background: 'var(--color-primary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = 'var(--color-primary-hover)'
        }}
        onMouseLeave={(e) => {
          if (!disabled) e.currentTarget.style.background = 'var(--color-primary)'
        }}
      >
        <TbPlayerPlay size={14} />
        Run
        {hasInputs && (
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            style={{
              marginLeft: 2,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s ease',
            }}
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && hasInputs && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 300,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-elevated)',
            padding: 16,
            zIndex: 100,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: 12 }}>
            Process Inputs
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {schema!.map((field) => {
              const hasError = submitted && errors[field.name]
              return (
                <div key={field.name}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--color-foreground-secondary)',
                      marginBottom: 4,
                    }}
                  >
                    {field.label}
                    {field.required && <span style={{ color: 'var(--color-status-failed)', marginLeft: 2 }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={values[field.name] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: 13,
                      fontFamily: 'inherit',
                      color: 'var(--color-foreground)',
                      background: 'var(--color-surface)',
                      border: `1px solid ${hasError ? 'var(--color-status-failed)' : 'var(--color-border-strong)'}`,
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      if (!hasError) {
                        e.currentTarget.style.borderColor = 'rgba(29, 78, 216, 0.3)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29, 78, 216, 0.06)'
                      }
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = hasError
                        ? 'var(--color-status-failed)'
                        : 'var(--color-border-strong)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                  {hasError && (
                    <p style={{ fontSize: 11, color: 'var(--color-status-failed)', marginTop: 3, marginBottom: 0 }}>
                      {field.label} is required
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <button
            onClick={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              width: '100%',
              marginTop: 16,
              padding: '8px 0',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              color: '#ffffff',
              background: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)'
            }}
          >
            <TbPlayerPlay size={14} />
            Run
          </button>
        </div>
      )}
    </div>
  )
}
