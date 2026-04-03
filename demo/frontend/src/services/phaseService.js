import api from './api'

export const getByProjet = (projetId) =>
  api.get(`/projets/${projetId}/phases`).then((r) => r.data)

export const getById = (id) => api.get(`/phases/${id}`).then((r) => r.data)

export const create = (projetId, data) =>
  api.post(`/projets/${projetId}/phases`, data).then((r) => r.data)

export const update = (id, data) =>
  api.put(`/phases/${id}`, data).then((r) => r.data)

export const remove = (id) => api.delete(`/phases/${id}`)

export const realiser = (id) =>
  api.patch(`/phases/${id}/realisation`).then((r) => r.data)

export const facturer = (id) =>
  api.patch(`/phases/${id}/facturation`).then((r) => r.data)

export const payer = (id) =>
  api.patch(`/phases/${id}/paiement`).then((r) => r.data)
