import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as employeService from '../../services/employeService'
import { PageLayout, Table, Modal, Field, ModalActions, ActionButtons, inputStyle, tdStyle } from '../organismes/OrganismesPage'
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

  const filtered = employes.filter((e) => {
    const q = search.toLowerCase()
    return !q || e.matricule?.toLowerCase().includes(q) || e.nom?.toLowerCase().includes(q) || e.prenom?.toLowerCase().includes(q) || e.login?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q)
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
      setShowModal(false); load()
    } catch (err) { setError(err.response?.data?.message || 'Erreur lors de la sauvegarde') }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer cet employé ?')) return
    try { await employeService.remove(id); load() }
    catch { setError('Erreur lors de la suppression') }
  }

  const onSearchDispo = async (data) => {
    setDispoLoading(true)
    try { setDispoResult(await employeService.getDisponibles(data.dateDebut, data.dateFin)) }
    catch (err) { setError(err.response?.data?.message || 'Erreur disponibilité') }
    finally { setDispoLoading(false) }
  }

  const getProfilLabel = (e) => {
    if (e.profilId) { const p = PROFILS.find((p) => p.id === e.profilId); return p?.label || String(e.profilId) }
    return '—'
  }

  const badgeStyle = {
    padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600',
    backgroundColor: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)',
  }

  return (
    <PageLayout title="Employés" subtitle="Gestion du personnel" onAdd={canWrite ? openCreate : null} error={error} loading={loading}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Rechercher par matricule, nom, login, email…" style={{ ...inputStyle, flex: 1 }} />
        <button onClick={() => { setShowDispo(true); setDispoResult(null) }}
          style={{ padding: '10px 16px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
          Disponibilité
        </button>
      </div>

      <Table
        headers={['Matricule', 'Nom', 'Prénom', 'Login', 'Email', 'Profil', ...(canWrite ? ['Actions'] : [])]}
        rows={paginated}
        renderRow={(e) => (
          <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
            onMouseEnter={(ev) => ev.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseLeave={(ev) => ev.currentTarget.style.backgroundColor = 'transparent'}>
            <td style={tdStyle}><span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{e.matricule}</span></td>
            <td style={{ ...tdStyle, color: 'var(--text-primary)', fontWeight: '500' }}>{e.nom}</td>
            <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{e.prenom}</td>
            <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{e.login}</td>
            <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{e.email}</td>
            <td style={tdStyle}><span style={badgeStyle}>{getProfilLabel(e)}</span></td>
            {canWrite && <td style={tdStyle}><ActionButtons onEdit={() => openEdit(e)} onDelete={() => onDelete(e.id)} /></td>}
          </tr>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal création/modification */}
      {showModal && (
        <Modal title={editing ? "Modifier l'employé" : 'Nouvel employé'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Matricule" error={errors.matricule?.message}>
                <input {...register('matricule', { required: 'Requis' })} style={inputStyle} placeholder="EMP-001" />
              </Field>
              <Field label="Profil" error={errors.profilId?.message}>
                <select {...register('profilId', { required: 'Requis' })} style={inputStyle}>
                  <option value="">-- Choisir --</option>
                  {PROFILS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Nom" error={errors.nom?.message}>
                <input {...register('nom', { required: 'Requis' })} style={inputStyle} placeholder="Nom" />
              </Field>
              <Field label="Prénom">
                <input {...register('prenom')} style={inputStyle} placeholder="Prénom" />
              </Field>
            </div>
            <Field label="Login" error={errors.login?.message}>
              <input {...register('login', { required: 'Requis' })} style={inputStyle} placeholder="Login" />
            </Field>
            <Field label={editing ? 'Nouveau mot de passe (vide = inchangé)' : 'Mot de passe'} error={errors.password?.message}>
              <input {...register('password', { required: !editing ? 'Requis' : false })} type="password" style={inputStyle} placeholder={editing ? 'Laisser vide pour ne pas changer' : '••••••••'} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Email"><input {...register('email')} type="email" style={inputStyle} placeholder="email@..." /></Field>
              <Field label="Téléphone"><input {...register('telephone')} style={inputStyle} placeholder="0600000000" /></Field>
            </div>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}

      {/* Modal disponibilité */}
      {showDispo && (
        <Modal title="Employés disponibles" onClose={() => setShowDispo(false)}>
          <form onSubmit={handleDispo(onSearchDispo)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Date début"><input {...registerDispo('dateDebut', { required: true })} type="date" style={inputStyle} /></Field>
              <Field label="Date fin"><input {...registerDispo('dateFin', { required: true })} type="date" style={inputStyle} /></Field>
            </div>
            <button type="submit" disabled={dispoLoading}
              style={{ padding: '10px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', opacity: dispoLoading ? 0.6 : 1 }}>
              {dispoLoading ? 'Recherche…' : 'Rechercher'}
            </button>
          </form>
          {dispoResult !== null && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                {dispoResult.length === 0 ? 'Aucun employé disponible.' : `${dispoResult.length} employé(s) disponible(s) :`}
              </p>
              {dispoResult.map((e) => (
                <div key={e.id} style={{ display: 'flex', gap: '10px', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-input)', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{e.matricule}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{e.nom} {e.prenom}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </PageLayout>
  )
}