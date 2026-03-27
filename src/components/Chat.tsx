import { useState, useRef, useEffect } from 'react'
import { TbArrowUp } from 'react-icons/tb'
import { HiUsers } from 'react-icons/hi2'
import { TbArrowsShuffle } from 'react-icons/tb'
import { TeamArtifact } from './TeamArtifact'
import { WorkflowArtifact } from './WorkflowArtifact'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

type ArtifactTab = 'team' | 'workflow'

const TAB_META: Record<ArtifactTab, { label: string; icon: React.ReactNode }> = {
  team: { label: 'Team', icon: <HiUsers size={14} /> },
  workflow: { label: 'Workflow', icon: <TbArrowsShuffle size={14} /> },
}

export function Chat() {
  const [message, setMessage] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showArtifact, setShowArtifact] = useState(false)
  const [artifactTabs, setArtifactTabs] = useState<ArtifactTab[]>([])
  const [activeTab, setActiveTab] = useState<ArtifactTab>('team')
  const [sendCount, setSendCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSend = () => {
    if (!message.trim()) return
    if (!hasInteracted) setHasInteracted(true)
    const userMsg = message.trim()
    const currentSend = sendCount + 1
    setSendCount(currentSend)
    setMessage('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setIsTyping(true)

    if (currentSend === 1) {
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              "I'll add a new research analyst agent to your team. Here's your updated roster:",
          },
        ])
        setArtifactTabs(['team'])
        setActiveTab('team')
        setShowArtifact(true)
      }, 1200)
    } else if (currentSend === 2) {
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              "Great \u2014 I'll wire up a workflow for that. Watch it come together:",
          },
        ])
        setArtifactTabs((prev) =>
          prev.includes('workflow') ? prev : [...prev, 'workflow'],
        )
        setActiveTab('workflow')
      }, 1200)
    } else {
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "Got it! I'll work on that." },
        ])
      }, 800)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* ── Artifact panel (left) ── */}
      <div
        className="artifact-panel"
        style={{
          width: showArtifact ? '50%' : '0%',
          opacity: showArtifact ? 1 : 0,
        }}
      >
        <div
          style={{
            minWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Tab bar */}
          {artifactTabs.length > 0 && (
            <div className="artifact-tab-bar">
              {artifactTabs.map((tab) => (
                <button
                  key={tab}
                  className={`artifact-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {TAB_META[tab].icon}
                  {TAB_META[tab].label}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: activeTab === 'team' ? 'block' : 'none',
            }}
          >
            {artifactTabs.includes('team') && <TeamArtifact />}
          </div>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: activeTab === 'workflow' ? 'flex' : 'none',
              flexDirection: 'column',
            }}
          >
            {artifactTabs.includes('workflow') && <WorkflowArtifact />}
          </div>
        </div>
      </div>

      {/* ── Chat panel (right) ── */}
      <div
        style={{
          flex: showArtifact ? '0 0 50%' : '1 1 100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: hasInteracted ? 'flex-end' : 'center',
          minWidth: 0,
          background: '#fff',
          transition: 'flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Messages area */}
        {hasInteracted && messages.length > 0 && (
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <div
              style={{
                maxWidth: showArtifact ? 520 : 680,
                width: '100%',
                margin: '0 auto',
                padding: '24px 24px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  <div
                    className={
                      msg.role === 'user'
                        ? 'chat-bubble-user'
                        : 'chat-bubble-assistant'
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ alignSelf: 'flex-start' }}>
                  <div
                    className="chat-bubble-assistant"
                    style={{ display: 'flex', gap: 4, padding: '12px 16px' }}
                  >
                    <span className="typing-dot" />
                    <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Welcome + input */}
        <div
          style={{
            maxWidth: showArtifact ? 520 : 680,
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {!showArtifact && (
            <div
              style={{
                marginBottom: hasInteracted ? 16 : 24,
                textAlign: hasInteracted ? 'left' : 'center',
                transition: 'margin-bottom 0.3s ease',
              }}
            >
              <h1
                style={{
                  fontSize: hasInteracted ? 15 : 22,
                  fontWeight: hasInteracted ? 400 : 700,
                  color: '#0d0d0d',
                  lineHeight: 1.5,
                  letterSpacing: '-0.02em',
                  transition: 'font-size 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {hasInteracted
                  ? "Hi! I'm your Offload assistant."
                  : 'What would you like to automate?'}
              </h1>
              {!hasInteracted && (
                <p style={{ fontSize: 15, color: '#999', lineHeight: 1.7, marginTop: 8 }}>
                  I can set up workflows, create tasks, add team members, and
                  build connectors to your tools.
                </p>
              )}
            </div>
          )}

          <div style={{ paddingBottom: 24 }}>
            <div className="chat-input-container">
              <textarea
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Message Offload..."
                rows={1}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 15,
                  color: '#0d0d0d',
                  background: 'transparent',
                  padding: '10px 0',
                  resize: 'none',
                  lineHeight: 1.5,
                  fontFamily: 'inherit',
                }}
              />
              <button
                className="chat-send-btn"
                data-active={message.trim() ? 'true' : 'false'}
                onClick={handleSend}
              >
                <TbArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
