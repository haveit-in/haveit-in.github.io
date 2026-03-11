import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Brand from '../components/Brand.jsx'
import SocialButton from '../components/SocialButton.jsx'
import TextField from '../components/TextField.jsx'
import { FacebookIcon, GoogleIcon } from '../components/Icons.jsx'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  const errors = useMemo(() => {
    if (!touched) return {}
    const trimmedEmail = email.trim()
    return {
      email:
        trimmedEmail.length === 0
          ? 'Email is required.'
          : !isValidEmail(trimmedEmail)
            ? 'Enter a valid email.'
            : '',
      password:
        password.length === 0
          ? 'Password is required.'
          : password.length < 8
            ? 'Use at least 8 characters.'
            : '',
      confirm:
        confirm.length === 0
          ? 'Confirm your password.'
          : confirm !== password
            ? "Passwords don't match."
            : '',
    }
  }, [email, password, confirm, touched])

  async function onSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (errors.email || errors.password || errors.confirm) return

    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 650))
      navigate('/signin')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="authSingle">
      <div className="authWrap">
        <Link className="backArrow" to="/" aria-label="Back">
          <span aria-hidden="true">←</span>
        </Link>
        <section className="authCard" aria-label="Sign up">
          <Brand />

          <h2 className="authTitle" style={{ marginTop: 14 }}>
            Sign up
          </h2>
          <p className="authHint">Use email & password, or create an account with Google/Facebook.</p>

          <div className="socialRow">
            <SocialButton
              provider="Google"
              icon={<GoogleIcon />}
              onClick={() => alert('Connect Google sign-up here.')}
            />
            <SocialButton
              provider="Facebook"
              icon={<FacebookIcon />}
              onClick={() => alert('Connect Facebook sign-up here.')}
            />
          </div>

          <div className="divider">or</div>

          <form className="form" onSubmit={onSubmit}>
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <div className="row2">
              <TextField
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <TextField
                id="confirm"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm}
              />
            </div>

            <button className="btn btnPrimary" disabled={submitting} type="submit">
              {submitting ? 'Creating account…' : 'Create account'}
            </button>

            <div className="finePrint">
              By continuing, you agree to our{' '}
              <Link className="linkBlue" to="/signup">
                Terms
              </Link>{' '}
              and{' '}
              <Link className="linkBlue" to="/signup">
                Privacy Policy
              </Link>
              .
              <br />
              Already have an account?{' '}
              <Link className="linkPrimary" to="/signin">
                Log in
              </Link>
              .
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

