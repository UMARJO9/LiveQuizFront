import React, { useMemo } from 'react'

const clampStyle = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const QuizCard = ({ title, description, question_timer, onClick }) => {
  const timerText = useMemo(() => {
    const n = Number(question_timer)
    return Number.isFinite(n) && n > 0 ? `${n} сек.` : null
  }, [question_timer])

  return (
    <div className="qc-wrap" role="button" tabIndex={0} onClick={onClick}
         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}>
      <div className="qc-glow" aria-hidden />
      <div className="qc-card">
        <h3 className="qc-title" title={title}>{title || 'Без названия'}</h3>
        {description && (
          <p className="qc-desc" title={description}>{description}</p>
        )}
        <div className="qc-timer">{timerText ? `⏱ ${timerText}` : '⏱ —'}</div>
      </div>

      <style>{`
        .qc-wrap { position: relative; border-radius: 18px; cursor: pointer; transform: translateZ(0); }
        .qc-wrap:hover { transform: scale(1.02); }
        .qc-wrap:focus { outline: none; box-shadow: 0 0 0 3px rgba(74,144,226,0.35); border-radius: 20px; }

        .qc-glow { position: absolute; inset: -4px; border-radius: 22px; background: linear-gradient(135deg, #4A90E2, #E94B3C);
                   filter: blur(16px); opacity: 0.55; z-index: 0; transition: opacity .18s ease, filter .18s ease; }
        .qc-wrap:hover .qc-glow { opacity: 0.75; filter: blur(20px); }

        .qc-card { position: relative; z-index: 1; background: #fff; border-radius: 18px; padding: 20px; min-height: 180px;
                   display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
                   box-shadow: 0 6px 18px rgba(0,0,0,0.08); transition: box-shadow .18s ease; }
        .qc-wrap:hover .qc-card { box-shadow: 0 12px 28px rgba(0,0,0,0.13); }

        .qc-title { margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;
                    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; text-overflow: ellipsis; word-break: break-word; }
        .qc-desc { margin: 0 0 12px 0; color: #64748b; font-size: 0.95rem; line-height: 1.45;
                   display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; text-overflow: ellipsis; word-break: break-word; }
        .qc-timer { color: #334155; font-size: .9rem; }
      `}</style>
    </div>
  )
}

export default QuizCard
