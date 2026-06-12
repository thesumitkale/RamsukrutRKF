// Rotating circular "seal" badge (reference motif)
export default function Seal({ text = 'RAMSUKRUT KALYAN FOUNDATION \u00B7 EST 2024 \u00B7', size = 132, className = '' }) {
  const id = 'sealpath'
  return (
    <div className={`relative grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-cocoa shadow-card" />
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spinslow">
        <defs>
          <path id={id} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text fill="#F79A4F" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: 600, letterSpacing: '2px' }}>
          <textPath href={`#${id}`} startOffset="0">{text}</textPath>
        </text>
      </svg>
      <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 24 24" fill="none" stroke="#EF6C12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  )
}
