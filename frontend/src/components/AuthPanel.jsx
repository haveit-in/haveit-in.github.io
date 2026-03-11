import AuthLogin from './AuthLogin.jsx'
import AuthSignup from './AuthSignup.jsx'

export default function AuthPanel({ open, mode, onClose, onModeChange }) {
  const isLogin = mode === 'login'

  return (
    <>
      <div
        className={`authOverlay ${open ? 'authOverlayOpen' : ''}`}
        onClick={onClose}
        aria-hidden={open ? undefined : true}
      />

      <aside
        className={`authPanel ${open ? 'authPanelOpen' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? 'Log in' : 'Sign up'}
      >
        <div className="authPanelHandle" aria-hidden="true" />

        <button type="button" className="authClose" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="authPanelBody">
          {isLogin ? (
            <AuthLogin onSuccess={onClose} onOpenSignup={() => onModeChange('signup')} />
          ) : (
            <AuthSignup onSuccess={onClose} onOpenLogin={() => onModeChange('login')} />
          )}
        </div>
      </aside>
    </>
  )
}

