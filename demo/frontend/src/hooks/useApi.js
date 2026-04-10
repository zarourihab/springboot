import { useState, useEffect, useCallback } from 'react'

/**
 * Hook générique pour charger des données depuis une fonction de service.
 * Usage :
 *   const { data, loading, error, reload } = useApi(() => projetService.getAll())
 */
export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    fetchFn()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}

/**
 * Hook pour la pagination côté client.
 * Usage :
 *   const { page, totalPages, paginated, setPage } = usePagination(items, 10)
 */
export function usePagination(items = [], pageSize = 10) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  // Remet à la page 1 si les items changent
  useEffect(() => { setPage(1) }, [items.length])

  const paginated = items.slice((page - 1) * pageSize, page * pageSize)

  return { page, setPage, totalPages, paginated }
}