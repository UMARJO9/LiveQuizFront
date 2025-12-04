import React from 'react'

const AddCard = ({ onClick }) => {
  return (
    <div className="ac-wrap" role="button" tabIndex={0} onClick={onClick}
         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}>
      <div className="ac-card">
        <div className="ac-plus" aria-hidden>+</div>
      </div>

      <style>{`
        .ac-wrap { border-radius: 18px; cursor: pointer; transform: translateZ(0); }
        .ac-wrap:hover { transform: scale(1.03); }
        .ac-wrap:focus { outline: none; }

        .ac-card { background: #fff; border-radius: 18px; padding: 20px; min-height: 180px;
                   display: grid; place-items: center; text-align: center;
                   box-shadow: 0 6px 18px rgba(0,0,0,0.05); transition: box-shadow .18s ease, background-color .18s ease; }
        .ac-wrap:hover .ac-card { box-shadow: 0 12px 24px rgba(0,0,0,0.08); background: #f5f8ff; }

        .ac-plus { width: 84px; height: 84px; border-radius: 18px; display: grid; place-items: center; font-size: 52px; font-weight: 800;
                   color: #4A90E2; background: rgba(74,144,226,0.12); }
      `}</style>
    </div>
  )
}

export default AddCard
