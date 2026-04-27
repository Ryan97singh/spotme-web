'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, MapPin } from 'lucide-react'
import { useStore } from '@/lib/store'

const PINS = [
  { id: 'a', name: 'Alex', sport: 'Powerlifting', avatar: 'https://i.pravatar.cc/200?u=pin1', x: 22, y: 34, live: true },
  { id: 'b', name: 'Morgan', sport: 'Running', avatar: 'https://i.pravatar.cc/200?u=pin2', x: 55, y: 52, live: false },
  { id: 'c', name: 'Jordan', sport: 'CrossFit', avatar: 'https://i.pravatar.cc/200?u=pin3', x: 72, y: 28, live: true },
  { id: 'd', name: 'Riley', sport: 'Yoga', avatar: 'https://i.pravatar.cc/200?u=pin4', x: 38, y: 68, live: false },
  { id: 'e', name: 'Casey', sport: 'HIIT', avatar: 'https://i.pravatar.cc/200?u=pin5', x: 80, y: 62, live: true },
]

type Pin = typeof PINS[number]

function FauxMap() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 390 580" preserveAspectRatio="xMidYMid slice">
      {/* Background */}
      <rect width="390" height="580" fill="#111317" />

      {/* Grid lines — city blocks */}
      {[60, 120, 180, 240, 300, 360, 420, 480, 540].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="390" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {[50, 100, 150, 200, 250, 300, 350].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="580" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* Main roads */}
      <rect x="0" y="170" width="390" height="14" fill="rgba(255,255,255,0.05)" rx="1" />
      <rect x="0" y="370" width="390" height="14" fill="rgba(255,255,255,0.05)" rx="1" />
      <rect x="115" y="0" width="14" height="580" fill="rgba(255,255,255,0.05)" rx="1" />
      <rect x="275" y="0" width="14" height="580" fill="rgba(255,255,255,0.05)" rx="1" />

      {/* Park / green area */}
      <rect x="130" y="210" width="130" height="140" fill="rgba(212,255,58,0.04)" rx="8" />
      <rect x="132" y="212" width="126" height="136" fill="none" stroke="rgba(212,255,58,0.08)" strokeWidth="1" rx="7" />

      {/* Water feature */}
      <ellipse cx="310" cy="460" rx="55" ry="38" fill="rgba(56,189,248,0.07)" />
      <ellipse cx="310" cy="460" rx="55" ry="38" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="1" />

      {/* Block fills */}
      {[
        [20, 20, 80, 130], [160, 20, 100, 130], [290, 20, 80, 130],
        [20, 200, 80, 150], [290, 200, 80, 340],
        [20, 390, 80, 170], [160, 390, 100, 90], [160, 510, 100, 60],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.025)" rx="4" />
      ))}

      {/* Road labels */}
      <text x="195" y="166" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="Inter, sans-serif">MAIN ST</text>
      <text x="195" y="366" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="Inter, sans-serif">PARK AVE</text>

      {/* You are here — pulsing dot */}
      <circle cx="195" cy="285" r="10" fill="rgba(212,255,58,0.15)" />
      <circle cx="195" cy="285" r="6" fill="#D4FF3A" />
      <circle cx="195" cy="285" r="6" fill="none" stroke="rgba(212,255,58,0.4)" strokeWidth="2">
        <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export default function Map() {
  const { openChat } = useStore()
  const [selected, setSelected] = useState<Pin | null>(null)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden', position: 'relative' }}>
      {/* Top bar */}
      <div
        className="glass-bar"
        style={{ padding: '52px 20px 14px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
      >
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '-0.02em' }}>
            Nearby
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            {PINS.filter((p) => p.live).length} athletes at the gym now
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 20, background: 'rgba(212,255,58,0.1)', border: '1px solid rgba(212,255,58,0.25)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D4FF3A', display: 'inline-block', boxShadow: '0 0 6px rgba(212,255,58,0.8)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#D4FF3A' }}>Live</span>
        </div>
      </div>

      {/* Map area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <FauxMap />

        {/* Pins */}
        {PINS.map((pin) => {
          const left = `${pin.x}%`
          const top = `${pin.y}%`
          const isSelected = selected?.id === pin.id
          return (
            <motion.button
              key={pin.id}
              onClick={() => setSelected(isSelected ? null : pin)}
              style={{
                position: 'absolute',
                left,
                top,
                transform: 'translate(-50%, -50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                zIndex: isSelected ? 10 : 5,
              }}
              animate={{ scale: isSelected ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <div style={{ position: 'relative' }}>
                {/* Live glow */}
                {pin.live && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: '50%',
                      background: 'rgba(212,255,58,0.3)',
                    }}
                  />
                )}
                {/* Avatar */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: `2.5px solid ${pin.live ? '#D4FF3A' : 'rgba(255,255,255,0.25)'}`,
                  overflow: 'hidden',
                  background: 'var(--bg-1)',
                  boxShadow: pin.live ? '0 0 12px rgba(212,255,58,0.4)' : '0 2px 8px rgba(0,0,0,0.5)',
                }}>
                  <img src={pin.avatar} alt={pin.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Live dot */}
                {pin.live && (
                  <span style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 1,
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: '#D4FF3A',
                    border: '2px solid #0A0B0D',
                  }} />
                )}
              </div>
            </motion.button>
          )
        })}

        {/* You are here label */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '49%',
          transform: 'translate(-50%, 0)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 12,
          background: 'rgba(212,255,58,0.15)',
          border: '1px solid rgba(212,255,58,0.3)',
          pointerEvents: 'none',
        }}>
          <MapPin size={10} color="#D4FF3A" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#D4FF3A' }}>You</span>
        </div>
      </div>

      {/* Selected person card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="glass-sheet"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px 32px',
              zIndex: 20,
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ position: 'relative' }}>
                <img src={selected.avatar} alt={selected.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${selected.live ? '#D4FF3A' : 'rgba(255,255,255,0.2)'}` }} />
                {selected.live && (
                  <span style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#D4FF3A', border: '2px solid #0A0B0D' }} />
                )}
              </div>
              <div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>{selected.name}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{selected.sport}</p>
                {selected.live && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 4, padding: '2px 8px', borderRadius: 10, background: 'rgba(212,255,58,0.12)', border: '1px solid rgba(212,255,58,0.25)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4FF3A' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#D4FF3A' }}>At the gym now</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => openChat(selected.id)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: '#D4FF3A',
                border: 'none',
                color: '#0A0B0D',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(212,255,58,0.3)',
              }}
            >
              <Zap size={16} fill="#0A0B0D" />
              Ping
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
