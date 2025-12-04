import { useState } from 'react'
import { request } from '../api/request'
import '../App.css'

const initialLoginState = {
  email: '',
  password: '',
}

const saveSession = (result) => {
  if (!result) return
  const accessToken = result?.access ?? result?.token ?? result?.access_token ?? result?.jwt ?? ''
  const refreshToken = result?.refresh ?? result?.refresh_token ?? ''
  if (accessToken) localStorage.setItem('token', accessToken)
  if (refreshToken) localStorage.setItem('refresh', refreshToken)
  if (result.user) {
    localStorage.setItem('user', JSON.stringify(result.user))
  }
}

const flattenFieldErrors = (fields) => {
  if (!fields || typeof fields !== 'object') return {}
  const normalized = {}
  Object.entries(fields).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      normalized[key] = value[0]
    } else if (typeof value === 'string') {
      normalized[key] = value
    }
  })
  return normalized
}

const AuthPage = ({ onAuth }) => {
  const [form, setForm] = useState(initialLoginState)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const title = 'Войти'

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setFieldErrors({})
    setLoading(true)

    const email = (form.email || '').trim()
    const password = form.password || ''
    if (!email || !password) {
      setErrorMessage('Email and password are required')
      setLoading(false)
      return
    }

    // Backend expects `username` + `password`
    const payload = { username: email, password }
    const { success, result, message, fields } = await request(
      'post',
      '/api/auth/login/',
      payload,
    )

    if (success === true) {
      saveSession(result)
      if (onAuth) onAuth()
      // Avoid hard reload; App will render MainPage based on isAuthed
      return
    }

    setErrorMessage(message || 'Server unavailable')
    setFieldErrors(flattenFieldErrors(fields))
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h1 className="auth-title">{title}</h1>
        </div>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        {Object.keys(fieldErrors).length > 0 && (
          <div className="auth-error">
            {Object.entries(fieldErrors).map(([field, message]) => (
              <div key={field}>
                {field}: {message}
              </div>
            ))}
          </div>
        )}

        <div className="auth-fields">
          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="auth-label">
            Пароль
            <input
              className="auth-input"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Пароль"
              required
            />
          </label>
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : title}
        </button>
      </form>
    </div>
  )
}

export default AuthPage
