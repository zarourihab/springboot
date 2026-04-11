import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard',       path: '/dashboard',  icon: '📊', roles: ['ADMIN', 'DIRECTEUR', 'COMPTABLE', 'CHEF_PROJET', 'SECRETAIRE'] },
  { label: 'Projets',         path: '/projets',    icon: '📁', roles: ['ADMIN', 'DIRECTEUR', 'CHEF_PROJET', 'SECRETAIRE', 'COMPTABLE'] },
  { label: 'Employés',        path: '/employes',   icon: '👥', roles: ['ADMIN', 'DIRECTEUR', 'CHEF_PROJET', 'SECRETAIRE', 'COMPTABLE'] },
  { label: 'Organismes',      path: '/organismes', icon: '🏢', roles: ['ADMIN', 'SECRETAIRE', 'DIRECTEUR'] },
  { label: 'Factures',        path: '/factures',   icon: '🧾', roles: ['ADMIN', 'COMPTABLE'] },
  { label: 'Profils & Rôles', path: '/profils',    icon: '🛡️', roles: ['ADMIN'] },
  { label: 'Reporting',       path: '/reporting',  icon: '📈', roles: ['ADMIN', 'DIRECTEUR', 'COMPTABLE'] },
]

export default function Sidebar() {
  const { role, userLogin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  // sécurité : role peut être null au premier rendu
  const visibleItems = navItems.filter((item) => role && item.roles.includes(role))

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, height: '100%', width: '260px',
      backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-sidebar)',
      display: 'flex', flexDirection: 'column', zIndex: 40, transition: 'background-color 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-sidebar)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>SP</div>
          <div>
            <h1 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '14px', margin: 0 }}>Suivi Projet</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {visibleItems.map((item) => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
              fontSize: '14px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s',
              backgroundColor: isActive ? 'var(--accent-bg)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.style.border.includes('var(--accent-border)')) {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-sidebar)' }}>
        <NavLink to="/profil"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 12px', borderRadius: '8px', marginBottom: '8px',
            textDecoration: 'none', backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
          })}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-bg)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '12px', fontWeight: 'bold' }}>
            {userLogin ? userLogin[0].toUpperCase() : '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '500', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userLogin}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>Mon profil</p>
          </div>
        </NavLink>
        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: 'var(--danger)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span>🚪</span> Déconnexion
        </button>
      </div>
    </aside>
  )
}