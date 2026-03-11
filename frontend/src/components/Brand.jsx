import { Link } from 'react-router-dom'
import bagLogoUrl from '../../../image/bag logo.png'

export default function Brand({ to = '/', label = 'HaveIt home' }) {
  return (
    <Link to={to} className="brand" aria-label={label}>
      <span className="logoSquare" aria-hidden="true">
        <img className="logoImg" src={bagLogoUrl} alt="" />
      </span>
      <span className="brandText">Haveit</span>
    </Link>
  )
}

