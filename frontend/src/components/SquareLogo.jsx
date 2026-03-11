import bagLogoUrl from '../../../image/bag logo.png'

export default function SquareLogo({ size = 44, alt = '' }) {
  const px = typeof size === 'number' ? `${size}px` : size
  return (
    <span
      className="squareLogo"
      style={{ width: px, height: px, borderRadius: Math.max(10, Number(size) / 3) }}
      aria-hidden={alt ? undefined : true}
    >
      <img className="squareLogoImg" src={bagLogoUrl} alt={alt} />
    </span>
  )
}

