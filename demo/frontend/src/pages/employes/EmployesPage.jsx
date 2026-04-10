import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as employeService from '../../services/employeService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputCls } from '../organismes/OrganismesPage'
import { useAuth } from '../../context/AuthContext'
import { usePagination } from '../../hooks/useApi'
import Pagination from '../../components/Pagination'

const PROFILS = [
  { id: 1, label: 'ADMIN' },
  { id: 2, label: 'SECRETAIRE' },
  { id: 3, label: 'DIRECTEUR' },
  { id: 4, label: 'CHEF_PROJET' },
  { id: 5, label: 'COMPTABLE' },
]

const PAGE_SIZE = 8

export default function EmployesPage() {
  const [employes, setEmployes]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [showDispo, setShowDispo]       = useState(false)
  const [editing, setEditing]           = useState(null)
  const [error, setError]               = useState('')
  const [search, setSearch]             = useState('')
  const [dispoResult, setDispoResult]   = useState(null)
  const [dispoLoading, setDispoLoading] = useState(false)

  const { hasRole } = useAuth()
  const canWrite = hasRole('ADMIN')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { register: registerDispo, handleSubmit: handleDispo } = useForm()

  // Filtre côté client sur la liste chargée
  const filtered = employes.filter((e) => {
    const q = search.toLowerCase()
    return (
      !q ||
      e.matricule?.toLowerCase().includes(q) ||
      e.nom?.toLowerCase().includes(q) ||
      e.prenom?.toLowerCase().includes(q) ||
      e.login?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q)
    )
  })

  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE)

  const load = () => {
    setLoading(true)
    employeService.getAll()
      .then(setEmployes)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { reset({}); setEditing(null); setShowModal(true) }
  const openEdit   = (e) => { reset({ ...e, password: '' }); setEditing(e); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, profilId: data.profilId ? Number(data.profilId) : null }
      if (!payload.password) delete payload.password
      if (editing) await employeService.update(editing.id, payload)
      else         await employeService.create(payload)
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

  const onSearchDispo = async (data) => {
    setDispoLoading(true)
    try {
      const result = await employeService.getDisponibles(data.dateDebut, data.dateFin)
      setDispoResult(result)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur disponibilité')
    } finally {
      setDispoLoading(false)
    }
  }

  const getProfilLabel = (e) => {
    if (e.profilId) {
      const p = PROFILS.find((p) => p.id === e.profilId)
      return p?.label || String(e.profilId)
    }
    return '—'
  }

  return (
    <PageLayout
      title="Employés"
      subtitle="Gestion du personnel"
      onAdd={canWrite ? openCreate : null}
      error={error}
      loading={loading}
    >
      {/* Barre de recherche + bouton disponibilité */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Rechercher par matricule, nom, login, email…"
          className={inputCls + ' flex-1'}
        />
        <button
          onClick={() => { setShowDispo(true); setDispoResult(null) }}
          className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600/50 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all whitespace-nowrap"
        >
          Disponibilité
        </button>
      </div>

      <Table
        headers={['Matricule', 'Nom', 'Prénom', 'Login', 'Email', 'Profil', ...(canWrite ? ['Actions'] : [])]}
        rows={paginated}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal création / modification */}
      {showModal && (
        <Modal title={editing ? "Modifier l'employé" : 'Nouvel employé'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Matricule" error={errors.matricule?.message}>
                <input {...register('matricule', { required: 'Requis' })} className={inputCls} placeholder="EMP-001" />
              </Field>
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
            <Field label={editing ? 'Nouveau mot de passe (vide = inchangé)' : 'Mot de passe'} error={errors.password?.message}>
              <input
                {...register('password', { required: !editing ? 'Requis' : false })}
                type="password"
                className={inputCls}
                placeholder={editing ? 'Laisser vide pour ne pas changer' : 'Mot de passe'}
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

      {/* Modal disponibilité */}
      {showDispo && (
        <Modal title="Rechercher des employés disponibles" onClose={() => setShowDispo(false)}>
          <form onSubmit={handleDispo(onSearchDispo)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date début">
                <input {...registerDispo('dateDebut', { required: 'Requis' })} type="date" className={inputCls} />
              </Field>
              <Field label="Date fin">
                <input {...registerDispo('dateFin', { required: 'Requis' })} type="date" className={inputCls} />
              </Field>
            </div>
            <button
              type="submit"
              disabled={dispoLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {dispoLoading ? 'Recherche…' : 'Rechercher'}
            </button>
          </form>

          {dispoResult !== null && (
            <div className="mt-4">
              <p className="text-slate-400 text-sm mb-2">
                {dispoResult.length === 0
                  ? 'Aucun employé disponible sur cette période.'
                  : `${dispoResult.length} employé(s) disponible(s) :`}
              </p>
              {dispoResult.length > 0 && (
                <ul className="space-y-1">
                  {dispoResult.map((e) => (
                    <li key={e.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/30 text-sm">
                      <span className="text-slate-400 font-mono text-xs">{e.matricule}</span>
                      <span className="text-white">{e.nom} {e.prenom}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Modal>
      )}
    </PageLayout>
  )
}