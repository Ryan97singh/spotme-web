'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, MessageCircle, RefreshCw } from 'lucide-react'
import Logo from '@/components/Logo'
import SwipeCard from '@/components/SwipeCard'
import MatchOverlay from '@/components/MatchOverlay'
import { useStore } from '@/lib/store'
import { PROFILES } from '@/lib/data'
import { getSupabase } from '@/lib/supabase'

export default function Discover() {
  const go = useStore((s) => s.go)
  const unreadCount = useStore((s) => s.unreadCount)
  const showMatch = useStore((s) => s.showMatch)
  const user = useStore((s) => s.user)

  const [stack, setStack] = useState(PROFILES.slice())
  const [lastMatched, setLastMatched] = useState<string | undefined>()

  const recordSwipe = async (swipedId: string, direction: 'like' | 'pass' | 'super') => {
    if (!user) return
    const supabase = getSupabase()
    await supabase.from('swipes').insert({ swiper_id: user.id, swiped_id: swipedId, direction })
  }

  const handleLike = useCallback(() => {
    const top = stack[0]
    if (!top) return
    recordSwipe(top.id, 'like')
    const willMatch = Math.random() < 0.2
    if (willMatch) {
      setLastMatched(top.id)
      showMatch()
    }
    setStack((prev) => prev.slice(1))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack, showMatch, user])

  const handlePass = useCallback(() => {
    const top = stack[0]
    if (top) recordSwipe(top.id, 'pass')
    setStack((prev) => prev.slice(1))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack, user])

  const handleSuper = useCallback(() => {
    const top = stack[0]
    if (!top) return
    recordSwipe(top.id, 'super')
    setLastMatched(top.id)
    showMatch()
    setStack((prev) => prev.slice(1))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack, showMatch, user])

  const handleRefresh = () => {
    setStack(PROFILES.slice())
    setLastMatched(undefined)
  }

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
          justifyContent: 'space-between',
          padding: '52px 20px 14px',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Logo size={24} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={18} color="rgba(255,255,255,0.6)" />
          </button>

          <button
            onClick={() => go('matches')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <MessageCircle size={18} color="var(--rose)" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--rose)',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid var(--bg)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Card area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          padding: '16px 16px 96px',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {stack.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 56 }}>🔍</span>
            <h2
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 800,
                fontSize: 24,
                color: '#fff',
              }}
            >
              No one nearby
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 220 }}>
              You&apos;ve seen everyone in your area. Check back soon!
            </p>
            <button
              onClick={handleRefresh}
              style={{
                marginTop: 8,
                padding: '12px 24px',
                borderRadius: 12,
                background: 'var(--volt)',
                border: 'none',
                color: '#0D0B14',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </motion.div>
        ) : (
          <div style={{ position: 'relative', flex: 1 }}>
            {/* Background cards (non-interactive) */}
            {stack.slice(1, 3).map((profile, i) => (
              <SwipeCard
                key={profile.id}
                profile={profile}
                onLike={() => {}}
                onPass={() => {}}
                onSuper={() => {}}
                isTop={false}
                offset={i + 1}
              />
            ))}

            {/* Top interactive card */}
            <SwipeCard
              key={stack[0].id}
              profile={stack[0]}
              onLike={handleLike}
              onPass={handlePass}
              onSuper={handleSuper}
              isTop={true}
              offset={0}
            />
          </div>
        )}
      </div>

      {/* Match overlay */}
      <MatchOverlay matchedUserId={lastMatched} />
    </div>
  )
}
