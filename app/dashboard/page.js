'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(3)
  const [plan, setPlan] = useState('free')
  const [clips, setClips] = useState([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [activeTab, setActiveTab] = useState('generate')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) { setCredits(data.credits); setPlan(data.plan) }
      const { data: clipsData } = await supabase.from('clips').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (clipsData) setClips(clipsData)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const handleSubmit = async () => {
    if (!url) return
    if (credits <= 0) { setStatus('Sin créditos. Actualiza tu plan.'); return }
    setLoading(true)
    setStatus('⏳ Analizando vídeo con IA...')

    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('clips').insert({ user_id: user.id, title: url, status: 'processing' })
    await supabase.from('users').update({ credits: credits - 1 }).eq('id', user.id)
    setCredits(credits - 1)

    try {
      const response = await fetch('https://peakclip-backend-production.up.railway.app/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url, user_id: user.id })
      })

      if (response.ok) {
        const data = await response.json()
        setStatus(`✅ ¡${data.total} clips generados! Revisa "Mis clips".`)
        for (const clip of data.clips) {
          await supabase.from('clips').insert({
            user_id: user.id,
            title: clip.title,
            status: 'done',
            video_url: clip.file
          })
        }
      } else {
        setStatus('❌ Error procesando el vídeo. Inténtalo de nuevo.')
      }
    } catch (error) {
      setStatus('❌ No se pudo conectar con el servidor.')
    }

    setUrl('')
    setLoading(false)
    const { data: clipsData } = await supabase.from('clips').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (clipsData) setClips(clipsData)
  }

  const gold = '#C9A84C'
  const goldGrad = 'linear-gradient(135deg, #C9A84C, #e8c96a)'

  const plans = [
    {
      name: 'Free', price: '$0', clips: '3 clips/mes',
      features: ['3 créditos', 'Formato 9:16', 'Subtítulos básicos'],
      color: '#333', cta: 'Plan actual', disabled: true, link: null
    },
    {
      name: 'Creator', price: '$26.99', clips: '200 clips/mes',
      features: ['200 créditos', 'Subtítulos animados', 'Gameplay overlay', 'Export HD'],
      color: gold, cta: 'Empezar Creator', popular: true,
      link: 'https://buy.stripe.com/test_5kQbJ2ff7d3Cezmh0K8bS00'
    },
    {
      name: 'Pro', price: '$69.99', clips: 'Ilimitado',
      features: ['Créditos infinitos', 'Editor avanzado', 'Auto-publish', 'Viral Score IA', 'Soporte prioritario'],
      color: '#a855f7', cta: 'Empezar Pro',
      link: 'https://buy.stripe.com/test_9B614o7MF5BagHudOy8bS01'
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{ width: '220px', minHeight: '100vh', background: '#0d0d0d', borderRight: '1px solid #161616', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', top: 0, left: 0 }}>
        <div style={{ padding: '0 20px 32px' }}>
          <h1 style={{ color: gold, fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px' }}>PEAK CLIP</h1>
          <div style={{ fontSize: '9px', color: '#333', letterSpacing: '2px', marginTop: '2px' }}>AI CLIPPING PLATFORM</div>
        </div>

        {[
          { id: 'generate', icon: '⚡', label: 'Generar clips' },
          { id: 'clips', icon: '🎬', label: 'Mis clips' },
          { id: 'upgrade', icon: '👑', label: 'Upgrade' },
        ].map(item => (
          <div key={item.id} onClick={() => setActiveTab(item.id)} style={{
            padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
            background: activeTab === item.id ? 'rgba(201,168,76,0.08)' : 'transparent',
            borderRight: activeTab === item.id ? `2px solid ${gold}` : '2px solid transparent',
            color: activeTab === item.id ? gold : '#444',
            fontSize: '13px', fontWeight: activeTab === item.id ? '500' : '400',
            transition: 'all 0.15s'
          }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid #161616' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', color: '#000' }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              <div style={{ fontSize: '10px', color: gold, fontWeight: 'bold' }}>{plan.toUpperCase()}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#444', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: '220px', flex: 1, padding: '40px' }}>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px' }}>
            {activeTab === 'generate' && 'Genera tu clip viral'}
            {activeTab === 'clips' && 'Mis clips'}
            {activeTab === 'upgrade' && 'Elige tu plan'}
          </h2>
          <p style={{ color: '#444', fontSize: '14px' }}>
            {activeTab === 'generate' && 'Pega un link de YouTube o Twitch y la IA hace el resto'}
            {activeTab === 'clips' && `${clips.length} clips generados hasta ahora`}
            {activeTab === 'upgrade' && 'Desbloquea más créditos y funciones premium'}
          </p>
        </div>

        {activeTab === 'generate' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Créditos', value: credits, sub: plan === 'pro' ? '∞ ilimitado' : `de ${plan === 'creator' ? 200 : 3}`, color: credits > 0 ? gold : '#ef4444' },
                { label: 'Clips totales', value: clips.length, sub: 'generados', color: '#fff' },
                { label: 'Plan', value: plan.toUpperCase(), sub: plan === 'free' ? 'Click para upgrade' : 'Activo ✓', color: plan === 'pro' ? '#a855f7' : gold, onClick: () => setActiveTab('upgrade') },
              ].map((s, i) => (
                <div key={i} onClick={s.onClick} style={{
                  background: '#0d0d0d', border: '1px solid #161616', borderRadius: '14px',
                  padding: '22px 24px', cursor: s.onClick ? 'pointer' : 'default',
                }}>
                  <div style={{ color: '#444', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: '30px', fontWeight: 'bold', marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ color: '#333', fontSize: '12px' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0d0d0d', border: `1px solid ${gold}22`, borderRadius: '16px', padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: goldGrad, opacity: 0.4 }}></div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>URL del vídeo</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    style={{ flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid #1a1a1a', background: '#080808', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                  <button onClick={handleSubmit} disabled={loading} style={{
                    background: loading ? '#1a1a1a' : goldGrad,
                    color: loading ? '#444' : '#000', border: 'none', borderRadius: '10px',
                    padding: '14px 28px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px', whiteSpace: 'nowrap', minWidth: '160px'
                  }}>
                    {loading ? '⏳ Procesando...' : '⚡ Generar clips'}
                  </button>
                </div>
              </div>

              {status && (
                <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px', padding: '12px 16px', color: gold, fontSize: '13px' }}>
                  {status}
                </div>
              )}

              <div style={{ display: 'flex', gap: '24px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #111' }}>
                {['🎯 Detección viral con IA', '📝 Subtítulos automáticos', '📱 Formato 9:16', '🎮 Gameplay overlay'].map((f, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#333' }}>{f}</div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'clips' && (
          <div>
            {clips.length === 0 ? (
              <div style={{ background: '#0d0d0d', border: '1px dashed #1a1a1a', borderRadius: '16px', padding: '80px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                <p style={{ color: '#444', marginBottom: '20px' }}>Aún no tienes clips generados</p>
                <button onClick={() => setActiveTab('generate')} style={{ background: goldGrad, color: '#000', border: 'none', borderRadius: '8px', padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Generar primer clip
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {clips.map(clip => (
                  <div key={clip.id} style={{ background: '#0d0d0d', border: '1px solid #161616', borderRadius: '12px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', background: '#111', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎬</div>
                      <div>
                        <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clip.title}</div>
                        <div style={{ fontSize: '11px', color: '#333' }}>{new Date(clip.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {clip.status === 'done' && (
                        <button
                          onClick={() => window.location.href = `/editor?id=${clip.id}`}
                          style={{
                            fontSize: '11px', padding: '5px 12px', borderRadius: '20px',
                            background: 'rgba(201,168,76,0.08)', color: gold,
                            border: `1px solid ${gold}22`, cursor: 'pointer'
                          }}>
                          ✏️ Editar
                        </button>
                      )}
                      {clip.status === 'done' && clip.video_url && (
                        <a href={clip.video_url} download style={{
                          fontSize: '11px', padding: '5px 12px', borderRadius: '20px',
                          background: 'rgba(201,168,76,0.08)', color: gold,
                          border: `1px solid ${gold}22`, textDecoration: 'none'
                        }}>
                          ⬇ Descargar
                        </a>
                      )}
                      <span style={{
                        fontSize: '11px', padding: '5px 12px', borderRadius: '20px',
                        background: clip.status === 'done' ? 'rgba(34,197,94,0.08)' : 'rgba(201,168,76,0.08)',
                        color: clip.status === 'done' ? '#22c55e' : gold,
                        border: `1px solid ${clip.status === 'done' ? '#22c55e22' : gold + '22'}`
                      }}>
                        {clip.status === 'done' ? '✓ Listo' : '⏳ Procesando'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'upgrade' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {plans.map((p, i) => (
              <div key={i} style={{
                background: '#0d0d0d', border: `1px solid ${p.popular ? gold + '44' : '#161616'}`,
                borderRadius: '16px', padding: '28px', position: 'relative',
                boxShadow: p.popular ? `0 0 30px ${gold}11` : 'none'
              }}>
                {p.popular && <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: goldGrad, color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '4px 16px', borderRadius: '0 0 8px 8px', letterSpacing: '1px' }}>MÁS POPULAR</div>}
                <div style={{ color: p.color, fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>{p.name.toUpperCase()}</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>{p.price}<span style={{ fontSize: '13px', color: '#444', fontWeight: 'normal' }}>/mes</span></div>
                <div style={{ color: '#444', fontSize: '12px', marginBottom: '24px' }}>{p.clips}</div>
                <div style={{ marginBottom: '24px' }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ fontSize: '13px', color: '#666', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: p.color }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button
                  disabled={p.disabled}
                  onClick={() => p.link && window.open(p.link, '_blank')}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px',
                    background: p.disabled ? '#111' : p.popular ? goldGrad : `${p.color}22`,
                    color: p.disabled ? '#333' : p.popular ? '#000' : p.color,
                    fontWeight: 'bold', cursor: p.disabled ? 'not-allowed' : 'pointer', fontSize: '13px',
                    border: p.disabled ? '1px solid #1a1a1a' : p.popular ? 'none' : `1px solid ${p.color}44`
                  }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}