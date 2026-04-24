export interface Profile {
  id: string
  name: string
  age: number
  bio: string
  gym: string
  goals: string[]
  schedule: string
  trainDays: number
  verified: boolean
  compat: number
  tags: string[]
  photo: string
  pr: { squat: number; bench: number; deadlift: number }
  weeklyKm: number
  stravaConnected: boolean
  liveAtGym: boolean
}

export const PROFILES: Profile[] = [
  {
    id: 'u1',
    name: 'Aria Chen',
    age: 27,
    bio: 'Powerlifter by day, midnight runner by night. Looking for someone who understands skipping plans for a PR attempt.',
    gym: 'Iron Temple Gym',
    goals: ['Strength', 'Powerlifting'],
    schedule: 'Early AM',
    trainDays: 5,
    verified: true,
    compat: 94,
    tags: ['Powerlifting', 'Running', 'Meal Prep'],
    photo: 'https://i.pravatar.cc/400?img=47',
    pr: { squat: 140, bench: 90, deadlift: 165 },
    weeklyKm: 32,
    stravaConnected: true,
    liveAtGym: true,
  },
  {
    id: 'u2',
    name: 'Marcus Reid',
    age: 29,
    bio: 'CrossFit coach & weekend hiker. I count macros but I also believe in cheat days. Balance is everything.',
    gym: 'CrossFit Elevate',
    goals: ['CrossFit', 'HIIT'],
    schedule: 'Morning',
    trainDays: 6,
    verified: true,
    compat: 88,
    tags: ['CrossFit', 'Hiking', 'Nutrition'],
    photo: 'https://i.pravatar.cc/400?img=12',
    pr: { squat: 160, bench: 120, deadlift: 200 },
    weeklyKm: 45,
    stravaConnected: true,
    liveAtGym: false,
  },
  {
    id: 'u3',
    name: 'Sofia Reyes',
    age: 25,
    bio: 'Yoga teacher + HIIT addict. I meditate in the morning and lift in the evening. Come find your balance with me.',
    gym: 'Zen Body Studio',
    goals: ['Yoga', 'HIIT'],
    schedule: 'Evening',
    trainDays: 7,
    verified: false,
    compat: 79,
    tags: ['Yoga', 'HIIT', 'Meditation'],
    photo: 'https://i.pravatar.cc/400?img=25',
    pr: { squat: 80, bench: 55, deadlift: 100 },
    weeklyKm: 20,
    stravaConnected: false,
    liveAtGym: true,
  },
  {
    id: 'u4',
    name: 'Jaylen Brooks',
    age: 31,
    bio: 'Marathon runner chasing a sub-3hr. Also dabble in calisthenics when not pounding pavement.',
    gym: 'PureGym City',
    goals: ['Running', 'Calisthenics'],
    schedule: 'Early AM',
    trainDays: 6,
    verified: true,
    compat: 85,
    tags: ['Marathon', 'Calisthenics', 'Recovery'],
    photo: 'https://i.pravatar.cc/400?img=15',
    pr: { squat: 110, bench: 80, deadlift: 140 },
    weeklyKm: 70,
    stravaConnected: true,
    liveAtGym: false,
  },
  {
    id: 'u5',
    name: 'Priya Nair',
    age: 26,
    bio: 'Martial arts black belt & gym rat. Train hard, eat harder. Looking for a partner in crime (at the gym).',
    gym: 'Warriors Dojo & Gym',
    goals: ['Martial Arts', 'Strength'],
    schedule: 'Night',
    trainDays: 5,
    verified: true,
    compat: 91,
    tags: ['Muay Thai', 'BJJ', 'Strength'],
    photo: 'https://i.pravatar.cc/400?img=44',
    pr: { squat: 120, bench: 75, deadlift: 145 },
    weeklyKm: 15,
    stravaConnected: false,
    liveAtGym: true,
  },
  {
    id: 'u6',
    name: 'Ethan Walsh',
    age: 28,
    bio: 'Bodybuilder in prep season. Always at the gym, always eating chicken. Swipe right if you get it.',
    gym: 'Gold\'s Gym Downtown',
    goals: ['Strength', 'Bodybuilding'],
    schedule: 'Morning',
    trainDays: 6,
    verified: true,
    compat: 76,
    tags: ['Bodybuilding', 'Nutrition', 'Posing'],
    photo: 'https://i.pravatar.cc/400?img=8',
    pr: { squat: 200, bench: 150, deadlift: 240 },
    weeklyKm: 10,
    stravaConnected: false,
    liveAtGym: false,
  },
  {
    id: 'u7',
    name: 'Zoe Tanaka',
    age: 24,
    bio: 'Spinning & strength. I believe every workout should end with a smoothie. Fitness is my love language.',
    gym: 'SoulCycle + Anytime Fitness',
    goals: ['Cardio', 'Strength'],
    schedule: 'Lunch',
    trainDays: 4,
    verified: false,
    compat: 82,
    tags: ['Spinning', 'Strength', 'Smoothies'],
    photo: 'https://i.pravatar.cc/400?img=33',
    pr: { squat: 90, bench: 60, deadlift: 110 },
    weeklyKm: 55,
    stravaConnected: true,
    liveAtGym: false,
  },
  {
    id: 'u8',
    name: 'Luca Ferraro',
    age: 30,
    bio: 'Street workout & calisthenics. Parks are my gym, the world is my playground. Let\'s train outdoors.',
    gym: 'Outdoor Bars / Freeletics',
    goals: ['Calisthenics', 'Cardio'],
    schedule: 'Morning',
    trainDays: 5,
    verified: true,
    compat: 87,
    tags: ['Calisthenics', 'Parkour', 'Outdoor'],
    photo: 'https://i.pravatar.cc/400?img=18',
    pr: { squat: 0, bench: 0, deadlift: 0 },
    weeklyKm: 40,
    stravaConnected: true,
    liveAtGym: true,
  },
]

