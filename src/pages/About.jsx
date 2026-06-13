import { useLang } from '../i18n.jsx'
import Reveal from '../components/Reveal.jsx'
import GhostEyebrow from '../components/GhostEyebrow.jsx'
import SectionHead from '../components/SectionHead.jsx'
import PageHero from '../components/PageHero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { Ico } from '../components/iconMap.jsx'
import { Eye, Target } from '../components/Icons.jsx'
import { LOOKS } from '../components/cardLooks.js'

export default function About() {
  const { t } = useLang()
  const a = t.about
  return (
    <>
      <PageHero title={a.h1} img={a.heroImg} />

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal x={-36} y={0}>
            <div className="img-frame">
              <img src={a.storyImg} alt={a.storyAlt} loading="lazy" className="aspect-[4/4.4] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal x={36} y={0}>
            <GhostEyebrow text={a.storyEyebrow} />
            <h2 className="mt-3 text-3xl md:text-[2.4rem] font-bold leading-[1.15]">{a.storyTitle}</h2>
            <div className="mt-6 flex flex-col gap-4 leading-relaxed text-brown-2">
              {a.story.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="section-tint py-16 md:py-24">
        <div className="container-x grid gap-7 md:grid-cols-2">
          <Reveal delay={0} className="h-full">
            <div className="group relative h-full overflow-hidden rounded-[22px] bg-gradient-to-br from-teal to-teal-deep p-9 text-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <span className="pointer-events-none absolute -bottom-10 -right-8 opacity-[.12] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"><Eye size={210} /></span>
              <span className="ico-tile relative grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white"><Eye size={26} /></span>
              <h3 className="relative mt-6 font-display text-[1.5rem] font-bold">{a.vision.title}</h3>
              <p className="relative mt-3 text-[1.05rem] leading-relaxed text-white/95">{a.vision.text}</p>
            </div>
          </Reveal>
          <Reveal delay={.1} className="h-full">
            <div className="group relative h-full overflow-hidden rounded-[22px] bg-gradient-to-br from-orange to-orange-deep p-9 text-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <span className="pointer-events-none absolute -bottom-10 -right-8 opacity-[.12] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"><Target size={210} /></span>
              <span className="ico-tile relative grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white"><Target size={26} /></span>
              <h3 className="relative mt-6 font-display text-[1.5rem] font-bold">{a.mission.title}</h3>
              <p className="relative mt-3 text-[1.05rem] leading-relaxed text-white/95">{a.mission.text}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={a.valuesEyebrow} title={a.valuesTitle} />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {a.values.map(([icon, label], i) => {
              const k = LOOKS[i % LOOKS.length]
              return (
                <Reveal key={label} delay={i * 0.06} className="h-full">
                  <div className={`group relative flex h-full min-h-[150px] flex-col items-center justify-center gap-4 overflow-hidden rounded-[20px] p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${k.bg} ${k.txt}`}>
                    <span className="pointer-events-none absolute -bottom-6 -right-4 opacity-[.13] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Ico name={icon} size={110} />
                    </span>
                    <span className={`ico-tile relative grid h-13 w-13 h-[52px] w-[52px] place-items-center rounded-2xl ${k.tile}`}><Ico name={icon} size={24} /></span>
                    <span className={`relative font-display text-[1.1rem] font-bold ${k.txt}`}>{label}</span>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-tint py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={a.teamEyebrow} title={a.teamTitle} sub={a.teamSub} />
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {a.team.map(([img, name, role], i) => (
              <Reveal key={name} delay={(i % 3) * 0.08}>
                <article className="group h-full overflow-hidden rounded-[18px] bg-white/70 ring-1 ring-teal-ink/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="aspect-[4/5] overflow-hidden bg-beige">
                    <img src={img} alt={name} loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-[1.2rem] font-bold leading-tight">{name}</h3>
                    <p className="mt-2 text-[.92rem] font-semibold leading-snug text-orange-deep">{role}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skilled youth photo */}
      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <div className="img-frame">
              <img src={a.youthImg} alt={a.youthAlt} loading="lazy" className="aspect-[16/8] w-full object-cover" />
            </div>
            <p className="mt-5 text-center font-display text-[1.02rem] font-semibold text-brown-2">{a.youthCap}</p>
          </Reveal>
        </div>
      </section>

      <CtaBanner title={a.ctaTitle} sub={a.ctaSub} primary={a.ctaBtn} primaryTo="/involved" secondary={a.ctaBtn2} secondaryTo="/contact" />
    </>
  )
}
