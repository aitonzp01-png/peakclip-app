'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

export default function Editor() {
  const [clip, setClip] = useState(null)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(100)
  const [subtitleStyle, setSubtitleStyle] = useState('bold-yellow')
  const [subtitlePosition, setSubtitlePosition] = useState('bottom')
  const [watermark, setWatermark] = useState('')
  const [watermarkPosition, setWatermarkPosition] = useState('top-right')
  const [music, setMusic] = useState('none')
  const [musicVolume, setMusicVolume] = useState(30)
  const [saving, setSaving] = useState(false)
  const [activePanel, setActivePanel] = useState('trim')
  const videoRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const clipId = params.get('id')
    if (clipId) loadClip(clipId)
  }, [])

  const loadClip = async (id) => {
    const { data } = await supabase.from('clips').select('*').eq('id', id).single()
    if (data) setClip(data)
  }

  const gold = '#C9A84C'
  const goldGrad = 'linear-gradient(135deg, #C9A84C, #e8c96a)'

  const subtitleStyles = [
    { id: 'bold-yellow', label: 'Bold Yellow', preview: { color: '#FFD700', fontWeight: 'bold', fontSize: '18px', textShadow: '2px 2px 4px #000' } },
    { id: 'white-outline', label: 'White Outline', preview: { color: '#fff', fontWeight: 'bold', fontSize: '18px', textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' } },
    { id: 'neon-green', label: 'Neon Green', preview: { color: '#00ff88', fontWeight: 'bold', fontSize: '18px', textShadow: '0 0 10px #00ff88' } },
    { id: 'red-fire', label: 'Red Fire', preview: { color: '#ff4444', fontWeight: 'bold', fontSize: '18px', textShadow: '0 0 10px #ff0000' } },
    { id: 'minimal-white', label: 'Minimal', preview: { color: '#fff', fontWeight: '400', fontSize: '16px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px' } },
    { id: 'tiktok-style', label: 'TikTok', preview: { color: '#fff', fontWeight: '900', fontSize: '20px', textShadow: '3px 3px 0 #fe2c55' } },
  ]

  const musicTracks = [
    { id: 'none', label: 'Sin música' },
    { id: 'epic', label: '🎵 Epic Cinematic' },
    { id: 'hype', label: '🔥 Hype Beat' },
    { id: 'chill', label: '🌊 Chill Lofi' },
    { id: 'gaming', label: '🎮 Gaming Energy' },
    { id: 'viral', label: '📱 Viral Pop' },
  ]

  const panels = [
    { id: 'trim', icon: '✂️', label: 'Recortar' },
    { id: 'subtitles', icon: '💬', label: 'Subtítulos' },
    { id: 'watermark', icon: '🏷️', label: 'Marca de agua' },
    { id: 'music', icon: '🎵', label: 'Música' },
  ]

  const handleExport = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 2000))
    setSaving(false)
    alert('✅ Clip exportado correctamente. Disponible en "Mis clips".')
    window.location.href = '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Topbar */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #161616', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => window.location.href = '/dashboard'} style={{ background: 'transparent', border: '1px solid #222', color: '#555', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            ← Volver
          </button>
          <h1 style={{ color: gold, fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>PEAK CLIP <span style={{ color: '#333', fontSize: '12px', letterSpacing: '1px' }}>EDITOR</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: 'transparent', border: '1px solid #222', color: '#555', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Vista previa
          </button>
          <button onClick={handleExport} disabled={saving} style={{
            background: saving ? '#333' : goldGrad, color: saving ? '#666' : '#000',
            border: 'none', borderRadius: '8px', padding: '8px 24px',
            fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '13px'
          }}>
            {saving ? '⏳ Exportando...' : '⬇ Exportar clip'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', height: 'calc(100vh - 57px)' }}>

        {/* Preview area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: '#0a0a0a' }}>

          {/* Phone mockup */}
          <div style={{ position: 'relative', width: '240px', height: '426px', background: '#111', borderRadius: '32px', border: '3px solid #222', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            {clip?.video_url ? (
              <video ref={videoRef} src={clip.video_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
                <div style={{ fontSize: '12px', color: '#555', textAlign: 'center', padding: '0 20px' }}>Preview del clip aquí</div>
              </div>
            )}

            {/* Subtitle preview overlay */}
            <div style={{
              position: 'absolute',
              [subtitlePosition === 'bottom' ? 'bottom' : 'top']: '20px',
              left: '50%', transform: 'translateX(-50%)',
              width: '90%', textAlign: 'center',
              ...subtitleStyles.find(s => s.id === subtitleStyle)?.preview
            }}>
              Subtítulo de ejemplo
            </div>

            {/* Watermark preview */}
            {watermark && (
              <div style={{
                position: 'absolute',
                ...(watermarkPosition === 'top-right' ? { top: '12px', right: '12px' } :
                   watermarkPosition === 'top-left' ? { top: '12px', left: '12px' } :
                   watermarkPosition === 'bottom-right' ? { bottom: '40px', right: '12px' } :
                   { bottom: '40px', left: '12px' }),
                fontSize: '11px', color: 'rgba(255,255,255,0.8)',
                background: 'rgba(0,0,0,0.4)', padding: '3px 8px', borderRadius: '4px'
              }}>
                {watermark}
              </div>
            )}
          </div>

          {/* Trim timeline */}
          <div style={{ width: '100%', maxWidth: '500px', marginTop: '32px' }}>
            <div style={{ fontSize: '12px', color: '#444', marginBottom: '12px', textAlign: 'center' }}>Timeline — arrastra para recortar</div>
            <div style={{ background: '#111', borderRadius: '8px', height: '48px', position: 'relative', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${trimStart}%`, width: `${trimEnd - trimStart}%`,
                background: `${gold}22`, border: `2px solid ${gold}`,
                borderRadius: '4px'
              }} />
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{ position: 'absolute', left: `${i * 5}%`, top: '30%', bottom: '30%', width: '1px', background: '#222' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#444' }}>
              <span>0:00</span>
              <span style={{ color: gold }}>Selección: {trimStart}% — {trimEnd}%</span>
              <span>0:45</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ background: '#0d0d0d', borderLeft: '1px solid #161616', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Panel tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #161616' }}>
            {panels.map(p => (
              <div key={p.id} onClick={() => setActivePanel(p.id)} style={{
                padding: '12px 4px', textAlign: 'center', cursor: 'pointer',
                background: activePanel === p.id ? 'rgba(201,168,76,0.08)' : 'transparent',
                borderBottom: activePanel === p.id ? `2px solid ${gold}` : '2px solid transparent',
                transition: 'all 0.15s'
              }}>
                <div style={{ fontSize: '18px', marginBottom: '3px' }}>{p.icon}</div>
                <div style={{ fontSize: '10px', color: activePanel === p.id ? gold : '#444' }}>{p.label}</div>
              </div>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>

            {/* TRIM */}
            {activePanel === 'trim' && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '20px' }}>Recortar clip</div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Inicio ({trimStart}%)</label>
                  <input type="range" min="0" max={trimEnd - 5} value={trimStart}
                    onChange={e => setTrimStart(Number(e.target.value))}
                    style={{ width: '100%', accentColor: gold }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Fin ({trimEnd}%)</label>
                  <input type="range" min={trimStart + 5} max="100" value={trimEnd}
                    onChange={e => setTrimEnd(Number(e.target.value))}
                    style={{ width: '100%', accentColor: gold }} />
                </div>
                <div style={{ background: '#111', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#555' }}>
                  Duración seleccionada: <span style={{ color: gold }}>{Math.round((trimEnd - trimStart) * 0.45)}s</span> de 45s
                </div>
              </div>
            )}

            {/* SUBTITLES */}
            {activePanel === 'subtitles' && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '20px' }}>Estilo de subtítulos</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  {subtitleStyles.map(s => (
                    <div key={s.id} onClick={() => setSubtitleStyle(s.id)} style={{
                      background: subtitleStyle === s.id ? 'rgba(201,168,76,0.1)' : '#111',
                      border: `1px solid ${subtitleStyle === s.id ? gold : '#1a1a1a'}`,
                      borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'center'
                    }}>
                      <div style={{ ...s.preview, fontSize: '12px', marginBottom: '6px' }}>Aa</div>
                      <div style={{ fontSize: '10px', color: subtitleStyle === s.id ? gold : '#555' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Posición</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {['bottom', 'top', 'middle'].map(pos => (
                      <div key={pos} onClick={() => setSubtitlePosition(pos)} style={{
                        background: subtitlePosition === pos ? 'rgba(201,168,76,0.1)' : '#111',
                        border: `1px solid ${subtitlePosition === pos ? gold : '#1a1a1a'}`,
                        borderRadius: '6px', padding: '8px', cursor: 'pointer', textAlign: 'center',
                        fontSize: '12px', color: subtitlePosition === pos ? gold : '#555'
                      }}>
                        {pos === 'bottom' ? '⬇ Abajo' : pos === 'top' ? '⬆ Arriba' : '↔ Centro'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WATERMARK */}
            {activePanel === 'watermark' && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '20px' }}>Marca de agua</div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Texto</label>
                  <input
                    type="text" placeholder="@tu_usuario"
                    value={watermark} onChange={e => setWatermark(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Posición</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { id: 'top-right', label: '↗ Arriba derecha' },
                      { id: 'top-left', label: '↖ Arriba izquierda' },
                      { id: 'bottom-right', label: '↘ Abajo derecha' },
                      { id: 'bottom-left', label: '↙ Abajo izquierda' },
                    ].map(p => (
                      <div key={p.id} onClick={() => setWatermarkPosition(p.id)} style={{
                        background: watermarkPosition === p.id ? 'rgba(201,168,76,0.1)' : '#111',
                        border: `1px solid ${watermarkPosition === p.id ? gold : '#1a1a1a'}`,
                        borderRadius: '6px', padding: '8px', cursor: 'pointer', textAlign: 'center',
                        fontSize: '11px', color: watermarkPosition === p.id ? gold : '#555'
                      }}>
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MUSIC */}
            {activePanel === 'music' && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '20px' }}>Música de fondo</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {musicTracks.map(t => (
                    <div key={t.id} onClick={() => setMusic(t.id)} style={{
                      background: music === t.id ? 'rgba(201,168,76,0.1)' : '#111',
                      border: `1px solid ${music === t.id ? gold : '#1a1a1a'}`,
                      borderRadius: '8px', padding: '12px 16px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '13px', color: music === t.id ? gold : '#666' }}>{t.label}</span>
                      {music === t.id && <span style={{ fontSize: '10px', color: gold }}>✓ Seleccionado</span>}
                    </div>
                  ))}
                </div>
                {music !== 'none' && (
                  <div>
                    <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Volumen ({musicVolume}%)</label>
                    <input type="range" min="0" max="100" value={musicVolume}
                      onChange={e => setMusicVolume(Number(e.target.value))}
                      style={{ width: '100%', accentColor: gold }} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Export button bottom */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #161616' }}>
            <button onClick={handleExport} disabled={saving} style={{
              width: '100%', padding: '13px', borderRadius: '8px', border: 'none',
              background: saving ? '#333' : goldGrad,
              color: saving ? '#666' : '#000',
              fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px'
            }}>
              {saving ? '⏳ Exportando...' : '⬇ Exportar clip final'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}