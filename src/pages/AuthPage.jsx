import { useMemo, useState } from 'react'
import { request } from '../api/request'
import '../App.css'

const initialRegisterState = {
  email: '',
  password: '',
  password2: '',
  first_name: '',
  last_name: '',
  specialty: '',
}

const initialLoginState = {
  email: '',
  password: '',
}

const saveSession = (result) => {
  if (!result) return
  localStorage.setItem('token', result.access)
  localStorage.setItem('refresh', result.refresh)
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

const AuthPage = () => {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialLoginState)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const title = mode === 'login' ? 'Войти' : 'Регистрация'
  const toggleText =
    mode === 'login' ? 'У меня нет аккаунта' : 'У меня есть аккаунт'

  const handleToggle = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
    setForm(mode === 'login' ? initialRegisterState : initialLoginState)
    setErrorMessage('')
    setFieldErrors({})
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setFieldErrors({})
    setLoading(true)

    const payload = { ...form }
    const url = mode === 'login' ? '/api/login' : '/api/register'
    const result = await request('post', url, payload)

    if (result && !result.fields) {
      saveSession(result)
      window.location.assign('/')
      return
    }

    setErrorMessage(result?.message || 'Server unavailable')
    setFieldErrors(flattenFieldErrors(result?.fields))
    setLoading(false)
  }

  const registerFields = useMemo(
    () => (
      <>
        <label className="auth-label">
          Имя
          <input
            className="auth-input"
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={onChange}
            placeholder="Ваше имя"
            required
          />
        </label>
        <label className="auth-label">
          Фамилия
          <input
            className="auth-input"
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={onChange}
            placeholder="Ваша фамилия"
            required
          />
        </label>
        <label className="auth-label">
          Специализация
          <input
            className="auth-input"
            type="text"
            name="specialty"
            value={form.specialty}
            onChange={onChange}
            placeholder="Например: Backend, Frontend..."
            required
          />
        </label>
        <label className="auth-label">
          Подтвердите пароль
          <input
            className="auth-input"
            type="password"
            name="password2"
            value={form.password2}
            onChange={onChange}
            placeholder="Пароль еще раз"
            required
          />
        </label>
      </>
    ),
    [form.first_name, form.last_name, form.specialty, form.password2],
  )

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h1 className="auth-title">{title}</h1>
          <button type="button" className="auth-toggle" onClick={handleToggle}>
            {toggleText}
          </button>
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

          {mode === 'register' && registerFields}
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : title}
        </button>

        <div className="auth-meta">
          {mode === 'login'
            ? 'Впервые здесь?'
            : 'Уже есть аккаунт?'}{' '}
          <button type="button" className="auth-toggle" onClick={handleToggle}>
            {mode === 'login' ? 'Зарегистрируйтесь' : 'Войдите'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AuthPage
