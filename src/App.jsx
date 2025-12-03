import './App.css'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import {useState} from "react";

function App() {
  const [isAuthed, setIsAuthed] = useState(() => {
    return Boolean(localStorage.getItem('token'))
  })

  return isAuthed ? (
      <MainPage />
  ) : (
      <AuthPage onAuth={() => setIsAuthed(true)} />
  )
}

export default App
