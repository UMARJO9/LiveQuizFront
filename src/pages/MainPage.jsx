import { useMemo } from 'react'
import '../App.css'

const getInitials = (user) => {
  if (!user) return 'U'
  const first = user.first_name?.[0] || ''
  const last = user.last_name?.[0] || ''
  const initials = `${first}${last}` || user.email?.[0] || 'U'
  return initials.toUpperCase()
}

const MainPage = () => {
  const user = useMemo(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }, [])

  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()
      : user?.email || 'User'

  const initials = getInitials(user)

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="main-user">
          <div className="avatar">{initials}</div>
          <div className="user-name">{displayName}</div>
        </div>
      </header>
      <main className="main-content">
        <h1 className="main-greeting">Привет!</h1>
        <p className="main-sub">Добро пожаловать в приложение.</p>
      </main>
    </div>
  )
}

export default MainPage
