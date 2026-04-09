import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as factureService from '../../services/factureService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'

export default function FacturesPage() {
  const [factures, setFactures] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset } = useForm()

  const load = () => {
    setLoading(true)
    factureService.getAll()
      .then(setFactures)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openEdit = (f) => { reset(f); setEditing(f); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) await factureService.update(editing.id, {
        dateFacture: data.dateFacture,
        payee: data.payee === true || data.payee === 'true',
      })
      setShowModal(false)
      load()
    } catch { setError('Erreur lors de la sauvegarde') }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer cette facture ?')) return
    try { await factureService.remove(id); load() }
    catch { setError('Erreur de suppression') }
  }

  const payees = factures.filter(f => f.payee).length
  const nonPayees = factures.filter(f => !f.payee).length

  return (
    <PageLayout
      title="Factures"
      subtitle="Liste des factures émises"
      error={error} loading={loading}
    >
      {/* Résumé */}
      {!loading && (
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-6">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Total</p>
            <p className="text-2xl font-bold text-white">{factures.length}</p>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Payées</p>
            <p className="text-2xl font-bold text-emerald-400">{payees}</p>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Non payées</p>
            <p className="text-2xl font-bold text-amber-400">{nonPayees}</p>
          </div>
        </div>
      )}

      <Table
        // ✅ CORRIGÉ : colonnes selon le vrai DTO (id, dateFacture, payee, phaseId)
        headers={['ID', 'Phase ID', 'Date facture', 'Statut', 'Actions']}
        rows={factures}
        renderRow={(f) => (
          <tr key={f.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-slate-400 font-mono text-xs">FAC-{f.id}</td>
            <td className="px-4 py-3 text-slate-300">Phase #{f.phaseId}</td>
            {/* ✅ CORRIGÉ : dateFacture au lieu de dateEmission */}
            <td className="px-4 py-3 text-slate-400">{f.dateFacture || '—'}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-md border text-xs font-medium ${
                f.payee
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {f.payee ? 'Payée' : 'Non payée'}
              </span>
            </td>
            <td className="px-4 py-3">
              <ActionButtons onEdit={() => openEdit(f)} onDelete={() => onDelete(f.id)} />
            </td>
          </tr>
        )}
      />

      {showModal && (
        <Modal title="Modifier la facture" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Date de facturation">
              <input {...register('dateFacture')} type="date" className={inputCls} />
            </Field>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-900/40 rounded-lg">
              <input {...register('payee')} type="checkbox" className="w-4 h-4 rounded border-slate-600 text-indigo-500" />
              <span className="text-sm text-slate-300">Marquer comme payée</span>
            </label>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}