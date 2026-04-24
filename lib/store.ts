import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

export type Screen =
  | 'land'
  | 'login'
  | 'register'
  | 'ob1'
  | 'ob2'
  | 'ob3'
  | 'ob4'
  | 'discover'
  | 'matches'
  | 'chat'
  | 'profile'
  | 'leaderboard'
  | 'map'
  | 'groups'
  | 'settings'

interface StoreState {
  screen: Screen
  chatWith: string | null
  matchOverlay: boolean
  unreadCount: number
  user: User | null
  hasProfile: boolean
  go: (screen: Screen) => void
  openChat: (userId: string) => void
  showMatch: () => void
  hideMatch: () => void
  setUnread: (count: number) => void
  setUser: (user: User | null) => void
  setHasProfile: (v: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
  screen: 'land',
  chatWith: null,
  matchOverlay: false,
  unreadCount: 3,
  user: null,
  hasProfile: false,

  go: (screen) => set({ screen }),

  openChat: (userId) =>
    set({ chatWith: userId, screen: 'chat' }),

  showMatch: () => set({ matchOverlay: true }),
  hideMatch: () => set({ matchOverlay: false }),

  setUnread: (count) => set({ unreadCount: count }),
  setUser: (user) => set({ user }),
  setHasProfile: (hasProfile) => set({ hasProfile }),
}))
