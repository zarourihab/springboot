import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '📊',
    roles: ['ADMIN', 'DIRECTEUR', 'COMPTABLE', 'CHEF_PROJET', 'SECRETAIRE'],
  },
  {
    label: 'Projets',
    path: '/projets',
    icon: '📁',
    roles: ['ADMIN', 'DIRECTEUR', 'CHEF_PROJET', 'SECRETAIRE', 'COMPTABLE'],
  },
  {
    label: 'Employés',
    path: '/employes',
    icon: '👥',
    roles: ['ADMIN', 'DIRECTEUR', 'CHEF_PROJET', 'SECRETAIRE', 'COMPTABLE'],
  },
  {
    label: 'Organismes',
    path: '/organismes',
    icon: '🏢',
    roles: ['ADMIN', 'SECRETAIRE', 'DIRECTEUR'],
  },
  {
    label: 'Factures',
    path: '/factures',
    icon: '🧾',
    roles: ['ADMIN', 'COMPTABLE'],
  },
  {
    label: 'Reporting',
    path: '/reporting',
    icon: '📈',
    roles: ['ADMIN', 'DIRECTEUR', 'COMPTABLE'],
  },
]

export default function Sidebar() {
  const { role, userLogin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700/50 flex flex-col z-40">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
            SP
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Suivi Projet</h1>
            <p className="text-slate-400 text-xs">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/*  User — cliquable vers /profil */}
      <div className="p-4 border-t border-slate-700/50">
        <NavLink
          to="/profil"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 mb-2 rounded-lg transition-colors ${
              isActive ? 'bg-slate-700/50' : 'hover:bg-slate-800'
            }`
          }
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xs font-bold">
            {userLogin ? userLogin[0].toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{userLogin}</p>
            <p className="text-slate-500 text-xs">Mon profil</p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
        >
          <span>🚪</span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}