import api from './api'

export const getByPhase = (phaseId) =>
  api.get(`/phases/${phaseId}/livrables`).then((r) => r.data)

export const create = (phaseId, data) =>
  api.post(`/phases/${phaseId}/livrables`, data).then((r) => r.data)

export const update = (id, data) =>
  api.put(`/livrables/${id}`, data).then((r) => r.data)

export const remove = (id) => api.delete(`/livrables/${id}`)
