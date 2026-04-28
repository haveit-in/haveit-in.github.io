import { Navigate, Route, Routes } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Landing from './pages/Landing.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import PartnerLanding from './pages/PartnerLanding.jsx'
import PartnerLogin from './pages/PartnerLogin.jsx'
import PartnerRegister from './pages/PartnerRegister.jsx'
import AuthPanel from './components/AuthPanel.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [activeMode, setActiveMode] = useState('food') // 'food' | 'groceries'

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
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={<Landing onOpenLogin={openLogin} onOpenSignup={openSignup} activeMode={activeMode} setActiveMode={setActiveMode} />}
        />
        <Route
          path="/profile"
          element={<ProfilePage activeMode={activeMode} />}
        />
        <Route
          path="/partner"
          element={<PartnerLanding />}
        />
        <Route
          path="/partner/login"
          element={<PartnerLogin />}
        />
        <Route
          path="/partner/register"
          element={<PartnerRegister />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AuthPanel
        open={authOpen}
        mode={authMode}
        onClose={closeAuth}
        onModeChange={setAuthMode}
        activeMode={activeMode}
      />
    </AuthProvider>
  )
}

export default App
