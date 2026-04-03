import api from './api'

export const getAll = () => api.get('/employes').then((r) => r.data)
export const getById = (id) => api.get(`/employes/${id}`).then((r) => r.data)
export const create = (data) => api.post('/employes', data).then((r) => r.data)
export const update = (id, data) => api.put(`/employes/${id}`, data).then((r) => r.data)
export const remove = (id) => api.delete(`/employes/${id}`)
