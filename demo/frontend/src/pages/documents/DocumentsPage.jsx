import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as documentService from '../../services/documentService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'

export default function DocumentsPage() {
  const { projetId } = useParams()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setLoading(true)
    documentService.getByProjet(projetId)
      .then(setDocuments)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [projetId])

  const openCreate = () => { reset({}); setEditing(null); setShowModal(true) }
  const openEdit = (d) => { reset(d); setEditing(d); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) await documentService.update(editing.id, data)
      else await documentService.create(projetId, data)
      setShowModal(false)
      load()
    } catch { setError("Erreur lors de l'ajout") }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer ce document ?')) return
    try { await documentService.remove(id); load() }
    catch { setError('Erreur de suppression') }
  }

  return (
    <PageLayout
      title={`Documents — Projet #${projetId}`}
      subtitle="Documents administratifs du projet"
      onAdd={openCreate}
      error={error} loading={loading}
    >
      <Table
        // ✅ CORRIGÉ : colonnes selon le vrai DTO (code, libelle, description, chemin)
        headers={['Code', 'Libellé', 'Description', 'Chemin/Fichier', 'Actions']}
        rows={documents}
        renderRow={(d) => (
          <tr key={d.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{d.code}</td>
            <td className="px-4 py-3 text-white font-medium">{d.libelle}</td>
            <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{d.description || '—'}</td>
            <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-xs">{d.chemin || '—'}</td>
            <td className="px-4 py-3">
              <ActionButtons onEdit={() => openEdit(d)} onDelete={() => onDelete(d.id)} />
            </td>
          </tr>
        )}
      />
      {showModal && (
        <Modal title={editing ? 'Modifier le document' : 'Nouveau document'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ✅ CORRIGÉ : champs code + libelle + description + chemin */}
            <Field label="Code" error={errors.code?.message}>
              <input {...register('code', { required: 'Requis' })} className={inputCls} placeholder="DOC-001" />
            </Field>
            <Field label="Libellé" error={errors.libelle?.message}>
              <input {...register('libelle', { required: 'Requis' })} className={inputCls} placeholder="Intitulé du document" />
            </Field>
            <Field label="Description">
              <textarea {...register('description')} className={inputCls} rows="3" placeholder="Description..." />
            </Field>
            <Field label="Chemin / Fichier">
              <input {...register('chemin')} className={inputCls} placeholder="Ex: /docs/contrat.pdf" />
            </Field>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}