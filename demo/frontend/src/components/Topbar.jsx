import { useLocation } from 'react-router-dom'

const routeLabels = {
  '/dashboard': 'Tableau de bord',
  '/reporting': 'Reporting',
  '/projets': 'Projets',
  '/employes': 'Employés',
  '/organismes': 'Organismes',
  '/factures': 'Factures',
}

export default function Topbar() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const label = routeLabels['/' + (segments[0] || '')] || 'Suivi Projet'

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center px-6 z-30">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <span className="text-slate-500">Accueil</span>
        <span className="text-slate-600">/</span>
        <span className="text-white font-medium">{label}</span>
      </div>
    </header>
  )
}
