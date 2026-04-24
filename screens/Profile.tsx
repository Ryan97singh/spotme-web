'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Edit2, Activity, Zap, Settings, ChevronRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PROFILES } from '@/lib/data'

// Use first profile as "self" for demo
const ME = PROFILES[0]

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const TRAINED = [true, true, false, true, true, false, false]

export default function Profile() {
  const go = useStore((s) => s.go)
  const [photoIndex] = useState(0)

  const pr = ME.pr
  const stats = [
    { label: 'Squat', value: `${pr.squat}kg`, color: 'var(--volt)' },
    { label: 'Bench', value: `${pr.bench}kg`, color: 'var(--rose)' },
    { label: 'Deadlift', value: `${pr.deadlift}kg`, color: 'var(--blue)' },
    { label: 'Weekly km', value: `${ME.weeklyKm}`, color: 'var(--warn)' },
    { label: 'Train days', value: `${ME.trainDays}/wk`, color: 'var(--online)' },
  ]

  return (
    <div
      className="no-scrollbar"
      style={{
        flex: 1,
        overflowY: 'auto',
        background: 'var(--bg)',
        position: 'relative',
      }}
    >
      {/* Photo hero */}
      <div style={{ position: 'relative', height: 320, background: 'var(--surface)', flexShrink: 0 }}>
        {/* Gradient bg */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(200,255,0,0.2) 0%, rgba(255,107,157,0.2) 100%)',
          }}
        />
        <img
          src={ME.photo}
          alt={ME.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)',
          }}
        />

        {/* Slide dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === photoIndex ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === photoIndex ? 'var(--volt)' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>

        {/* Edit button */}
        <button
          style={{
            position: 'absolute',
            top: 56,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'rgba(13,11,20,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Edit2 size={16} color="#fff" />
        </button>

        {/* Live badge */}
        {ME.liveAtGym && (
          <div
            style={{
              position: 'absolute',
              top: 56,
              left: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(13,11,20,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,230,118,0.3)',
              borderRadius: 20,
              padding: '6px 12px',
            }}
          >
            <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--online)', display: 'block' }} />
            <span style={{ color: 'var(--online)', fontSize: 12, fontWeight: 600 }}>At the gym</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px 100px' }}>
        {/* Name + edit */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 20, marginBottom: 16 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 800,
                fontSize: 28,
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              {ME.name}, {ME.age}
            </h1>
            {ME.verified && (
              <CheckCircle size={20} color="var(--volt)" fill="var(--volt)" />
            )}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>📍 {ME.gym}</p>
        </motion.div>

        {/* Edit profile button */}
        <button
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 12,
            background: 'rgba(200,255,0,0.08)',
            border: '1.5px solid var(--volt)',
            color: 'var(--volt)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          <Edit2 size={16} />
          Edit profile
        </button>

        {/* Stats grid */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 12,
            }}
          >
            Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {stats.slice(0, 3).map((s) => (
              <div
                key={s.label}
                className="glass"
                style={{ borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}
              >
                <p
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    fontSize: 20,
                    color: s.color,
                    marginBottom: 2,
                  }}
                >
                  {s.value}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {stats.slice(3).map((s) => (
              <div
                key={s.label}
                className="glass"
                style={{ borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}
              >
                <p
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    fontSize: 20,
                    color: s.color,
                    marginBottom: 2,
                  }}
                >
                  {s.value}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly workout strip */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 12,
            }}
          >
            This week
          </h2>
          <div
            className="glass"
            style={{
              borderRadius: 16,
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {WEEK_DAYS.map((day, i) => (
              <div
                key={`${day}-${i}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: TRAINED[i] ? 'var(--volt)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${TRAINED[i] ? 'rgba(200,255,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: TRAINED[i] ? '0 0 12px rgba(200,255,0,0.3)' : 'none',
                  }}
                >
                  {TRAINED[i] && (
                    <Activity size={14} color="#0D0B14" strokeWidth={2.5} />
                  )}
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}
          >
            About
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            {ME.bio}
          </p>
        </div>

        {/* Training tags */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ME.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '7px 14px',
                  borderRadius: 20,
                  background: 'var(--volt-dim)',
                  border: '1px solid rgba(200,255,0,0.2)',
                  color: 'var(--volt)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Strava row */}
        <div
          className="glass"
          style={{
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(252,76,2,0.15)',
                border: '1px solid rgba(252,76,2,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              🏃
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>Strava</p>
              <p style={{ fontSize: 12, color: ME.stravaConnected ? 'var(--online)' : 'rgba(255,255,255,0.3)' }}>
                {ME.stravaConnected ? '✓ Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          <Zap size={16} color={ME.stravaConnected ? 'var(--volt)' : 'rgba(255,255,255,0.3)'} />
        </div>

        {/* Settings link */}
        <button
          onClick={() => go('settings')}
          className="glass"
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings size={18} color="rgba(255,255,255,0.6)" />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              Settings
            </span>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
        </button>
      </div>
    </div>
  )
}
