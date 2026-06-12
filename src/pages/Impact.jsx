import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHead from '../components/SectionHead.jsx'
import PageHero from '../components/PageHero.jsx'
import Counter from '../components/Counter.jsx'
import Roadmap from '../components/Roadmap.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { Ico } from '../components/iconMap.jsx'
import { LOOKS } from '../components/cardLooks.js'
import { Arrow } from '../components/Icons.jsx'

export default function Impact() {
  const { t } = useLang()
  const im = t.impact
  return (
    <>
      <PageHero title={im.h1} img={im.heroImg} />

      {/* Counter band */}
      <section className="relative overflow-hidden bg-grad-dark py-16 md:py-24">
        <div className="container-x relative">
          <SectionHead light eyebrow={im.bandEyebrow} title={im.bandTitle} />
          <div className="grid gap-6 sm:grid-cols-3">
            {t.home.stats.map(([n, s, l], i) => (
              <Reveal key={l} delay={i * 0.1}>
                <div className="rounded-[5px] border border-white/10 bg-white/[.05] px-6 py-9 text-center backdrop-blur-sm">
                  <Counter value={n} suffix={s} className="font-display text-5xl font-bold text-clay-soft" />
                  <p className="mt-3 text-[1rem] text-paper/90">{l}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={.25}><p className="mt-10 text-center text-[1.02rem] italic text-paper/90">{im.note}</p></Reveal>
        </div>
      </section>

      {/* Areas of change */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={im.areasEyebrow} title={im.areasTitle} sub={im.areasSub} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {im.areas.map((a, i) => {
              const c = LOOKS[i % LOOKS.length]
              return (
                <Reveal key={a.title} delay={i * 0.08} className="h-full">
                  <article className={`group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-[20px] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${c.bg} ${c.txt}`}>
                    <span className="pointer-events-none absolute -bottom-7 -right-5 opacity-[.13] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Ico name={a.icon} size={150} />
                    </span>
                    <span className={`ico-tile relative grid h-14 w-14 place-items-center rounded-2xl p-3.5 ${c.tile}`}><Ico name={a.icon} size={24} /></span>
                    <h3 className={`relative mt-5 font-display text-[1.25rem] font-bold leading-snug ${c.txt}`}>{a.title}</h3>
                    <p className={`relative mt-2.5 grow text-[1rem] leading-relaxed ${c.sub}`}>{a.text}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section-tint py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={im.roadEyebrow} title={im.roadTitle} sub={im.roadSub} />
          <Roadmap phases={t.roadmap} />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={im.galEyebrow} title={im.galTitle} sub={im.galSub} />
          <GalleryGrid items={im.gallery} />
          <Reveal delay={.15} className="mt-10 text-center">
            <Link to="/media" className="btn-outline">{im.galBtn} <Arrow size={16} /></Link>
          </Reveal>
        </div>
      </section>

      <CtaBanner title={im.ctaTitle} sub={im.ctaSub} primary={im.ctaBtn} primaryTo="/involved#fund" secondary={im.ctaBtn2} secondaryTo="/involved#volunteer" />
    </>
  )
}
