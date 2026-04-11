import { useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const routeLabels = {
  '/dashboard':  'Tableau de bord',
  '/reporting':  'Reporting',
  '/projets':    'Projets',
  '/employes':   'Employés',
  '/organismes': 'Organismes',
  '/factures':   'Factures',
  '/profil':     'Mon profil',
}

export default function Topbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const segments = location.pathname.split('/').filter(Boolean)
  const label = routeLabels['/' + (segments[0] || '')] || 'Suivi Projet'

  return (
    <header style={{
      position: 'fixed', top: 0, left: '260px', right: 0, height: '64px',
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-sidebar)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', zIndex: 30,
      backdropFilter: 'blur(8px)',
      transition: 'background-color 0.3s ease',
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <span style={{ color: 'var(--text-muted)' }}>Accueil</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{label}</span>
      </div>

      {/* Toggle thème */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '7px 14px', borderRadius: '8px', fontSize: '13px',
          fontWeight: '500', cursor: 'pointer', border: '1px solid var(--border-color)',
          backgroundColor: 'var(--accent-bg)', color: 'var(--text-primary)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-bg)'}
      >
        <span style={{ fontSize: '16px' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
        {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      </button>
    </header>
  )
}