import api from './api'

export const getAll = () => api.get('/organismes').then((r) => r.data)
export const getById = (id) => api.get(`/organismes/${id}`).then((r) => r.data)
export const create = (data) => api.post('/organismes', data).then((r) => r.data)
export const update = (id, data) => api.put(`/organismes/${id}`, data).then((r) => r.data)
export const remove = (id) => api.delete(`/organismes/${id}`)
