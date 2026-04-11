import api from './api'

export const getByPhase = (phaseId) =>
  api.get(`/phases/${phaseId}/employes`).then((r) => r.data)

// Le backend exige employeId, phaseId et role dans le body
export const add = (phaseId, employeId) =>
  api.post(`/phases/${phaseId}/employes/${employeId}`, {
    employeId: Number(employeId),
    phaseId:   Number(phaseId),
    role:      'COLLABORATEUR',
  }).then((r) => r.data)

export const remove = (phaseId, employeId) =>
  api.delete(`/phases/${phaseId}/employes/${employeId}`)

export const getByEmploye = (employeId) =>
  api.get(`/employes/${employeId}/phases`).then((r) => r.data)