const containerStyle = {
  background: '#fff',
  borderRadius: 18,
  padding: '24px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
}

const timerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  marginBottom: 20,
}

const timerCircleStyle = (timeLeft, totalTime) => {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
  const color = timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : '#10b981'
  return {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: `conic-gradient(${color} ${percentage}%, #e2e8f0 ${percentage}%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0f172a',
  }
}

const questionStyle = {
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  color: '#fff',
  padding: '24px',
  borderRadius: 14,
  marginBottom: 20,
  textAlign: 'center',
}

const questionTextStyle = {
  fontSize: '1.3rem',
  fontWeight: 700,
  margin: 0,
}

const optionsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
  marginBottom: 20,
}

const optionStyle = (index) => {
  const colors = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981']
  return {
    padding: '16px',
    borderRadius: 10,
    background: colors[index % 4],
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    textAlign: 'center',
  }
}

const answerCountStyle = {
  textAlign: 'center',
  padding: '16px',
  background: '#f8fafc',
  borderRadius: 10,
  marginBottom: 20,
}

const rankingListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
}

const rankingItemStyle = (position) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  background: position === 1 ? '#fef3c7' : position === 2 ? '#f1f5f9' : position === 3 ? '#fed7aa' : '#fff',
  borderRadius: 10,
  marginBottom: 8,
  border: position === 1 ? '2px solid #f59e0b' : '1px solid #e2e8f0',
})

const positionBadgeStyle = (position) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: position === 1 ? '#f59e0b' : position === 2 ? '#94a3b8' : position === 3 ? '#f97316' : '#e2e8f0',
  color: position <= 3 ? '#fff' : '#334155',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.9rem',
})

const nextButtonStyle = {
  width: '100%',
  padding: '16px 24px',
  borderRadius: 12,
  border: 'none',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  marginTop: 16,
}

const finishedContainerStyle = {
  textAlign: 'center',
  padding: '32px',
}

const winnerStyle = {
  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
  color: '#fff',
  padding: '24px',
  borderRadius: 14,
  marginBottom: 24,
}

const timerExpiredStyle = {
  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
  color: '#fff',
  padding: '24px',
  borderRadius: 14,
  marginBottom: 20,
  textAlign: 'center',
}

const TeacherQuizView = ({
  currentQuestion,
  answerCount,
  timeLeft,
  showResults,
  ranking,
  isQuizFinished,
  timerExpired,
  finalResults,
  isLoadingNext,
  nextQuestion,
  onBackToHome,
}) => {
  // Финальные результаты
  if (isQuizFinished && finalResults) {
    return (
      <div style={containerStyle}>
        <div style={finishedContainerStyle}>
          <h2 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '1.5rem' }}>
            Викторина завершена!
          </h2>

          {finalResults.winners && finalResults.winners.length > 0 && (
            <div style={winnerStyle}>
              <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: 8 }}>
                {finalResults.winners.length > 1 ? 'Победители' : 'Победитель'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {finalResults.winners.map((w) => w.name).join(', ')}
              </div>
              <div style={{ fontSize: '1.1rem', marginTop: 8 }}>
                {finalResults.winners[0]?.score || 0} баллов
              </div>
            </div>
          )}

          <h3 style={{ margin: '0 0 16px 0', color: '#334155', fontSize: '1.1rem' }}>
            Итоговый рейтинг
          </h3>

          <ul style={rankingListStyle}>
            {(finalResults.scoreboard || []).map((player, index) => (
              <li key={player.sid || player.name || index} style={rankingItemStyle(player.position)}>
                <div style={positionBadgeStyle(player.position)}>{player.position}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{player.name}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.1rem' }}>
                  {player.score} б.
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onBackToHome}
            style={{ ...nextButtonStyle, background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    )
  }

  // Показываем результаты после вопроса
  if (showResults && ranking.length > 0) {
    return (
      <div style={containerStyle}>
        <h2 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '1.3rem', textAlign: 'center' }}>
          Результаты вопроса
        </h2>

        <ul style={rankingListStyle}>
          {ranking.map((player, index) => (
            <li key={player.sid || player.name || index} style={rankingItemStyle(player.position)}>
              <div style={positionBadgeStyle(player.position)}>{player.position}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{player.name}</div>
              </div>
              <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.1rem' }}>
                {player.score} б.
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={nextQuestion}
          disabled={isLoadingNext}
          style={{
            ...nextButtonStyle,
            opacity: isLoadingNext ? 0.7 : 1,
            cursor: isLoadingNext ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoadingNext ? 'Загрузка...' : 'Следующий вопрос'}
        </button>
      </div>
    )
  }

  // Показываем текущий вопрос
  if (currentQuestion) {
    const totalTime = currentQuestion.time || 30

    return (
      <div style={containerStyle}>
        {/* Таймер */}
        <div style={timerStyle}>
          <div style={timerCircleStyle(timeLeft, totalTime)}>
            <span>{timeLeft}</span>
          </div>
        </div>

        {/* Вопрос */}
        <div style={questionStyle}>
          <p style={questionTextStyle}>{currentQuestion.text}</p>
        </div>

        {/* Варианты ответов */}
        <div style={optionsGridStyle}>
          {(currentQuestion.options || []).map((option, index) => (
            <div key={option.id || index} style={optionStyle(index)}>
              {option.text}
            </div>
          ))}
        </div>

        {/* Время вышло */}
        {timerExpired && (
          <div style={timerExpiredStyle}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Время вышло!
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: 8 }}>
              Ожидание результатов...
            </div>
          </div>
        )}

        {/* Счётчик ответов */}
        {!timerExpired && (
          <div style={answerCountStyle}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>
              {answerCount.answered} / {answerCount.total}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
              студентов ответили
            </div>
          </div>
        )}
      </div>
    )
  }

  // Ожидание первого вопроса
  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
        <div style={{
          width: 48,
          height: 48,
          border: '4px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <div>Загрузка вопроса...</div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}

export default TeacherQuizView
