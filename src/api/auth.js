import { apiRequest } from './client'

export const login = (payload) => apiRequest('post', '/api/register', payload)

export const register = (payload) => apiRequest('post', '/api/login', payload)
