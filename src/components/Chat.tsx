import { useState, useRef, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { TbArrowUp, TbChevronDown, TbChevronRight, TbPlus } from 'react-icons/tb'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatChange {
  action: 'added' | 'modified' | 'removed'
  type: string
  entity: string
}

interface ChatSession {
  messages: Message[]
  changes: ChatChange[]
}

const MOCK_CHANGES: ChatChange[] = [
  { action: 'added', type: 'Role', entity: 'QA Reviewer' },
  { action: 'added', type: 'Task', entity: 'Automated Testing' },
  { action: 'modified', type: 'Process', entity: 'Client Onboarding' },
  { action: 'removed', type: 'Agent', entity: 'Legacy Bot' },
]

const CHAT_SESSIONS: Record<string, ChatSession> = {
  c1: {
    messages: [
      {
        role: 'user',
        content:
          'I need to set up an onboarding workflow for new clients. It should include document collection, contract signing, and a welcome call.',
      },
      {
        role: 'assistant',
        content:
          "I've created a Client Onboarding v2 process with three main stages: document collection via a receive task, contract signing through a send task with DocuSign, and a welcome call scheduled via timer. I also updated the Project Lead role to include onboarding oversight responsibilities.",
      },
    ],
    changes: [
      { action: 'added', type: 'Process', entity: 'Client Onboarding v2' },
      { action: 'modified', type: 'Role', entity: 'Project Lead' },
    ],
  },
  c2: {
    messages: [
      {
        role: 'user',
        content: 'Can you add a QA agent to the team?',
      },
      {
        role: 'assistant',
        content:
          'Done! I added a QA Agent with automated testing capabilities. It uses the gpt-4o model profile and has access to the test runner tools.',
      },
    ],
    changes: [],
  },
  c3: {
    messages: [
      {
        role: 'user',
        content:
          'I want to review the task dependencies in our current processes. Are there any circular dependencies or bottlenecks?',
      },
      {
        role: 'assistant',
        content:
          'I analyzed all process flows and found a few issues. The "Review Submission" task in the Approval process was waiting on "Final Check" which itself depended on "Review Submission" -- a circular dependency. I also found that the "Data Validation" task is a bottleneck: 4 downstream tasks depend on it with no parallel paths.',
      },
      {
        role: 'user',
        content: 'Can you fix the circular dependency and add a parallel path for the data validation bottleneck?',
      },
      {
        role: 'assistant',
        content:
          'I\'ve resolved both issues. The circular dependency is broken by introducing a new "Pre-Review Check" task that feeds into "Review Submission" independently. For the data validation bottleneck, I added a parallel gateway so that "Format Check" and "Schema Validation" run concurrently before merging back.',
      },
    ],
    changes: [
      { action: 'added', type: 'Task', entity: 'Pre-Review Check' },
      { action: 'modified', type: 'Process', entity: 'Approval Flow' },
      { action: 'added', type: 'Gateway', entity: 'Validation Split' },
      { action: 'modified', type: 'Task', entity: 'Data Validation' },
    ],
  },
  c4: {
    messages: [
      {
        role: 'user',
        content: 'Help me configure the Slack connector for notifications.',
      },
      {
        role: 'assistant',
        content:
          "I've set up the Slack connector with a webhook URL placeholder. You'll need to add your actual Slack webhook URL in the connector settings under Administration. The connector is configured for the #notifications channel by default.",
      },
    ],
    changes: [],
  },
  c5: {
    messages: [
      {
        role: 'user',
        content: 'I want to automate our sprint planning process.',
      },
      {
        role: 'assistant',
        content:
          "I can help with that. What does your current sprint planning look like? Do you have a backlog prioritization step, capacity planning, or standup scheduling that you'd like to automate?",
      },
    ],
    changes: [],
  },
}

const ACTION_COLORS: Record<string, { color: string; bg: string }> = {
  added: { color: 'var(--color-status-done)', bg: '#ecfdf5' },
  modified: { color: 'var(--color-status-processing)', bg: '#fffbeb' },
  removed: { color: 'var(--color-status-failed)', bg: '#fef2f2' },
}

function ChatInner({ id }: { id?: string }) {
  const session = useMemo(() => (id ? CHAT_SESSIONS[id] : undefined), [id])

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(session?.messages ?? [])
  const [isTyping, setIsTyping] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<ChatChange[]>(session?.changes ?? [])
  const [changesExpanded, setChangesExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0 || isTyping

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    const text = message.trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setMessage('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I've made some changes based on your request. I added a QA Reviewer role, an Automated Testing task, updated the Client Onboarding process, and removed the Legacy Bot agent. You can review the changes below and add them to unreleased when ready.",
        },
      ])
      setPendingChanges(MOCK_CHANGES)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAddToUnreleased = () => {
    setPendingChanges([])
    setChangesExpanded(false)
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content:
          'Changes have been added to unreleased. You can review them in the Versions page and release when ready.',
      },
    ])
  }

  // Before any messages: centered layout
  if (!hasMessages) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          minHeight: 0,
          background: '#fff',
          padding: '0 24px',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 6 }}>
          Kora Assistant
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-foreground-muted)', marginBottom: 24 }}>
          Ask me to modify processes, roles, or any resource.
        </div>
        <div style={{ width: '100%', maxWidth: 680 }}>
          <div className="chat-input-container">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the assistant..."
              rows={1}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: 14,
                lineHeight: 1.5,
                fontFamily: 'inherit',
                color: 'var(--color-foreground)',
                padding: '8px 0',
              }}
            />
            <button
              className="chat-send-btn"
              data-active={message.trim().length > 0 ? 'true' : 'false'}
              onClick={handleSend}
            >
              <TbArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // After first interaction
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        background: '#fff',
        alignItems: 'center',
      }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 24px',
          width: '100%',
          maxWidth: 728,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '10px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? 'var(--color-foreground)' : 'var(--color-surface-hover)',
                color: msg.role === 'user' ? '#fff' : 'var(--color-foreground)',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div
              style={{
                padding: '10px 16px',
                borderRadius: '16px 16px 16px 4px',
                background: 'var(--color-surface-hover)',
                display: 'flex',
                gap: 4,
              }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
              <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom area: changes accordion + input */}
      <div
        style={{
          flexShrink: 0,
          width: '100%',
          maxWidth: 728,
          padding: '0 24px 20px',
        }}
      >
        {/* Pending changes accordion */}
        {pendingChanges.length > 0 && (
          <div
            style={{
              border: '2px solid var(--color-status-processing)',
              borderRadius: 12,
              marginBottom: 10,
              overflow: 'hidden',
            }}
          >
            {/* Accordion header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 14px',
                cursor: 'pointer',
                background: 'rgba(245, 158, 11, 0.04)',
              }}
              onClick={() => setChangesExpanded(!changesExpanded)}
            >
              {changesExpanded ? (
                <TbChevronDown size={16} style={{ color: 'var(--color-foreground-secondary)', flexShrink: 0 }} />
              ) : (
                <TbChevronRight size={16} style={{ color: 'var(--color-foreground-secondary)', flexShrink: 0 }} />
              )}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--color-foreground)',
                  marginLeft: 8,
                  flex: 1,
                }}
              >
                {pendingChanges.length} pending change{pendingChanges.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToUnreleased()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--color-status-processing)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'opacity 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.85'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                <TbPlus size={13} strokeWidth={2.5} />
                Add to unreleased
              </button>
            </div>

            {/* Accordion content */}
            {changesExpanded && (
              <div
                style={{
                  padding: '8px 14px 12px',
                  borderTop: '1px solid rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {pendingChanges.map((change, i) => {
                  const style = ACTION_COLORS[change.action]
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: style.color,
                          background: style.bg,
                          padding: '2px 7px',
                          borderRadius: 4,
                          textTransform: 'capitalize',
                          flexShrink: 0,
                        }}
                      >
                        {change.action}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--color-foreground-muted)' }}>{change.type}:</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-foreground)' }}>
                        {change.entity}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the assistant..."
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: 'inherit',
              color: 'var(--color-foreground)',
              padding: '8px 0',
            }}
          />
          <button
            className="chat-send-btn"
            data-active={message.trim().length > 0 ? 'true' : 'false'}
            onClick={handleSend}
          >
            <TbArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Chat() {
  const { id } = useParams<{ id: string }>()
  return <ChatInner key={id ?? '__new__'} id={id} />
}
