import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { resetPassword } from '../services/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setError(''); setLoading(true)
    try {
      await resetPassword(token, data.newPassword)
      setSuccess('Mot de passe réinitialisé avec succès !')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Lien invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--danger)' }}>
          <p>Lien invalide.</p>
          <Link to="/login" style={{ color: 'var(--accent)' }}>Retour à la connexion</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: 36 }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 14 }}>
              SP
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 20, margin: '0 0 6px' }}>Nouveau mot de passe</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>Choisissez un nouveau mot de passe sécurisé</p>
          </div>

          {success && (
            <div style={{ marginBottom: 18, padding: '12px 16px', backgroundColor: '#05966920', border: '1px solid #059669', borderRadius: 8, color: '#059669', fontSize: 13 }}>
              ✅ {success} Redirection en cours…
            </div>
          )}
          {error && (
            <div style={{ marginBottom: 18, padding: '12px 16px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 8, color: 'var(--danger)', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Nouveau mot de passe</label>
                <input
                  {...register('newPassword', { required: 'Requis', minLength: { value: 6, message: 'Minimum 6 caractères' } })}
                  type="password" placeholder="••••••••"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13, backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                />
                {errors.newPassword && <p style={{ marginTop: 4, fontSize: 11, color: 'var(--danger)' }}>{errors.newPassword.message}</p>}
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirmer le mot de passe</label>
                <input
                  {...register('confirm', {
                    required: 'Requis',
                    validate: (v) => v === watch('newPassword') || 'Les mots de passe ne correspondent pas'
                  })}
                  type="password" placeholder="••••••••"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13, backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                />
                {errors.confirm && <p style={{ marginTop: 4, fontSize: 11, color: 'var(--danger)' }}>{errors.confirm.message}</p>}
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                backgroundColor: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Enregistrement…' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/login" style={{ color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}