import React from 'react'

const TopicHeader = ({ id, deleting, error, onDelete }) => {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: '0 0 16px 0' }}>
        <h2 style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '1.6rem' }}>
          Редактирование темы #{id}
        </h2>
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)' }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(239,68,68,0.25)',
            transition: 'all 160ms ease-in-out',
          }}
        >
          {deleting ? 'Удаление…' : 'Удалить тему'}
        </button>
      </div>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 12px', borderRadius: 10, marginBottom: 8 }}>
          {error}
        </div>
      )}
    </>
  )
}

export default TopicHeader

