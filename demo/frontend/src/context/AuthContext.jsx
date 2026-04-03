import { createContext, useContext, useState } from 'react'
import { login as apiLogin } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [role, setRole] = useState(() => localStorage.getItem('role'))
  const [userLogin, setUserLogin] = useState(() => localStorage.getItem('login'))
  const [loading, setLoading] = useState(false)

  // ✅ CORRIGÉ : le backend stocke le rôle dans le claim "profil"
  const decodeRole = (jwt) => {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]))
      return payload.profil || ''
    } catch {
      return ''
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    try {
      const data = await apiLogin(credentials)
      const jwt = data.token
      const decodedRole = decodeRole(jwt)

      localStorage.setItem('token', jwt)
      localStorage.setItem('role', decodedRole)
      localStorage.setItem('login', credentials.login)

      setToken(jwt)
      setRole(decodedRole)
      setUserLogin(credentials.login)

      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Identifiants incorrects'
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('login')
    setToken(null)
    setRole(null)
    setUserLogin(null)
  }

  const hasRole = (...roles) => roles.includes(role)

  return (
    <AuthContext.Provider value={{ token, role, userLogin, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)