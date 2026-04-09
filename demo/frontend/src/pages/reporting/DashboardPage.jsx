import { useState, useEffect } from 'react'
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
        if (err?.response?.status !== 403) {
          setError('Impossible de charger le tableau de bord')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorCard message={error} />

  // ✅ CORRIGÉ : utilise les clés "nombre*" pour les compteurs
  // Le backend retourne : nombreProjetsEnCours, nombreProjetsClotures,
  // nombrePhasesTermineesNonFacturees, nombrePhasesFactureesNonPayees, nombrePhasesPayees
  const cards = stats ? [
    { label: 'Projets en cours',                value: stats.nombreProjetsEnCours ?? 0,               icon: '📁', color: 'indigo' },
    { label: 'Projets clôturés',                value: stats.nombreProjetsClotures ?? 0,              icon: '✅', color: 'emerald' },
    { label: 'Phases réalisées non facturées',  value: stats.nombrePhasesTermineesNonFacturees ?? 0,  icon: '⏳', color: 'amber' },
    { label: 'Phases facturées non payées',     value: stats.nombrePhasesFactureesNonPayees ?? 0,     icon: '🧾', color: 'orange' },
    { label: 'Phases payées',                   value: stats.nombrePhasesPayees ?? 0,                 icon: '💰', color: 'cyan' },
  ] : []

  const colorMap = {
    indigo:  'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    amber:   'bg-amber-500/10 border-amber-500/30 text-amber-400',
    orange:  'bg-orange-500/10 border-orange-500/30 text-orange-400',
    cyan:    'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Tableau de bord</h2>
      <p className="text-slate-400 text-sm mb-8">Vue d'ensemble de l'activité</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border p-6 ${colorMap[card.color]} hover:scale-[1.02] transition-transform duration-200 cursor-default`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-3xl font-bold text-white">{card.value}</span>
            </div>
            <p className="text-sm font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Accès rapide */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-white mb-4">Accès rapide</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Voir les projets',    path: '/projets' },
            { label: 'Gérer les employés',  path: '/employes' },
            { label: 'Factures',            path: '/factures' },
            { label: 'Organismes',          path: '/organismes' },
          ].map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )
}

function ErrorCard({ message }) {
  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
      <p className="text-red-400">⚠️ {message}</p>
    </div>
  )
}