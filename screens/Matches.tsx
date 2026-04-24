'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { MessageCircle } from 'lucide-react'
import { getMatches, type MatchWithProfiles } from '@/lib/api'

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export default function Matches() {
  const { openChat, user } = useStore()
  const [matches, setMatches] = useState<MatchWithProfiles[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getMatches(user.id).then((data) => {
      setMatches(data)
      setLoading(false)
    })
  }, [user])

  // Helper: get the OTHER user's info from the match
  function other(m: MatchWithProfiles) {
    if (!user) return { id: m.user1_id, name: m.user1_name, avatar: m.user1_avatar }
    return user.id === m.user1_id
      ? { id: m.user2_id, name: m.user2_name, avatar: m.user2_avatar }
      : { id: m.user1_id, name: m.user1_name, avatar: m.user1_avatar }
  }

  const newMatches = matches.filter((m) => !m.last_message)
  const withMessages = matches.filter((m) => !!m.last_message)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="glass-bar" style={{ padding: '52px 20px 14px', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '-0.02em' }}>
          Matches
        </h1>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(255,107,157,0.2)', borderTopColor: 'var(--rose)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : matches.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--rose-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={32} color="var(--rose)" />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff' }}>No matches yet</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.5 }}>Start swiping to find your training partner</p>
          </div>
        ) : (
          <>
            {/* New matches — no messages yet */}
            {newMatches.length > 0 && (
              <div style={{ padding: '20px 0 0' }}>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 20px', marginBottom: 14 }}>
                  New Matches
                </h2>
                <div className="no-scrollbar" style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '0 20px 20px' }}>
                  {newMatches.map((match) => {
                    const o = other(match)
                    return (
                      <motion.button
                        key={match.match_id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => openChat(o.id)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                      >
                        <div style={{ width: 68, height: 68, borderRadius: '50%', padding: 2.5, background: 'linear-gradient(135deg, var(--rose), var(--volt))' }}>
                          <img
                            src={o.avatar ?? `https://i.pravatar.cc/200?u=${o.id}`}
                            alt={o.name}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--bg)' }}
                          />
                        </div>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500, maxWidth: 64, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {o.name.split(' ')[0]}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {withMessages.length > 0 && (
              <>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 0 4px' }} />
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 20px 12px' }}>
                  Messages
                </h2>
                {withMessages.map((match, i) => {
                  const o = other(match)
                  return (
                    <motion.button
                      key={match.match_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => openChat(o.id)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <img
                        src={o.avatar ?? `https://i.pravatar.cc/200?u=${o.id}`}
                        alt={o.name}
                        style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: '2px solid transparent', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#fff' }}>
                            {o.name}
                          </span>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginLeft: 8 }}>
                            {timeAgo(match.last_message_at)}
                          </span>
                        </div>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                          {match.last_message ?? ''}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
