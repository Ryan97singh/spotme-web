'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, MoreVertical, Send, Calendar, X, Zap } from 'lucide-react'
import { useStore } from '@/lib/store'
import { findMatchId, getMessages, sendMessage, subscribeToMessages, type Message } from '@/lib/api'
import { getSupabase } from '@/lib/supabase'

const ICEBREAKERS = ["What's your PR? 🏋️", 'Morning or evening? ☀️', 'Favourite gym? 💪', 'Fav protein? 🥤', 'Training split? 📋']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIMES = ['6:00 AM', '7:00 AM', '8:00 AM', '12:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']
const PLACES = ['Your gym', 'My gym', 'Central Park', 'CrossFit Box', 'Outdoor Track']

export default function Chat() {
  const go = useStore((s) => s.go)
  const chatWith = useStore((s) => s.chatWith)
  const user = useStore((s) => s.user)

  const [otherProfile, setOtherProfile] = useState<{ name: string; avatar: string | null; gym: string | null } | null>(null)
  const [matchId, setMatchId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [showSchedule, setShowSchedule] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedPlace, setSelectedPlace] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load other user profile + match + messages
  useEffect(() => {
    if (!chatWith || !user) return

    const supabase = getSupabase()

    // Load other user's profile
    supabase.from('profiles').select('full_name,avatar_url,gym_name').eq('id', chatWith).single().then(({ data }) => {
      if (data) setOtherProfile({ name: data.full_name, avatar: data.avatar_url, gym: data.gym_name })
    })

    // Find match ID then load messages
    findMatchId(user.id, chatWith).then(async (mid) => {
      setMatchId(mid)
      if (mid) {
        const msgs = await getMessages(mid)
        setMessages(msgs)
      }
      setLoading(false)
    })
  }, [chatWith, user])

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  // Realtime subscription
  useEffect(() => {
    if (!matchId) return
    const channel = subscribeToMessages(matchId, (msg) => {
      // Only add if not already in list (avoid duplicates from optimistic update)
      setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg])
    })
    return () => { channel.unsubscribe() }
  }, [matchId])

  const handleSend = async (text?: string) => {
    const msgText = text ?? input.trim()
    if (!msgText || !user || !matchId) return
    setInput('')

    // Optimistic insert
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      match_id: matchId,
      sender_id: user.id,
      text: msgText,
      read: false,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    // Real insert
    const { data } = await sendMessage(matchId, user.id, msgText)
    if (data) {
      // Replace optimistic with real
      setMessages((prev) => prev.map((m) => m.id === optimistic.id ? data : m))
    }
  }

  const handleScheduleSend = () => {
    if (!selectedDay || !selectedTime) return
    handleSend(`📅 Session booked: ${selectedDay} at ${selectedTime}${selectedPlace ? ` · ${selectedPlace}` : ''}`)
    setShowSchedule(false)
    setSelectedDay('')
    setSelectedTime('')
    setSelectedPlace('')
  }

  const displayName = otherProfile?.name ?? 'Loading...'
  const displayAvatar = otherProfile?.avatar ?? (chatWith ? `https://i.pravatar.cc/200?u=${chatWith}` : '')

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Top bar */}
      <div className="glass-bar" style={{ display: 'flex', alignItems: 'center', padding: '52px 16px 12px', gap: 12, flexShrink: 0 }}>
        <button onClick={() => go('matches')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', padding: '6px' }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <img src={displayAvatar} alt={displayName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--rose)' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.2 }}>
              {displayName}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              {otherProfile?.gym ?? 'SpotMe member'}
            </p>
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '6px' }}>
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Compat banner */}
      <div style={{ padding: '8px 16px', background: 'var(--volt-dim)', borderBottom: '1px solid rgba(200,255,0,0.12)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Zap size={14} color="var(--volt)" fill="var(--volt)" />
        <span style={{ color: 'var(--volt)', fontSize: 12, fontWeight: 600 }}>
          You&apos;re connected — say hi! 💪
        </span>
      </div>

      {/* Icebreaker chips */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 16px', flexShrink: 0 }}>
        {ICEBREAKERS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 28, height: 28, border: '3px solid rgba(255,107,157,0.2)', borderTopColor: 'var(--rose)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            No messages yet — break the ice! 🧊
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}
              >
                {!isMe && (
                  <img src={displayAvatar} alt={displayName} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap: 3 }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isMe ? 'var(--rose)' : 'var(--elevated)',
                    color: '#fff',
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: isMe ? '0 2px 12px rgba(255,107,157,0.3)' : '0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Input bar */}
      <div className="glass-bar" style={{ padding: '10px 12px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button
          onClick={() => setShowSchedule(true)}
          style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <Calendar size={18} color="var(--volt)" />
        </button>
        <input
          type="text"
          placeholder={matchId ? 'Message...' : 'No match found yet'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={!matchId}
          style={{ flex: 1, padding: '11px 16px', borderRadius: 22, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'var(--font-ui)' }}
        />
        <button
          onClick={() => handleSend()}
          style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() ? 'var(--rose)' : 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', boxShadow: input.trim() ? '0 0 16px rgba(255,107,157,0.4)' : 'none', transition: 'all 0.15s ease', flexShrink: 0 }}
        >
          <Send size={17} color={input.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} />
        </button>
      </div>

      {/* Schedule sheet */}
      <AnimatePresence>
        {showSchedule && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSchedule(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="glass-sheet" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50, borderRadius: '20px 20px 0 0', padding: '20px 20px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff' }}>📅 Schedule a session</h2>
                <button onClick={() => setShowSchedule(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>Day</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {DAYS.map((d) => (
                  <button key={d} onClick={() => setSelectedDay(d)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${selectedDay === d ? 'var(--volt)' : 'rgba(255,255,255,0.1)'}`, background: selectedDay === d ? 'var(--volt-dim)' : 'rgba(255,255,255,0.03)', color: selectedDay === d ? 'var(--volt)' : 'rgba(255,255,255,0.6)', fontWeight: selectedDay === d ? 700 : 500, fontSize: 13, cursor: 'pointer' }}>{d}</button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>Time</p>
              <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }}>
                {TIMES.map((t) => (
                  <button key={t} onClick={() => setSelectedTime(t)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${selectedTime === t ? 'var(--volt)' : 'rgba(255,255,255,0.1)'}`, background: selectedTime === t ? 'var(--volt-dim)' : 'rgba(255,255,255,0.03)', color: selectedTime === t ? 'var(--volt)' : 'rgba(255,255,255,0.6)', fontWeight: selectedTime === t ? 700 : 500, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{t}</button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>Location</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {PLACES.map((pl) => (
                  <button key={pl} onClick={() => setSelectedPlace(pl)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${selectedPlace === pl ? 'var(--rose)' : 'rgba(255,255,255,0.1)'}`, background: selectedPlace === pl ? 'var(--rose-dim)' : 'rgba(255,255,255,0.03)', color: selectedPlace === pl ? 'var(--rose)' : 'rgba(255,255,255,0.6)', fontWeight: selectedPlace === pl ? 700 : 500, fontSize: 13, cursor: 'pointer' }}>{pl}</button>
                ))}
              </div>
              <button onClick={handleScheduleSend} disabled={!selectedDay || !selectedTime} style={{ width: '100%', padding: '15px', borderRadius: 14, background: selectedDay && selectedTime ? 'var(--volt)' : 'rgba(255,255,255,0.08)', border: 'none', color: selectedDay && selectedTime ? '#0D0B14' : 'rgba(255,255,255,0.3)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, cursor: selectedDay && selectedTime ? 'pointer' : 'not-allowed' }}>
                Send session invite
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
