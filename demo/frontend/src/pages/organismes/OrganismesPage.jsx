import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as organismeService from '../../services/organismeService'

export default function OrganismesPage() {
  const [organismes, setOrganismes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setLoading(true)
    organismeService.getAll()
      .then(setOrganismes)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { reset({}); setEditing(null); setShowModal(true) }
  const openEdit = (o) => { reset(o); setEditing(o); setShowModal(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) await organismeService.update(editing.id, data)
      else await organismeService.create(data)
      setShowModal(false)
      load()
    } catch { setError('Erreur lors de la sauvegarde') }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer cet organisme ?')) return
    try { await organismeService.remove(id); load() }
    catch { setError('Erreur lors de la suppression') }
  }

  return (
    <PageLayout
      title="Organismes" subtitle="Gestion des organismes clients"
      onAdd={openCreate}
      error={error} loading={loading}
    >
      <Table
        headers={['Nom', 'Abréviation', 'Adresse', 'Téléphone', 'Email', 'Actions']}
        rows={organismes}
        renderRow={(o) => (
          <tr key={o.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
            <td className="px-4 py-3 text-white font-medium">{o.nom}</td>
            <td className="px-4 py-3 text-slate-300">{o.abreviation}</td>
            <td className="px-4 py-3 text-slate-400">{o.adresse}</td>
            <td className="px-4 py-3 text-slate-400">{o.telephone}</td>
            <td className="px-4 py-3 text-slate-400">{o.email}</td>
            <td className="px-4 py-3">
              <ActionButtons onEdit={() => openEdit(o)} onDelete={() => onDelete(o.id)} />
            </td>
          </tr>
        )}
      />
      {showModal && (
        <Modal title={editing ? 'Modifier l\'organisme' : 'Nouvel organisme'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Nom" error={errors.nom?.message}>
              <input {...register('nom', { required: 'Requis' })} className={inputCls} placeholder="Nom complet" />
            </Field>
            <Field label="Abréviation" error={errors.abreviation?.message}>
              <input {...register('abreviation')} className={inputCls} placeholder="Ex: ONEE" />
            </Field>
            <Field label="Adresse">
              <input {...register('adresse')} className={inputCls} placeholder="Adresse" />
            </Field>
            <Field label="Téléphone">
              <input {...register('telephone')} className={inputCls} placeholder="0600000000" />
            </Field>
            <Field label="Email">
              <input {...register('email')} type="email" className={inputCls} placeholder="contact@..."  />
            </Field>
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function ModalActions({ onClose }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">Annuler</button>
      <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-medium">Enregistrer</button>
    </div>
  )
}

export function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onEdit} className="px-3 py-1.5 text-xs text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg transition-all">Modifier</button>
      <button onClick={onDelete} className="px-3 py-1.5 text-xs text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all">Supprimer</button>
    </div>
  )
}

export function Table({ headers, rows, renderRow, emptyMessage = 'Aucune donnée' }) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <div className="text-4xl mb-3">📭</div>
        <p>{emptyMessage}</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700/50">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
            <span className="text-lg leading-none">+</span> Ajouter
          </button>
        )}
      </div>
      {error && <div className="mb-4 bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">⚠️ {error}</div>}
      <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
        {loading
          ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>
          : children
        }
      </div>
    </div>
  )
}
