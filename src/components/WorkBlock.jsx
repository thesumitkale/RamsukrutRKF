import Reveal from './Reveal.jsx'
import GhostEyebrow from './GhostEyebrow.jsx'

/* One focus area: framed photo with an offset colour plate + numbered badge,
   and the Problem / Our work / Result / Next step rows as colour-coded chips
   on soft card rows, so the story is scannable and the text reads strong. */
const ROW = [
  { chip: 'bg-orange text-white' },                 // problem
  { chip: 'bg-teal text-white' },                   // our work
  { chip: 'bg-yellow text-ink' },                   // result
  { chip: 'bg-teal-ink text-white' },               // next step
]

export default function WorkBlock({ data, flip = false, alt = false, id }) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 md:py-24 ${alt ? 'section-tint' : ''}`}>
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal x={flip ? 36 : -36} y={0} className={flip ? 'lg:order-2' : ''}>
          <div className="relative">
            {/* offset colour plate behind the photo */}
            <span aria-hidden="true" className={`absolute -bottom-4 ${flip ? '-right-4' : '-left-4'} h-full w-full rounded-[22px] ${alt ? 'bg-orange/15' : 'bg-teal/15'}`} />
            <div className="relative overflow-hidden rounded-[22px] shadow-lift">
              <img src={data.img} alt={data.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.04]" />
            </div>
            <span className="absolute -bottom-4 left-6 rounded-full bg-gradient-to-r from-orange to-orange-deep px-6 py-2.5 font-sans text-[.74rem] font-bold uppercase tracking-[.14em] text-white shadow-lift">
              {data.badge}
            </span>
          </div>
        </Reveal>
        <Reveal x={flip ? -36 : 36} y={0} className={flip ? 'lg:order-1' : ''}>
          <GhostEyebrow text={data.eyebrow} />
          <h2 className="mt-5 display text-[1.9rem] leading-[1.1] sm:text-[2.4rem]">{data.title}</h2>
          <p className="mt-5 text-[1.08rem] font-medium leading-relaxed text-ink-2">{data.intro}</p>
          <div className="mt-8 flex flex-col gap-3.5">
            {data.rows.map((r, i) => (
              <div key={r.k}
                className="group flex flex-col gap-2.5 rounded-[16px] bg-white/70 p-5 ring-1 ring-teal-ink/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card sm:flex-row sm:items-start sm:gap-5">
                <span className={`inline-flex w-fit shrink-0 rounded-full px-4 py-1.5 font-sans text-[.72rem] font-bold uppercase tracking-[.12em] sm:min-w-[122px] sm:justify-center ${ROW[i % ROW.length].chip}`}>
                  {r.k}
                </span>
                <p className="text-[1.02rem] leading-relaxed text-ink">{r.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
