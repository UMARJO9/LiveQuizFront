import { apiRequest } from './client'

const persistAuth = (data) => {
  if (!data) return
  const accessToken = data?.access ?? data?.token ?? data?.access_token ?? data?.jwt ?? ''
  const refreshToken = data?.refresh ?? data?.refresh_token ?? ''
  if (accessToken) localStorage.setItem('token', accessToken)
  if (refreshToken) localStorage.setItem('refresh', refreshToken)
  if (data?.user) {
    try { localStorage.setItem('user', JSON.stringify(data.user)) } catch {}
  }
}

export const login = async (payload) => {
  const data = await apiRequest('post', '/api/auth/login/', payload)
  persistAuth(data)
  return data
}

export const register = async (payload) => {
  const data = await apiRequest('post', '/api/auth/register/', payload)
  persistAuth(data)
  return data
}
