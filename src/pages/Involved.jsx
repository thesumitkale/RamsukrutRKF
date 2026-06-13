import { useEffect } from 'react'
import { useLang } from '../i18n.jsx'
import Reveal from '../components/Reveal.jsx'
import GhostEyebrow from '../components/GhostEyebrow.jsx'
import SectionHead from '../components/SectionHead.jsx'
import PageHero from '../components/PageHero.jsx'
import WaForm from '../components/WaForm.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { Ico } from '../components/iconMap.jsx'
import { LOOKS } from '../components/cardLooks.js'
import { Arrow, Wa, Phone } from '../components/Icons.jsx'

const Rows = ({ rows }) => (
  <div className="mt-7 flex flex-col gap-3.5">
    {rows.map((r) => (
      <div key={r.k} className="flex items-start gap-3.5">
        <span className="mt-0.5 min-w-[150px] shrink-0 font-sans text-[.72rem] font-semibold uppercase tracking-[.12em] text-clay">{r.k}</span>
        <p className="text-[1rem] leading-relaxed text-brown-2">{r.v}</p>
      </div>
    ))}
  </div>
)

export default function Involved() {
  const { t } = useLang()
  const v = t.involved

  // Arriving with a hash (e.g. /involved#volunteer from a CTA on another page)
  // should land on that section, not jump to the top.
  useEffect(() => {
    const id = window.location.hash.split('#')[2]
    if (!id) return
    let tries = 0
    const tick = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else if (tries++ < 20) setTimeout(tick, 80)
    }
    setTimeout(tick, 120)
  }, [])

  return (
    <>
      <PageHero title={v.h1} img={v.heroImg} />

      {/* Path cards */}
      <section className="py-16 md:py-20">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {v.cards.map((c, i) => {
            const k = LOOKS[i % LOOKS.length]
            return (
              <Reveal key={c.hash} delay={i * 0.08} className="h-full">
                <a href={`#/involved#${c.hash}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById(c.hash)?.scrollIntoView({ behavior: 'smooth' }) }}
                  className={`group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[20px] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${k.bg} ${k.txt}`}>
                  <span className="pointer-events-none absolute -bottom-7 -right-5 opacity-[.13] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Ico name={c.icon} size={150} />
                  </span>
                  <span className={`ico-tile relative grid h-14 w-14 place-items-center rounded-2xl p-3.5 ${k.tile}`}><Ico name={c.icon} size={24} /></span>
                  <h3 className={`relative mt-5 font-display text-[1.25rem] font-bold leading-snug ${k.txt}`}>{c.title}</h3>
                  <p className={`relative mt-2.5 grow text-[1rem] leading-relaxed ${k.sub}`}>{c.text}</p>
                  <span className={`relative mt-5 inline-flex items-center gap-2 font-sans text-[.85rem] font-bold uppercase tracking-wide transition-all group-hover:gap-3.5 ${k.link}`}>
                    {c.link} <Arrow size={15} />
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Volunteer */}
      <section id="volunteer" className="scroll-mt-24 section-tint py-16 md:py-24">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal x={-36} y={0}>
            <GhostEyebrow text={v.volEyebrow} />
            <h2 className="mt-3 text-3xl md:text-[2.3rem] font-bold leading-[1.15]">{v.volTitle}</h2>
            <p className="mt-4 leading-relaxed text-ink-2">{v.volIntro}</p>
            <Rows rows={v.volRows} />
          </Reveal>
          <Reveal x={36} y={0}><WaForm form={v.volForm} /></Reveal>
        </div>
      </section>

      {/* CSR */}
      <section id="csr" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal x={-36} y={0} className="lg:order-2">
            <GhostEyebrow text={v.csrEyebrow} />
            <h2 className="mt-3 text-3xl md:text-[2.3rem] font-bold leading-[1.15]">{v.csrTitle}</h2>
            <p className="mt-4 leading-relaxed text-ink-2">{v.csrIntro}</p>
            <Rows rows={v.csrRows} />
          </Reveal>
          <Reveal x={36} y={0} className="lg:order-1"><WaForm form={v.csrForm} /></Reveal>
        </div>
      </section>

      {/* Partners */}
      <section id="partner" className="scroll-mt-24 section-tint py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={v.partEyebrow} title={v.partTitle} sub={v.partSub} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {v.partners.map((p, i) => {
              const k = LOOKS[(i + 2) % LOOKS.length]
              return (
                <Reveal key={p.title} delay={i * 0.08} className="h-full">
                  <article className={`group relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-[20px] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${k.bg} ${k.txt}`}>
                    <span className="pointer-events-none absolute -bottom-7 -right-5 opacity-[.13] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Ico name={p.icon} size={150} />
                    </span>
                    <span className={`ico-tile relative grid h-14 w-14 place-items-center rounded-2xl p-3.5 ${k.tile}`}><Ico name={p.icon} size={24} /></span>
                    <h3 className={`relative mt-5 font-display text-[1.2rem] font-bold leading-snug ${k.txt}`}>{p.title}</h3>
                    <p className={`relative mt-2.5 text-[1rem] leading-relaxed ${k.sub}`}>{p.text}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>
          <Reveal delay={.15} className="mt-10 text-center">
            <a href={v.partWa} target="_blank" rel="noopener noreferrer" className="btn-wa"><Wa size={19} /> {v.partBtn}</a>
          </Reveal>
        </div>
      </section>

      {/* Fund */}
      <section id="fund" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={v.fundEyebrow} title={v.fundTitle} sub={v.fundSub} />
          <div className="grid gap-7 md:grid-cols-3">
            {v.funds.map((f, i) => {
              const k = f.feature
                ? { bg: 'bg-gradient-to-br from-orange to-orange-deep', txt: 'text-white', sub: 'text-white/90', tile: 'bg-white/15 text-white', amt: 'text-yellow-soft' }
                : i === 0
                  ? { bg: 'bg-gradient-to-br from-teal to-teal-deep', txt: 'text-white', sub: 'text-white/95', tile: 'bg-white/15 text-white', amt: 'text-yellow' }
                  : { bg: 'bg-gradient-to-br from-teal-ink to-[#072826]', txt: 'text-white', sub: 'text-white/92', tile: 'bg-teal text-white', amt: 'text-yellow' }
              return (
                <Reveal key={f.title} delay={i * 0.1} className="h-full">
                  <article className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${k.bg} ${k.txt} ${f.feature ? 'md:scale-[1.04] shadow-lift' : ''}`}>
                    <span className="pointer-events-none absolute -bottom-8 -right-6 opacity-[.12] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Ico name={f.icon} size={160} />
                    </span>
                    <span className={`ico-tile relative grid h-14 w-14 place-items-center rounded-2xl p-3.5 ${k.tile}`}><Ico name={f.icon} size={24} /></span>
                    <div className={`relative mt-5 font-display text-[2.2rem] font-extrabold ${k.amt}`}>{f.amt}</div>
                    <h3 className="relative mt-1.5 font-display text-[1.15rem] font-bold leading-snug">{f.title}</h3>
                    <p className={`relative mt-3 grow text-[1rem] leading-relaxed ${k.sub}`}>{f.text}</p>
                    <a href={f.wa} target="_blank" rel="noopener noreferrer"
                      className={`relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-[.9rem] font-bold transition-all duration-300 ${f.feature ? 'bg-white text-orange-deep hover:bg-yellow-soft hover:text-ink' : 'bg-white/12 text-white ring-1 ring-white/35 hover:bg-white hover:text-teal-ink'}`}>
                      {v.fundBtn}
                    </a>
                  </article>
                </Reveal>
              )
            })}
          </div>
          <Reveal delay={.2} className="mt-12 text-center">
            <p className="font-display text-xl font-semibold md:text-2xl" dangerouslySetInnerHTML={{ __html: v.fundTag }} />
            <p className="mx-auto mt-4 max-w-xl text-[1rem] text-ink-2">{v.fundNote}</p>
            <a href="tel:+917277404040" className="mt-4 inline-flex items-center gap-2 font-display text-lg font-bold text-clay hover:text-orange">
              <Phone size={19} /> +91 72774 04040
            </a>
          </Reveal>
        </div>
      </section>

      <CtaBanner title={v.ctaTitle} sub={v.ctaSub} primary={v.ctaBtn} primaryTo="/contact" secondary={v.ctaWa} wa />
    </>
  )
}
