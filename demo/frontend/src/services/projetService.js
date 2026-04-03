import api from './api'

export const getAll = () => api.get('/projets').then((r) => r.data)
export const getById = (id) => api.get(`/projets/${id}`).then((r) => r.data)
export const create = (data) => api.post('/projets', data).then((r) => r.data)
export const update = (id, data) => api.put(`/projets/${id}`, data).then((r) => r.data)
export const remove = (id) => api.delete(`/projets/${id}`)
