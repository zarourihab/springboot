import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import * as organismeService from '../../services/organismeService'
import { usePagination } from '../../hooks/useApi'
import Pagination from '../../components/Pagination'

const PAGE_SIZE = 8

export default function OrganismesPage() {
  const [organismes, setOrganismes] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [error, setError]           = useState('')
  const [search, setSearch]         = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filtered = organismes.filter((o) => {
    const q = search.toLowerCase()
    return (
      !q ||
      o.nom?.toLowerCase().includes(q) ||
      o.code?.toLowerCase().includes(q) ||
      o.nomContact?.toLowerCase().includes(q) ||
      o.contact?.toLowerCase().includes(q)
    )
  })

  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE)

  const load = () => {
    setLoading(true)
    organismeService.getAll()
      .then(setOrganismes)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { reset({}); setEditing(null); setShowModal(true) }
  const openEdit   = (o) => { reset(o); setEditing(o); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) await organismeService.update(editing.id, data)
      else         await organismeService.create(data)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer cet organisme ?')) return
    try { await organismeService.remove(id); load() }
    catch { setError('Erreur lors de la suppression') }
  }

  return (
    <PageLayout
      title="Organismes"
      subtitle="Gestion des organismes clients"
      onAdd={openCreate}
      error={error}
      loading={loading}
    >
      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Rechercher par code, nom, contact…"
          className={inputCls}
        />
      </div>

      <Table
        headers={['Code', 'Nom', 'Adresse', 'Contact', 'Email', 'Actions']}
        rows={paginated}
        renderRow={(o) => (
          <tr key={o.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{o.code}</td>
            <td className="px-4 py-3 text-white font-medium">{o.nom}</td>
            <td className="px-4 py-3 text-slate-400">{o.adresse || '—'}</td>
            <td className="px-4 py-3 text-slate-400">{o.contact || o.nomContact || '—'}</td>
            <td className="px-4 py-3 text-slate-400">{o.emailContact || '—'}</td>
            <td className="px-4 py-3">
              <ActionButtons onEdit={() => openEdit(o)} onDelete={() => onDelete(o.id)} />
            </td>
          </tr>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {showModal && (
        <Modal title={editing ? "Modifier l'organisme" : 'Nouvel organisme'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Code" error={errors.code?.message}>
                <input {...register('code', { required: 'Requis' })} className={inputCls} placeholder="ORG-001" />
              </Field>
              <Field label="Nom" error={errors.nom?.message}>
                <input {...register('nom', { required: 'Requis' })} className={inputCls} placeholder="Nom complet" />
              </Field>
            </div>
            <Field label="Adresse">
              <input {...register('adresse')} className={inputCls} placeholder="Adresse" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact (nom)">
                <input {...register('contact')} className={inputCls} placeholder="Nom du contact" />
              </Field>
              <Field label="Email contact">
                <input {...register('emailContact')} type="email" className={inputCls} placeholder="contact@..." />
              </Field>
            </div>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

export const inputCls = 'w-full bg-slate-900/70 border border-slate-600/50 text-white placeholder-slate-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all'

export function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function Modal({ title, onClose, children }) {
  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 99999, padding: '1rem',
      }}
    >
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export function Table({ headers, rows, renderRow }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">Aucun élément à afficher.</div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700/50 bg-slate-800/50">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    </div>
  )
}

export function PageLayout({ title, subtitle, onAdd, error, loading, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span> Ajouter
          </button>
        )}
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : children}
    </div>
  )
}

export function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
      >
        Modifier
      </button>
      <button
        onClick={onDelete}
        className="px-2.5 py-1.5 text-xs rounded-lg bg-red-900/30 hover:bg-red-800/50 text-red-400 hover:text-red-300 transition-colors"
      >
        Supprimer
      </button>
    </div>
  )
}

export function ModalActions({ onClose }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Enregistrer
      </button>
    </div>
  )
}