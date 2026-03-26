import { useState } from 'react'
import { TbArrowUp } from 'react-icons/tb'

export function Chat() {
  const [message, setMessage] = useState('')

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 24px 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 16,
      }}>
        <div style={{ maxWidth: '100%' }}>
          <p style={{
            fontSize: 14, color: '#0d0d0d', lineHeight: 1.7,
          }}>
            Hi! I'm your Offload assistant. I can set up workflows, create tasks, add team members, and build connectors to your tools.
          </p>
          <p style={{
            fontSize: 14, color: '#999', lineHeight: 1.7, marginTop: 12,
          }}>
            What would you like to automate?
          </p>
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          background: '#fff',
          borderRadius: 12,
          padding: '4px 4px 4px 14px',
          border: '1px solid #e0e0e0',
        }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message Offload..."
            rows={1}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: '#0d0d0d',
              background: 'transparent',
              padding: '8px 0',
              resize: 'none',
              lineHeight: 1.5,
              fontFamily: 'inherit',
            }}
          />
          <button
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: message.trim() ? '#0d0d0d' : '#e5e5e5',
              border: 'none',
              cursor: message.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: message.trim() ? '#fff' : '#aaa',
              transition: 'background 0.15s',
              flexShrink: 0,
            }}
          >
            <TbArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
