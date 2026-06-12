// Curved top divider (Teach For India signature). color = fill of the curve.
export default function Curve({ color = '#FBF7EE', flip = false, className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 ${flip ? 'bottom-0' : 'top-0'} leading-[0] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`block h-[60px] w-full md:h-[80px] ${flip ? 'rotate-180' : ''}`}>
        <path d="M0,80 C360,0 1080,0 1440,80 Z" fill={color} />
      </svg>
    </div>
  )
}
