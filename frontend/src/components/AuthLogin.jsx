import { useMemo, useState } from 'react'
import Brand from './Brand.jsx'
import TextField from './TextField.jsx'
import { FacebookIcon, GoogleIcon } from './Icons.jsx'
import { loginWithGoogle } from '../utils/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useRoleRedirect } from '../context/useRoleRedirect.jsx'
import SocialAuthButtons from './SocialAuthButtons.jsx'

function isValidPhone(value) {
  const digits = value.replace(/[^\d]/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export default function AuthLogin({ onSuccess, onOpenSignup, activeMode = 'food' }) {
  const { login } = useAuth()
  const { handleLoginRedirect } = useRoleRedirect()
  const [loginMethod, setLoginMethod] = useState('email')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  const errors = useMemo(() => {
    if (!touched) return {}
    return {
      phone:
        phone.trim().length === 0
          ? 'Mobile number is required.'
          : !isValidPhone(phone)
            ? 'Enter a valid mobile number.'
            : '',
      otp: otpSent && otp.trim().length < 4 ? 'Enter the OTP.' : '',
    }
  }, [phone, otp, otpSent, touched])

  async function sendOtp() {
    setTouched(true)
    if (errors.phone) return
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 450))
      setOtpSent(true)
    } finally {
      setSubmitting(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (errors.phone) return
    if (!otpSent) return sendOtp()
    if (errors.otp) return

    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 550))
      onSuccess?.()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Email/Phone Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setLoginMethod('email')}
          style={{
            flex: 1,
            padding: '10px',
            border: `1px solid ${loginMethod === 'email' ? (activeMode === 'food' ? '#f97316' : '#22c55e') : '#e5e7eb'}`,
            backgroundColor: loginMethod === 'email' ? (activeMode === 'food' ? '#fff7ed' : '#f0fdf4') : '#ffffff',
            borderRadius: '8px',
            color: loginMethod === 'email' ? (activeMode === 'food' ? '#f97316' : '#22c55e') : '#6b7280',
            fontWeight: loginMethod === 'email' ? '600' : '400',
            cursor: 'pointer'
          }}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod('phone')}
          style={{
            flex: 1,
            padding: '10px',
            border: `1px solid ${loginMethod === 'phone' ? (activeMode === 'food' ? '#f97316' : '#22c55e') : '#e5e7eb'}`,
            backgroundColor: loginMethod === 'phone' ? (activeMode === 'food' ? '#fff7ed' : '#f0fdf4') : '#ffffff',
            borderRadius: '8px',
            color: loginMethod === 'phone' ? (activeMode === 'food' ? '#f97316' : '#22c55e') : '#6b7280',
            fontWeight: loginMethod === 'phone' ? '600' : '400',
            cursor: 'pointer'
          }}
        >
          Phone
        </button>
      </div>

      <form className="form" onSubmit={onSubmit}>
        {/* Email Fields */}
        {loginMethod === 'email' && (
          <>
            <TextField
              id="email"
              label="Email Address"
              placeholder="Enter your email"
              disabled
              activeMode={activeMode}
            />

            <TextField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              disabled
              activeMode={activeMode}
            />
          </>
        )}

        {/* Phone Fields */}
        {loginMethod === 'phone' && (
          <>
            <TextField
              id="phone"
              label="Phone Number"
              placeholder="Enter your mobile number"
              value=""
              disabled
              activeMode={activeMode}
            />
          </>
        )}

        <button 
          className="primaryBtn"
          disabled={submitting || loginMethod === 'phone'} 
          type="submit"
        >
          {submitting ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div className="spinner"></div>
              Signing in...
            </div>
          ) : (
            loginMethod === 'email' ? 'Sign In' : 'Send OTP'
          )}
        </button>

        {/* <div className="finePrint">
          New here?{' '}
          <button type="button" className="linkBlue linkBtn" onClick={onOpenSignup}>
            Create an account
          </button>
          .
        </div> */}
      </form>


      <div className="divider">or</div>

      <SocialAuthButtons
        onGoogleLogin={async () => {
          try {
            setSubmitting(true)
            const loginResult = await loginWithGoogle(login)
            
            // Handle role-based redirect
            if (loginResult && loginResult.user) {
              handleLoginRedirect(loginResult)
            }
            
            onSuccess?.()
          } catch (error) {
            console.error('Google login failed:', error)
          } finally {
            setSubmitting(false)
          }
        }}
        onFacebookLogin={() => alert('Connect Facebook login here.')}
        submitting={submitting}
      />
    </div>
  )
}

