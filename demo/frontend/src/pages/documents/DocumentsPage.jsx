import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as documentService from '../../services/documentService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'

export default function DocumentsPage() {
  const { projetId } = useParams()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [error, setError]         = useState('')
  const [downloading, setDownloading] = useState(null)

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
  const openEdit   = (d) => { reset(d); setEditing(d); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) await documentService.update(editing.id, data)
      else         await documentService.create(projetId, data)
      setShowModal(false)
      load()
    } catch { setError("Erreur lors de l'ajout") }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer ce document ?')) return
    try { await documentService.remove(id); load() }
    catch { setError('Erreur de suppression') }
  }

  const onDownload = async (d) => {
    setDownloading(d.id)
    try {
      const filename = d.chemin ? d.chemin.split('/').pop() : `${d.code}.pdf`
      await documentService.download(d.id, filename)
    } catch {
      setError('Erreur lors du téléchargement')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <PageLayout
      title={`Documents — Projet #${projetId}`}
      subtitle="Documents administratifs du projet"
      onAdd={openCreate}
      error={error}
      loading={loading}
    >
      <Table
        headers={['Code', 'Libellé', 'Description', 'Chemin/Fichier', 'Actions']}
        rows={documents}
        renderRow={(d) => (
          <tr key={d.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{d.code}</td>
            <td className="px-4 py-3 text-white font-medium">{d.libelle}</td>
            <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{d.description || '—'}</td>
            <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-xs">{d.chemin || '—'}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                {/* Bouton télécharger */}
                <button
                  onClick={() => onDownload(d)}
                  disabled={downloading === d.id}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-emerald-900/30 hover:bg-emerald-800/50 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
                >
                  {downloading === d.id ? '...' : '⬇ Télécharger'}
                </button>
                <ActionButtons onEdit={() => openEdit(d)} onDelete={() => onDelete(d.id)} />
              </div>
            </td>
          </tr>
        )}
      />

      {showModal && (
        <Modal title={editing ? 'Modifier le document' : 'Nouveau document'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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