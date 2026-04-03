import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import * as phaseService from '../../services/phaseService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'

export default function PhasesPage() {
  const { projetId } = useParams()
  const navigate = useNavigate()
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setLoading(true)
    phaseService.getByProjet(projetId)
      .then(setPhases)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [projetId])

  const openCreate = () => { reset({}); setEditing(null); setShowModal(true) }
  const openEdit = (p) => { reset(p); setEditing(p); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) await phaseService.update(editing.id, data)
      else await phaseService.create(projetId, data)
      setShowModal(false)
      load()
    } catch { setError('Erreur lors de la sauvegarde') }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer cette phase ?')) return
    try { await phaseService.remove(id); load() }
    catch { setError('Erreur de suppression') }
  }

  const handlePatch = async (action, id) => {
    const actions = {
      realisation: phaseService.realiser,
      facturation: phaseService.facturer,
      paiement: phaseService.payer,
    }
    try { await actions[action](id); load() }
    catch { setError(`Erreur lors du patch ${action}`) }
  }

  const statutColor = (s) => {
    if (s === 'REALISEE') return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    if (s === 'FACTUREE') return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    if (s === 'PAYEE') return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
    return 'bg-slate-500/10 border-slate-500/30 text-slate-400'
  }

  return (
    <PageLayout
      title={`Phases — Projet #${projetId}`}
      subtitle="Gestion des phases et suivi de réalisation"
      onAdd={openCreate}
      error={error} loading={loading}
    >
      <Table
        headers={['Intitulé', 'Délai', 'Montant', 'Statut', 'Réalisation', 'Facturation', 'Paiement', 'Actions']}
        rows={phases}
        renderRow={(p) => (
          <tr key={p.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-white font-medium">{p.intitule}</td>
            <td className="px-4 py-3 text-slate-400">{p.delai} j</td>
            <td className="px-4 py-3 text-slate-300">{p.montant?.toLocaleString()} MAD</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-md border text-xs font-medium ${statutColor(p.statut)}`}>{p.statut || '—'}</span>
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => handlePatch('realisation', p.id)}
                disabled={p.realisee}
                className="px-2 py-1 text-xs rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {p.realisee ? '✅' : 'Réaliser'}
              </button>
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => handlePatch('facturation', p.id)}
                disabled={!p.realisee || p.facturee}
                className="px-2 py-1 text-xs rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {p.facturee ? '✅' : 'Facturer'}
              </button>
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => handlePatch('paiement', p.id)}
                disabled={!p.facturee || p.payee}
                className="px-2 py-1 text-xs rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {p.payee ? '✅' : 'Payer'}
              </button>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1.5">
                <button onClick={() => navigate(`/phases/${p.id}/affectations`)}
                  className="px-2 py-1.5 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 rounded-lg transition-all">
                  Affec.
                </button>
                <button onClick={() => navigate(`/phases/${p.id}/livrables`)}
                  className="px-2 py-1.5 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 rounded-lg transition-all">
                  Livr.
                </button>
                <ActionButtons onEdit={() => openEdit(p)} onDelete={() => onDelete(p.id)} />
              </div>
            </td>
          </tr>
        )}
      />
      {showModal && (
        <Modal title={editing ? 'Modifier la phase' : 'Nouvelle phase'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Intitulé" error={errors.intitule?.message}>
              <input {...register('intitule', { required: 'Requis' })} className={inputCls} placeholder="Intitulé de la phase" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Délai (jours)" error={errors.delai?.message}>
                <input {...register('delai', { required: 'Requis', valueAsNumber: true })} type="number" className={inputCls} placeholder="30" />
              </Field>
              <Field label="Montant (MAD)">
                <input {...register('montant', { valueAsNumber: true })} type="number" className={inputCls} placeholder="50000" />
              </Field>
            </div>
            <Field label="Description">
              <textarea {...register('description')} className={inputCls} rows="3" />
            </Field>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}
