import { useNavigate } from 'react-router-dom'
import { HiUsers } from 'react-icons/hi2'
import { TbLayoutList, TbArrowsShuffle } from 'react-icons/tb'
import { TEAM } from '../data/team'
import { TASKS } from '../data/tasks'
import { WORKFLOWS } from '../data/workflows'

const SECTIONS = [
  {
    key: 'team',
    label: 'Team',
    description: 'People and agents',
    icon: <HiUsers size={16} />,
    path: '/team',
    count: TEAM.length,
  },
  {
    key: 'tasks',
    label: 'Tasks',
    description: 'Reusable units of work',
    icon: <TbLayoutList size={16} />,
    path: '/tasks',
    count: TASKS.length,
  },
  {
    key: 'workflows',
    label: 'Workflows',
    description: 'Automated pipelines',
    icon: <TbArrowsShuffle size={16} />,
    path: '/workflows',
    count: WORKFLOWS.length,
  },
]

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 style={{
        fontSize: 14, fontWeight: 500, color: '#999',
        marginBottom: 24,
      }}>
        Workspace
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {SECTIONS.map((section) => (
          <div
            key={section.key}
            onClick={() => navigate(section.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 8px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9f9f8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#f5f5f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666',
              flexShrink: 0,
            }}>
              {section.icon}
            </div>

            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0d0d0d' }}>
                {section.label}
              </span>
              <span style={{ fontSize: 13, color: '#aaa', marginLeft: 8 }}>
                {section.description}
              </span>
            </div>

            <span style={{ fontSize: 12, color: '#ccc', fontWeight: 500 }}>
              {section.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
