import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export const request = async (method, url, data) => {
  try {
    const response = await client.request({
      method,
      url,
      data: data !== undefined ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { success, result, message } = response.data ?? {}
    if (success === true) return result

    return {
      fields: result ?? {},
      message: message || 'Request failed',
    }
  } catch (error) {
    if (error.response?.data) {
      const { message, result } = error.response.data ?? {}
      return {
        fields: result ?? {},
        message: message || 'Request failed',
      }
    }

    if (error.request && !error.response) {
      return { fields: null, message: 'Server unavailable' }
    }

    return { fields: null, message: error.message || 'Request failed' }
  }
}
