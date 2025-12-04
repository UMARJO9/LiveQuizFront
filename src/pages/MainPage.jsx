import { useEffect, useMemo, useRef, useState } from 'react'
import QuizCard from '../components/QuizCard'
import { apiRequest } from '../api/client'
import '../App.css'
import CreateTopicModal from '../components/CreateTopicModal'

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    window.location.assign('/')
  }

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const didFetchRef = useRef(false)
  useEffect(() => {
    if (didFetchRef.current) return
    didFetchRef.current = true

    let isMounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const token = (localStorage.getItem('token') || '').trim()
        if (!token) {
          if (isMounted) {
            setError('Токен не найден. Выполните вход заново.')
            setQuizzes([])
          }
          return
        }

        const data = await apiRequest('get', '/api/quizzes/')
        if (!isMounted) return
        if (Array.isArray(data)) {
          setQuizzes(data)
        } else {
          setQuizzes([])
        }
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Failed to load quizzes')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="main-spacer" />
        <div className="main-user">
          <div className="avatar">{initials}</div>
          <div className="user-name">{displayName}</div>
        </div>
        <button className="logout-button" type="button" onClick={handleLogout}>
          Выйти
        </button>
      </header>
      <main className="main-content">
        <div className="quiz-grid" style={{ width: '100%' }}>
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="quiz-skeleton" />
            ))}

          {!loading && error && (
            <div className="error-text" style={{ gridColumn: '1 / -1' }}>
              {error}
            </div>
          )}

          {!loading && !error && quizzes.length === 0 && (
            <div style={{ gridColumn: '1 / -1', color: '#475569' }}>Тем пока нет</div>
          )}

          {!loading && !error &&
            quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onClick={() => console.log(quiz.id)} />
            ))}

          {!loading && !error && (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              aria-label="Создать тему"
              style={{
                border: '2px dashed #94a3b8',
                background: 'transparent',
                borderRadius: 12,
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                fontSize: 32,
                height: 160,
              }}
              className="quiz-card"
            >
              +
            </button>
          )}
        </div>
      </main>
      {showCreate && (
        <CreateTopicModal
          onCancel={() => setShowCreate(false)}
          onCreated={(topic) => {
            setShowCreate(false)
            // моментальный переход на страницу темы
            if (topic?.id) {
              window.location.assign(`/topics/${topic.id}`)
            }
          }}
        />
      )}
    </div>
  )
}

export default MainPage
