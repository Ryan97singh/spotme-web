'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MapPin, Users, Clock } from 'lucide-react'
import { GROUPS } from '@/lib/data'
import type { Group } from '@/lib/data'

const FILTERS = ['All', 'Running', 'Lifting', 'HIIT', 'Yoga', 'CrossFit']

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Running: { bg: 'rgba(0,194,255,0.1)', text: 'var(--blue)', border: 'rgba(0,194,255,0.25)' },
  Lifting: { bg: 'var(--volt-dim)', text: 'var(--volt)', border: 'rgba(200,255,0,0.25)' },
  HIIT: { bg: 'var(--rose-dim)', text: 'var(--rose)', border: 'rgba(255,107,157,0.25)' },
  Yoga: { bg: 'rgba(168,85,247,0.1)', text: '#A855F7', border: 'rgba(168,85,247,0.25)' },
  CrossFit: { bg: 'rgba(255,176,32,0.1)', text: 'var(--warn)', border: 'rgba(255,176,32,0.25)' },
}

export default function Groups() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [groups, setGroups] = useState<Group[]>(GROUPS)

  const filtered = activeFilter === 'All'
    ? groups
    : groups.filter((g) => g.type === activeFilter)

  const toggleJoin = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => g.id === id ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g)
    )
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 26,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            Group Workouts
          </h1>
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--volt)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(200,255,0,0.3)',
            }}
          >
            <Plus size={20} color="#0D0B14" strokeWidth={2.5} />
          </button>
        </div>

        {/* Filter chips */}
        <div
          className="no-scrollbar"
          style={{ display: 'flex', gap: 8, overflowX: 'auto' }}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f
            const style = f !== 'All' ? TYPE_COLORS[f] : null
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 20,
                  border: `1.5px solid ${active ? (style?.border ?? 'rgba(200,255,0,0.4)') : 'rgba(255,255,255,0.08)'}`,
                  background: active ? (style?.bg ?? 'var(--volt-dim)') : 'rgba(255,255,255,0.03)',
                  color: active ? (style?.text ?? 'var(--volt)') : 'rgba(255,255,255,0.5)',
                  fontWeight: active ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="no-scrollbar"
        style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: 90 }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 24px',
              textAlign: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 48 }}>🏋️</span>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff' }}>
              No groups yet
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              Be the first to create a {activeFilter} group!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((group, i) => {
              const typeStyle = TYPE_COLORS[group.type] ?? TYPE_COLORS.Running
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass"
                  style={{ borderRadius: 18, overflow: 'hidden' }}
                >
                  {/* Group photo header */}
                  <div style={{ position: 'relative', height: 140 }}>
                    <img
                      src={group.photo}
                      alt={group.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(13,11,20,0.9) 0%, rgba(13,11,20,0.2) 60%, transparent 100%)',
                      }}
                    />

                    {/* Type badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: typeStyle.bg,
                        border: `1px solid ${typeStyle.border}`,
                        color: typeStyle.text,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {group.type}
                    </span>

                    {/* Members count */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        background: 'rgba(13,11,20,0.7)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 20,
                        padding: '4px 10px',
                      }}
                    >
                      <Users size={12} color="rgba(255,255,255,0.7)" />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                        {group.members}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '14px 16px 16px' }}>
                    <h3
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: 17,
                        color: '#fff',
                        marginBottom: 8,
                      }}
                    >
                      {group.name}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={13} color="rgba(255,255,255,0.35)" />
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{group.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={13} color="rgba(255,255,255,0.35)" />
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{group.location}</span>
                      </div>
                    </div>

                    {/* Member avatars + join button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Stacked avatars */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {[1, 2, 3, 4].map((n) => (
                          <div
                            key={n}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: '50%',
                              border: '2px solid var(--surface)',
                              overflow: 'hidden',
                              marginLeft: n === 1 ? 0 : -8,
                              background: 'var(--elevated)',
                            }}
                          >
                            <img
                              src={`https://i.pravatar.cc/60?img=${n * 10 + i}`}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                        {group.members > 4 && (
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: '50%',
                              border: '2px solid var(--surface)',
                              background: 'var(--elevated)',
                              marginLeft: -8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              color: 'rgba(255,255,255,0.5)',
                              fontWeight: 600,
                            }}
                          >
                            +{group.members - 4}
                          </div>
                        )}
                      </div>

                      {/* Join button */}
                      <button
                        onClick={() => toggleJoin(group.id)}
                        style={{
                          padding: '9px 20px',
                          borderRadius: 12,
                          border: group.joined ? '1.5px solid rgba(255,255,255,0.15)' : 'none',
                          background: group.joined ? 'rgba(255,255,255,0.05)' : 'var(--volt)',
                          color: group.joined ? 'rgba(255,255,255,0.5)' : '#0D0B14',
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: group.joined ? 'none' : '0 0 16px rgba(200,255,0,0.25)',
                        }}
                      >
                        {group.joined ? 'Joined ✓' : 'Join'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
