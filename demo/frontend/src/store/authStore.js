// Store léger pour l'authentification (complément à AuthContext)
// Utilisé pour accéder au token/role en dehors des composants React (ex : dans les services)

const TOKEN_KEY = 'token'
const ROLE_KEY  = 'role'
const LOGIN_KEY = 'login'

export const authStore = {
  getToken:    () => localStorage.getItem(TOKEN_KEY),
  getRole:     () => localStorage.getItem(ROLE_KEY),
  getLogin:    () => localStorage.getItem(LOGIN_KEY),

  save: (token, role, login) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(ROLE_KEY,  role)
    localStorage.setItem(LOGIN_KEY, login)
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    localStorage.removeItem(LOGIN_KEY)
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
}