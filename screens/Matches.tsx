'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { MATCHES, PROFILES } from '@/lib/data'
import { MessageCircle } from 'lucide-react'

function getProfile(userId: string) {
  return PROFILES.find((p) => p.id === userId)
}

export default function Matches() {
  const openChat = useStore((s) => s.openChat)

  const newMatches = MATCHES.filter((m) => m.unread > 0)
  const allMatches = MATCHES

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div
        className="glass-bar"
        style={{
          padding: '52px 20px 14px',
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800,
            fontSize: 26,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          Matches
        </h1>
      </div>

      <div
        className="no-scrollbar"
        style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}
      >
        {allMatches.length === 0 ? (
          /* Empty state */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 32px',
              textAlign: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--rose-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageCircle size={32} color="var(--rose)" />
            </div>
            <h2
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 20,
                color: '#fff',
              }}
            >
              No matches yet
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.5 }}>
              Start swiping to find your training partner
            </p>
          </div>
        ) : (
          <>
            {/* New matches horizontal scroll */}
            {newMatches.length > 0 && (
              <div style={{ padding: '20px 0 0' }}>
                <h2
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0 20px',
                    marginBottom: 14,
                  }}
                >
                  New Matches
                </h2>
                <div
                  className="no-scrollbar"
                  style={{
                    display: 'flex',
                    gap: 16,
                    overflowX: 'auto',
                    padding: '0 20px 20px',
                  }}
                >
                  {newMatches.map((match) => {
                    const profile = getProfile(match.userId)
                    if (!profile) return null
                    return (
                      <motion.button
                        key={match.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => openChat(match.userId)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              width: 68,
                              height: 68,
                              borderRadius: '50%',
                              padding: 2.5,
                              background: 'linear-gradient(135deg, var(--rose), var(--volt))',
                            }}
                          >
                            <img
                              src={profile.photo}
                              alt={profile.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--bg)',
                              }}
                            />
                          </div>
                          {/* Online dot */}
                          <span
                            className="pulse"
                            style={{
                              position: 'absolute',
                              bottom: 2,
                              right: 2,
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              background: 'var(--online)',
                              border: '2px solid var(--bg)',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            color: 'rgba(255,255,255,0.6)',
                            fontWeight: 500,
                            maxWidth: 64,
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {profile.name.split(' ')[0]}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 0 4px' }} />

            {/* Messages list */}
            <div>
              <h2
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '16px 20px 12px',
                }}
              >
                Messages
              </h2>

              {allMatches.map((match, i) => {
                const profile = getProfile(match.userId)
                if (!profile) return null
                return (
                  <motion.button
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => openChat(match.userId)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)' }}
                    onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
                  >
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: match.unread > 0 ? '2px solid var(--rose)' : '2px solid transparent',
                        }}
                      />
                      {profile.liveAtGym && (
                        <span
                          className="pulse"
                          style={{
                            position: 'absolute',
                            bottom: 1,
                            right: 1,
                            width: 11,
                            height: 11,
                            borderRadius: '50%',
                            background: 'var(--online)',
                            border: '2px solid var(--bg)',
                          }}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span
                          style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: match.unread > 0 ? 700 : 500,
                            fontSize: 15,
                            color: '#fff',
                          }}
                        >
                          {profile.name}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginLeft: 8 }}>
                          {match.time}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: 13,
                            color: match.unread > 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)',
                            fontWeight: match.unread > 0 ? 500 : 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                            marginRight: 8,
                          }}
                        >
                          {match.lastMsg}
                        </span>
                        {match.unread > 0 && (
                          <span
                            style={{
                              minWidth: 20,
                              height: 20,
                              borderRadius: 10,
                              background: 'var(--rose)',
                              color: '#fff',
                              fontSize: 11,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0 6px',
                              flexShrink: 0,
                              boxShadow: '0 0 8px rgba(255,107,157,0.4)',
                            }}
                          >
                            {match.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
