'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Target, MapPin, Dumbbell, Heart, Flame } from 'lucide-react'
import Logo from '@/components/Logo'
import { useStore } from '@/lib/store'

const FEATURES = [
  {
    icon: Shield,
    title: 'Verified by sweat',
    desc: 'Every profile linked to Strava or gym check-ins. No catfish, no couch potatoes.',
    color: 'var(--volt)',
    bg: 'var(--volt-dim)',
  },
  {
    icon: Target,
    title: 'Goal-matched',
    desc: "We pair you with people training for the same things. Lift together, grow together.",
    color: 'var(--rose)',
    bg: 'var(--rose-dim)',
  },
  {
    icon: MapPin,
    title: 'Gym partner or date',
    desc: 'Whether you want a spotter or a soulmate — SpotMe handles both.',
    color: 'var(--blue)',
    bg: 'rgba(0,194,255,0.1)',
  },
]

export default function Landing() {
  const go = useStore((s) => s.go)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const handleJoin = () => {
    if (email) setJoined(true)
  }

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
      {/* Ambient glows */}
      <div
        style={{
          position: 'fixed',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,255,0,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 100,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,157,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '72px 28px 40px',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            style={{ marginBottom: 28 }}
          >
            <Logo size={48} stacked />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              marginBottom: 12,
            }}
          >
            Date people who{' '}
            <span className="gradient-text">actually train.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.5,
              marginBottom: 32,
              maxWidth: 280,
            }}
          >
            Matched by goals. Verified by sweat.
          </motion.p>

          {/* Email waitlist */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ width: '100%', maxWidth: 340 }}
          >
            {joined ? (
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 14,
                  background: 'var(--volt-dim)',
                  border: '1px solid rgba(200,255,0,0.3)',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: 'var(--volt)', fontWeight: 700, fontSize: 15 }}>
                  🎉 You&apos;re on the list!
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
                  We&apos;ll notify you when SpotMe launches in your city.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: 15,
                    outline: 'none',
                    fontFamily: 'var(--font-ui)',
                  }}
                />
                <button
                  onClick={handleJoin}
                  style={{
                    padding: '14px',
                    borderRadius: 12,
                    background: 'var(--volt)',
                    border: 'none',
                    color: '#0D0B14',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: '0 4px 20px rgba(200,255,0,0.3)',
                  }}
                >
                  Join the waitlist <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>

          {/* Sign in link */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => go('login')}
            style={{
              marginTop: 16,
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Already in? Sign in <ArrowRight size={14} />
          </motion.button>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 8,
              marginTop: 28,
            }}
          >
            {['🔒 Verified', '🏋️ Goal-matched', '📍 Nearby'].map((chip) => (
              <span
                key={chip}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 500,
                }}
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Feature cards */}
        <div style={{ padding: '8px 20px 40px' }}>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 16,
              paddingLeft: 4,
            }}
          >
            Why SpotMe
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="glass"
                  style={{
                    borderRadius: 16,
                    padding: '18px 20px',
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: feat.bg,
                      border: `1px solid ${feat.color}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={feat.color} strokeWidth={2} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: 16,
                        color: '#fff',
                        marginBottom: 4,
                      }}
                    >
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            padding: '0 20px 60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
            <Dumbbell size={24} color="var(--volt)" />
            <Flame size={24} color="var(--rose)" />
            <Heart size={24} color="var(--rose)" fill="var(--rose)" />
          </div>
          <button
            onClick={() => go('register')}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, var(--volt) 0%, #A8D900 100%)',
              border: 'none',
              color: '#0D0B14',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 6px 28px rgba(200,255,0,0.35)',
            }}
          >
            Get Started Free
          </button>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            No credit card. No gym fee. Just gains.
          </p>
        </div>
      </div>
    </div>
  )
}
