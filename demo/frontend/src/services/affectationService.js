import api from './api'

export const getByPhase = (phaseId) =>
  api.get(`/phases/${phaseId}/employes`).then((r) => r.data)

export const add = (phaseId, employeId) =>
  api.post(`/phases/${phaseId}/employes/${employeId}`).then((r) => r.data)

export const remove = (phaseId, employeId) =>
  api.delete(`/phases/${phaseId}/employes/${employeId}`)
