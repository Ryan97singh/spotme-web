'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import { useStore } from '@/lib/store'
import { getSupabase } from '@/lib/supabase'

export default function Register() {
  const { go, setUser } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) { setError('Enter your name'); return }
    if (!email) { setError('Enter your email'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    setError('')

    const supabase = getSupabase()
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setUser(data.user)
    // New user — go through onboarding to build profile
    go('ob1')
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '15px 16px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'var(--font-ui)',
  } as const

  const labelStyle = {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: 6,
  }

  const strength = Math.min(4, Math.floor(password.length / 3))

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
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,157,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 28px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          onClick={() => go('land')}
          style={{
            position: 'absolute',
            top: 56,
            left: 20,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 36, display: 'flex', justifyContent: 'center' }}
        >
          <Logo size={32} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 32 }}
        >
          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: 8,
            }}
          >
            Create account
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>
            Join thousands of athletes finding their match
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          {error && (
            <div style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(255,77,109,0.12)',
              border: '1px solid rgba(255,77,109,0.2)',
              color: 'var(--danger)',
              fontSize: 13,
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Your name</label>
            <input
              type="text"
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                style={{ ...inputStyle, paddingRight: 48 }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {password.length > 0 && (
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background:
                      i <= strength
                        ? i <= 1 ? 'var(--danger)' : i <= 2 ? 'var(--warn)' : 'var(--volt)'
                        : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.2s ease',
                  }}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '16px',
              borderRadius: 14,
              background: loading ? 'rgba(200,255,0,0.6)' : 'var(--volt)',
              border: 'none',
              color: '#0D0B14',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: loading ? 'none' : '0 4px 20px rgba(200,255,0,0.3)',
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: '2.5px solid rgba(13,11,20,0.3)',
                    borderTopColor: '#0D0B14',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }}
                />
                Creating account...
              </>
            ) : (
              <>Create account <ArrowRight size={18} /></>
            )}
          </button>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.5 }}>
            By creating an account you agree to our{' '}
            <span style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>Terms</span>{' '}
            and{' '}
            <span style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>Privacy Policy</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ marginTop: 'auto', paddingTop: 24, textAlign: 'center' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
            Already have an account?{' '}
          </span>
          <button
            onClick={() => go('login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--volt)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sign in
          </button>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
