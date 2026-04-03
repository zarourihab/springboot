import api from './api'

export const getAll = () => api.get('/factures').then((r) => r.data)

export const getByPhase = (phaseId) =>
  api.get(`/phases/${phaseId}/facture`).then((r) => r.data)

export const create = (phaseId, data) =>
  api.post(`/phases/${phaseId}/facture`, data).then((r) => r.data)

export const update = (id, data) =>
  api.put(`/factures/${id}`, data).then((r) => r.data)

export const remove = (id) => api.delete(`/factures/${id}`)
