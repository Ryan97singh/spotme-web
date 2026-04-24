'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import Logo from '@/components/Logo'
import { useStore } from '@/lib/store'
import { getSupabase } from '@/lib/supabase'

export default function Login() {
  const { go, setUser, setHasProfile } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async () => {
    if (!email || !password) { setError('Enter email and password'); return }
    setLoading(true)
    setError('')

    const supabase = getSupabase()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setUser(data.user)

    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single()

    if (profile) {
      setHasProfile(true)
      go('discover')
    } else {
      setHasProfile(false)
      go('ob1')
    }

    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email first'); return }
    const supabase = getSupabase()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (resetError) setError(resetError.message)
    else setError('Check your email for a reset link')
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
    transition: 'border-color 0.15s ease',
  } as const

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
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,255,0,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 28px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40, display: 'flex', justifyContent: 'center' }}
        >
          <Logo size={32} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 36 }}
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
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>
            Sign in to find your training partner
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
              background: error.includes('Check your email')
                ? 'rgba(200,255,0,0.1)'
                : 'rgba(255,77,109,0.12)',
              border: `1px solid ${error.includes('Check your email') ? 'rgba(200,255,0,0.2)' : 'rgba(255,77,109,0.2)'}`,
              color: error.includes('Check your email') ? 'var(--volt)' : 'var(--danger)',
              fontSize: 13,
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
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

          <button
            onClick={handleForgotPassword}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--volt)',
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'right',
              fontWeight: 600,
            }}
          >
            Forgot password?
          </button>

          <button
            onClick={handleSignIn}
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
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: '2.5px solid rgba(13,11,20,0.3)',
                    borderTopColor: '#0D0B14',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Signing in...
              </span>
            ) : (
              <>Sign in <ArrowRight size={18} /></>
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <button
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 18 }}>🏃</span>
            Continue with Strava
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 'auto', paddingTop: 32, textAlign: 'center' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
            Don&apos;t have an account?{' '}
          </span>
          <button
            onClick={() => go('register')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--volt)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
