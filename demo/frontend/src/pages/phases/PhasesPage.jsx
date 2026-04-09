import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import * as phaseService from '../../services/phaseService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'
import * as factureService from '../../services/factureService'

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
      const payload = { ...data, montant: data.montant ? Number(data.montant) : null }
      if (editing) await phaseService.update(editing.id, payload)
      else await phaseService.create(projetId, payload)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer cette phase ?')) return
    try { await phaseService.remove(id); load() }
    catch { setError('Erreur de suppression') }
  }

  const handlePatch = async (action, id) => {
    try {
      if (action === 'facturation') {
        // ✅ D'abord PATCH l'état facturation
        await phaseService.facturer(id)
        // ✅ Ensuite créer la vraie facture
        await factureService.create(id, {
          dateFacture: new Date().toISOString().split('T')[0],
          payee: false
        })
      } else if (action === 'realisation') {
        await phaseService.realiser(id)
      } else if (action === 'paiement') {
        await phaseService.payer(id)
      }
      load()
    } catch (err) {
      setError(`Erreur lors de l'action ${action}`)
    }
  }

  return (
    <PageLayout
      title={`Phases — Projet #${projetId}`}
      subtitle="Gestion des phases et suivi de réalisation"
      onAdd={openCreate}
      error={error} loading={loading}
    >
      <Table
        headers={['Code', 'Libellé', 'Début', 'Fin', 'Montant', 'Réal.', 'Fact.', 'Paie.', 'Actions']}
        rows={phases}
        renderRow={(p) => (
          <tr key={p.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-3 py-3 text-slate-400 font-mono text-xs">{p.code}</td>
            {/* ✅ CORRIGÉ : p.libelle au lieu de p.intitule */}
            <td className="px-3 py-3 text-white font-medium">{p.libelle}</td>
            <td className="px-3 py-3 text-slate-400 text-xs">{p.dateDebut || '—'}</td>
            <td className="px-3 py-3 text-slate-400 text-xs">{p.dateFin || '—'}</td>
            <td className="px-3 py-3 text-slate-300">{p.montant ? `${Number(p.montant).toLocaleString()}` : '—'}</td>
            {/* ✅ CORRIGÉ : etatRealisation au lieu de realisee */}
            <td className="px-2 py-3">
              <button onClick={() => handlePatch('realisation', p.id)} disabled={p.etatRealisation}
                className="px-2 py-1 text-xs rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {p.etatRealisation ? '✅' : 'Réal.'}
              </button>
            </td>
            <td className="px-2 py-3">
              <button onClick={() => handlePatch('facturation', p.id)} disabled={!p.etatRealisation || p.etatFacturation}
                className="px-2 py-1 text-xs rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {p.etatFacturation ? '✅' : 'Fact.'}
              </button>
            </td>
            <td className="px-2 py-3">
              <button onClick={() => handlePatch('paiement', p.id)} disabled={!p.etatFacturation || p.etatPaiement}
                className="px-2 py-1 text-xs rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {p.etatPaiement ? '✅' : 'Paie.'}
              </button>
            </td>
            <td className="px-2 py-3">
              <div className="flex items-center gap-1">
                <button onClick={() => navigate(`/phases/${p.id}/affectations`)}
                  className="px-2 py-1 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 rounded-lg transition-all">Aff.</button>
                <button onClick={() => navigate(`/phases/${p.id}/livrables`)}
                  className="px-2 py-1 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 rounded-lg transition-all">Livr.</button>
                <ActionButtons onEdit={() => openEdit(p)} onDelete={() => onDelete(p.id)} />
              </div>
            </td>
          </tr>
        )}
      />
      {showModal && (
        <Modal title={editing ? 'Modifier la phase' : 'Nouvelle phase'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Code" error={errors.code?.message}>
                <input {...register('code', { required: 'Requis' })} className={inputCls} placeholder="PH-001" />
              </Field>
              <Field label="Montant (MAD)">
                <input {...register('montant')} type="number" className={inputCls} placeholder="50000" />
              </Field>
            </div>
            {/* ✅ CORRIGÉ : champ libelle */}
            <Field label="Libellé" error={errors.libelle?.message}>
              <input {...register('libelle', { required: 'Requis' })} className={inputCls} placeholder="Libellé de la phase" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date début" error={errors.dateDebut?.message}>
                <input {...register('dateDebut', { required: 'Requis' })} type="date" className={inputCls} />
              </Field>
              <Field label="Date fin" error={errors.dateFin?.message}>
                <input {...register('dateFin', { required: 'Requis' })} type="date" className={inputCls} />
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