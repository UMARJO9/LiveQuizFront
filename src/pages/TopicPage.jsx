import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { request } from '../api/request'

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef2ff 100%)',
  padding: '32px 16px',
}

const formStyle = {
  width: 'min(860px, 96vw)',
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

  const [questions, setQuestions] = useState([])
  const [createForms, setCreateForms] = useState([])
  const [savingMap, setSavingMap] = useState({})
  const [savedMap, setSavedMap] = useState({})
  const [questionErrors, setQuestionErrors] = useState({})
  const [deletingMap, setDeletingMap] = useState({})
  const [deleteErrors, setDeleteErrors] = useState({})
  const [baselineQuestions, setBaselineQuestions] = useState({})

  const normalizeQuestion = (q) => {
    if (!q) return { text: '', options: [] }
    const text = (q.text || '').trim()
    const options = Array.isArray(q.options)
      ? q.options.map((o) => ({ text: (o.text || '').trim(), is_correct: !!o.is_correct }))
      : []
    return { text, options }
  }

  const buildBaseline = (arr) => {
    const map = {}
    if (Array.isArray(arr)) {
      for (const it of arr) {
        if (it?.id != null) map[it.id] = normalizeQuestion(it)
      }
    }
    return map
  }

  const hasQuestionChanged = (q) => {
    if (!q?.id) return false
    const base = baselineQuestions[q.id]
    if (!base) return false
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
          const loadedQuestions = Array.isArray(result?.questions) ? result.questions : []
          setQuestions(loadedQuestions)
          setBaselineQuestions(buildBaseline(loadedQuestions))
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

  const deleteQuestion = async (questionId) => {
    setDeleteErrors((m) => ({ ...m, [questionId]: '' }))
    setDeletingMap((m) => ({ ...m, [questionId]: true }))
    try {
      const { success, message } = await request('delete', `/api/questions/${questionId}/delete/`)
      if (success) {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId))
        setSavingMap((m) => { const n = { ...m }; delete n[questionId]; return n })
        setSavedMap((m) => { const n = { ...m }; delete n[questionId]; return n })
        setQuestionErrors((m) => { const n = { ...m }; delete n[questionId]; return n })
        setDeleteErrors((m) => { const n = { ...m }; delete n[questionId]; return n })
      } else {
        setDeleteErrors((m) => ({ ...m, [questionId]: message || 'Не удалось удалить вопрос' }))
      }
    } catch (e) {
      setDeleteErrors((m) => ({ ...m, [questionId]: e.message || 'Ошибка сети' }))
    } finally {
      setDeletingMap((m) => ({ ...m, [questionId]: false }))
    }
  }

  if (!Number.isFinite(id)) {
    return <div style={pageStyle}><div style={{ ...formStyle }}>Неверный адрес</div></div>
  }

  return (
    <div style={pageStyle}>
      <form style={formStyle} onSubmit={onSave}>
        <h2 style={{ margin: '0 0 16px 0', color: '#0f172a', fontWeight: 800, fontSize: '1.6rem' }}>
          Редактирование темы #{id}
        </h2>

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

        {/* Questions */}
        {!loading && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Вопросы</h3>

            <button
              type="button"
              onClick={() => { setCreating(true); setCreateError(''); setCreateFields({}); }}
              style={{
                display: 'none',
                width: '100%',
                padding: '18px 16px',
                borderRadius: 12,
                border: '1px dashed #94a3b8',
                background: '#fff',
                color: '#4A90E2',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              + Добавить вопрос
            </button>

            {false && (
              <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
                {createError && <div style={{ ...errorStyle, marginBottom: 8 }}>{createError}</div>}
                <div style={rowStyle}>
                  <label style={labelStyle}>
                    Вопрос
                    <input
                      type="text"
                      value={createForm.text}
                      onChange={(e) => setCreateForm((p) => ({ ...p, text: e.target.value }))}
                      style={{ ...inputStyle, borderColor: createFields.text ? '#ef4444' : '#e2e8f0' }}
                      placeholder="Введите текст вопроса"
                    />
                    {createFields.text && <span style={{ color: '#b91c1c', fontSize: 12 }}>{createFields.text}</span>}
                  </label>

                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ color: '#334155', fontWeight: 600 }}>Варианты</div>
                    {createForm.options.map((opt, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => setCreateForm((p) => {
                            const next = [...p.options]
                            next[idx] = { ...next[idx], text: e.target.value }
                            return { ...p, options: next }
                          })}
                          style={{ ...inputStyle, margin: 0, borderColor: createFields[`options.${idx}.text`] ? '#ef4444' : '#e2e8f0' }}
                          placeholder={`Вариант ${idx + 1}`}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
                          <input
                            type="checkbox"
                            checked={!!opt.is_correct}
                            onChange={(e) => setCreateForm((p) => {
                              const next = [...p.options]
                              next[idx] = { ...next[idx], is_correct: e.target.checked }
                              return { ...p, options: next }
                            })}
                          />
                          Правильный
                        </label>
                        {createFields[`options.${idx}.text`] && (
                          <div style={{ gridColumn: '1 / -1', color: '#b91c1c', fontSize: 12 }}>{createFields[`options.${idx}.text`]}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={actionsStyle}>
                    <button
                      type="button"
                      onClick={() => { setCreating(false); setCreateError(''); setCreateFields({}); setCreateForm({ text: '', options: createForm.options.map(() => ({ text: '', is_correct: false })) }) }}
                      style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      disabled={createSaving}
                      onClick={async () => {
                        setCreateError('')
                        setCreateFields({})
                        setCreateSaving(true)
                        try {
                          const payload = {
                            text: (createForm.text || '').trim(),
                            options: createForm.options.map((o) => ({ text: (o.text || '').trim(), is_correct: !!o.is_correct })),
                          }
                          const { success, result, message, fields } = await request('post', `/api/topics/${id}/questions/`, payload)
                          if (success) {
                            const created = result || payload
                            setQuestions((prev) => Array.isArray(prev) ? [...prev, created] : [created])
                            setCreating(false)
                            setCreateForm({ text: '', options: createForm.options.map(() => ({ text: '', is_correct: false })) })
                          } else {
                            setCreateError(message || 'Не удалось создать вопрос')
                            setCreateFields(fields || {})
                          }
                        } catch (e) {
                          setCreateError(e.message || 'Ошибка запроса')
                        } finally {
                          setCreateSaving(false)
                        }
                      }}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#fff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 10px 24px rgba(16,185,129,0.25)'
                      }}
                    >
                      {createSaving ? 'Создание…' : 'Создать вопрос'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {questions && questions.length > 0 && (
              <div style={{ display: 'grid', gap: 16 }}>
                {questions.map((q, qi) => (
                  <div key={q.id ?? qi} style={{ padding: 16, background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
                    {savedMap[q.id] && (
                      <div style={{ ...successStyle, marginBottom: 8 }}>{savedMap[q.id]}</div>
                    )}
                    {questionErrors[q.id]?.message && (
                      <div style={{ ...errorStyle, marginBottom: 8 }}>{questionErrors[q.id].message}</div>
                    )}
                    <div style={rowStyle}>
                      <label style={labelStyle}>
                        Вопрос
                        <input
                          type="text"
                          value={q.text ?? ''}
                          onChange={(e) => setQuestions((prev) => prev.map((it, i) => i === qi ? { ...it, text: e.target.value } : it))}
                          style={{ ...inputStyle, borderColor: questionErrors[q.id]?.text ? '#ef4444' : '#e2e8f0' }}
                          placeholder="Введите текст вопроса"
                        />
                        {questionErrors[q.id]?.text && <span style={{ color: '#b91c1c', fontSize: 12 }}>{questionErrors[q.id].text}</span>}
                      </label>

                      <div style={{ display: 'grid', gap: 12 }}>
                        <div style={{ color: '#334155', fontWeight: 600 }}>Варианты</div>
                        {(q.options || []).map((opt, oi) => (
                          <div key={opt.id ?? oi} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                            <input
                              type="text"
                              value={opt.text ?? ''}
                              onChange={(e) => setQuestions((prev) => prev.map((it, i) => {
                                if (i !== qi) return it
                                const nextOpts = [...(it.options || [])]
                                nextOpts[oi] = { ...nextOpts[oi], text: e.target.value }
                                return { ...it, options: nextOpts }
                              }))}
                              style={{ ...inputStyle, margin: 0, borderColor: questionErrors[q.id]?.[`options.${oi}.text`] ? '#ef4444' : '#e2e8f0' }}
                              placeholder={`Вариант ${oi + 1}`}
                            />
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
                              <input
                                type="checkbox"
                                checked={!!opt.is_correct}
                                onChange={(e) => setQuestions((prev) => prev.map((it, i) => {
                                  if (i !== qi) return it
                                  const nextOpts = [...(it.options || [])]
                                  nextOpts[oi] = { ...nextOpts[oi], is_correct: e.target.checked }
                                  return { ...it, options: nextOpts }
                                }))}
                              />
                              Правильный
                            </label>
                            {questionErrors[q.id]?.[`options.${oi}.text`] && (
                              <div style={{ gridColumn: '1 / -1', color: '#b91c1c', fontSize: 12 }}>{questionErrors[q.id][`options.${oi}.text`]}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={actionsStyle}>
                        {hasQuestionChanged(q) && (
                        <button
                          type="button"
                          disabled={!!savingMap[q.id]}
                          onClick={async () => {
                            setSavedMap((m) => ({ ...m, [q.id]: '' }))
                            setQuestionErrors((m) => ({ ...m, [q.id]: {} }))
                            setSavingMap((m) => ({ ...m, [q.id]: true }))
                            try {
                              const payload = {
                                topic_id: id,
                                text: (q.text || '').trim(),
                                options: (q.options || []).map((o) => ({ id: o.id, text: (o.text || '').trim(), is_correct: !!o.is_correct })),
                              }
                              const { success, result, message, fields } = await request('patch', `/api/questions/${q.id}/`, payload)
                              if (success) {
                                const updated = result || payload
                                setQuestions((prev) => prev.map((it) => (it.id === q.id ? { ...it, ...updated } : it)))
                                setBaselineQuestions((m) => ({ ...m, [q.id]: normalizeQuestion(updated) }))
                                setSavedMap((m) => ({ ...m, [q.id]: 'Сохранено' }))
                              } else {
                                setQuestionErrors((m) => ({ ...m, [q.id]: fields || {} }))
                                setSavedMap((m) => ({ ...m, [q.id]: '' }))
                                if (message) setErrorMsg(message)
                              }
                            } catch (e) {
                              setSavedMap((m) => ({ ...m, [q.id]: '' }))
                              setErrorMsg(e.message || 'Ошибка запроса')
                            } finally {
                              setSavingMap((m) => ({ ...m, [q.id]: false }))
                            }
                          }}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 10,
                            border: 'none',
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            color: '#fff',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 10px 24px rgba(37,99,235,0.25)'
                          }}
                        >
                          {savingMap[q.id] ? 'Сохранение…' : 'Сохранить изменения'}
                        </button>
                        )}
                        <button
                          type="button"
                          disabled={!!deletingMap[q.id]}
                          onClick={() => deleteQuestion(q.id)}
                          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 10,
                            border: 'none',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: '#fff',
                            fontWeight: 800,
                            cursor: 'pointer',
                            minWidth: 220,
                            boxShadow: '0 10px 24px rgba(239,68,68,0.25)',
                            transition: 'all 160ms ease-in-out',
                          }}
                        >
                          {deletingMap[q.id] ? 'Удаление…' : 'Удалить вопрос'}
                        </button>
                      </div>

                      {deleteErrors[q.id] && (
                        <div style={{ ...errorStyle, marginTop: 8 }}>{deleteErrors[q.id]}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {createForms.map((cf, cfi) => (
              <div key={cf.key ?? cfi} style={{ marginTop: 12, padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
                {cf.error && <div style={{ ...errorStyle, marginBottom: 8 }}>{cf.error}</div>}
                <div style={rowStyle}>
                  <label style={labelStyle}>
                    Текст вопроса
                    <input
                      type="text"
                      value={cf.text}
                      onChange={(e) => setCreateForms((prev) => prev.map((it, i) => i === cfi ? { ...it, text: e.target.value } : it))}
                      style={{ ...inputStyle, borderColor: cf.fields?.text ? '#ef4444' : '#e2e8f0' }}
                      placeholder="Введите текст вопроса"
                    />
                    {cf.fields?.text && <span style={{ color: '#b91c1c', fontSize: 12 }}>{cf.fields.text}</span>}
                  </label>

                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ color: '#334155', fontWeight: 600 }}>Варианты ответа</div>
                    {(cf.options || []).map((opt, oi) => (
                      <div key={oi} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => setCreateForms((prev) => prev.map((it, i) => {
                            if (i !== cfi) return it
                            const next = [...(it.options || [])]
                            next[oi] = { ...next[oi], text: e.target.value }
                            return { ...it, options: next }
                          }))}
                          style={{ ...inputStyle, margin: 0, borderColor: cf.fields?.[`options.${oi}.text`] ? '#ef4444' : '#e2e8f0' }}
                          placeholder={`Вариант ${oi + 1}`}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
                          <input
                            type="checkbox"
                            checked={!!opt.is_correct}
                            onChange={(e) => setCreateForms((prev) => prev.map((it, i) => {
                              if (i !== cfi) return it
                              const next = [...(it.options || [])]
                              next[oi] = { ...next[oi], is_correct: e.target.checked }
                              return { ...it, options: next }
                            }))}
                          />
                          Правильный ответ
                        </label>
                        {cf.fields?.[`options.${oi}.text`] && (
                          <div style={{ gridColumn: '1 / -1', color: '#b91c1c', fontSize: 12 }}>{cf.fields[`options.${oi}.text`]}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={actionsStyle}>
                    <button
                      type="button"
                      onClick={() => setCreateForms((prev) => prev.filter((_, i) => i !== cfi))}
                      style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      disabled={!!cf.saving}
                      onClick={async () => {
                        setCreateForms((prev) => prev.map((it, i) => i === cfi ? { ...it, error: '', fields: {}, saving: true } : it))
                        try {
                          const payload = {
                            text: (cf.text || '').trim(),
                            options: (cf.options || []).map((o) => ({ text: (o.text || '').trim(), is_correct: !!o.is_correct })),
                          }
                          const { success, result, message, fields } = await request('post', `/api/topics/${id}/questions/`, payload)
                          if (success) {
                            const created = result || payload
                            setQuestions((prev) => Array.isArray(prev) ? [...prev, created] : [created])
                            if (created?.id != null) {
                              setBaselineQuestions((m) => ({ ...m, [created.id]: normalizeQuestion(created) }))
                            }
                            setCreateForms((prev) => prev.filter((_, i) => i !== cfi))
                          } else {
                            setCreateForms((prev) => prev.map((it, i) => i === cfi ? { ...it, error: (message || 'Не удалось создать вопрос'), fields: (fields || {}), saving: false } : it))
                          }
                        } catch (e) {
                          setCreateForms((prev) => prev.map((it, i) => i === cfi ? { ...it, error: (e.message || 'Ошибка сети'), saving: false } : it))
                        }
                      }}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#fff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 10px 24px rgba(16,185,129,0.25)'
                      }}
                    >
                      {cf.saving ? 'Создание…' : 'Создать вопрос'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setCreateForms((prev) => ([
                ...prev,
                {
                  key: Date.now() + Math.random(),
                  text: '',
                  options: [
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                  ],
                  error: '',
                  fields: {},
                  saving: false,
                },
              ]))}
              style={{
                width: '100%',
                padding: '18px 16px',
                borderRadius: 12,
                border: '1px dashed #94a3b8',
                background: '#fff',
                color: '#2563eb',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              + Добавить вопрос
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default TopicPage
