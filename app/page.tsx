'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import type { Screen } from '@/lib/store'
import BottomNav from '@/components/BottomNav'
import { getSupabase } from '@/lib/supabase'

import Landing from '@/screens/Landing'
import Login from '@/screens/Login'
import Register from '@/screens/Register'
import Onboarding from '@/screens/Onboarding'
import Discover from '@/screens/Discover'
import Matches from '@/screens/Matches'
import Chat from '@/screens/Chat'
import Profile from '@/screens/Profile'
import Leaderboard from '@/screens/Leaderboard'
import Groups from '@/screens/Groups'

const APP_SCREENS: Screen[] = ['discover', 'matches', 'chat', 'profile', 'leaderboard', 'groups']
const OB_SCREENS: Screen[] = ['ob1', 'ob2', 'ob3', 'ob4']

function ScreenRenderer({ screen }: { screen: Screen }) {
  if (OB_SCREENS.includes(screen)) {
    return <Onboarding />
  }

  switch (screen) {
    case 'land':
      return <Landing />
    case 'login':
      return <Login />
    case 'register':
      return <Register />
    case 'discover':
      return <Discover />
    case 'matches':
      return <Matches />
    case 'chat':
      return <Chat />
    case 'profile':
      return <Profile />
    case 'leaderboard':
      return <Leaderboard />
    case 'groups':
      return <Groups />
    case 'settings':
      return <SettingsPlaceholder />
    case 'map':
      return <MapPlaceholder />
    default:
      return <Landing />
  }
}

function SettingsPlaceholder() {
  const go = useStore((s) => s.go)
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        gap: 16,
      }}
    >
      <span style={{ fontSize: 48 }}>⚙️</span>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 24, color: '#fff' }}>
        Settings
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Coming soon</p>
      <button
        onClick={() => go('profile')}
        style={{
          padding: '12px 24px',
          borderRadius: 12,
          background: 'var(--volt)',
          border: 'none',
          color: '#0D0B14',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        Back to profile
      </button>
    </div>
  )
}

function MapPlaceholder() {
  const go = useStore((s) => s.go)
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        gap: 16,
      }}
    >
      <span style={{ fontSize: 48 }}>🗺️</span>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 24, color: '#fff' }}>
        Gym Map
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Coming soon</p>
      <button
        onClick={() => go('discover')}
        style={{
          padding: '12px 24px',
          borderRadius: 12,
          background: 'var(--volt)',
          border: 'none',
          color: '#0D0B14',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        Back to discover
      </button>
    </div>
  )
}

export default function Page() {
  const screen = useStore((s) => s.screen)
  const { go, setUser, setHasProfile } = useStore()
  const showNav = APP_SCREENS.includes(screen)

  // Restore session on mount
  useEffect(() => {
    const supabase = getSupabase()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setUser(session.user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setHasProfile(true)
        go('discover')
      } else {
        go('ob1')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) go('land')
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: showNav ? 64 : 0,
          position: 'relative',
        }}
      >
        <ScreenRenderer screen={screen} />
      </div>
      {showNav && <BottomNav />}
    </>
  )
}
