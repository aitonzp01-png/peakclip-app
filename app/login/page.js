'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [focusedInput, setFocusedInput] = useState('')

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  const handleEmailAuth = async () => {
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Revisa tu email para confirmar tu cuenta')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/dashboard'
    }
  }

  const inputStyle = (name) => ({
    width: '100%', padding: '13px 16px', borderRadius: '8px',
    border: `1px solid ${focusedInput === name ? '#C9A84C' : '#2a2a2a'}`,
    background: '#111', color: '#fff',
    marginBottom: '12px', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s',
    boxShadow: focusedInput === name ? '0 0 0 3px rgba(201,168,76,0.1)' : 'none'
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 1px 1px, #2a2a2a 1px, transparent 0)',
      backgroundSize: '40px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(13,13,13,0.97)',
        border: '1px solid #C9A84C',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 40px rgba(201,168,76,0.08), 0 20px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            color: '#C9A84C', fontSize: '30px', fontWeight: 'bold',
            letterSpacing: '4px', marginBottom: '6px'
          }}>PEAK CLIP</h1>
          <div style={{
            display: 'inline-block', background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)', borderRadius: '20px',
            padding: '3px 14px', fontSize: '10px', color: '#C9A84C', letterSpacing: '3px'
          }}>· AI-POWERED CLIPPING PLATFORM ·</div>
        </div>

        <p style={{ color: '#555', marginBottom: '28px', fontSize: '14px' }}>
          {isSignUp ? 'Crea tu cuenta gratis' : 'Bienvenido de nuevo'}
        </p>

        <input
          type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput('')}
          style={inputStyle('email')}
        />
        <input
          type="password" placeholder="Contraseña"
          value={password} onChange={e => setPassword(e.target.value)}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput('')}
          style={inputStyle('password')}
        />

        <button
          onClick={handleEmailAuth}
          style={{
            border: 'none', borderRadius: '8px', padding: '14px 32px',
            fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
            width: '100%', marginBottom: '16px', marginTop: '8px',
            background: 'linear-gradient(135deg, #C9A84C, #e8c96a)',
            color: '#000', letterSpacing: '1px',
            boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
            transition: 'transform 0.1s'
          }}>
          {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>

        <div style={{ color: '#2a2a2a', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
          <span style={{ color: '#444' }}>o</span>
          <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            border: '1px solid #2a2a2a', borderRadius: '8px', padding: '13px 32px',
            fontSize: '14px', fontWeight: '500', cursor: 'pointer',
            width: '100%', marginBottom: '8px',
            background: '#fff', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 4.8C9.7 39.8 16.4 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 5.8l6.2 5.2C40.8 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continuar con Google
        </button>

        {message && (
          <div style={{
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '8px', padding: '10px', marginTop: '16px',
            color: '#C9A84C', fontSize: '13px'
          }}>{message}</div>
        )}

        <p
          style={{ color: '#444', marginTop: '24px', fontSize: '13px', cursor: 'pointer' }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
          <span style={{ color: '#C9A84C' }}>{isSignUp ? 'Inicia sesión' : 'Regístrate gratis'}</span>
        </p>
      </div>
    </div>
  )
}