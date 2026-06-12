import Reveal from './Reveal.jsx'
import { Layers, Trend, Cog, Users, Landmark } from './Icons.jsx'

const ICONS = [Layers, Trend, Cog, Users, Landmark]

/* Node + card colours cycle through the brand trio so the journey reads as a
   colourful climb, ending on a featured dark-teal "summit" card. */
const NODE = [
  'bg-gradient-to-br from-teal to-teal-deep text-white',
  'bg-gradient-to-br from-orange to-orange-deep text-white',
  'bg-gradient-to-br from-yellow-soft to-yellow text-ink',
  'bg-gradient-to-br from-teal to-teal-deep text-white',
  'bg-gradient-to-br from-orange to-orange-deep text-white',
]

export default function Roadmap({ phases }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* gradient spine */}
      <span aria-hidden="true"
        className="absolute bottom-6 left-[26px] top-2 w-[4px] rounded-full bg-gradient-to-b from-teal via-orange to-yellow sm:left-[30px]" />

      <div className="flex flex-col gap-7">
        {phases.map((p, i) => {
          const Icon = ICONS[i] || Layers
          const last = i === phases.length - 1
          return (
            <Reveal key={p.year} delay={i * 0.05}>
              <div className="relative flex items-start gap-5 sm:gap-7">
                {/* node on the spine */}
                <span className={`relative z-10 grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl shadow-lift ring-4 ring-paper sm:h-[60px] sm:w-[60px] ${NODE[i % NODE.length]}`}>
                  <Icon size={24} />
                </span>

                {/* phase card */}
                <article className={`group relative grow overflow-hidden rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-7
                  ${last ? 'bg-gradient-to-br from-teal-ink to-[#072826] text-white' : 'bg-white/70 ring-1 ring-teal-ink/10'}`}>
                  {/* ghost phase number */}
                  <span aria-hidden="true"
                    className={`pointer-events-none absolute -right-2 -top-6 font-display text-[5.2rem] font-extrabold leading-none ${last ? 'text-white/[.07]' : 'text-teal-ink/[.06]'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`inline-flex rounded-full px-3.5 py-1 font-sans text-[.72rem] font-bold uppercase tracking-[.12em] ${last ? 'bg-yellow text-ink' : 'bg-orange/10 text-orange-deep'}`}>
                    {p.year}
                  </span>
                  <h3 className={`relative mt-3.5 font-display text-[1.3rem] font-bold leading-snug sm:text-[1.45rem] ${last ? 'text-white' : ''}`}>{p.title}</h3>
                  <p className={`relative mt-2 text-[1rem] leading-relaxed ${last ? 'text-white/95' : 'text-ink-2'}`}>{p.text}</p>
                  {p.goals && (
                    <div className="relative mt-4 flex flex-wrap gap-2">
                      {p.goals.map((g) => (
                        <span key={g} className="rounded-full bg-yellow px-4 py-1.5 font-sans text-[.8rem] font-bold text-ink">{g}</span>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
