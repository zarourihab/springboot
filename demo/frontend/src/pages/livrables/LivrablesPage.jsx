import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as livrableService from '../../services/livrableService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'

export default function LivrablesPage() {
  const { phaseId } = useParams()
  const [livrables, setLivrables] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setLoading(true)
    livrableService.getByPhase(phaseId)
      .then(setLivrables)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [phaseId])

  const openCreate = () => { reset({}); setEditing(null); setShowModal(true) }
  const openEdit = (l) => { reset(l); setEditing(l); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) await livrableService.update(editing.id, data)
      else await livrableService.create(phaseId, data)
      setShowModal(false)
      load()
    } catch { setError('Erreur lors de la sauvegarde') }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer ce livrable ?')) return
    try { await livrableService.remove(id); load() }
    catch { setError('Erreur de suppression') }
  }

  return (
    <PageLayout
      title={`Livrables — Phase #${phaseId}`}
      subtitle="Documents et livrables associés à cette phase"
      onAdd={openCreate}
      error={error} loading={loading}
    >
      <Table
        headers={['Désignation', 'Type', 'Date prévue', 'Date livraison', 'Statut', 'Actions']}
        rows={livrables}
        renderRow={(l) => (
          <tr key={l.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-white font-medium">{l.designation}</td>
            <td className="px-4 py-3 text-slate-400">{l.type}</td>
            <td className="px-4 py-3 text-slate-400">{l.datePrevue}</td>
            <td className="px-4 py-3 text-slate-400">{l.dateLivraison || '—'}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-md border text-xs font-medium ${l.livre ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
                {l.livre ? 'Livré' : 'En attente'}
              </span>
            </td>
            <td className="px-4 py-3">
              <ActionButtons onEdit={() => openEdit(l)} onDelete={() => onDelete(l.id)} />
            </td>
          </tr>
        )}
      />
      {showModal && (
        <Modal title={editing ? 'Modifier le livrable' : 'Nouveau livrable'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Désignation" error={errors.designation?.message}>
              <input {...register('designation', { required: 'Requis' })} className={inputCls} placeholder="Nom du livrable" />
            </Field>
            <Field label="Type">
              <input {...register('type')} className={inputCls} placeholder="Ex: Rapport, Prototype…" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date prévue">
                <input {...register('datePrevue')} type="date" className={inputCls} />
              </Field>
              <Field label="Date livraison">
                <input {...register('dateLivraison')} type="date" className={inputCls} />
              </Field>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('livre')} type="checkbox" className="rounded border-slate-600 text-indigo-500" />
              <span className="text-sm text-slate-300">Livré</span>
            </label>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}
