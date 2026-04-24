'use client'

import { Flame, MessageCircle, Users, User } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { Screen } from '@/lib/store'

interface NavTab {
  screen: Screen
  label: string
  icon: React.ComponentType<{ size: number; strokeWidth?: number; color?: string }>
  activeColor: string
}

const TABS: NavTab[] = [
  { screen: 'discover', label: 'Discover', icon: Flame, activeColor: 'var(--volt)' },
  { screen: 'matches', label: 'Matches', icon: MessageCircle, activeColor: 'var(--rose)' },
  { screen: 'groups', label: 'Groups', icon: Users, activeColor: 'var(--volt)' },
  { screen: 'profile', label: 'Profile', icon: User, activeColor: 'var(--volt)' },
]

export default function BottomNav() {
  const screen = useStore((s) => s.screen)
  const go = useStore((s) => s.go)
  const unreadCount = useStore((s) => s.unreadCount)

  return (
    <nav
      className="glass-nav"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'stretch',
        paddingBottom: 'env(safe-area-inset-bottom, 12px)',
        height: 'calc(64px + env(safe-area-inset-bottom, 12px))',
      }}
    >
      {TABS.map((tab) => {
        const active = screen === tab.screen
        const Icon = tab.icon
        const isMatches = tab.screen === 'matches'

        return (
          <button
            key={tab.screen}
            onClick={() => go(tab.screen)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0 0',
              position: 'relative',
              transition: 'opacity 0.15s ease',
            }}
          >
            {/* Active indicator line */}
            {active && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 28,
                  height: 2,
                  borderRadius: 2,
                  background: tab.activeColor,
                  boxShadow: `0 0 8px ${tab.activeColor}`,
                }}
              />
            )}

            {/* Icon wrapper with badge */}
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                style={{
                  color: active ? tab.activeColor : 'rgba(255,255,255,0.35)',
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  color={active ? tab.activeColor : 'rgba(255,255,255,0.35)'}
                />
              </span>

              {/* Unread badge for matches */}
              {isMatches && unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    background: 'var(--rose)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    border: '1.5px solid var(--bg)',
                    boxShadow: '0 0 8px var(--rose-glow)',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </span>

            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.02em',
                color: active ? tab.activeColor : 'rgba(255,255,255,0.35)',
                transition: 'color 0.15s ease',
                lineHeight: 1,
                fontFamily: 'var(--font-ui)',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
