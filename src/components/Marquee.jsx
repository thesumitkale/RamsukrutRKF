import Sparkle from './Sparkle.jsx'

export default function Marquee({ items, dark = true }) {
  const row = (
    <div className="marquee__track" aria-hidden="true">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className={`font-display font-semibold text-[1.05rem] ${dark ? 'text-paper' : 'text-cocoa'}`}>{it}</span>
          <Sparkle size={18} color={dark ? '#F79A4F' : '#EF6C12'} />
        </span>
      ))}
    </div>
  )
  return (
    <div className={`${dark ? 'bg-cocoa' : 'bg-orange'} py-4`}>
      <div className="marquee">
        {row}{row}
      </div>
    </div>
  )
}
