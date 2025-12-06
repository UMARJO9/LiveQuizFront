import React from 'react'

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
}

const modalStyle = {
  background: '#fff',
  borderRadius: 12,
  width: 'min(520px, 92vw)',
  padding: 24,
  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.22)',
}

const actionsStyle = {
  display: 'grid',
  gap: 12,
  marginTop: 16,
}

const buttonBase = {
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: '#fff',
  cursor: 'pointer',
  textAlign: 'left',
}

const ModalChooseQuestionType = ({ onSelect, onClose }) => {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Создать вопрос</h3>
        <p style={{ marginTop: 0, marginBottom: 12, color: '#475569' }}>
          Создать вопрос с одним правильным ответом или с несколькими правильными ответами?
        </p>

        <div style={actionsStyle}>
          <button
            type="button"
            style={{ ...buttonBase, borderColor: '#60a5fa', background: '#eff6ff', color: '#1d4ed8' }}
            onClick={() => onSelect?.('single')}
          >
            Один правильный ответ
          </button>
          <button
            type="button"
            style={{ ...buttonBase, borderColor: '#a5b4fc', background: '#eef2ff', color: '#4f46e5' }}
            onClick={() => onSelect?.('multiple')}
          >
            Несколько правильных ответов
          </button>
          <button
            type="button"
            style={{ ...buttonBase, justifySelf: 'flex-end', padding: '10px 14px', width: 'fit-content' }}
            onClick={onClose}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalChooseQuestionType
