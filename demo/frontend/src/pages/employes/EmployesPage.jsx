import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as employeService from '../../services/employeService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'
import { useAuth } from '../../context/AuthContext'

// ✅ IDs des profils créés par DataInitializer dans l'ordre
const PROFILS = [
  { id: 1, label: 'ADMIN' },
  { id: 2, label: 'SECRETAIRE' },
  { id: 3, label: 'DIRECTEUR' },
  { id: 4, label: 'CHEF_PROJET' },
  { id: 5, label: 'COMPTABLE' },
]

export default function EmployesPage() {
  const [employes, setEmployes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const { hasRole } = useAuth()
  const canWrite = hasRole('ADMIN')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setLoading(true)
    employeService.getAll()
      .then(setEmployes)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { reset({}); setEditing(null); setShowModal(true) }
  const openEdit = (e) => {
    reset({ ...e, password: '' })
    setEditing(e)
    setShowModal(true)
  }

  const onSubmit = async (data) => {
    try {
      // ✅ CORRIGÉ : envoie profilId comme nombre
      const payload = { ...data, profilId: data.profilId ? Number(data.profilId) : null }
      if (!payload.password) delete payload.password
      if (editing) await employeService.update(editing.id, payload)
      else await employeService.create(payload)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer cet employé ?')) return
    try { await employeService.remove(id); load() }
    catch { setError('Erreur lors de la suppression') }
  }

  const getProfilLabel = (e) => {
    if (e.profilId) {
      const p = PROFILS.find(p => p.id === e.profilId)
      return p?.label || e.profilId
    }
    return '—'
  }

  return (
    <PageLayout
      title="Employés" subtitle="Gestion du personnel"
      onAdd={canWrite ? openCreate : null}
      error={error} loading={loading}
    >
      <Table
        headers={['Matricule', 'Nom', 'Prénom', 'Login', 'Email', 'Profil', ...(canWrite ? ['Actions'] : [])]}
        rows={employes}
        renderRow={(e) => (
          <tr key={e.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{e.matricule}</td>
            <td className="px-4 py-3 text-white font-medium">{e.nom}</td>
            <td className="px-4 py-3 text-slate-300">{e.prenom}</td>
            <td className="px-4 py-3 text-slate-400">{e.login}</td>
            <td className="px-4 py-3 text-slate-400">{e.email}</td>
            <td className="px-4 py-3">
              <span className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
                {getProfilLabel(e)}
              </span>
            </td>
            {canWrite && (
              <td className="px-4 py-3">
                <ActionButtons onEdit={() => openEdit(e)} onDelete={() => onDelete(e.id)} />
              </td>
            )}
          </tr>
        )}
      />
      {showModal && (
        <Modal title={editing ? "Modifier l'employé" : 'Nouvel employé'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Matricule" error={errors.matricule?.message}>
                <input {...register('matricule', { required: 'Requis' })} className={inputCls} placeholder="EMP-001" />
              </Field>
              {/* ✅ CORRIGÉ : liste déroulante avec ID numérique */}
              <Field label="Profil" error={errors.profilId?.message}>
                <select {...register('profilId', { required: 'Requis' })} className={inputCls}>
                  <option value="">-- Choisir un profil --</option>
                  {PROFILS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nom" error={errors.nom?.message}>
                <input {...register('nom', { required: 'Requis' })} className={inputCls} placeholder="Nom" />
              </Field>
              <Field label="Prénom">
                <input {...register('prenom')} className={inputCls} placeholder="Prénom" />
              </Field>
            </div>
            <Field label="Login" error={errors.login?.message}>
              <input {...register('login', { required: 'Requis' })} className={inputCls} placeholder="Login de connexion" />
            </Field>
            <Field label={editing ? "Nouveau mot de passe (laisser vide = inchangé)" : "Mot de passe"} error={errors.password?.message}>
              <input
                {...register('password', { required: !editing ? 'Requis' : false })}
                type="password"
                className={inputCls}
                placeholder={editing ? "Laisser vide pour ne pas changer" : "Mot de passe"}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <input {...register('email')} type="email" className={inputCls} placeholder="email@..." />
              </Field>
              <Field label="Téléphone">
                <input {...register('telephone')} className={inputCls} placeholder="0600000000" />
              </Field>
            </div>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}