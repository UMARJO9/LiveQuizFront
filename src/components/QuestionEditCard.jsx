import React from 'react'

const QuestionEditCard = ({
  q,
  styles, dirty,
  saving, savedMsg, errors,
  deleting, deleteError,
  onChangeText, onChangeOptionText, onToggleOption,
  onSave, onDelete, onCancelChanges,
}) => {
  const { rowStyle, labelStyle, inputStyle, actionsStyle, successStyle, errorStyle } = styles

  return (
    <div style={{ padding: 16, background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
      {savedMsg ? <div style={{ ...successStyle, marginBottom: 8 }}>{savedMsg}</div> : null}
      {errors?.message ? <div style={{ ...errorStyle, marginBottom: 8 }}>{errors.message}</div> : null}

      <div style={rowStyle}>
        <label style={labelStyle}>
          Текст вопроса
          <input
            type="text"
            value={q.text ?? ''}
            onChange={(e) => onChangeText(e.target.value)}
            style={{ ...inputStyle, borderColor: errors?.text ? '#ef4444' : '#e2e8f0' }}
            placeholder="Введите текст вопроса"
          />
          {errors?.text && <span style={{ color: '#b91c1c', fontSize: 12 }}>{errors.text}</span>}
        </label>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ color: '#334155', fontWeight: 600 }}>Ответы на вопрос</div>
          {(q.options || []).map((opt, oi) => (
            <div key={opt.id ?? oi} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
              <input
                type="text"
                value={opt.text ?? ''}
                onChange={(e) => onChangeOptionText(oi, e.target.value)}
                style={{ ...inputStyle, margin: 0, borderColor: errors?.[`options.${oi}.text`] ? '#ef4444' : '#e2e8f0' }}
                placeholder={`Вариант ${oi + 1}`}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={!!opt.is_correct}
                  onChange={(e) => onToggleOption(oi, e.target.checked)}
                />
                Правильный ответ
              </label>
              {errors?.[`options.${oi}.text`] && (
                <div style={{ gridColumn: '1 / -1', color: '#b91c1c', fontSize: 12 }}>{errors[`options.${oi}.text`]}</div>
              )}
            </div>
          ))}
        </div>

        <div style={actionsStyle}>
          {dirty && (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={onSave}
                style={{
                  padding: '12px 16px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 24px rgba(37,99,235,0.25)'
                }}
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={onCancelChanges}
                style={{
                  padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0',
                  background: '#fff', color: '#0f172a', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Отменить изменения
              </button>
            </>
          )}
          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)' }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
            style={{
              padding: '12px 16px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff', fontWeight: 800, cursor: 'pointer', minWidth: 220,
              boxShadow: '0 10px 24px rgba(239,68,68,0.25)', transition: 'all 160ms ease-in-out'
            }}
          >
            {deleting ? 'Удаление...' : 'Удалить вопрос'}
          </button>
        </div>

        {deleteError ? <div style={{ ...errorStyle, marginTop: 8 }}>{deleteError}</div> : null}
      </div>
    </div>
  )
}

export default QuestionEditCard
