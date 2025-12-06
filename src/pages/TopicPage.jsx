import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { request } from '../api/request'
import TopicHeader from '../components/TopicHeader'
import QuestionEditCard from '../components/QuestionEditCard'
import QuestionCreateForm from '../components/QuestionCreateForm'
import ModalChooseQuestionType from '../components/ModalChooseQuestionType'

const pageStyle = {
  minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef2ff 100%)', padding: '32px 16px'
}
const formStyle = { width: 'min(860px, 96vw)' }
const labelStyle = { display: 'flex', flexDirection: 'column', gap: 8, color: '#334155', fontWeight: 600 }
const inputStyle = { padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 16 }
const textareaStyle = { ...inputStyle, minHeight: 160, resize: 'vertical' }
const rowStyle = { display: 'grid', gap: 16, width: '100%' }
const actionsStyle = { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }
const successStyle = { background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 12px', borderRadius: 10 }
const errorStyle = { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 12px', borderRadius: 10 }

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

  const [questions, setQuestions] = useState([])
  const [baselineQuestions, setBaselineQuestions] = useState({})
  const [savingMap, setSavingMap] = useState({})
  const [savedMap, setSavedMap] = useState({})
  const [questionErrors, setQuestionErrors] = useState({})
  const [deletingMap, setDeletingMap] = useState({})
  const [deleteErrors, setDeleteErrors] = useState({})

  const [createForms, setCreateForms] = useState([])
  const [topicDeleting, setTopicDeleting] = useState(false)
  const [topicDeleteError, setTopicDeleteError] = useState('')
  const [questionType, setQuestionType] = useState('single') // 'single' | 'multiple'
  const [showTypeModal, setShowTypeModal] = useState(false)

  const normalizeQuestion = (q) => ({
    text: (q?.text || '').trim(),
    options: Array.isArray(q?.options) ? q.options.map(o => ({ text: (o.text || '').trim(), is_correct: !!o.is_correct })) : []
  })
  const buildBaseline = (arr) => {
    const map = {}
    ;(arr || []).forEach(it => { if (it?.id != null) map[it.id] = normalizeQuestion(it) })
    return map
  }
  const hasQuestionChanged = (q) => {
    if (!q?.id) return false
    const base = baselineQuestions[q.id]; if (!base) return false
    const cur = normalizeQuestion(q)
    if (base.text !== cur.text) return true
    if ((base.options?.length || 0) !== (cur.options?.length || 0)) return true
    for (let i = 0; i < (cur.options || []).length; i++) {
      const b = base.options?.[i] || { text: '', is_correct: false }
      const c = cur.options?.[i] || { text: '', is_correct: false }
      if (b.text !== c.text || !!b.is_correct !== !!c.is_correct) return true
    }
    return false
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true); setErrorMsg(''); setSuccessMsg('')
      try {
        const { success, result, message } = await request('get', `/api/quizzes/${id}/`)
        if (!alive) return
        if (success) {
          setInitial(result)
          setForm({ title: result?.title ?? '', description: result?.description ?? '', question_timer: String(result?.question_timer ?? '') })
          const loaded = Array.isArray(result?.questions) ? result.questions : []
          setQuestions(loaded)
          setBaselineQuestions(buildBaseline(loaded))
        } else setErrorMsg(message || 'Не удалось загрузить данные')
      } catch (e) { if (alive) setErrorMsg(e.message || 'Ошибка сети') }
      finally { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
  }, [id])

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const buildPatch = () => {
    const payload = {}
    const t = (form.title || '').trim(); const d = (form.description || '').trim(); const timer = Number(form.question_timer)
    if (initial?.title !== t) payload.title = t
    if ((initial?.description || '') !== d) payload.description = d
    if (Number(initial?.question_timer) !== timer && Number.isFinite(timer)) payload.question_timer = timer
    return payload
  }
  const onSave = async (e) => {
    e.preventDefault(); setSaving(true); setErrorMsg(''); setSuccessMsg(''); setFieldErrors({})
    try {
      const payload = buildPatch(); if (Object.keys(payload).length === 0) { setSuccessMsg('Изменений нет'); return }
      const { success, result, message, fields } = await request('patch', `/api/quizzes/${id}/`, payload)
      if (success) { setInitial(result); setForm({ title: result?.title ?? '', description: result?.description ?? '', question_timer: String(result?.question_timer ?? '') }); setSuccessMsg('Сохранено') }
      else { setErrorMsg(message || 'Не удалось сохранить'); setFieldErrors(fields || {}) }
    } catch (e2) { setErrorMsg(e2.message || 'Ошибка сети') }
    finally { setSaving(false) }
  }

  const onDeleteQuestion = async (questionId) => {
    setDeleteErrors(m => ({ ...m, [questionId]: '' })); setDeletingMap(m => ({ ...m, [questionId]: true }))
    try {
      const { success, message } = await request('delete', `/api/questions/${questionId}/delete/`)
      if (success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId))
        setSavingMap(m => { const n = { ...m }; delete n[questionId]; return n })
        setSavedMap(m => { const n = { ...m }; delete n[questionId]; return n })
        setQuestionErrors(m => { const n = { ...m }; delete n[questionId]; return n })
        setDeleteErrors(m => { const n = { ...m }; delete n[questionId]; return n })
      } else setDeleteErrors(m => ({ ...m, [questionId]: message || 'Не удалось удалить вопрос' }))
    } catch (e) { setDeleteErrors(m => ({ ...m, [questionId]: e.message || 'Ошибка сети' })) }
    finally { setDeletingMap(m => ({ ...m, [questionId]: false })) }
  }

  const onSaveQuestion = async (q) => {
    setSavedMap(m => ({ ...m, [q.id]: '' })); setQuestionErrors(m => ({ ...m, [q.id]: {} })); setSavingMap(m => ({ ...m, [q.id]: true }))
    try {
      const payload = { topic_id: id, text: (q.text || '').trim(), options: (q.options || []).map(o => ({ id: o.id, text: (o.text || '').trim(), is_correct: !!o.is_correct })) }
      const { success, result, message, fields } = await request('patch', `/api/questions/${q.id}/`, payload)
      if (success) {
        const updated = result || payload
        setQuestions(prev => prev.map(it => it.id === q.id ? { ...it, ...updated } : it))
        setSavedMap(m => ({ ...m, [q.id]: 'Сохранено' }))
        setBaselineQuestions(m => ({ ...m, [q.id]: normalizeQuestion(updated) }))
      } else { setQuestionErrors(m => ({ ...m, [q.id]: fields || {} })); if (message) setErrorMsg(message) }
    } catch (e) { setErrorMsg(e.message || 'Ошибка сети') }
    finally { setSavingMap(m => ({ ...m, [q.id]: false })) }
  }

  const addCreateForm = (selectedType = 'single') => {
    setQuestionType(selectedType)
    setCreateForms(prev => ([
      ...prev,
      {
        key: Date.now() + Math.random(),
        text: '',
        options: Array.from({ length: 4 }).map(() => ({ text: '', is_correct: false })),
        error: '',
        fields: {},
        saving: false,
        questionType: selectedType,
      }
    ]))
  }
  const validateCreateForm = (cf) => {
    const fields = {}
    const text = (cf.text || '').trim()
    if (!text) fields.text = 'Заполните текст вопроса'

    const options = Array.isArray(cf.options) ? cf.options : []
    options.forEach((opt, idx) => {
      if (!(opt?.text || '').trim()) fields[`options.${idx}.text`] = 'Заполните текст варианта'
    })

    const correctCount = options.filter(o => o?.is_correct).length
    const type = cf.questionType || questionType
    if (correctCount === 0) {
      fields.options = 'Выберите хотя бы один правильный ответ'
    } else if (type === 'single' && correctCount > 1) {
      fields.options = 'Для одиночного вопроса можно выбрать только один правильный ответ'
    }

    const valid = Object.keys(fields).length === 0
    const error = fields.options || fields.text || ''
    return { valid, fields, error }
  }
  const onToggleCreateOption = (cfi, oi, checked, typeValue) => {
    setCreateForms(prev => prev.map((it, i) => {
      if (i !== cfi) return it
      const currentType = typeValue || it.questionType || questionType
      const nextOptions = (it.options || []).map((opt, idx) => {
        if (currentType === 'single') {
          if (idx === oi) return { ...opt, is_correct: checked }
          return checked ? { ...opt, is_correct: false } : opt
        }
        return idx === oi ? { ...opt, is_correct: checked } : opt
      })
      return { ...it, options: nextOptions }
    }))
  }
  const onCreateQuestion = async (cfi, cf) => {
    const validation = validateCreateForm(cf)
    if (!validation.valid) {
      setCreateForms(prev => prev.map((it, i) => i === cfi ? { ...it, error: validation.error, fields: validation.fields, saving: false } : it))
      return
    }
    setCreateForms(prev => prev.map((it, i) => i === cfi ? { ...it, saving: true, error: '', fields: {} } : it))
    try {
      const payload = { text: (cf.text || '').trim(), options: (cf.options || []).map(o => ({ text: (o.text || '').trim(), is_correct: !!o.is_correct })) }
      const { success, result, message, fields } = await request('post', `/api/topics/${id}/questions/`, payload)
      if (success) {
        const created = result || payload
        setQuestions(prev => Array.isArray(prev) ? [...prev, created] : [created])
        if (created?.id != null) setBaselineQuestions(m => ({ ...m, [created.id]: normalizeQuestion(created) }))
        setCreateForms(prev => prev.filter((_, i) => i !== cfi))
      } else setCreateForms(prev => prev.map((it, i) => i === cfi ? { ...it, error: (message || 'Не удалось создать вопрос'), fields: (fields || {}), saving: false } : it))
    } catch (e) { setCreateForms(prev => prev.map((it, i) => i === cfi ? { ...it, error: (e.message || 'Ошибка сети'), saving: false } : it)) }
  }

  if (!Number.isFinite(id)) return <div style={pageStyle}><div style={{ ...formStyle }}>Некорректный идентификатор</div></div>

  return (
    <div style={pageStyle}>
      <form style={formStyle} onSubmit={onSave}>
        <TopicHeader
          id={id}
          deleting={topicDeleting}
          error={topicDeleteError}
          onDelete={async () => {
            setTopicDeleteError(''); setTopicDeleting(true)
            try {
              const { success, message } = await request('delete', `/api/quizzes/${id}/`)
              if (success) window.location.assign('/')
              else setTopicDeleteError(message || 'Не удалось удалить тему')
            } catch (e) { setTopicDeleteError(e.message || 'Ошибка сети') }
            finally { setTopicDeleting(false) }
          }}
        />

        {loading && <div style={{ color: '#64748b' }}>Загрузка…</div>}
        {!loading && errorMsg && <div style={errorStyle}>{errorMsg}</div>}
        {!loading && successMsg && <div style={successStyle}>{successMsg}</div>}

        {!loading && (
          <div style={rowStyle}>
            <label style={labelStyle}>
              Название
              <input name="title" type="text" value={form.title} onChange={onChange} style={{ ...inputStyle, borderColor: fieldErrors.title ? '#ef4444' : '#e2e8f0' }} placeholder="Введите название" />
              {fieldErrors.title && <span style={{ color: '#b91c1c', fontSize: 12 }}>{fieldErrors.title}</span>}
            </label>
            <label style={labelStyle}>
              Описание
              <textarea name="description" value={form.description} onChange={onChange} style={textareaStyle} placeholder="Введите описание" />
              {fieldErrors.description && <span style={{ color: '#b91c1c', fontSize: 12 }}>{fieldErrors.description}</span>}
            </label>
            <label style={labelStyle}>
              Таймер вопроса (сек.)
              <input name="question_timer" type="number" min={1} step={1} value={form.question_timer} onChange={onChange} style={{ ...inputStyle, width: 220, borderColor: fieldErrors.question_timer ? '#ef4444' : '#e2e8f0' }} />
              {fieldErrors.question_timer && <span style={{ color: '#b91c1c', fontSize: 12 }}>{fieldErrors.question_timer}</span>}
            </label>
            <div style={actionsStyle}>
              {Object.keys(buildPatch()).length > 0 && (
                <button type="submit" disabled={saving} style={{ padding: '14px 18px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 12px 30px rgba(37,99,235,0.25)', width: '100%' }}>
                  {saving ? 'Сохранение…' : 'Сохранить изменения'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Questions */}
        {!loading && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Вопросы</h3>

            {questions && questions.length > 0 && (
              <div style={{ display: 'grid', gap: 16 }}>
                {questions.map((q, qi) => (
                  <QuestionEditCard
                    key={q.id ?? qi}
                    q={q}
                    qi={qi}
                    styles={{ rowStyle, labelStyle, inputStyle, actionsStyle, successStyle, errorStyle }}
                    dirty={hasQuestionChanged(q)}
                    saving={!!savingMap[q.id]}
                    savedMsg={savedMap[q.id] || ''}
                    errors={questionErrors[q.id] || {}}
                    deleting={!!deletingMap[q.id]}
                    deleteError={deleteErrors[q.id] || ''}
                    onChangeText={(value) => setQuestions(prev => prev.map((it, i) => i === qi ? { ...it, text: value } : it))}
                    onChangeOptionText={(oi, value) => setQuestions(prev => prev.map((it, i) => { if (i !== qi) return it; const next = [...(it.options || [])]; next[oi] = { ...next[oi], text: value }; return { ...it, options: next } }))}
                    onToggleOption={(oi, checked) => setQuestions(prev => prev.map((it, i) => { if (i !== qi) return it; const next = [...(it.options || [])]; next[oi] = { ...next[oi], is_correct: checked }; return { ...it, options: next } }))}
                    onSave={() => onSaveQuestion(q)}
                    onDelete={() => onDeleteQuestion(q.id)}
                  />
                ))}
              </div>
            )}

            {createForms.map((cf, cfi) => (
              <QuestionCreateForm
                key={cf.key ?? cfi}
                cf={cf}
                cfi={cfi}
                questionType={cf.questionType || questionType}
                styles={{ rowStyle, labelStyle, inputStyle, actionsStyle, errorStyle }}
                onChangeText={(value) => setCreateForms(prev => prev.map((it, i) => i === cfi ? { ...it, text: value } : it))}
                onChangeOptionText={(oi, value) => setCreateForms(prev => prev.map((it, i) => { if (i !== cfi) return it; const next = [...(it.options || [])]; next[oi] = { ...next[oi], text: value }; return { ...it, options: next } }))}
                onToggleOption={(oi, checked) => onToggleCreateOption(cfi, oi, checked, cf.questionType || questionType)}
                onCancel={() => setCreateForms(prev => prev.filter((_, i) => i !== cfi))}
                onCreate={() => onCreateQuestion(cfi, cf)}
              />
            ))}

            <button type="button" onClick={() => setShowTypeModal(true)} style={{ width: '100%', padding: '18px 16px', borderRadius: 12, border: '1px dashed #94a3b8', background: '#fff', color: '#2563eb', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: 16, marginBottom: 16 }}>
              + Добавить вопрос
            </button>
          </div>
        )}
      </form>
      {showTypeModal && (
        <ModalChooseQuestionType
          onClose={() => setShowTypeModal(false)}
          onSelect={(type) => { addCreateForm(type); setShowTypeModal(false) }}
        />
      )}
    </div>
  )
}

export default TopicPage

