import api from './api'

export const getByProjet = (projetId) =>
  api.get(`/projets/${projetId}/documents`).then((r) => r.data)

export const create = (projetId, data) =>
  api.post(`/projets/${projetId}/documents`, data).then((r) => r.data)

export const remove = (id) => api.delete(`/documents/${id}`)
