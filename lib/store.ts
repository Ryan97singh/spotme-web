import { create } from 'zustand'

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
  go: (screen: Screen) => void
  openChat: (userId: string) => void
  showMatch: () => void
  hideMatch: () => void
  setUnread: (count: number) => void
}

export const useStore = create<StoreState>((set) => ({
  screen: 'land',
  chatWith: null,
  matchOverlay: false,
  unreadCount: 3,

  go: (screen) => set({ screen }),

  openChat: (userId) =>
    set({ chatWith: userId, screen: 'chat' }),

  showMatch: () => set({ matchOverlay: true }),
  hideMatch: () => set({ matchOverlay: false }),

  setUnread: (count) => set({ unreadCount: count }),
}))
