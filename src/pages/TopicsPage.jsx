import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopicCard from '../components/TopicCard'
import AddCard from '../components/AddCard'
import CreateTopicModal from '../components/CreateTopicModal'
import { apiRequest } from '../api/client'
import socket, { connectSocket } from '../api/socket'
import '../App.css'

const getInitials = (user) => {
  if (!user) return 'U'
  const first = user.first_name?.[0] || ''
  const last = user.last_name?.[0] || ''
  const initials = `${first}${last}` || user.email?.[0] || 'U'
  return initials.toUpperCase()
}

const TopicsPage = () => {
  const navigate = useNavigate()

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

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [startingTest, setStartingTest] = useState(null)
  const [sessionError, setSessionError] = useState('')

  const didFetchRef = useRef(false)

  useEffect(() => {
    connectSocket()

    return () => {
      socket.off('teacher:session_created')
    }
  }, [])

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
            setTopics([])
          }
          return
        }

        const data = await apiRequest('get', '/api/quizzes/')
        if (!isMounted) return
        if (Array.isArray(data)) {
          setTopics(data)
        } else {
          setTopics([])
        }
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Не удалось загрузить темы')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const startTest = (topicId) => {
    setStartingTest(topicId)
    setSessionError('')

    // Проверяем подключение сокета
    if (!socket.connected) {
      connectSocket()
    }

    socket.emit('teacher:create_session', { topic_id: topicId })

    const handleSessionCreated = ({ session_id }) => {
      clearTimeout(timeoutId)
      socket.off('teacher:session_created', handleSessionCreated)
      socket.off('teacher:session_error', handleError)
      setStartingTest(null)
      navigate(`/teacher/session/${session_id}`)
    }

    const handleError = ({ message }) => {
      clearTimeout(timeoutId)
      socket.off('teacher:session_created', handleSessionCreated)
      socket.off('teacher:session_error', handleError)
      setStartingTest(null)
      setSessionError(message || 'Ошибка создания сессии')
    }

    // Таймаут 10 секунд
    const timeoutId = setTimeout(() => {
      socket.off('teacher:session_created', handleSessionCreated)
      socket.off('teacher:session_error', handleError)
      setStartingTest(null)
      setSessionError('Сервер не отвечает. Попробуйте позже.')
    }, 10000)

    socket.on('teacher:session_created', handleSessionCreated)
    socket.on('teacher:session_error', handleError)
  }

  const cancelStartTest = () => {
    socket.off('teacher:session_created')
    socket.off('teacher:session_error')
    setStartingTest(null)
    setSessionError('')
  }

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
        <div
          className="quiz-grid"
          style={{
            width: '100%',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="quiz-skeleton" />
            ))}

          {!loading && error && (
            <div className="error-text" style={{ gridColumn: '1 / -1' }}>
              {error}
            </div>
          )}

          {!loading && !error && topics.length === 0 && (
            <div style={{ gridColumn: '1 / -1', color: '#475569' }}>
              Тем пока нет
            </div>
          )}

          {!loading &&
            !error &&
            topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onStartTest={startTest}
              />
            ))}

          {!loading && !error && (
            <AddCard onClick={() => setShowCreate(true)} />
          )}
        </div>

        {startingTest && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: '24px 32px',
                borderRadius: 12,
                textAlign: 'center',
                minWidth: 280,
              }}
            >
              <div style={{ fontSize: '1.1rem', color: '#334155', marginBottom: 16 }}>
                Создание сессии...
              </div>
              <div style={{
                width: 40,
                height: 40,
                border: '4px solid #e2e8f0',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }} />
              <button
                type="button"
                onClick={cancelStartTest}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#e2e8f0',
                  color: '#334155',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        )}

        {sessionError && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: '24px 32px',
                borderRadius: 12,
                textAlign: 'center',
                minWidth: 280,
              }}
            >
              <div style={{
                fontSize: '1.1rem',
                color: '#991b1b',
                marginBottom: 16,
                background: '#fef2f2',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #fecaca'
              }}>
                {sessionError}
              </div>
              <button
                type="button"
                onClick={() => setSessionError('')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#2563eb',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </main>
      {showCreate && (
        <CreateTopicModal
          onCancel={() => setShowCreate(false)}
          onCreated={(topic) => {
            setShowCreate(false)
            if (topic?.id) navigate(`/topic/${topic.id}`)
          }}
        />
      )}
    </div>
  )
}

export default TopicsPage
