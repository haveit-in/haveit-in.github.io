import { Navigate, Route, Routes } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import './app.css'
import Landing from './pages/Landing.jsx'
import AuthPanel from './components/AuthPanel.jsx'

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'

  const openLogin = useCallback(() => {
    setAuthMode('login')
    setAuthOpen(true)
  }, [])

  const openSignup = useCallback(() => {
    setAuthMode('signup')
    setAuthOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setAuthOpen(false)
  }, [])

  useEffect(() => {
    if (!authOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeAuth()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [authOpen, closeAuth])

  useEffect(() => {
    const original = document.body.style.overflow
    if (authOpen) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [authOpen])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Landing onOpenLogin={openLogin} onOpenSignup={openSignup} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AuthPanel
        open={authOpen}
        mode={authMode}
        onClose={closeAuth}
        onModeChange={setAuthMode}
      />
    </>
  )
}

export default App
