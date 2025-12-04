import { useEffect, useState } from 'react'
import { request } from '../api/request'
import { useParams } from 'react-router-dom'

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef2ff 100%)',
  padding: '32px 16px',
}

const formStyle = {
  width: 'min(820px, 96vw)',
  padding: 0,
}

const labelStyle = { display: 'flex', flexDirection: 'column', gap: 8, color: '#334155', fontWeight: 600 }
const inputStyle = {
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  fontSize: 16,
}
const textareaStyle = { ...inputStyle, minHeight: 160, resize: 'vertical' }
const rowStyle = { display: 'grid', gap: 16, width: '100%' }
const actionsStyle = { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }

const successStyle = {
  background: '#ecfdf5',
  border: '1px solid #a7f3d0',
  color: '#065f46',
  padding: '10px 12px',
  borderRadius: 10,
}
const errorStyle = {
  background: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#991b1b',
  padding: '10px 12px',
  borderRadius: 10,
}

const TopicPage = () => {
  const { id: idParam } = useParams()
  const id = Number(idParam)

  const [initial, setInitial] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', question_timer: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let alive = true
    const load = async () => {
      setLoading(true)
      setErrorMsg('')
      setSuccessMsg('')
      try {
        const { success, result, message } = await request('get', `/api/quizzes/${id}/`)
        if (!alive) return
        if (success) {
          setInitial(result)
          setForm({
            title: result?.title ?? '',
            description: result?.description ?? '',
            question_timer: String(result?.question_timer ?? ''),
          })
        } else {
          setErrorMsg(message || 'Не удалось загрузить тему')
        }
      } catch (e) {
        if (!alive) return
        setErrorMsg(e.message || 'Ошибка запроса')
      } finally {
        if (alive) setLoading(false)
      }
    }
    if (Number.isFinite(id)) load()
    return () => { alive = false }
  }, [id])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const buildPatch = () => {
    const payload = {}
    const normTitle = (form.title || '').trim()
    const normDesc = (form.description || '').trim()
    const normTimer = Number(form.question_timer)
    if (initial?.title !== normTitle) payload.title = normTitle
    if ((initial?.description || '') !== normDesc) payload.description = normDesc
    if (Number(initial?.question_timer) !== normTimer && Number.isFinite(normTimer)) payload.question_timer = normTimer
    return payload
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg('')
    setSuccessMsg('')
    setFieldErrors({})
    try {
      const payload = buildPatch()
      if (Object.keys(payload).length === 0) {
        setSuccessMsg('Изменений нет')
        return
      }
      const { success, result, message, fields } = await request('patch', `/api/quizzes/${id}/`, payload)
      if (success) {
        setInitial(result)
        setForm({
          title: result?.title ?? '',
          description: result?.description ?? '',
          question_timer: String(result?.question_timer ?? ''),
        })
        setSuccessMsg('Успешно сохранено')
      } else {
        setErrorMsg(message || 'Не удалось сохранить')
        setFieldErrors(fields || {})
      }
    } catch (e2) {
      setErrorMsg(e2.message || 'Ошибка запроса')
    } finally {
      setSaving(false)
    }
  }

  if (!Number.isFinite(id)) {
    return <div style={pageStyle}><div style={cardStyle}>Неверный адрес</div></div>
  }

  return (
    <div style={pageStyle}>
      <form style={formStyle} onSubmit={onSave}>
        <h2 style={{ margin: '0 0 16px 0', color: '#0f172a', fontWeight: 800, fontSize: '1.6rem' }}>Редактирование темы #{id}</h2>

        {loading && <div style={{ color: '#64748b' }}>Загрузка…</div>}
        {!loading && errorMsg && <div style={errorStyle}>{errorMsg}</div>}
        {!loading && successMsg && <div style={successStyle}>{successMsg}</div>}

        {!loading && (
          <div style={rowStyle}>
            <label style={labelStyle}>
              Название
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={onChange}
                style={{ ...inputStyle, borderColor: fieldErrors.title ? '#ef4444' : '#e2e8f0' }}
                placeholder="Введите название"
              />
              {fieldErrors.title && <span style={{ color: '#b91c1c', fontSize: 12 }}>{fieldErrors.title}</span>}
            </label>

            <label style={labelStyle}>
              Описание
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                style={textareaStyle}
                placeholder="Кратко опишите тему"
              />
              {fieldErrors.description && <span style={{ color: '#b91c1c', fontSize: 12 }}>{fieldErrors.description}</span>}
            </label>

            <label style={labelStyle}>
              Время на вопрос (сек.)
              <input
                name="question_timer"
                type="number"
                min={1}
                step={1}
                value={form.question_timer}
                onChange={onChange}
                style={{ ...inputStyle, width: 220, borderColor: fieldErrors.question_timer ? '#ef4444' : '#e2e8f0' }}
              />
              {fieldErrors.question_timer && <span style={{ color: '#b91c1c', fontSize: 12 }}>{fieldErrors.question_timer}</span>}
            </label>

            <div style={actionsStyle}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 12px 30px rgba(37,99,235,0.25)',
                  width: '100%',
                }}
              >
                {saving ? 'Сохранение…' : 'Сохранить изменения'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default TopicPage
