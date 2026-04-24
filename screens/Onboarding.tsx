'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ArrowRight, Camera, Info } from 'lucide-react'
import { useStore } from '@/lib/store'

const TRAINING_GOALS = [
  'Strength', 'Cardio', 'HIIT', 'CrossFit',
  'Running', 'Yoga', 'Martial Arts', 'Calisthenics',
]

const TIME_SLOTS = ['Early AM', 'Morning', 'Lunch', 'Evening', 'Night']

const SCREENS: Array<'ob1' | 'ob2' | 'ob3' | 'ob4'> = ['ob1', 'ob2', 'ob3', 'ob4']

export default function Onboarding() {
  const go = useStore((s) => s.go)
  const screen = useStore((s) => s.screen)
  const stepIndex = SCREENS.indexOf(screen as 'ob1' | 'ob2' | 'ob3' | 'ob4')
  const step = stepIndex + 1

  // Step 1
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  // Step 2
  const [trainFreq, setTrainFreq] = useState(4)
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  // Step 3 — photo slots
  const [photos] = useState<(string | null)[]>([null, null, null])
  // Step 4
  const [bio, setBio] = useState('')
  const [gymName, setGymName] = useState('')

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }
  const toggleTime = (t: string) => {
    setSelectedTimes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  const handleBack = () => {
    if (step === 1) go('register')
    else go(SCREENS[stepIndex - 1])
  }

  const handleNext = () => {
    if (step === 4) {
      go('discover')
    } else {
      go(SCREENS[stepIndex + 1])
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
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '56px 20px 20px',
          gap: 12,
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            padding: '6px',
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Progress bar */}
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: s <= step ? 'var(--volt)' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s ease',
                boxShadow: s <= step ? '0 0 6px rgba(200,255,0,0.4)' : 'none',
              }}
            />
          ))}
        </div>

        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }}>
          {step}/4
        </span>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '8px 24px 0',
            overflowY: 'auto',
          }}
          className="no-scrollbar"
        >
          {/* Step 1: Goals */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h1
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    fontSize: 28,
                    color: '#fff',
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  What are you training for?
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                  Select all that apply — we use this to match you with similar people
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {TRAINING_GOALS.map((goal) => {
                  const active = selectedGoals.includes(goal)
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 24,
                        border: `1.5px solid ${active ? 'var(--volt)' : 'rgba(255,255,255,0.1)'}`,
                        background: active ? 'var(--volt-dim)' : 'rgba(255,255,255,0.03)',
                        color: active ? 'var(--volt)' : 'rgba(255,255,255,0.65)',
                        fontWeight: active ? 700 : 500,
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: active ? '0 0 12px rgba(200,255,0,0.2)' : 'none',
                      }}
                    >
                      {goal}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div>
                <h1
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    fontSize: 28,
                    color: '#fff',
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  Your schedule
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                  How often and when do you train?
                </p>
              </div>

              {/* Frequency slider */}
              <div
                className="glass"
                style={{ borderRadius: 16, padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Frequency
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--volt)' }}>
                    {trainFreq}x / week
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={trainFreq}
                  onChange={(e) => setTrainFreq(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--volt)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>1</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>7</span>
                </div>
              </div>

              {/* Time slots */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  Preferred time
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {TIME_SLOTS.map((t) => {
                    const active = selectedTimes.includes(t)
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTime(t)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 24,
                          border: `1.5px solid ${active ? 'var(--volt)' : 'rgba(255,255,255,0.1)'}`,
                          background: active ? 'var(--volt-dim)' : 'rgba(255,255,255,0.03)',
                          color: active ? 'var(--volt)' : 'rgba(255,255,255,0.65)',
                          fontWeight: active ? 700 : 500,
                          fontSize: 13,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h1
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    fontSize: 28,
                    color: '#fff',
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  Add photos
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                  Show them the real you — in your element
                </p>
              </div>

              {/* Photo slots */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Main large slot */}
                <div
                  style={{
                    gridColumn: '1 / -1',
                    aspectRatio: '4 / 3',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.04)',
                    border: '2px dashed rgba(255,255,255,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 40 }}>🏋️</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Camera size={16} color="var(--volt)" />
                    <span style={{ color: 'var(--volt)', fontWeight: 600, fontSize: 13 }}>
                      Main photo
                    </span>
                  </div>
                </div>

                {/* Secondary slots */}
                {[1, 2].map((slot) => (
                  <div
                    key={slot}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.04)',
                      border: '2px dashed rgba(255,255,255,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{slot === 1 ? '💪' : '🏃'}</span>
                    <Camera size={14} color="rgba(255,255,255,0.3)" />
                  </div>
                ))}
              </div>

              {/* Tip card */}
              <div
                className="glass"
                style={{
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  border: '1px solid rgba(200,255,0,0.15)',
                }}
              >
                <Info size={16} color="var(--volt)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--volt)', fontWeight: 600 }}>Pro tip:</span>{' '}
                  Profiles with gym photos get 3× more matches. Show us your gains!
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Bio */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h1
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    fontSize: 28,
                    color: '#fff',
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  Set your bio
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                  Tell people what drives you in and out of the gym
                </p>
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Bio
                </label>
                <textarea
                  placeholder="I train for strength and love helping others hit their goals. Weekend hiker and protein shake enthusiast..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={200}
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
                    resize: 'none',
                    lineHeight: 1.6,
                  }}
                />
                <div style={{ textAlign: 'right', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                    {bio.length}/200
                  </span>
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Home gym
                </label>
                <input
                  type="text"
                  placeholder="e.g. Iron Temple Gym, CrossFit Elevate..."
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
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
              </div>

              {/* Ready card */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--volt-dim) 0%, var(--rose-dim) 100%)',
                  border: '1px solid rgba(200,255,0,0.15)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 20, marginBottom: 6 }}>🚀</p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                  You&apos;re almost ready!
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                  Start discovering people who actually train.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Continue button */}
      <div style={{ padding: '20px 24px 36px' }}>
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            background: 'var(--volt)',
            border: 'none',
            color: '#0D0B14',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 20px rgba(200,255,0,0.3)',
          }}
        >
          {step === 4 ? 'Start discovering' : 'Continue'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
