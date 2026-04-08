import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useForm } from 'react-hook-form'
import { changePassword } from '../../services/authService'

export default function ProfilPage() {
  const { userLogin, role, logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()

  const onSubmit = async (data) => {
    setSuccess('')
    setError('')
    setLoading(true)
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      setSuccess('Mot de passe modifié avec succès !')
      reset()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-slate-900/70 border border-slate-600/50 text-white placeholder-slate-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all'

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-white">Mon profil</h2>
        <p className="text-slate-400 text-sm mt-1">Informations de votre compte</p>
      </div>

      {/* Carte infos */}
      <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-2xl font-bold">
            {userLogin ? userLogin[0].toUpperCase() : '?'}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{userLogin}</p>
            <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full">
              {role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/40 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-1">Login</p>
            <p className="text-white font-medium">{userLogin}</p>
          </div>
          <div className="bg-slate-900/40 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-1">Rôle</p>
            <p className="text-white font-medium">{role}</p>
          </div>
        </div>
      </div>

      {/* Carte changement mot de passe */}
      <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Changer le mot de passe</h3>

        {success && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 text-sm">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Ancien mot de passe
            </label>
            <input
              {...register('oldPassword', { required: 'Requis' })}
              type="password"
              placeholder="••••••••"
              className={inputCls}
            />
            {errors.oldPassword && <p className="mt-1 text-xs text-red-400">{errors.oldPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nouveau mot de passe
            </label>
            <input
              {...register('newPassword', {
                required: 'Requis',
                minLength: { value: 6, message: 'Minimum 6 caractères' }
              })}
              type="password"
              placeholder="••••••••"
              className={inputCls}
            />
            {errors.newPassword && <p className="mt-1 text-xs text-red-400">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <input
              {...register('confirmPassword', {
                required: 'Requis',
                validate: (val) => val === watch('newPassword') || 'Les mots de passe ne correspondent pas'
              })}
              type="password"
              placeholder="••••••••"
              className={inputCls}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-all"
            >
              {loading ? 'Enregistrement...' : 'Modifier le mot de passe'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}