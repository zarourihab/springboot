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

  const openCreate = () => { reset({}); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      await documentService.create(projetId, data)
      setShowModal(false)
      load()
    } catch { setError('Erreur lors de l\'ajout') }
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
        headers={['Titre', 'Type', 'Date', 'Description', 'Actions']}
        rows={documents}
        renderRow={(d) => (
          <tr key={d.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-white font-medium">{d.titre}</td>
            <td className="px-4 py-3">
              <span className="px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-medium">{d.type}</span>
            </td>
            <td className="px-4 py-3 text-slate-400">{d.date}</td>
            <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{d.description}</td>
            <td className="px-4 py-3">
              <button onClick={() => onDelete(d.id)}
                className="px-3 py-1.5 text-xs text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all">
                Supprimer
              </button>
            </td>
          </tr>
        )}
      />
      {showModal && (
        <Modal title="Ajouter un document" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Titre" error={errors.titre?.message}>
              <input {...register('titre', { required: 'Requis' })} className={inputCls} placeholder="Titre du document" />
            </Field>
            <Field label="Type">
              <select {...register('type')} className={inputCls}>
                <option value="">-- Type --</option>
                <option value="CONTRAT">Contrat</option>
                <option value="AVENANT">Avenant</option>
                <option value="BON_COMMANDE">Bon de commande</option>
                <option value="RAPPORT">Rapport</option>
                <option value="AUTRE">Autre</option>
              </select>
            </Field>
            <Field label="Date">
              <input {...register('date')} type="date" className={inputCls} />
            </Field>
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
