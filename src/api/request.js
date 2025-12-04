import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
})

const getToken = () => {
  try {
    return (localStorage.getItem('token') || '').trim()
  } catch {
    return ''
  }
}

export const request = async (method, url, data) => {
  try {
    const token = getToken()
    const response = await client.request({
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    const { success, result, message } = response.data ?? {}
    if (success === true) {
      // Support endpoints that return token at top-level (no result wrapper)
      const normalized = result ?? response.data
      return { success: true, result: normalized, message: message || '' }
    }

    return {
      success: false,
      fields: result ?? {},
      message: message || 'Request failed',
    }
  } catch (error) {
    if (error.response?.data) {
      const { message, result } = error.response.data ?? {}
      return {
        success: false,
        fields: result ?? {},
        message: message || 'Request failed',
      }
    }

    if (error.request && !error.response) {
      return { success: false, fields: {}, message: 'Server unavailable' }
    }

    return { success: false, fields: {}, message: error.message || 'Request failed' }
  }
}

