import { useState } from 'react'
import { request } from '../api/request'

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const modalStyle = {
  background: '#fff',
  borderRadius: 12,
  width: 'min(560px, 92vw)',
  padding: 24,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
}

const rowStyle = { display: 'flex', flexDirection: 'column', gap: 8 }
const gridStyle = { display: 'grid', gap: 16 }
const actionsStyle = { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }

const inputStyle = {
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
}

const errorStyle = {
  background: '#fee2e2',
  color: '#991b1b',
  border: '1px solid #fecaca',
  padding: '8px 12px',
  borderRadius: 8,
}

const CreateTopicModal = ({ onCancel, onCreated }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questionTimer, setQuestionTimer] = useState('20')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const validate = () => {
    if (!title.trim()) {
      setError('Название темы обязательно')
      return false
    }
    const n = Number(questionTimer)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Время на вопрос должно быть числом > 0')
      return false
    }
    return true
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setSubmitting(true)

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        question_timer: Number(questionTimer),
      }
      const { success, result, message } = await request('post', '/api/quizzes/', payload)
      if (success) {
        onCreated?.(result)
      } else {
        setError(message || 'Не удалось создать тему')
      }
    } catch (err) {
      setError(err.message || 'Ошибка запроса')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Создать тему</h2>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={onSubmit} style={gridStyle}>
          <label style={rowStyle}>
            <span style={{ color: '#334155', fontWeight: 600 }}>Название темы</span>
            <input
              style={inputStyle}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Основы HTML"
              required
            />
          </label>

          <label style={rowStyle}>
            <span style={{ color: '#334155', fontWeight: 600 }}>Описание</span>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Кратко опишите тему"
            />
          </label>

          <label style={rowStyle}>
            <span style={{ color: '#334155', fontWeight: 600 }}>Время на вопрос (сек.)</span>
            <input
              style={inputStyle}
              type="number"
              min={1}
              step={1}
              value={questionTimer}
              onChange={(e) => setQuestionTimer(e.target.value)}
              required
            />
          </label>

          <div style={actionsStyle}>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="button-secondary"
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#fff',
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="button-primary"
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: '#0ea5e9',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Создание…' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTopicModal

