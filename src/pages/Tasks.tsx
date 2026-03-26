import { TASKS } from '../data/tasks'
import type { Task } from '../data/tasks'
import { HiDocumentText } from 'react-icons/hi2'
import { TbFolders } from 'react-icons/tb'

function DossierCard({ task }: { task: Task }) {
  const paperCount = task.papers.length

  return (
    <div
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Dossier body */}
      <div
        style={{
          background: '#faf8f4',
          borderRadius: 16,
          border: '1px solid #e8e4dc',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top binding strip */}
        <div style={{
          height: 6,
          background: task.color,
          borderRadius: '16px 16px 0 0',
        }} />

        {/* Cover area */}
        <div style={{ padding: '20px 20px 0' }}>
          {/* Classification stamp */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8b7355',
            background: '#f0ebe0',
            border: '1px solid #ddd5c5',
            padding: '3px 10px',
            borderRadius: 4,
            marginBottom: 14,
          }}>
            Task Dossier
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-ink)',
            marginBottom: 6,
          }}>
            {task.name}
          </h3>

          <p style={{
            fontSize: 12,
            color: 'var(--color-ink-secondary)',
            lineHeight: 1.5,
            marginBottom: 16,
          }}>
            {task.description}
          </p>
        </div>

        {/* Papers inside */}
        <div style={{
          margin: '0 12px 12px',
          background: '#fff',
          borderRadius: 10,
          border: '1px solid #eae6de',
          overflow: 'hidden',
        }}>
          {task.papers.map((paper, i) => (
            <div
              key={paper}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 12px',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--color-ink-secondary)',
                borderTop: i > 0 ? '1px solid #f0ece4' : undefined,
              }}
            >
              <HiDocumentText size={14} style={{ color: '#c4b99a', flexShrink: 0 }} />
              {paper}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 20px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px dashed #e0dbd0',
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: '#a09480',
          }}>
            {paperCount} {paperCount === 1 ? 'document' : 'documents'} enclosed
          </span>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: task.color,
            opacity: 0.6,
          }} />
        </div>
      </div>
    </div>
  )
}

export function Tasks() {
  return (
    <div style={{ maxWidth: 1100 }}>
      <header style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.03em' }}>Tasks</h1>
        <p style={{ fontSize: 14, color: 'var(--color-ink-secondary)', marginTop: 4 }}>Reusable units of work — pick a dossier, assign it to a workflow</p>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <TbFolders size={16} style={{ color: 'var(--color-ink-secondary)' }} />
        <h2 style={{ fontSize: 15, fontWeight: 650, color: 'var(--color-ink)' }}>Task Library</h2>
        <span style={{
          fontSize: 12, fontWeight: 600, color: 'var(--color-ink-muted)',
          background: 'var(--color-bg)', padding: '3px 10px', borderRadius: 20,
        }}>
          {TASKS.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
        {TASKS.map((task) => (
          <DossierCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
