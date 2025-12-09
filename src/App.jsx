import './App.css'
import AuthPage from './pages/AuthPage'
import TopicsPage from './pages/TopicsPage'
import TopicPage from './pages/TopicPage'
import TeacherSessionPage from './pages/TeacherSessionPage'
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const [isAuthed, setIsAuthed] = useState(() => {
    const raw = localStorage.getItem('token')
    return Boolean(raw && raw !== 'undefined' && raw !== 'null' && raw.trim() !== '')
  })
  if (!isAuthed) {
    return <AuthPage onAuth={() => setIsAuthed(true)} />
  }

  return (
    <Routes>
      <Route path="/" element={<TopicsPage />} />
      <Route path="/topic/:id" element={<TopicPage />} />
      <Route path="/teacher/session/:sessionId" element={<TeacherSessionPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
