import api from './api'

export const getAll = () => api.get('/profils').then((r) => r.data)