import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/'
const ACCESS_TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh'

const api = axios.create({
  baseURL: API_BASE_URL,
})

const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

const storeTokens = (token, refresh) => {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token)
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const handleLogout = () => {
  clearTokens()
  // Replace with your own logout/redirect flow if needed
  window.location.assign('/')
}

export const refreshToken = async () => {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refresh) {
    handleLogout()
    throw new Error('No refresh token')
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: refresh,
    })
    const { success, code, message, result } = response.data ?? {}

    if (code === 401) {
      handleLogout()
      throw new Error(message || 'Unauthorized')
    }

    if (code === 403) {
      handleLogout()
      throw new Error(message || 'Forbidden')
    }

    if (success === false) {
      throw new Error(message || 'Failed to refresh token')
    }

    storeTokens(result?.token, result?.refresh)
    return result?.token
  } catch (error) {
    if (error.response?.status === 401) {
      handleLogout()
    }

    if (error.request && !error.response) {
      throw new Error('Server unavailable')
    }

    throw new Error(error.response?.data?.message || error.message || 'Failed to refresh token')
  }
}

export const apiRequest = async (method, url, data, config = {}) => {
  const headers = {
    ...(config.headers || {}),
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await api.request({
      method,
      url,
      data,
      ...config,
      headers,
    })

    const { success, code, message, result } = response.data ?? {}

    if (code === 401) {
      handleLogout()
      throw new Error(message || 'Unauthorized')
    }

    if (code === 403) {
      await refreshToken()
      return apiRequest(method, url, data, config)
    }

    if (success === false) {
      throw new Error(message || 'Request failed')
    }

    return result
  } catch (error) {
    if (error.response) {
      const status = error.response.status

      if (status === 401) {
        handleLogout()
        throw new Error(error.response?.data?.message || 'Unauthorized')
      }

      if (status === 403) {
        await refreshToken()
        return apiRequest(method, url, data, config)
      }

      throw new Error(error.response?.data?.message || error.message || 'Request failed')
    }

    if (error.request && !error.response) {
      throw new Error('Server unavailable')
    }

    throw new Error(error.message || 'Request failed')
  }
}



