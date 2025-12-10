import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useTeacherSession from '../hooks/useTeacherSession'

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef2ff 100%)',
  padding: '32px 16px',
}

const containerStyle = {
  width: 'min(600px, 96vw)',
  background: '#fff',
  borderRadius: 18,
  padding: '28px 32px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
}

const codeBlockStyle = {
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  color: '#fff',
  padding: '20px 28px',
  borderRadius: 14,
  textAlign: 'center',
  marginBottom: 28,
}

const codeTextStyle = {
  fontSize: '2.5rem',
  fontWeight: 800,
  letterSpacing: '0.15em',
  margin: 0,
}

const codeLabelStyle = {
  fontSize: '0.9rem',
  opacity: 0.9,
  marginBottom: 8,
}

const studentListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
}

const studentItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  background: '#f8fafc',
  borderRadius: 10,
  marginBottom: 10,
}

const avatarStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #10b981, #059669)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '1rem',
}

const backBtnStyle = {
  padding: '10px 18px',
  borderRadius: 10,
  border: 'none',
  background: '#e2e8f0',
  color: '#334155',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s ease',
}

const TeacherSessionPage = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Получаем данные из state навигации
  const { code: initialCode, topic, question_count } = location.state || {}

  const { students, sessionCode, loading, error, isStarted, isStarting, startSession } = useTeacherSession(sessionId)

  // Используем код из state или из хука
  const displayCode = initialCode || sessionCode || sessionId

  // Если есть данные из навигации - не показываем загрузку
  const hasInitialData = Boolean(initialCode)
  const isLoading = loading && !hasInitialData

  const getInitials = (student) => {
    if (!student) return '?'
    const first = student.first_name?.[0] || ''
    const last = student.last_name?.[0] || ''
    const initials = `${first}${last}` || student.name?.[0] || student.email?.[0] || '?'
    return initials.toUpperCase()
  }

  const getDisplayName = (student) => {
    if (!student) return 'Студент'
    if (student.first_name || student.last_name) {
      return `${student.first_name || ''} ${student.last_name || ''}`.trim()
    }
    return student.name || student.email || 'Студент'
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.5rem' }}>
            Сессия теста
          </h1>
          <button
            type="button"
            style={backBtnStyle}
            onClick={() => navigate('/')}
            onMouseOver={(e) => (e.target.style.background = '#cbd5e1')}
            onMouseOut={(e) => (e.target.style.background = '#e2e8f0')}
          >
            Назад
          </button>
        </div>

        {isLoading && (
          <div style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>
            Загрузка сессии...
          </div>
        )}

        {error && !hasInitialData && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {!isLoading && (
          <>
            <div style={codeBlockStyle}>
              <div style={codeLabelStyle}>Код сессии:</div>
              <p style={codeTextStyle}>{displayCode}</p>
            </div>

            {topic && (
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: 10,
                marginBottom: 20,
                overflow: 'hidden'
              }}>
                <div style={{
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {topic.title}
                </div>
                {topic.description && (
                  <div style={{
                    color: '#64748b',
                    fontSize: '0.9rem',
                    marginBottom: 8,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word'
                  }}>
                    {topic.description}
                  </div>
                )}
                <div style={{ color: '#334155', fontSize: '0.85rem' }}>
                  Вопросов: {question_count || 0} | Время на вопрос: {topic.time_per_question || '-'} сек
                </div>

                {!isStarted && (
                  <button
                    type="button"
                    onClick={startSession}
                    disabled={isStarting || students.length === 0}
                    style={{
                      width: '100%',
                      marginTop: 16,
                      padding: '14px 20px',
                      borderRadius: 10,
                      border: 'none',
                      background: isStarting || students.length === 0
                        ? '#94a3b8'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: isStarting || students.length === 0 ? 'not-allowed' : 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      boxShadow: isStarting || students.length === 0
                        ? 'none'
                        : '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    {isStarting ? 'Запуск...' : 'Начать тест'}
                  </button>
                )}

                {isStarted && (
                  <div style={{
                    marginTop: 16,
                    padding: '12px 16px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 10,
                    color: '#065f46',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    Тест начался!
                  </div>
                )}
              </div>
            )}

            {!topic && !isStarted && (
              <button
                type="button"
                onClick={startSession}
                disabled={isStarting || students.length === 0}
                style={{
                  width: '100%',
                  marginBottom: 20,
                  padding: '14px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: isStarting || students.length === 0
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: isStarting || students.length === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: isStarting || students.length === 0
                    ? 'none'
                    : '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                {isStarting ? 'Запуск...' : 'Начать тест'}
              </button>
            )}

            <div>
              <h2
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '1.1rem',
                  color: '#334155',
                  fontWeight: 700,
                }}
              >
                Подключённые студенты ({students.length})
              </h2>

              {students.length === 0 ? (
                <div
                  style={{
                    color: '#64748b',
                    textAlign: 'center',
                    padding: '24px 16px',
                    background: '#f8fafc',
                    borderRadius: 10,
                  }}
                >
                  Ожидание подключения студентов...
                </div>
              ) : (
                <ul style={studentListStyle}>
                  {students.map((student, index) => (
                    <li key={student.id || index} style={studentItemStyle}>
                      <div style={avatarStyle}>{getInitials(student)}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {getDisplayName(student)}
                        </div>
                        {student.email && (
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {student.email}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TeacherSessionPage
