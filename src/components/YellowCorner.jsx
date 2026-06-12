// Yellow corner accent shape used in the photo grid (TFI motif)
export default function YellowCorner({ className = '', color = '#FFC42E' }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill={color} aria-hidden="true">
      <path d="M0 0h60v22H22v38H0z" />
    </svg>
  )
}
