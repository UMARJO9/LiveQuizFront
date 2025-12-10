import { useEffect, useState, useCallback, useRef } from 'react'
import socket, { connectSocket } from '../api/socket'

const useTeacherSession = (sessionId) => {
  const [students, setStudents] = useState([])
  const [sessionCode, setSessionCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  // Состояние теста
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answerCount, setAnswerCount] = useState({ answered: 0, total: 0 })
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [ranking, setRanking] = useState([])
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [finalResults, setFinalResults] = useState(null)
  const [isLoadingNext, setIsLoadingNext] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)

  const timerRef = useRef(null)

  // Таймер
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [timeLeft, showResults])

  useEffect(() => {
    if (!sessionId) return

    connectSocket()

    const handleSessionState = ({ students: studentsList, code }) => {
      setStudents(studentsList || [])
      if (code) {
        setSessionCode(code)
      }
      setLoading(false)
    }

    const handleError = ({ message }) => {
      setError(message || 'Ошибка сессии')
      setLoading(false)
      setIsStarting(false)
      setIsLoadingNext(false)
    }

    const handleStudentJoined = ({ student }) => {
      if (student) {
        setStudents((prev) => {
          const exists = prev.some((s) => s.id === student.id || s.sid === student.sid)
          if (exists) return prev
          return [...prev, student]
        })
      }
    }

    const handleStudentLeft = ({ student_id, sid }) => {
      const idToRemove = student_id || sid
      if (idToRemove) {
        setStudents((prev) => prev.filter((s) => s.id !== idToRemove && s.sid !== idToRemove))
      }
    }

    const handleSessionStarted = ({ session_id }) => {
      if (session_id === sessionId) {
        setIsStarted(true)
        setIsStarting(false)
      }
    }

    // Получить вопрос
    const handleQuestion = (data) => {
      setCurrentQuestion(data)
      setTimeLeft(data.time || 30)
      setShowResults(false)
      setTimerExpired(false)
      setAnswerCount({ answered: 0, total: students.length })
      setIsLoadingNext(false)
    }

    // Время вышло
    const handleTimerExpired = () => {
      console.log('[Teacher] Timer expired')
      setTimerExpired(true)
      setTimeLeft(0)
    }

    // Счётчик ответов
    const handleAnswerCount = ({ answered, total }) => {
      setAnswerCount({ answered, total })
    }

    // Вопрос закрыт (время вышло)
    const handleQuestionClosed = () => {
      setTimeLeft(0)
      setShowResults(true)
    }

    // Рейтинг после вопроса
    const handleRanking = (data) => {
      console.log('[Teacher] Ranking received:', data)
      // data может быть массивом или объектом с players
      const players = Array.isArray(data) ? data : (data.players || data.scoreboard || [])
      console.log('[Teacher] Parsed players:', players)
      setRanking(players)
      setShowResults(true)
      setTimerExpired(false)
      setTimeLeft(0)
    }

    // Финал викторины
    const handleQuizFinished = (data) => {
      setIsQuizFinished(true)
      setFinalResults(data)
      setShowResults(true)
      setCurrentQuestion(null)
    }

    socket.on('session:state', handleSessionState)
    socket.on('session:error', handleError)
    socket.on('error', handleError)
    socket.on('session:student_joined', handleStudentJoined)
    socket.on('session:student_left', handleStudentLeft)
    socket.on('session:started', handleSessionStarted)
    socket.on('session:question', handleQuestion)
    socket.on('session:answer_count', handleAnswerCount)
    socket.on('session:timer_expired', handleTimerExpired)
    socket.on('session:question_closed', handleQuestionClosed)
    // Слушаем оба варианта названия событий
    socket.on('ranking', handleRanking)
    socket.on('session:ranking', handleRanking)
    socket.on('quiz_finished', handleQuizFinished)
    socket.on('session:quiz_finished', handleQuizFinished)

    socket.emit('teacher:join_session', { session_id: sessionId })

    return () => {
      socket.off('session:state', handleSessionState)
      socket.off('session:error', handleError)
      socket.off('error', handleError)
      socket.off('session:student_joined', handleStudentJoined)
      socket.off('session:student_left', handleStudentLeft)
      socket.off('session:started', handleSessionStarted)
      socket.off('session:question', handleQuestion)
      socket.off('session:answer_count', handleAnswerCount)
      socket.off('session:timer_expired', handleTimerExpired)
      socket.off('session:question_closed', handleQuestionClosed)
      socket.off('ranking', handleRanking)
      socket.off('session:ranking', handleRanking)
      socket.off('quiz_finished', handleQuizFinished)
      socket.off('session:quiz_finished', handleQuizFinished)
      socket.emit('teacher:leave_session', { session_id: sessionId })

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [sessionId, students.length])

  const startSession = useCallback(() => {
    if (!sessionId || isStarting || isStarted) return

    setIsStarting(true)
    setError('')
    socket.emit('teacher:start_session', { session_id: sessionId })
  }, [sessionId, isStarting, isStarted])

  const nextQuestion = useCallback(() => {
    if (!sessionId || isLoadingNext) return

    setIsLoadingNext(true)
    setShowResults(false)
    socket.emit('teacher:next_question', { session_id: sessionId })
  }, [sessionId, isLoadingNext])

  const finishSession = useCallback(() => {
    if (!sessionId) return

    socket.emit('teacher:finish_session', { session_id: sessionId })
  }, [sessionId])

  return {
    students,
    sessionCode,
    loading,
    error,
    isStarted,
    isStarting,
    startSession,
    // Quiz state
    currentQuestion,
    answerCount,
    timeLeft,
    showResults,
    ranking,
    isQuizFinished,
    finalResults,
    isLoadingNext,
    timerExpired,
    nextQuestion,
    finishSession,
  }
}

export default useTeacherSession