export interface Match {
  id: string
  userId: string
  lastMsg: string
  time: string
  unread: number
}

export const MATCHES: Match[] = [
  {
    id: 'm1',
    userId: 'u1',
    lastMsg: 'Want to train together this Saturday?',
    time: '2m',
    unread: 2,
  },
  {
    id: 'm2',
    userId: 'u5',
    lastMsg: 'Your deadlift form looked amazing! 💪',
    time: '1h',
    unread: 1,
  },
  {
    id: 'm3',
    userId: 'u2',
    lastMsg: 'I\'ll be at CrossFit Elevate at 7am if you want to join',
    time: '3h',
    unread: 0,
  },
]

export interface Message {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
}

export const MESSAGES: Record<string, Message[]> = {
  u1: [
    { id: 'msg1', from: 'them', text: 'Hey! I saw your squat PR — that\'s impressive 🔥', time: '10:32' },
    { id: 'msg2', from: 'me', text: 'Thanks! Been working on it for months. You powerlift too?', time: '10:35' },
    { id: 'msg3', from: 'them', text: 'Yes! 140kg squat last week. Still chasing that 150 goal.', time: '10:36' },
    { id: 'msg4', from: 'me', text: 'That\'s insane! We should train together sometime 💪', time: '10:38' },
    { id: 'msg5', from: 'them', text: 'Want to train together this Saturday?', time: '10:40' },
  ],
  u5: [
    { id: 'msg1', from: 'them', text: 'Hi! Saw we both love strength training 😊', time: '09:14' },
    { id: 'msg2', from: 'me', text: 'Hey Priya! BJJ + lifting is such a great combo', time: '09:20' },
    { id: 'msg3', from: 'them', text: 'Your deadlift form looked amazing! 💪', time: '09:22' },
  ],
  u2: [
    { id: 'msg1', from: 'me', text: 'Love that CrossFit background! What\'s your Fran time?', time: '08:00' },
    { id: 'msg2', from: 'them', text: '3:45 last month. Getting under 3 is the goal.', time: '08:15' },
    { id: 'msg3', from: 'me', text: 'That\'s elite level! I\'d love to come to one of your classes', time: '08:18' },
    { id: 'msg4', from: 'them', text: 'I\'ll be at CrossFit Elevate at 7am if you want to join', time: '08:20' },
  ],
}

export interface LeaderboardEntry {
  rank: number
  name: string
  photo: string
  points: number
  badge: string
}

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Marcus Reid', photo: 'https://i.pravatar.cc/400?img=12', points: 9840, badge: '👑' },
  { rank: 2, name: 'Aria Chen', photo: 'https://i.pravatar.cc/400?img=47', points: 8720, badge: '🥈' },
  { rank: 3, name: 'Jaylen Brooks', photo: 'https://i.pravatar.cc/400?img=15', points: 7650, badge: '🥉' },
  { rank: 4, name: 'Priya Nair', photo: 'https://i.pravatar.cc/400?img=44', points: 6930, badge: '⚡' },
  { rank: 5, name: 'Ethan Walsh', photo: 'https://i.pravatar.cc/400?img=8', points: 6200, badge: '🔥' },
  { rank: 6, name: 'Zoe Tanaka', photo: 'https://i.pravatar.cc/400?img=33', points: 5800, badge: '💎' },
  { rank: 7, name: 'Luca Ferraro', photo: 'https://i.pravatar.cc/400?img=18', points: 5100, badge: '🌟' },
  { rank: 8, name: 'Sofia Reyes', photo: 'https://i.pravatar.cc/400?img=25', points: 4600, badge: '🏅' },
  { rank: 9, name: 'Jordan Mack', photo: 'https://i.pravatar.cc/400?img=52', points: 3900, badge: '💪' },
  { rank: 10, name: 'Riley Storm', photo: 'https://i.pravatar.cc/400?img=64', points: 3200, badge: '🎯' },
]

export interface Group {
  id: string
  name: string
  type: string
  members: number
  time: string
  location: string
  photo: string
  joined: boolean
}

export const GROUPS: Group[] = [
  {
    id: 'g1',
    name: '5am Club Run',
    type: 'Running',
    members: 24,
    time: 'Tomorrow, 5:00 AM',
    location: 'Riverside Park',
    photo: 'https://i.pravatar.cc/400?img=60',
    joined: true,
  },
  {
    id: 'g2',
    name: 'Saturday Lifting Crew',
    type: 'Lifting',
    members: 12,
    time: 'Sat, 9:00 AM',
    location: 'Iron Temple Gym',
    photo: 'https://i.pravatar.cc/400?img=65',
    joined: false,
  },
  {
    id: 'g3',
    name: 'HIIT Maniacs',
    type: 'HIIT',
    members: 31,
    time: 'Wed, 6:30 PM',
    location: 'Central Park Lawn',
    photo: 'https://i.pravatar.cc/400?img=70',
    joined: false,
  },
  {
    id: 'g4',
    name: 'Sunday Yoga Flow',
    type: 'Yoga',
    members: 18,
    time: 'Sun, 8:00 AM',
    location: 'Zen Body Studio',
    photo: 'https://i.pravatar.cc/400?img=57',
    joined: true,
  },
  {
    id: 'g5',
    name: 'CrossFit Open Training',
    type: 'CrossFit',
    members: 8,
    time: 'Mon + Thu, 7:00 AM',
    location: 'CrossFit Elevate',
    photo: 'https://i.pravatar.cc/400?img=62',
    joined: false,
  },
]
