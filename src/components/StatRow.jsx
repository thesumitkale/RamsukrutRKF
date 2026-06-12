import Reveal from './Reveal.jsx'
import Counter from './Counter.jsx'
import { Arrow } from './Icons.jsx'

export default function StatRow({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-y-8 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
      {stats.map(([n, suf, label], i) => (
        <Reveal key={label} delay={i * 0.08} className="contents">
          <div className="text-center md:text-left">
            <Counter value={n} suffix={suf} className="stat-num block text-[2.4rem] text-cocoa sm:text-[2.9rem]" />
            <p className="mt-1.5 font-sans text-[.82rem] uppercase tracking-wide text-ink-2/70">{label}</p>
          </div>
          {i < stats.length - 1 && (
            <span className="hidden md:flex"><Arrow size={26} className="text-orange" /></span>
          )}
        </Reveal>
      ))}
    </div>
  )
}
