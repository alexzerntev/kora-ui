import { TASKS } from '../data/tasks'
import type { Task } from '../data/tasks'
import { TbLayoutList, TbCircleFilled } from 'react-icons/tb'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentCheck,
  HiOutlineHandThumbUp,
  HiOutlineChartBar,
} from 'react-icons/hi2'

const TASK_THEMES: Record<string, { icon: React.ReactNode; bg: string; fg: string; accent: string }> = {
  t1: { icon: <HiOutlineMagnifyingGlass size={22} />, bg: '#fdf6ee', fg: '#b8860b', accent: '#f0dbb8' },
  t2: { icon: <HiOutlineDocumentText size={22} />,    bg: '#f0f6f0', fg: '#3d7a4a', accent: '#c4dcc8' },
  t3: { icon: <HiOutlineClipboardDocumentCheck size={22} />, bg: '#eef3fb', fg: '#3b6bb5', accent: '#b8cde8' },
  t4: { icon: <HiOutlineHandThumbUp size={22} />,     bg: '#f4f0fa', fg: '#7c54b8', accent: '#d4c4ea' },
  t5: { icon: <HiOutlineChartBar size={22} />,         bg: '#edf6f7', fg: '#1a8a8a', accent: '#b4d9da' },
}

const DEFAULT_THEME = { icon: <HiOutlineDocumentText size={22} />, bg: '#f0f0f0', fg: '#6b6b6b', accent: '#d4d4d4' }

function TaskCard({ task }: { task: Task }) {
  const theme = TASK_THEMES[task.id] ?? DEFAULT_THEME

  return (
    <div
      className="content-card"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Tinted icon area */}
      <div
        style={{
          background: theme.bg,
          borderRadius: 16,
          margin: 8,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative ring */}
        <div style={{
          position: 'absolute',
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: `1.5px solid ${theme.accent}`,
          opacity: 0.6,
        }} />
        {/* Icon circle */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.fg,
          position: 'relative',
        }}>
          {theme.icon}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 20px 20px' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>
          {task.name}
        </h3>

        <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
          {task.description}
        </p>

        {/* Refs */}
        {task.refs.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            paddingTop: 14,
            borderTop: '1px solid var(--color-border-light)',
          }}>
            {task.refs.map((ref) => (
              <span
                key={ref}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--color-ink-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <TbCircleFilled size={6} style={{ opacity: 0.3 }} />
                {ref}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function Tasks() {
  return (
    <div style={{ maxWidth: 1100 }}>
      <header className="page-header">
        <h1>Tasks</h1>
        <p>Reusable units of work — pick a task, assign it to a workflow</p>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-ink-secondary)' }}>
          <TbLayoutList size={16} />
          <h2 style={{ fontSize: 15, fontWeight: 650, color: 'var(--color-ink)' }}>Task Library</h2>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, color: 'var(--color-ink-muted)',
          background: 'var(--color-bg-hover)', padding: '3px 10px', borderRadius: 20,
        }}>
          {TASKS.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {TASKS.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
