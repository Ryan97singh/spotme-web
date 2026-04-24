'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { CheckCircle, Zap, X, Star, Heart } from 'lucide-react'
import type { Profile } from '@/lib/data'

interface SwipeCardProps {
  profile: Profile
  onLike: () => void
  onPass: () => void
  onSuper: () => void
  isTop?: boolean
  offset?: number
}

const GOAL_COLORS: Record<string, string> = {
  Strength: '#C8FF00',
  Running: '#00C2FF',
  HIIT: '#FF6B9D',
  CrossFit: '#FFB020',
  Yoga: '#A855F7',
  Cardio: '#00E676',
  Powerlifting: '#C8FF00',
  'Martial Arts': '#FF4D6D',
  Calisthenics: '#00C2FF',
  Bodybuilding: '#FFB020',
}

export default function SwipeCard({
  profile,
  onLike,
  onPass,
  onSuper,
  isTop = false,
  offset = 0,
}: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0])

  const cardBg = profile.goals[0]
    ? `linear-gradient(135deg, ${GOAL_COLORS[profile.goals[0]] ?? '#C8FF00'}22 0%, var(--elevated) 100%)`
    : 'var(--elevated)'

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      onLike()
    } else if (info.offset.x < -100) {
      onPass()
    }
  }

  const cardStyle = {
    position: 'absolute' as const,
    inset: 0,
    scale: 1 - offset * 0.04,
    y: offset * 10,
    zIndex: isTop ? 10 : 10 - offset,
  }

  if (!isTop) {
    return (
      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          inset: 0,
          borderRadius: 24,
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.06)',
          transform: `scale(${1 - offset * 0.04}) translateY(${offset * 10}px)`,
          zIndex: 10 - offset,
        }}
      />
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
      <motion.div
        className="swipe-card"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 24,
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          cursor: 'grab',
          x,
          rotate,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* Photo */}
        <div style={{ position: 'relative', width: '100%', height: '65%', background: cardBg }}>
          <img
            src={profile.photo}
            alt={profile.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              pointerEvents: 'none',
            }}
          />

          {/* LIKE stamp */}
          <motion.div
            style={{
              position: 'absolute',
              top: 32,
              left: 24,
              opacity: likeOpacity,
              border: '3px solid #C8FF00',
              borderRadius: 8,
              padding: '4px 12px',
              transform: 'rotate(-12deg)',
            }}
          >
            <span style={{ color: '#C8FF00', fontWeight: 800, fontSize: 28, letterSpacing: 2, fontFamily: 'Space Grotesk, sans-serif' }}>
              LIKE
            </span>
          </motion.div>

          {/* NOPE stamp */}
          <motion.div
            style={{
              position: 'absolute',
              top: 32,
              right: 24,
              opacity: nopeOpacity,
              border: '3px solid #FF4D6D',
              borderRadius: 8,
              padding: '4px 12px',
              transform: 'rotate(12deg)',
            }}
          >
            <span style={{ color: '#FF4D6D', fontWeight: 800, fontSize: 28, letterSpacing: 2, fontFamily: 'Space Grotesk, sans-serif' }}>
              NOPE
            </span>
          </motion.div>

          {/* Compat chip */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(200,255,0,0.18)',
              border: '1px solid var(--volt)',
              borderRadius: 20,
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Zap size={12} color="var(--volt)" fill="var(--volt)" />
            <span style={{ color: 'var(--volt)', fontWeight: 700, fontSize: 12 }}>
              {profile.compat}% match
            </span>
          </div>

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '55%',
              background: 'linear-gradient(to top, rgba(13,11,20,0.98) 0%, rgba(13,11,20,0.6) 60%, transparent 100%)',
            }}
          />
        </div>

        {/* Bottom info */}
        <div style={{ padding: '0 20px 16px', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          {/* Live at gym badge */}
          {profile.liveAtGym && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--online)', display: 'inline-block' }} />
              <span style={{ color: 'var(--online)', fontSize: 12, fontWeight: 600 }}>At the gym now</span>
            </div>
          )}

          {/* Name & age */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 26, color: '#fff', lineHeight: 1 }}>
              {profile.name}, {profile.age}
            </h2>
            {profile.verified && (
              <CheckCircle size={18} color="var(--volt)" fill="var(--volt)" style={{ flexShrink: 0 }} />
            )}
          </div>

          {/* Gym */}
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
            📍 {profile.gym}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {profile.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  padding: '3px 10px',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          zIndex: 20,
        }}
      >
        {/* Pass */}
        <button
          onClick={onPass}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255,77,109,0.08)',
            border: '1.5px solid var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, background 0.15s ease',
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)' }}
          onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          <X size={22} color="var(--danger)" strokeWidth={2.5} />
        </button>

        {/* Super */}
        <button
          onClick={onSuper}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(255,176,32,0.08)',
            border: '1.5px solid var(--warn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)' }}
          onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          <Star size={20} color="var(--warn)" fill="var(--warn)" />
        </button>

        {/* Like */}
        <button
          onClick={onLike}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--rose)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 24px rgba(255,107,157,0.5)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)' }}
          onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          <Heart size={26} color="#fff" fill="#fff" />
        </button>
      </div>
    </div>
  )
}
