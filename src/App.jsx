import './App.css'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import {useState} from "react";

function App() {
  const [isAuthed, setIsAuthed] = useState(() => {
    const raw = localStorage.getItem('token')
    return Boolean(raw && raw !== 'undefined' && raw !== 'null' && raw.trim() !== '')
  })

  return isAuthed ? (
      <MainPage />
  ) : (
      <AuthPage onAuth={() => setIsAuthed(true)} />
  )
}

export default App
