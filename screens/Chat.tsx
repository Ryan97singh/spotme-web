'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, MoreVertical, Send, Calendar, X, Zap } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PROFILES, MESSAGES } from '@/lib/data'

const ICEBREAKERS = [
  "What's your PR? 🏋️",
  'Morning or evening? ☀️',
  'Favourite gym? 💪',
  'Fav protein? 🥤',
  'Training split? 📋',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIMES = ['6:00 AM', '7:00 AM', '8:00 AM', '12:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']
const PLACES = ['Your gym', 'My gym', 'Central Park', 'CrossFit Box', 'Outdoor Track']

export default function Chat() {
  const go = useStore((s) => s.go)
  const chatWith = useStore((s) => s.chatWith)

  const profile = chatWith ? PROFILES.find((p) => p.id === chatWith) : PROFILES[0]
  const initialMessages = chatWith && MESSAGES[chatWith] ? MESSAGES[chatWith] : []

  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedPlace, setSelectedPlace] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text?: string) => {
    const msgText = text ?? input.trim()
    if (!msgText) return
    const newMsg = {
      id: `msg${Date.now()}`,
      from: 'me' as const,
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMsg])
    setInput('')

    // Simulate response
    setTimeout(() => {
      const responses = [
        'That sounds amazing! 💪',
        'I was just thinking the same thing!',
        "Yes! Let's do it 🔥",
        'Great idea! When works for you?',
        "Love it! I'll be there 🏋️",
      ]
      setMessages((prev) => [
        ...prev,
        {
          id: `msg${Date.now() + 1}`,
          from: 'them',
          text: responses[Math.floor(Math.random() * responses.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 1200)
  }

  const handleScheduleSend = () => {
    if (!selectedDay || !selectedTime) return
    handleSend(`📅 Session booked: ${selectedDay} at ${selectedTime}${selectedPlace ? ` · ${selectedPlace}` : ''}`)
    setShowSchedule(false)
    setSelectedDay('')
    setSelectedTime('')
    setSelectedPlace('')
  }

  if (!profile) return null

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div
        className="glass-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '52px 16px 12px',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => go('matches')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex',
            padding: '6px',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <img
              src={profile.photo}
              alt={profile.name}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--rose)',
              }}
            />
            <span
              className="pulse"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--online)',
                border: '2px solid var(--bg)',
              }}
            />
          </div>
          <div>
            <p
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 15,
                color: '#fff',
                lineHeight: 1.2,
              }}
            >
              {profile.name}
            </p>
            <p style={{ fontSize: 11, color: 'var(--online)', fontWeight: 500 }}>
              Active now · {profile.gym}
            </p>
          </div>
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)',
            padding: '6px',
          }}
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Compat banner */}
      <div
        style={{
          padding: '8px 16px',
          background: 'var(--volt-dim)',
          borderBottom: '1px solid rgba(200,255,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <Zap size={14} color="var(--volt)" fill="var(--volt)" />
        <span style={{ color: 'var(--volt)', fontSize: 12, fontWeight: 600 }}>
          {profile.compat}% match — You both love {profile.goals[0]}
        </span>
      </div>

      {/* Icebreaker chips */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '10px 16px',
          flexShrink: 0,
        }}
      >
        {ICEBREAKERS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="glass"
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {messages.map((msg, i) => {
          const isMe = msg.from === 'me'
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.18 }}
              style={{
                display: 'flex',
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 8,
              }}
            >
              {!isMe && i === 0 && (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              )}
              {!isMe && i > 0 && <div style={{ width: 28 }} />}

              <div
                style={{
                  maxWidth: '72%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  gap: 3,
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isMe ? 'var(--rose)' : 'var(--elevated)',
                    color: '#fff',
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: isMe ? '0 2px 12px rgba(255,107,157,0.3)' : '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                  {msg.time}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Input bar */}
      <div
        className="glass-bar"
        style={{
          padding: '10px 12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: 'none',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setShowSchedule(true)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Calendar size={18} color="var(--volt)" />
        </button>

        <input
          type="text"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '11px 16px',
            borderRadius: 22,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'var(--font-ui)',
          }}
        />

        <button
          onClick={() => handleSend()}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: input.trim() ? 'var(--rose)' : 'rgba(255,255,255,0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            boxShadow: input.trim() ? '0 0 16px rgba(255,107,157,0.4)' : 'none',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          <Send size={17} color={input.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} />
        </button>
      </div>

      {/* Schedule sheet */}
      <AnimatePresence>
        {showSchedule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSchedule(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 40,
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-sheet"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                borderRadius: '20px 20px 0 0',
                padding: '20px 20px 40px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    fontSize: 20,
                    color: '#fff',
                  }}
                >
                  📅 Schedule a session
                </h2>
                <button
                  onClick={() => setShowSchedule(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)',
                    display: 'flex',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Day picker */}
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>
                Day
              </p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: `1.5px solid ${selectedDay === d ? 'var(--volt)' : 'rgba(255,255,255,0.1)'}`,
                      background: selectedDay === d ? 'var(--volt-dim)' : 'rgba(255,255,255,0.03)',
                      color: selectedDay === d ? 'var(--volt)' : 'rgba(255,255,255,0.6)',
                      fontWeight: selectedDay === d ? 700 : 500,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Time picker */}
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>
                Time
              </p>
              <div
                className="no-scrollbar"
                style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }}
              >
                {TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: `1.5px solid ${selectedTime === t ? 'var(--volt)' : 'rgba(255,255,255,0.1)'}`,
                      background: selectedTime === t ? 'var(--volt-dim)' : 'rgba(255,255,255,0.03)',
                      color: selectedTime === t ? 'var(--volt)' : 'rgba(255,255,255,0.6)',
                      fontWeight: selectedTime === t ? 700 : 500,
                      fontSize: 13,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Place picker */}
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>
                Location
              </p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {PLACES.map((pl) => (
                  <button
                    key={pl}
                    onClick={() => setSelectedPlace(pl)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: `1.5px solid ${selectedPlace === pl ? 'var(--rose)' : 'rgba(255,255,255,0.1)'}`,
                      background: selectedPlace === pl ? 'var(--rose-dim)' : 'rgba(255,255,255,0.03)',
                      color: selectedPlace === pl ? 'var(--rose)' : 'rgba(255,255,255,0.6)',
                      fontWeight: selectedPlace === pl ? 700 : 500,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {pl}
                  </button>
                ))}
              </div>

              <button
                onClick={handleScheduleSend}
                disabled={!selectedDay || !selectedTime}
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: 14,
                  background: selectedDay && selectedTime ? 'var(--volt)' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: selectedDay && selectedTime ? '#0D0B14' : 'rgba(255,255,255,0.3)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: selectedDay && selectedTime ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
              >
                Send session invite
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
