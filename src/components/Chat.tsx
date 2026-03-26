import { useState } from 'react'
import { TbArrowUp } from 'react-icons/tb'

export function Chat() {
  const [message, setMessage] = useState('')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        background: '#fff',
      }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: 16,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 15, color: '#0d0d0d', lineHeight: 1.7 }}>
              Hi! I'm your Offload assistant. I can set up workflows, create
              tasks, add team members, and build connectors to your tools.
            </p>
            <p
              style={{
                fontSize: 15,
                color: '#999',
                lineHeight: 1.7,
                marginTop: 12,
              }}
            >
              What would you like to automate?
            </p>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div
        style={{
          maxWidth: 680,
          width: '100%',
          margin: '0 auto',
          padding: '8px 24px 24px',
        }}
      >
        <div className="chat-input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
          >
            <TbArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
