import { useForm } from 'react-hook-form'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')

  const from = location.state?.from?.pathname || '/dashboard'

  const onSubmit = async (data) => {
    setServerError('')
    const result = await login(data)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setServerError(result.error)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: 36 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 14 }}>
              SP
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 22, margin: '0 0 4px' }}>Suivi Projet</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>Connectez-vous à votre espace de travail</p>
          </div>

          {serverError && (
            <div style={{ marginBottom: 18, padding: '12px 16px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 8, color: 'var(--danger)', fontSize: 13 }}>
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Login */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Login</label>
              <input
                {...register('login', { required: 'Le login est requis' })}
                type="text" placeholder="Votre identifiant"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13, backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.login && <p style={{ marginTop: 4, fontSize: 11, color: 'var(--danger)' }}>{errors.login.message}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Mot de passe</label>
              <input
                {...register('password', { required: 'Le mot de passe est requis' })}
                type="password" placeholder="••••••••"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13, backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.password && <p style={{ marginTop: 4, fontSize: 11, color: 'var(--danger)' }}>{errors.password.message}</p>}
            </div>

            {/* Mot de passe oublié */}
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ color: 'var(--accent)', fontSize: 12, textDecoration: 'none' }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              backgroundColor: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}