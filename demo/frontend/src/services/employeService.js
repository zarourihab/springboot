import api from './api'

export const getAll       = (q)         => api.get('/employes', { params: { q } }).then((r) => r.data)
export const getById      = (id)        => api.get(`/employes/${id}`).then((r) => r.data)
export const create       = (data)      => api.post('/employes', data).then((r) => r.data)
export const update       = (id, data)  => api.put(`/employes/${id}`, data).then((r) => r.data)
export const remove       = (id)        => api.delete(`/employes/${id}`)

// Employés disponibles entre deux dates (format ISO : 'YYYY-MM-DD')
export const getDisponibles = (dateDebut, dateFin) =>
  api.get('/employes/disponibles', { params: { dateDebut, dateFin } }).then((r) => r.data)