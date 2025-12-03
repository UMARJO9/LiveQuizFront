import { useEffect, useState } from 'react'
import './App.css'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'

function App() {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthed(Boolean(token))
  }, [])

  return isAuthed ? <MainPage /> : <AuthPage onAuth={() => setIsAuthed(true)} />
}

export default App
