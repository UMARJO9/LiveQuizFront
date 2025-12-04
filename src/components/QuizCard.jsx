import React from 'react'

const QuizCard = ({ quiz, onClick }) => {
  const { title, description, question_timer, created_at } = quiz || {}
  const created = created_at ? new Date(created_at) : null

  return (
    <div className="quiz-card" onClick={onClick} role="button" tabIndex={0}
         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}>
      <h3 className="quiz-title">{title || 'Без названия'}</h3>
      {description && <p className="quiz-desc">{description}</p>}
      <div className="quiz-meta">
        {Number.isFinite(Number(question_timer)) && (
          <span>⏱ {Number(question_timer)} сек.</span>
        )}
        {created && (
          <span>
            • {created.toLocaleDateString()} {created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
}

export default QuizCard

