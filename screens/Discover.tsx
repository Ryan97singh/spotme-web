'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, MessageCircle, RefreshCw } from 'lucide-react'
import Logo from '@/components/Logo'
import SwipeCard from '@/components/SwipeCard'
import MatchOverlay from '@/components/MatchOverlay'
import { useStore } from '@/lib/store'
import { PROFILES, type Profile as MockProfile } from '@/lib/data'
import { getSupabase } from '@/lib/supabase'
import { getDiscoverProfiles, type Profile } from '@/lib/api'

// Adapt DB profile to the shape SwipeCard expects (mock Profile type)
function adaptProfile(p: Profile): MockProfile {
  const scheduleVal = Array.isArray(p.schedule)
    ? (p.schedule as string[]).join(', ')
    : (p.schedule as string | null) ?? 'Flexible'
  return {
    id: p.id,
    name: p.full_name,
    age: p.age ?? 25,
    photo: p.avatar_url ?? `https://i.pravatar.cc/400?u=${p.id}`,
    gym: p.gym_name ?? 'Local Gym',
    goals: (p.goals as string[]) ?? [],
    schedule: scheduleVal,
    trainDays: p.train_days ?? 3,
    compat: Math.floor(Math.random() * 20) + 80,
    liveAtGym: false,
    verified: !!p.verified,
    bio: p.bio ?? '',
    pr: { squat: p.pr_squat ?? 0, bench: p.pr_bench ?? 0, deadlift: p.pr_deadlift ?? 0 },
    weeklyKm: p.weekly_km ?? 0,
    tags: (p.goals as string[]) ?? [],
    stravaConnected: !!p.strava_id,
  }
}

export default function Discover() {
  const go = useStore((s) => s.go)
  const unreadCount = useStore((s) => s.unreadCount)
  const showMatch = useStore((s) => s.showMatch)
  const user = useStore((s) => s.user)

  const [stack, setStack] = useState(PROFILES.slice()) // start with mock while loading
  const [lastMatched, setLastMatched] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  // Load real profiles when user is available
  useEffect(() => {
    if (!user) return
    setLoading(true)
    getDiscoverProfiles(user.id).then((profiles) => {
      if (profiles.length > 0) {
        setStack(profiles.map(adaptProfile))
      }
      setLoading(false)
    })
  }, [user])

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
    if (willMatch) { setLastMatched(top.id); showMatch() }
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
    if (user) {
      setLoading(true)
      getDiscoverProfiles(user.id).then((profiles) => {
        setStack(profiles.length > 0 ? profiles.map(adaptProfile) : PROFILES.slice())
        setLastMatched(undefined)
        setLoading(false)
      })
    } else {
      setStack(PROFILES.slice())
      setLastMatched(undefined)
    }
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
          flexShrink: 0,
        }}
      >
        <Logo size={28} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
              padding: 4,
              display: 'flex',
            }}
            onClick={() => go('matches')}
          >
            <MessageCircle size={22} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 14,
                  height: 14,
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
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, display: 'flex' }}
          >
            <SlidersHorizontal size={22} />
          </button>
        </div>
      </div>

      {/* Card stack area */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(200,255,0,0.2)', borderTopColor: 'var(--volt)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Finding athletes near you...</p>
          </div>
        ) : stack.length === 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              padding: '0 32px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 56 }}>🏋️</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: '#fff' }}>
              You&apos;ve seen everyone!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.5 }}>
              Check back later as new athletes join
            </p>
            <button
              onClick={handleRefresh}
              style={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 14,
                background: 'var(--volt)',
                border: 'none',
                color: '#0D0B14',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        ) : (
          <div style={{ position: 'absolute', inset: 0 }}>
            {stack
              .slice(0, 3)
              .reverse()
              .map((profile, reverseIdx) => {
                const stackIdx = Math.min(2, stack.length - 1) - reverseIdx
                const isTop = stackIdx === 0
                return (
                  <div
                    key={profile.id}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 16px',
                    }}
                  >
                    <SwipeCard
                      profile={profile}
                      isTop={isTop}
                      onLike={handleLike}
                      onPass={handlePass}
                      onSuper={handleSuper}
                      offset={stackIdx * 6}
                    />
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Match overlay */}
      <MatchOverlay matchedUserId={lastMatched} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
