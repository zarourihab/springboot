import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as affectationService from '../../services/affectationService'
import * as employeService from '../../services/employeService'
import { PageLayout, Table } from '../organismes/OrganismesPage'

export default function AffectationsPage() {
  const { phaseId } = useParams()
  const [affectes, setAffectes] = useState([])
  const [tous, setTous] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      affectationService.getByPhase(phaseId),
      employeService.getAll()
    ])
      .then(([a, e]) => { setAffectes(a); setTous(e) })
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [phaseId])

  const affectesIds = new Set(affectes.map((a) => a.id || a.employeId))

  const handleAdd = async (employeId) => {
    try { await affectationService.add(phaseId, employeId); load() }
    catch { setError('Erreur lors de l\'affectation') }
  }

  const handleRemove = async (employeId) => {
    try { await affectationService.remove(phaseId, employeId); load() }
    catch { setError('Erreur lors du retrait') }
  }

  const nonAffectes = tous.filter((e) => !affectesIds.has(e.id))

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Affectations — Phase #{phaseId}</h2>
      <p className="text-slate-400 text-sm mb-8">Gérer les employés affectés à cette phase</p>
      {error && <div className="mb-4 bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">⚠️ {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Affectés */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <h3 className="text-white font-semibold">✅ Employés affectés ({affectes.length})</h3>
          </div>
          <div className="p-4 space-y-2">
            {loading ? <Spinner /> : affectes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">Aucun employé affecté</p>
            ) : affectes.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-white text-sm font-medium">{e.nom} {e.prenom}</span>
                <button
                  onClick={() => handleRemove(e.id)}
                  className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-2.5 py-1 rounded-md transition-all"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Disponibles */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <h3 className="text-white font-semibold">👥 Employés disponibles ({nonAffectes.length})</h3>
          </div>
          <div className="p-4 space-y-2">
            {loading ? <Spinner /> : nonAffectes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">Tous les employés sont affectés</p>
            ) : nonAffectes.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300 text-sm">{e.nom} {e.prenom}</span>
                <button
                  onClick={() => handleAdd(e.id)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-md transition-all"
                >
                  Affecter
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>
}
