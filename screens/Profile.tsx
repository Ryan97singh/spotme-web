'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Edit2, Activity, Zap, Settings, ChevronRight, Camera } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getMyProfile, uploadAvatar, updateProfile, type Profile } from '@/lib/api'
import AvatarCropModal from '@/components/AvatarCropModal'

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Profile() {
  const go = useStore((s) => s.go)
  const user = useStore((s) => s.user)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getMyProfile(user.id).then((p) => {
      setProfile(p)
      setLoading(false)
    })
  }, [user])

  // Step 1: user picks a file → show crop modal
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so same file can be re-selected
    e.target.value = ''
    const url = URL.createObjectURL(file)
    setCropSrc(url)
  }

  // Step 2: crop confirmed → upload the cropped blob
  const handleCropConfirm = async (blob: Blob) => {
    if (!user) return
    setCropSrc(null)
    setUploading(true)
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    const url = await uploadAvatar(user.id, file)
    if (url) {
      await updateProfile(user.id, { avatar_url: url })
      setProfile((prev) => prev ? { ...prev, avatar_url: url } : prev)
    }
    setUploading(false)
  }

  const handleCropCancel = () => {
    setCropSrc(null)
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(200,255,0,0.2)', borderTopColor: 'var(--volt)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const goals = (profile?.goals as string[] | null) ?? []
  const pr = {
    squat: profile?.pr_squat ?? 0,
    bench: profile?.pr_bench ?? 0,
    deadlift: profile?.pr_deadlift ?? 0,
  }
  const stats = [
    { label: 'Squat', value: `${pr.squat}kg`, color: 'var(--volt)' },
    { label: 'Bench', value: `${pr.bench}kg`, color: 'var(--rose)' },
    { label: 'Deadlift', value: `${pr.deadlift}kg`, color: 'var(--blue)' },
    { label: 'Weekly km', value: `${profile?.weekly_km ?? 0}`, color: 'var(--warn)' },
    { label: 'Train days', value: `${profile?.train_days ?? 0}/wk`, color: 'var(--online)' },
  ]

  const avatarSrc = profile?.avatar_url ?? `https://i.pravatar.cc/400?u=${user?.id}`

  return (
    <div
      className="no-scrollbar"
      style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', position: 'relative' }}
    >
      {/* Photo hero */}
      <div style={{ position: 'relative', height: 320, background: 'var(--surface)', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(200,255,0,0.2) 0%, rgba(255,107,157,0.2) 100%)' }} />
        <img
          src={avatarSrc}
          alt={profile?.full_name ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)' }} />

        {/* Avatar upload button */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            position: 'absolute',
            top: 56,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'rgba(13,11,20,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.5 : 1,
          }}
        >
          {uploading
            ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            : <Camera size={16} color="#fff" />
          }
        </button>
        <input ref={fileRef} type="file" accept="image/*,image/heic,image/heif" style={{ display: 'none' }} onChange={handleFileSelect} />
        {cropSrc && <AvatarCropModal imageSrc={cropSrc} onConfirm={handleCropConfirm} onCancel={handleCropCancel} />}
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px 100px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: '-0.02em' }}>
              {profile?.full_name ?? user?.email?.split('@')[0] ?? 'You'}{profile?.age ? `, ${profile.age}` : ''}
            </h1>
            {profile?.verified && <CheckCircle size={20} color="var(--volt)" fill="var(--volt)" />}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>📍 {profile?.gym_name ?? 'No gym set'}</p>
        </motion.div>

        {/* Edit profile button */}
        <button
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 12,
            background: 'rgba(200,255,0,0.08)',
            border: '1.5px solid var(--volt)',
            color: 'var(--volt)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          <Edit2 size={16} />
          Edit profile
        </button>

        {/* Stats grid */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {stats.slice(0, 3).map((s) => (
              <div key={s.label} className="glass" style={{ borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 20, color: s.color, marginBottom: 2 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {stats.slice(3).map((s) => (
              <div key={s.label} className="glass" style={{ borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 20, color: s.color, marginBottom: 2 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly workout strip */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            This week
          </h2>
          <div className="glass" style={{ borderRadius: 16, padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
            {WEEK_DAYS.map((day, i) => {
              const today = new Date().getDay()
              const dayMap = [6, 0, 1, 2, 3, 4, 5]
              const trained = i < dayMap[today]
              return (
                <div key={`${day}-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: trained ? 'var(--volt)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${trained ? 'rgba(200,255,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: trained ? '0 0 12px rgba(200,255,0,0.3)' : 'none',
                  }}>
                    {trained && <Activity size={14} color="#0D0B14" strokeWidth={2.5} />}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              About
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{profile.bio}</p>
          </div>
        )}

        {/* Training tags */}
        {goals.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {goals.map((tag) => (
                <span key={tag} style={{ padding: '7px 14px', borderRadius: 20, background: 'var(--volt-dim)', border: '1px solid rgba(200,255,0,0.2)', color: 'var(--volt)', fontSize: 13, fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strava row */}
        <div className="glass" style={{ borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(252,76,2,0.15)', border: '1px solid rgba(252,76,2,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🏃
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>Strava</p>
              <p style={{ fontSize: 12, color: profile?.strava_id ? 'var(--online)' : 'rgba(255,255,255,0.3)' }}>
                {profile?.strava_id ? '✓ Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          <Zap size={16} color={profile?.strava_id ? 'var(--volt)' : 'rgba(255,255,255,0.3)'} />
        </div>

        {/* Settings link */}
        <button
          onClick={() => go('settings')}
          className="glass"
          style={{ width: '100%', padding: '14px 16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={18} color="rgba(255,255,255,0.6)" />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Settings</span>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
