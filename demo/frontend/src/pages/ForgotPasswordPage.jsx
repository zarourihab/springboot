import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { forgotPassword } from '../services/authService'

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setError(''); setSuccess(''); setLoading(true)
    try {
      await forgotPassword(data.email)
      setSuccess('Un email de réinitialisation a été envoyé. Vérifiez votre boîte mail.')
    } catch (err) {
      setError(err.response?.data?.message || 'Aucun compte trouvé avec cet email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: 36 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 14 }}>
              SP
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 20, margin: '0 0 6px' }}>Mot de passe oublié ?</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>

          {success && (
            <div style={{ marginBottom: 18, padding: '12px 16px', backgroundColor: '#05966920', border: '1px solid #059669', borderRadius: 8, color: '#059669', fontSize: 13 }}>
              ✅ {success}
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
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Adresse email</label>
                <input
                  {...register('email', {
                    required: 'Email requis',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' }
                  })}
                  type="email"
                  placeholder="votre@email.com"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13, backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                />
                {errors.email && <p style={{ marginTop: 4, fontSize: 11, color: 'var(--danger)' }}>{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                backgroundColor: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
              }}>
                {loading ? 'Envoi en cours…' : 'Envoyer le lien'}
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