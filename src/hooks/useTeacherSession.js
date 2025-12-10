import { useEffect, useState, useCallback } from 'react'
import socket, { connectSocket } from '../api/socket'

const useTeacherSession = (sessionId) => {
  const [students, setStudents] = useState([])
  const [sessionCode, setSessionCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

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

    socket.on('session:state', handleSessionState)
    socket.on('session:error', handleError)
    socket.on('error', handleError)
    socket.on('session:student_joined', handleStudentJoined)
    socket.on('session:student_left', handleStudentLeft)
    socket.on('session:started', handleSessionStarted)

    socket.emit('teacher:join_session', { session_id: sessionId })

    return () => {
      socket.off('session:state', handleSessionState)
      socket.off('session:error', handleError)
      socket.off('error', handleError)
      socket.off('session:student_joined', handleStudentJoined)
      socket.off('session:student_left', handleStudentLeft)
      socket.off('session:started', handleSessionStarted)
      socket.emit('teacher:leave_session', { session_id: sessionId })
    }
  }, [sessionId])

  const startSession = useCallback(() => {
    if (!sessionId || isStarting || isStarted) return

    setIsStarting(true)
    setError('')
    socket.emit('teacher:start_session', { session_id: sessionId })
  }, [sessionId, isStarting, isStarted])

  return {
    students,
    sessionCode,
    loading,
    error,
    isStarted,
    isStarting,
    startSession,
  }
}

export default useTeacherSession
