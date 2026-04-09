import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as projetService from '../../services/projetService'
import * as organismeService from '../../services/organismeService'
import * as employeService from '../../services/employeService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'
import { useAuth } from '../../context/AuthContext'

export default function ProjetsPage() {
  const [projets, setProjets] = useState([])
  const [organismes, setOrganismes] = useState([])
  const [employes, setEmployes] = useState([])
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
    Promise.all([
      projetService.getAll(),
      employeService.getAll(),
      organismeService.getAll().catch(() => [])
    ])
      .then(([p, e, o]) => {
        setProjets(p)
        setEmployes(e)
        setOrganismes(o)
      })
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  // ✅ AJOUTÉ : useEffect manquant
  useEffect(() => { load() }, [])

  // ✅ AJOUTÉ : fonctions manquantes
  const openCreate = () => { reset({}); setEditing(null); setShowModal(true) }
  const openEdit = (p) => {
    reset({ ...p })
    setEditing(p)
    setShowModal(true)
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        organismeId: data.organismeId ? Number(data.organismeId) : null,
        chefProjetId: data.chefProjetId ? Number(data.chefProjetId) : null,
        montant: data.montant ? Number(data.montant) : null,
      }
      if (editing) await projetService.update(editing.id, payload)
      else await projetService.create(payload)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return
    try { await projetService.remove(id); load() }
    catch (err) { setError(err.response?.data?.message || 'Erreur lors de la suppression') }
  }

  const getOrganismeNom = (p) => {
    const o = organismes.find(o => o.id === p.organismeId)
    return o?.nom || '—'
  }

  return (
    <PageLayout
      title="Projets" subtitle="Gestion des projets"
      onAdd={canWrite ? openCreate : null}
      error={error} loading={loading}
    >
      <Table
        headers={['Code', 'Nom', 'Organisme', 'Date début', 'Date fin', 'Montant', 'Actions']}
        rows={projets}
        renderRow={(p) => (
          <tr key={p.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.code}</td>
            <td className="px-4 py-3 text-white font-medium">{p.nom}</td>
            <td className="px-4 py-3 text-slate-300">{getOrganismeNom(p)}</td>
            <td className="px-4 py-3 text-slate-400">{p.dateDebut || '—'}</td>
            <td className="px-4 py-3 text-slate-400">{p.dateFin || '—'}</td>
            <td className="px-4 py-3 text-cyan-400">{p.montant ? `${Number(p.montant).toLocaleString()} MAD` : '—'}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(`/projets/${p.id}/phases`)}
                  className="px-3 py-1.5 text-xs text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg transition-all">
                  Phases
                </button>
                <button onClick={() => navigate(`/projets/${p.id}/documents`)}
                  className="px-3 py-1.5 text-xs text-violet-400 hover:text-white bg-violet-500/10 hover:bg-violet-500/30 border border-violet-500/30 rounded-lg transition-all">
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
              <Field label="Montant (MAD)">
                <input {...register('montant')} type="number" className={inputCls} placeholder="100000" />
              </Field>
            </div>
            <Field label="Nom du projet" error={errors.nom?.message}>
              <input {...register('nom', { required: 'Requis' })} className={inputCls} placeholder="Nom du projet" />
            </Field>
            <Field label="Organisme">
              <select {...register('organismeId')} className={inputCls}>
                <option value="">-- Choisir --</option>
                {organismes.map((o) => <option key={o.id} value={o.id}>{o.nom}</option>)}
              </select>
            </Field>
            <Field label="Chef de projet">
              <select {...register('chefProjetId')} className={inputCls}>
                <option value="">-- Choisir --</option>
                {employes.map((e) => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
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