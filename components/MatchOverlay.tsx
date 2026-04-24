'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PROFILES } from '@/lib/data'
import { MessageCircle, RefreshCw } from 'lucide-react'

interface MatchOverlayProps {
  matchedUserId?: string
}

export default function MatchOverlay({ matchedUserId }: MatchOverlayProps) {
  const matchOverlay = useStore((s) => s.matchOverlay)
  const hideMatch = useStore((s) => s.hideMatch)
  const openChat = useStore((s) => s.openChat)

  const matched = matchedUserId
    ? PROFILES.find((p) => p.id === matchedUserId)
    : PROFILES[0]

  return (
    <AnimatePresence>
      {matchOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(9,6,15,0.96)',
          }}
        >
          {/* Rose radial glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(255,107,157,0.22) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Volt top glow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,255,0,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 28,
              padding: '0 32px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Heading */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 500, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                You matched!
              </p>
              <h1
                className="gradient-text"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 800,
                  fontSize: 42,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                It&apos;s a Match!
              </h1>
            </div>

            {/* Overlapping avatars */}
            <div style={{ position: 'relative', height: 120, width: 200 }}>
              {/* Your avatar (left) */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 0,
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  border: '3px solid var(--volt)',
                  boxShadow: '0 0 24px rgba(200,255,0,0.4)',
                  overflow: 'hidden',
                  background: 'var(--elevated)',
                  zIndex: 2,
                }}
              >
                <img
                  src="https://i.pravatar.cc/400?img=1"
                  alt="You"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>

              {/* Their avatar (right) */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 0,
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  border: '3px solid var(--rose)',
                  boxShadow: '0 0 24px rgba(255,107,157,0.4)',
                  overflow: 'hidden',
                  background: 'var(--elevated)',
                  zIndex: 1,
                }}
              >
                <img
                  src={matched?.photo ?? 'https://i.pravatar.cc/400?img=47'}
                  alt={matched?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>

              {/* Connection heart */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 400, damping: 15 }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: -4,
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(255,107,157,0.6)',
                  zIndex: 3,
                  fontSize: 14,
                }}
              >
                ❤️
              </motion.div>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.5,
                maxWidth: 260,
              }}
            >
              You and{' '}
              <span style={{ color: '#fff', fontWeight: 600 }}>{matched?.name}</span>{' '}
              both train for{' '}
              <span style={{ color: 'var(--volt)', fontWeight: 600 }}>
                {matched?.goals[0] ?? 'Strength'}
              </span>
            </motion.p>

            {/* Compat */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'var(--volt-dim)',
                border: '1px solid rgba(200,255,0,0.25)',
                borderRadius: 12,
                padding: '8px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ color: 'var(--volt)', fontWeight: 700, fontSize: 15 }}>
                {matched?.compat ?? 91}% compatibility score
              </span>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <button
                onClick={() => {
                  hideMatch()
                  if (matched) openChat(matched.id)
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  background: 'var(--rose)',
                  border: 'none',
                  color: '#fff',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 20px rgba(255,107,157,0.4)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <MessageCircle size={18} />
                Send a message
              </button>

              <button
                onClick={hideMatch}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'opacity 0.15s ease',
                }}
              >
                <RefreshCw size={16} />
                Keep swiping
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
