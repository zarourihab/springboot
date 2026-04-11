import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as reportingService from '../../services/reportingService'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    reportingService.getTableauDeBord()
      .then(setStats)
      .catch((err) => {
        if (err?.response?.status !== 403) setError('Impossible de charger le tableau de bord')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorCard message={error} />

  const cards = stats ? [
    { label: 'Projets en cours',               value: stats.nombreProjetsEnCours ?? 0,              icon: '📁', color: '#4f46e5' },
    { label: 'Projets clôturés',               value: stats.nombreProjetsClotures ?? 0,             icon: '✅', color: '#059669' },
    { label: 'Phases réalisées non facturées', value: stats.nombrePhasesTermineesNonFacturees ?? 0, icon: '⏳', color: '#d97706' },
    { label: 'Phases facturées non payées',    value: stats.nombrePhasesFactureesNonPayees ?? 0,    icon: '🧾', color: '#ea580c' },
    { label: 'Phases payées',                  value: stats.nombrePhasesPayees ?? 0,                icon: '💰', color: '#0891b2' },
  ] : []

  // Données pour les graphiques
  const totalPhases =
    (stats?.nombrePhasesTermineesNonFacturees ?? 0) +
    (stats?.nombrePhasesFactureesNonPayees ?? 0) +
    (stats?.nombrePhasesPayees ?? 0)

  const donutData = [
    { label: 'Réalisées non facturées', value: stats?.nombrePhasesTermineesNonFacturees ?? 0, color: '#d97706' },
    { label: 'Facturées non payées',    value: stats?.nombrePhasesFactureesNonPayees ?? 0,    color: '#ea580c' },
    { label: 'Payées',                  value: stats?.nombrePhasesPayees ?? 0,                color: '#059669' },
  ]

  const barData = [
    { label: 'En cours',  value: stats?.nombreProjetsEnCours ?? 0,    color: '#4f46e5' },
    { label: 'Clôturés',  value: stats?.nombreProjetsClotures ?? 0,   color: '#059669' },
  ]

  return (
    <div>
      <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 22, margin: 0 }}>Tableau de bord</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, marginBottom: 28 }}>Vue d'ensemble de l'activité</p>

      {/* Cartes statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map((card) => (
          <div key={card.label} style={{
            backgroundColor: 'var(--bg-card)', border: `1px solid ${card.color}44`,
            borderRadius: 12, padding: '20px 22px', cursor: 'default',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{card.icon}</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: card.color }}>{card.value}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Graphique en barres — Projets */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>
            État des projets
          </h3>
          <BarChart data={barData} />
        </div>

        {/* Graphique donut — Phases */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>
            Suivi de facturation des phases
          </h3>
          <DonutChart data={donutData} total={totalPhases} />
        </div>

      </div>

      {/* Accès rapide */}
      <div>
        <h3 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Accès rapide</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { label: 'Voir les projets',   path: '/projets' },
            { label: 'Gérer les employés', path: '/employes' },
            { label: 'Factures',           path: '/factures' },
            { label: 'Organismes',         path: '/organismes' },
          ].map((btn) => (
            <button key={btn.path} onClick={() => navigate(btn.path)} style={{
              padding: '9px 18px', backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
              borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'var(--bg-input)' }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Graphique en barres horizontales ──────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {data.map((item) => (
        <div key={item.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.value}</span>
          </div>
          <div style={{ height: 10, backgroundColor: 'var(--bg-input)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${(item.value / max) * 100}%`,
              backgroundColor: item.color,
              transition: 'width 0.8s ease',
              minWidth: item.value > 0 ? 8 : 0,
            }} />
          </div>
        </div>
      ))}
      {/* Légende */}
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {data.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Graphique donut SVG ───────────────────────────────────────────────────────
function DonutChart({ data, total }) {
  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
        Aucune phase enregistrée
      </div>
    )
  }

  const cx = 90, cy = 90, r = 65, stroke = 28
  const circumference = 2 * Math.PI * r
  let cumul = 0

  const segments = data.map((item) => {
    const pct = item.value / total
    const dash = pct * circumference
    const gap = circumference - dash
    const offset = cumul * circumference
    cumul += pct
    return { ...item, pct, dash, gap, offset }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ flexShrink: 0 }}>
        {/* Fond */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-input)" strokeWidth={stroke} />
        {/* Segments */}
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset + circumference * 0.25}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px`, transition: 'stroke-dasharray 0.8s ease' }}
          />
        ))}
        {/* Total au centre */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-primary)">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--text-muted)">phases</text>
      </svg>

      {/* Légende */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {segments.map((seg) => (
          <div key={seg.label}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: seg.color }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{seg.label}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: seg.color }}>
                {seg.value} ({Math.round(seg.pct * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{ width: 36, height: 36, border: '2px solid var(--accent-bg)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ErrorCard({ message }) {
  return (
    <div style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
      <p style={{ color: 'var(--danger)', margin: 0 }}>⚠️ {message}</p>
    </div>
  )
}