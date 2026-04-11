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
    return !q || o.nom?.toLowerCase().includes(q) || o.code?.toLowerCase().includes(q) || o.nomContact?.toLowerCase().includes(q) || o.contact?.toLowerCase().includes(q)
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
      setShowModal(false); load()
    } catch (err) { setError(err.response?.data?.message || 'Erreur lors de la sauvegarde') }
  }

  const onDelete = async (id) => {
    if (!confirm('Supprimer cet organisme ?')) return
    try { await organismeService.remove(id); load() }
    catch { setError('Erreur lors de la suppression') }
  }

  return (
    <PageLayout title="Organismes" subtitle="Gestion des organismes clients" onAdd={openCreate} error={error} loading={loading}>
      <div style={{ marginBottom: '16px' }}>
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Rechercher par code, nom, contact…" style={inputStyle} />
      </div>
      <Table
        headers={['Code', 'Nom', 'Adresse', 'Contact', 'Email', 'Actions']}
        rows={paginated}
        renderRow={(o) => (
          <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <td style={tdStyle}><span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{o.code}</span></td>
            <td style={{ ...tdStyle, color: 'var(--text-primary)', fontWeight: '500' }}>{o.nom}</td>
            <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{o.adresse || '—'}</td>
            <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{o.contact || o.nomContact || '—'}</td>
            <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{o.emailContact || '—'}</td>
            <td style={tdStyle}><ActionButtons onEdit={() => openEdit(o)} onDelete={() => onDelete(o.id)} /></td>
          </tr>
        )}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      {showModal && (
        <Modal title={editing ? "Modifier l'organisme" : 'Nouvel organisme'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Code" error={errors.code?.message}>
                <input {...register('code', { required: 'Requis' })} style={inputStyle} placeholder="ORG-001" />
              </Field>
              <Field label="Nom" error={errors.nom?.message}>
                <input {...register('nom', { required: 'Requis' })} style={inputStyle} placeholder="Nom complet" />
              </Field>
            </div>
            <Field label="Adresse">
              <input {...register('adresse')} style={inputStyle} placeholder="Adresse" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Contact (nom)">
                <input {...register('contact')} style={inputStyle} placeholder="Nom du contact" />
              </Field>
              <Field label="Email contact">
                <input {...register('emailContact')} type="email" style={inputStyle} placeholder="contact@..." />
              </Field>
            </div>
            <ModalActions onClose={() => setShowModal(false)} />
          </form>
        </Modal>
      )}
    </PageLayout>
  )
}

// ─── Shared UI helpers ─────────────────────────────────────────────────────────

export const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '13px',
  backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)',
  color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}
export const inputCls = inputStyle

export const tdStyle = { padding: '12px 16px' }

export function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>
      {children}
      {error && <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--danger)' }}>{error}</p>}
    </div>
  )
}

export function Modal({ title, onClose, children }) {
  return createPortal(
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0, fontSize: '15px' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>,
    document.body
  )
}

export function Table({ headers, rows, renderRow }) {
  if (!rows || rows.length === 0) {
    return <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>Aucun élément à afficher.</div>
  }
  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
            {headers.map((h) => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '22px', margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>{subtitle}</p>}
        </div>
        {onAdd && (
          <button onClick={onAdd}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}>
            <span>+</span> Ajouter
          </button>
        )}
      </div>
      {error && <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', fontSize: '13px' }}>{error}</div>}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ width: '32px', height: '32px', border: '2px solid var(--accent-bg)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : children}
    </div>
  )
}

export function ActionButtons({ onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={onEdit}
        style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '6px', backgroundColor: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)', cursor: 'pointer' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-bg)'}>
        Modifier
      </button>
      <button onClick={onDelete}
        style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '6px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', cursor: 'pointer' }}>
        Supprimer
      </button>
    </div>
  )
}

export function ModalActions({ onClose }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
      <button type="button" onClick={onClose}
        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
        Annuler
      </button>
      <button type="submit"
        style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
        Enregistrer
      </button>
    </div>
  )
}