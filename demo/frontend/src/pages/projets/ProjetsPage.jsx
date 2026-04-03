import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as projetService from '../../services/projetService'
import * as organismeService from '../../services/organismeService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'
import { useAuth } from '../../context/AuthContext'

export default function ProjetsPage() {
  const [projets, setProjets] = useState([])
  const [organismes, setOrganismes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const { hasRole } = useAuth()
  const canWrite = hasRole('ADMIN', 'SECRETAIRE')
  const navigate = useNavigate()

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setLoading(true)
    Promise.all([projetService.getAll(), organismeService.getAll()])
      .then(([p, o]) => { setProjets(p); setOrganismes(o) })
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { reset({ statut: 'EN_COURS' }); setEditing(null); setShowModal(true) }
  const openEdit = (p) => { reset({ ...p, organismeId: p.organisme?.id }); setEditing(p); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) await projetService.update(editing.id, data)
      else await projetService.create(data)
      setShowModal(false)
      load()
    } catch { setError('Erreur lors de la sauvegarde') }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return
    try { await projetService.remove(id); load() }
    catch { setError('Erreur lors de la suppression') }
  }

  const statutColor = {
    EN_COURS: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    CLOTURE: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    SUSPENDU: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  }

  return (
    <PageLayout
      title="Projets" subtitle="Gestion des projets"
      onAdd={canWrite ? openCreate : null}
      error={error} loading={loading}
    >
      <Table
        headers={['Code', 'Intitulé', 'Organisme', 'Statut', 'Date début', 'Actions']}
        rows={projets}
        renderRow={(p) => (
          <tr key={p.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.code}</td>
            <td className="px-4 py-3 text-white font-medium">{p.intitule}</td>
            <td className="px-4 py-3 text-slate-300">{p.organisme?.nom || '—'}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-md border text-xs font-medium ${statutColor[p.statut] || 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
                {p.statut}
              </span>
            </td>
            <td className="px-4 py-3 text-slate-400">{p.dateDebut}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/projets/${p.id}/phases`)}
                  className="px-3 py-1.5 text-xs text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg transition-all"
                >
                  Phases
                </button>
                <button
                  onClick={() => navigate(`/projets/${p.id}/documents`)}
                  className="px-3 py-1.5 text-xs text-violet-400 hover:text-white bg-violet-500/10 hover:bg-violet-500/30 border border-violet-500/30 rounded-lg transition-all"
                >
                  Docs
                </button>
                {canWrite && <ActionButtons onEdit={() => openEdit(p)} onDelete={() => onDelete(p.id)} />}
              </div>
            </td>
          </tr>
        )}
      />
      {showModal && (
        <Modal title={editing ? 'Modifier le projet' : 'Nouveau projet'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Code" error={errors.code?.message}>
                <input {...register('code', { required: 'Requis' })} className={inputCls} placeholder="PRJ-001" />
              </Field>
              <Field label="Statut">
                <select {...register('statut')} className={inputCls}>
                  <option value="EN_COURS">EN_COURS</option>
                  <option value="CLOTURE">CLOTURE</option>
                  <option value="SUSPENDU">SUSPENDU</option>
                </select>
              </Field>
            </div>
            <Field label="Intitulé" error={errors.intitule?.message}>
              <input {...register('intitule', { required: 'Requis' })} className={inputCls} placeholder="Intitulé du projet" />
            </Field>
            <Field label="Organisme">
              <select {...register('organismeId')} className={inputCls}>
                <option value="">-- Choisir --</option>
                {organismes.map((o) => <option key={o.id} value={o.id}>{o.nom}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date début">
                <input {...register('dateDebut')} type="date" className={inputCls} />
              </Field>
              <Field label="Date fin">
                <input {...register('dateFin')} type="date" className={inputCls} />
              </Field>
            </div>
            <Field label="Description">
              <textarea {...register('description')} className={inputCls} rows="3" placeholder="Description…" />
            </Field>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}
