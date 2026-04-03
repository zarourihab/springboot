import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protège une route :
 * - Redirige vers /login si pas de token
 * - Optionnel : prop allowedRoles pour restreindre par rôle
 */
export default function PrivateRoute({ children, allowedRoles }) {
  const { token, role } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8 text-center max-w-md">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Accès refusé</h2>
          <p className="text-slate-400">Vous n'avez pas les droits pour accéder à cette page.</p>
          <p className="text-slate-500 text-sm mt-2">Rôle requis : {allowedRoles.join(', ')}</p>
        </div>
      </div>
    )
  }

  return children
}
