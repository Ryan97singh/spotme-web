'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LEADERBOARD } from '@/lib/data'

const TABS = ['Global', 'Friends', 'Gym']

// Mock user rank
const MY_RANK = { rank: 14, points: 2840, badge: '🎯' }

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('Global')
  const [weekOffset, setWeekOffset] = useState(0)

  const top3 = LEADERBOARD.slice(0, 3)
  const rest = LEADERBOARD.slice(3)

  const weekLabel = weekOffset === 0 ? 'This week' : weekOffset === -1 ? 'Last week' : `${Math.abs(weekOffset)}w ago`

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,255,0,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top bar */}
      <div
        className="glass-bar"
        style={{
          padding: '52px 20px 14px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
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
            Leaderboard
          </h1>

          {/* Week selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600, minWidth: 70, textAlign: 'center' }}>
              {weekLabel}
            </span>
            <button
              onClick={() => setWeekOffset((w) => Math.min(0, w + 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: weekOffset === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)', display: 'flex' }}
              disabled={weekOffset === 0}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: 3,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 10,
                border: 'none',
                background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'none',
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div
        className="no-scrollbar"
        style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, position: 'relative', zIndex: 1 }}
      >
        {/* Podium */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 12,
            padding: '28px 20px 32px',
          }}
        >
          {/* 2nd place */}
          <PodiumCard entry={top3[1]} podiumHeight={100} />

          {/* 1st place */}
          <PodiumCard entry={top3[0]} podiumHeight={130} isFirst />

          {/* 3rd place */}
          <PodiumCard entry={top3[2]} podiumHeight={80} />
        </div>

        {/* Ranked list */}
        <div style={{ padding: '0 16px' }}>
          {rest.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                marginBottom: 8,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span
                style={{
                  width: 28,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.4)',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {entry.rank}
              </span>
              <img
                src={entry.photo}
                alt={entry.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 2 }}>
                  {entry.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: 'var(--volt)', fontWeight: 700, fontSize: 13 }}>
                    {entry.points.toLocaleString()}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>pts</span>
                </div>
              </div>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{entry.badge}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Your rank footer */}
      <div
        className="glass-sheet"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          zIndex: 20,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--volt), var(--rose))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          🏋️
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>
            Your rank
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Keep training to climb higher!
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--volt)' }}>
            #{MY_RANK.rank}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            {MY_RANK.points.toLocaleString()} pts
          </p>
        </div>
      </div>
    </div>
  )
}

function PodiumCard({ entry, podiumHeight, isFirst = false }: {
  entry: (typeof LEADERBOARD)[0]
  podiumHeight: number
  isFirst?: boolean
}) {
  const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        flex: 1,
      }}
    >
      {/* Crown for 1st */}
      {isFirst && (
        <motion.span
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          style={{ fontSize: 22 }}
        >
          👑
        </motion.span>
      )}

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 + entry.rank * 0.05, type: 'spring', stiffness: 250 }}
        style={{
          position: 'relative',
          padding: isFirst ? 3 : 2,
          borderRadius: '50%',
          background: isFirst
            ? 'linear-gradient(135deg, var(--volt), var(--rose))'
            : 'rgba(255,255,255,0.2)',
        }}
      >
        <img
          src={entry.photo}
          alt={entry.name}
          style={{
            width: isFirst ? 80 : 64,
            height: isFirst ? 80 : 64,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--bg)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            fontSize: isFirst ? 18 : 14,
          }}
        >
          {medal}
        </span>
      </motion.div>

      {/* Name */}
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: isFirst ? 13 : 11,
          color: isFirst ? '#fff' : 'rgba(255,255,255,0.6)',
          textAlign: 'center',
          maxWidth: 80,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.name.split(' ')[0]}
      </span>

      {/* Points */}
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: isFirst ? 15 : 12,
          color: 'var(--volt)',
        }}
      >
        {entry.points.toLocaleString()}
      </span>

      {/* Podium block */}
      <div
        style={{
          width: '100%',
          height: podiumHeight,
          borderRadius: '10px 10px 0 0',
          background: isFirst
            ? 'linear-gradient(to bottom, rgba(200,255,0,0.25), rgba(200,255,0,0.06))'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          border: `1px solid ${isFirst ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800,
            fontSize: isFirst ? 20 : 16,
            color: isFirst ? 'var(--volt)' : 'rgba(255,255,255,0.4)',
          }}
        >
          {entry.rank}
        </span>
      </div>
    </div>
  )
}
