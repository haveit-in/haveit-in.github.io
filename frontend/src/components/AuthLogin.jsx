import { useMemo, useState } from 'react'
import Brand from './Brand.jsx'
import TextField from './TextField.jsx'
import { FacebookIcon, GoogleIcon } from './Icons.jsx'

function isValidPhone(value) {
  const digits = value.replace(/[^\d]/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export default function AuthLogin({ onSuccess, onOpenSignup }) {
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
      <Brand />

      {/* <h2 className="authTitle" style={{ marginTop: 14 }}>
        Log in
      </h2> */}
      {/*<p className="authHint">Enter your mobile number to log in. You can also use a social account.</p>*/}

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

        {otpSent ? (
          <TextField
            id="otp"
            label="OTP"
            type="tel"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={errors.otp}
          />
        ) : null}

        <button className="btn btnPrimary" disabled={submitting} type="submit">
          {submitting ? 'Please wait…' : otpSent ? 'Log in' : 'Send OTP'}
        </button>

        <div className="finePrint">
          New here?{' '}
          <button type="button" className="linkBlue linkBtn" onClick={onOpenSignup}>
            Create an account
          </button>
          .
        </div>
      </form>

      <div className="divider">or</div>

      <div className="socialIconRow">
        <button
          type="button"
          className="socialIconButton"
          aria-label="Continue with Google"
          onClick={() => alert('Connect Google login here.')}
        >
          <GoogleIcon size={20} />
        </button>
        <button
          type="button"
          className="socialIconButton"
          aria-label="Continue with Facebook"
          onClick={() => alert('Connect Facebook login here.')}
        >
          <FacebookIcon size={20} />
        </button>
      </div>
    </div>
  )
}

