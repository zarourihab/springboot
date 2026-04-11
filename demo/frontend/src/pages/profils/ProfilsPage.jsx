import { useState, useEffect } from 'react'
import * as profilService from '../../services/profilService'

const roleConfig = {
  ADMIN:       { icon: '🛡️', color: '#4f46e5', bg: '#4f46e520', border: '#4f46e544' },
  SECRETAIRE:  { icon: '📋', color: '#0891b2', bg: '#0891b220', border: '#0891b244' },
  DIRECTEUR:   { icon: '👔', color: '#7c3aed', bg: '#7c3aed20', border: '#7c3aed44' },
  CHEF_PROJET: { icon: '🎯', color: '#059669', bg: '#05966920', border: '#05966944' },
  COMPTABLE:   { icon: '💼', color: '#d97706', bg: '#d9770620', border: '#d9770644' },
}

const defaultCfg = { icon: '👤', color: '#64748b', bg: '#64748b20', border: '#64748b44' }

export default function ProfilsPage() {
  const [profils, setProfils]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    profilService.getAll()
      .then((data) => {
        // sécurité : on s'assure que c'est bien un tableau
        setProfils(Array.isArray(data) ? data : [])
      })
      .catch(() => setError('Erreur de chargement des profils'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = profils.filter((p) => {
    const q = search.toLowerCase()
    return !q || p.libelle?.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q)
  })

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--accent-bg)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 22, margin: 0 }}>Profils & Rôles</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Niveaux d'accès définis dans l'application</p>
      </div>

      <div style={{ marginBottom: 24, maxWidth: 360 }}>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par libellé ou code…"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 13, backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 8, color: 'var(--danger)', fontSize: 13 }}>{error}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
        {filtered.map((profil) => {
          const cfg = roleConfig[profil.code] || defaultCfg
          return (
            <div key={profil.id} style={{
              backgroundColor: 'var(--bg-card)', border: `1px solid ${cfg.border}`,
              borderRadius: 14, padding: 24, position: 'relative', overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.color}22` }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Badge code */}
              <div style={{ position: 'absolute', top: 14, right: 14, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99 }}>
                {profil.code?.slice(0, 6)}
              </div>

              {/* Icône */}
              <div style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
                {cfg.icon}
              </div>

              {/* Libellé */}
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {profil.libelle}
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                # ID #{profil.id} · {profil.code}
              </p>

              {/* Barre colorée */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: cfg.color, opacity: 0.6 }} />
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 14 }}>Aucun profil trouvé.</div>
      )}
    </div>
  )
}