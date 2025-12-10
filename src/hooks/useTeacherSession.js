import { useEffect, useState } from 'react'
import socket, { connectSocket } from '../api/socket'

const useTeacherSession = (sessionId) => {
  const [students, setStudents] = useState([])
  const [sessionCode, setSessionCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    }

    const handleStudentJoined = ({ student }) => {
      if (student) {
        setStudents((prev) => {
          const exists = prev.some((s) => s.id === student.id)
          if (exists) return prev
          return [...prev, student]
        })
      }
    }

    const handleStudentLeft = ({ student_id }) => {
      if (student_id) {
        setStudents((prev) => prev.filter((s) => s.id !== student_id))
      }
    }

    socket.on('session:state', handleSessionState)
    socket.on('session:error', handleError)
    socket.on('session:student_joined', handleStudentJoined)
    socket.on('session:student_left', handleStudentLeft)

    socket.emit('teacher:join_session', { session_id: sessionId })

    return () => {
      socket.off('session:state', handleSessionState)
      socket.off('session:error', handleError)
      socket.off('session:student_joined', handleStudentJoined)
      socket.off('session:student_left', handleStudentLeft)
      socket.emit('teacher:leave_session', { session_id: sessionId })
    }
  }, [sessionId])

  return {
    students,
    sessionCode,
    loading,
    error,
  }
}

export default useTeacherSession
