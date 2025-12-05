import React from 'react'

const QuestionCreateForm = ({
  cf, cfi, styles,
  onChangeText, onChangeOptionText, onToggleOption,
  onCancel, onCreate,
}) => {
  const { rowStyle, labelStyle, inputStyle, actionsStyle, errorStyle } = styles

  return (
    <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
      {cf.error && <div style={{ ...errorStyle, marginBottom: 8 }}>{cf.error}</div>}
      <div style={rowStyle}>
        <label style={labelStyle}>
          Текст вопроса
          <input
            type="text"
            value={cf.text}
            onChange={(e) => onChangeText(e.target.value)}
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
                onChange={(e) => onChangeOptionText(oi, e.target.value)}
                style={{ ...inputStyle, margin: 0, borderColor: cf.fields?.[`options.${oi}.text`] ? '#ef4444' : '#e2e8f0' }}
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
              {cf.fields?.[`options.${oi}.text`] && (
                <div style={{ gridColumn: '1 / -1', color: '#b91c1c', fontSize: 12 }}>{cf.fields[`options.${oi}.text`]}</div>
              )}
            </div>
          ))}
        </div>

        <div style={actionsStyle}>
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={!!cf.saving}
            onClick={onCreate}
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
  )
}

export default QuestionCreateForm

