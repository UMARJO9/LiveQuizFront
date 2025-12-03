import { useCallback } from 'react'
import { apiRequest } from '../api/client'

export const useApi = () => {
  const get = useCallback((url, config) => apiRequest('get', url, undefined, config), [])

  const post = useCallback((url, data, config) => apiRequest('post', url, data, config), [])

  const put = useCallback((url, data, config) => apiRequest('put', url, data, config), [])

  const del = useCallback((url, config) => apiRequest('delete', url, undefined, config), [])

  return { get, post, put, del }
}
