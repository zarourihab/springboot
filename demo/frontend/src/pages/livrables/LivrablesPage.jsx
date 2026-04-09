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
      subtitle="Livrables associés à cette phase"
      onAdd={openCreate}
      error={error} loading={loading}
    >
      <Table
        // ✅ CORRIGÉ : colonnes selon le vrai DTO (code, libelle, description, chemin)
        headers={['Code', 'Libellé', 'Description', 'Chemin/Fichier', 'Actions']}
        rows={livrables}
        renderRow={(l) => (
          <tr key={l.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{l.code}</td>
            <td className="px-4 py-3 text-white font-medium">{l.libelle}</td>
            <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{l.description || '—'}</td>
            <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-xs">{l.chemin || '—'}</td>
            <td className="px-4 py-3">
              <ActionButtons onEdit={() => openEdit(l)} onDelete={() => onDelete(l.id)} />
            </td>
          </tr>
        )}
      />
      {showModal && (
        <Modal title={editing ? 'Modifier le livrable' : 'Nouveau livrable'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ✅ CORRIGÉ : champs code + libelle + description + chemin */}
            <Field label="Code" error={errors.code?.message}>
              <input {...register('code', { required: 'Requis' })} className={inputCls} placeholder="LIV-001" />
            </Field>
            <Field label="Libellé" error={errors.libelle?.message}>
              <input {...register('libelle', { required: 'Requis' })} className={inputCls} placeholder="Nom du livrable" />
            </Field>
            <Field label="Description">
              <textarea {...register('description')} className={inputCls} rows="3" placeholder="Description..." />
            </Field>
            <Field label="Chemin / Fichier">
              <input {...register('chemin')} className={inputCls} placeholder="Ex: /docs/rapport.pdf" />
            </Field>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}