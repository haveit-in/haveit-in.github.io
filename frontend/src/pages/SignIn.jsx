import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Brand from '../components/Brand.jsx'
import SocialButton from '../components/SocialButton.jsx'
import TextField from '../components/TextField.jsx'
import { FacebookIcon, GoogleIcon } from '../components/Icons.jsx'

function isValidPhone(value) {
  const digits = value.replace(/[^\d]/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export default function SignIn() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
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
    }
  }, [phone, touched])

  async function onSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (errors.phone) return

    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 550))
      navigate('/')
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
        <section className="authCard" aria-label="Log in">
          <Brand />

          <h2 className="authTitle" style={{ marginTop: 14 }}>
            Log in
          </h2>
          <p className="authHint">Use your mobile number, or continue with Google/Facebook.</p>

          <div className="socialRow">
            <SocialButton
              provider="Google"
              icon={<GoogleIcon />}
              onClick={() => alert('Connect Google sign-in here.')}
            />
            <SocialButton
              provider="Facebook"
              icon={<FacebookIcon />}
              onClick={() => alert('Connect Facebook sign-in here.')}
            />
          </div>

          <div className="divider">or</div>

          <form className="form" onSubmit={onSubmit}>
            <TextField
              id="phone"
              label="Mobile number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />

            <button className="btn btnPrimary" disabled={submitting} type="submit">
              {submitting ? 'Logging in…' : 'Log in'}
            </button>

            <div className="finePrint">
              New here?{' '}
              <Link className="linkBlue" to="/signup">
                Create an account
              </Link>
              .
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

