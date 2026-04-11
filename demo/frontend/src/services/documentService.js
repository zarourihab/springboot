import api from './api'

export const getByProjet = (projetId) =>
  api.get(`/projets/${projetId}/documents`).then((r) => r.data)

export const create = (projetId, data) =>
  api.post(`/projets/${projetId}/documents`, data).then((r) => r.data)

export const update = (id, data) =>
  api.put(`/documents/${id}`, data).then((r) => r.data)

export const remove = (id) => api.delete(`/documents/${id}`)

export const download = async (id, filename) => {
  const response = await api.get(`/documents/${id}/download`, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename || `document_${id}`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}