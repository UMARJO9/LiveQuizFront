import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const TopicCard = ({ topic, onStartTest }) => {
  const navigate = useNavigate()

  const timerText = useMemo(() => {
    const n = Number(topic?.question_timer)
    return Number.isFinite(n) && n > 0 ? `${n} сек` : null
  }, [topic?.question_timer])

  const handleCardClick = () => {
    if (topic?.id != null) {
      navigate(`/topic/${topic.id}`)
    }
  }

  const handleStartTest = (e) => {
    e.stopPropagation()
    if (onStartTest && topic?.id != null) {
      onStartTest(topic.id)
    }
  }

  return (
    <div
      className="topic-card-wrap"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
    >
      <div className="topic-card-glow" aria-hidden />
      <div className="topic-card">
        <h3 className="topic-card-title" title={topic?.title}>
          {topic?.title || 'Без названия'}
        </h3>
        {topic?.description && (
          <p className="topic-card-desc" title={topic.description}>
            {topic.description}
          </p>
        )}
        <div className="topic-card-timer">Таймер: {timerText || '-'}</div>
        <button
          type="button"
          className="topic-card-start-btn"
          onClick={handleStartTest}
        >
          Начать тест
        </button>
      </div>

      <style>{`
        .topic-card-wrap {
          position: relative;
          border-radius: 18px;
          cursor: pointer;
          transform: translateZ(0);
          transition: transform 0.18s ease;
        }
        .topic-card-wrap:hover {
          transform: scale(1.02);
        }
        .topic-card-wrap:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.35);
          border-radius: 20px;
        }

        .topic-card-glow {
          position: absolute;
          inset: -4px;
          border-radius: 22px;
          background: linear-gradient(135deg, #4A90E2, #E94B3C);
          filter: blur(16px);
          opacity: 0.55;
          z-index: 0;
          transition: opacity 0.18s ease, filter 0.18s ease;
        }
        .topic-card-wrap:hover .topic-card-glow {
          opacity: 0.75;
          filter: blur(20px);
        }

        .topic-card {
          position: relative;
          z-index: 1;
          background: #fff;
          border-radius: 18px;
          padding: 20px;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          transition: box-shadow 0.18s ease;
        }
        .topic-card-wrap:hover .topic-card {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.13);
        }

        .topic-card-title {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
        }

        .topic-card-desc {
          margin: 0 0 12px 0;
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
        }

        .topic-card-timer {
          color: #334155;
          font-size: 0.9rem;
          margin-bottom: 14px;
        }

        .topic-card-start-btn {
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .topic-card-start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }
        .topic-card-start-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

export default TopicCard
