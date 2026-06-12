import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import Reveal from '../components/Reveal.jsx'
import Counter from '../components/Counter.jsx'
import Reel from '../components/Reel.jsx'
import YellowCorner from '../components/YellowCorner.jsx'
import ScrollCue from '../components/ScrollCue.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { Ico } from '../components/iconMap.jsx'
import { Arrow } from '../components/Icons.jsx'

export default function Home() {
  const { t } = useLang()
  const h = t.home
  return (
    <>
      {/* ===================== HERO (spec background video, tagline top-left) ===================== */}
      <section className="hero-night relative min-h-[100svh] overflow-hidden">
        {/* Background video from the provided spec: fills the screen edge to edge with no extra
            zoom or blur, so the globe-and-hands footage stays as sharp as the source allows. */}
        <video
          ref={(el) => { if (el) { el.playbackRate = 1.5; el.onloadeddata = () => { el.playbackRate = 1.5 }; el.onplaying = () => { el.style.opacity = 1 } } }}
          className="hero-video absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
          style={{ filter: 'contrast(1.12) saturate(1.12) brightness(.74)' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4"
          autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        {/* gentle darkening at the base where the tagline now sits */}
        <div className="absolute inset-0 bg-[rgba(4,16,15,.30)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(4,16,15,.34)_0%,rgba(4,16,15,.14)_34%,rgba(4,16,15,0)_56%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(0deg,rgba(4,16,15,.66),rgba(4,16,15,0))]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-36 z-10 sm:bottom-40">
          <div className="container-x">
            <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}
              className="display text-[clamp(2.2rem,9.2vw,2.65rem)] leading-[1.12] tracking-[-0.015em] text-white drop-shadow-[0_3px_22px_rgba(0,0,0,.5)] sm:text-[2.9rem] md:text-[3.15rem] lg:text-[3.5rem]"
              dangerouslySetInnerHTML={{ __html: `${h.heroL1}<br/>${h.heroL2}` }} />
          </div>
        </div>
        <ScrollCue delay={1.4} />
      </section>

      {/* ===================== IMPACT STAT BAND ===================== */}
      <section className="bg-paper pb-16 pt-14 md:pb-20 md:pt-16">
        <div className="container-x">
          <Reveal className="mb-10 text-center"><span className="tfi-label text-[1.5rem] sm:text-[1.9rem]">{h.impactTitle}</span></Reveal>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {h.stats.map(([n, s, l], i) => (
              <Reveal key={l} delay={i * 0.1} className="text-center">
                <Counter value={n} suffix={s} className="stat-num block text-[3.4rem] text-teal sm:text-[4.4rem]" />
                <div className="mx-auto mt-2 h-1 w-10 rounded bg-yellow" />
                <p className="mt-4 text-[1rem] font-medium text-ink-2">{l}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={.25}><p className="mx-auto mt-12 max-w-2xl text-center text-[1.05rem] leading-relaxed text-ink-2">{h.impactNote}</p></Reveal>
        </div>
      </section>

      {/* ===================== WHY WE EXIST (statement + numbered challenges) ===================== */}
      <section className="bg-orange-deep py-20 text-white md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <span className="tfi-label text-[1.4rem] !text-white sm:text-[1.7rem]" style={{ }}>{h.chEyebrow}</span>
            <Reveal><h2 className="mt-7 display text-[2.1rem] leading-[1.08] text-white sm:text-[2.9rem]">{h.chTitle}</h2></Reveal>
          </div>
          <Reveal y={26}>
            <div className="flex flex-col divide-y divide-white/25 border-y border-white/25">
              {h.challenges.map((c, i) => (
                <div key={c} className="flex items-baseline gap-5 py-5">
                  <span className="font-display text-2xl font-extrabold text-white/55">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[1.02rem] leading-relaxed text-white/95">{c}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 font-display text-[1.3rem] font-semibold leading-snug sm:text-[1.5rem]">{h.chQuote}</p>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHO WE ARE (teal section, B&W photo grid + yellow accents) ===================== */}
      <section className="relative bg-teal py-20 text-white md:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="tfi-label text-[1.6rem] !text-white sm:text-[2rem]">{h.aboutEyebrow}</span>
            <Reveal>
              <p className="mt-7 text-[1.12rem] font-medium leading-relaxed text-white/95">{h.aboutTitle}.</p>
              <p className="mt-4 text-[1rem] leading-relaxed text-white/95">{h.aboutBody}</p>
              <Link to="/about" className="btn-cream mt-8">{h.aboutBtn} <Arrow size={16} /></Link>
            </Reveal>
          </div>
          <Reveal x={30} y={0}>
            <div className="grid grid-cols-3 grid-rows-2 gap-3" style={{ minHeight: 360 }}>
              <div className="bw-cell rounded-[10px] row-span-2"><img src="/img/stock-bw1.jpg" alt="Rural school students" /></div>
              <div className="relative rounded-[10px] bg-yellow"><YellowCorner className="absolute bottom-0 right-0 h-10 w-10 rotate-180" color="#0C3B39" /></div>
              <div className="bw-cell rounded-[10px]"><img src="/img/stock-bw2.jpg" alt="Students on their way to school" /></div>
              <div className="bw-cell rounded-[10px]"><img src="/img/stock-bw3.jpg" alt="A smiling schoolboy holding his notebook" /></div>
              <div className="relative rounded-[10px] bg-orange"><YellowCorner className="absolute right-0 top-0 h-10 w-10" color="#FFC42E" /></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHAT WE DO (focus areas, icon-led TFI cards) ===================== */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mb-12 max-w-3xl">
            <span className="tfi-label text-[1.6rem] sm:text-[2rem]">{h.focusEyebrow}</span>
            <h2 className="mt-7 display text-[2rem] leading-[1.1] sm:text-[2.6rem]" dangerouslySetInnerHTML={{ __html: h.focusTitle }} />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {h.focus.map((f, i) => {
              const cards = [
                { bg: 'bg-teal', light: true },
                { bg: 'bg-orange', light: false },
                { bg: 'bg-teal-ink', light: false },
                { bg: 'bg-yellow', light: true },
              ]
              const c = cards[i] || cards[0]
              const txt = c.light ? 'text-ink' : 'text-white'
              return (
                <Reveal key={f.title} delay={i * 0.08} className="h-full">
                  <Link to={f.to} className={`group flex h-full flex-col rounded-[16px] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card ${c.bg} ${txt}`}>
                    <span className={`grid h-12 w-12 place-items-center rounded-full ${c.light ? 'bg-ink/10' : 'bg-white/20'} ${txt}`}><Ico name={f.icon} size={22} /></span>
                    <h3 className={`mt-5 font-display text-[1.15rem] font-bold leading-snug ${txt}`}>{f.title}</h3>
                    <p className={`mt-2.5 grow text-[1.02rem] leading-relaxed ${c.light ? 'text-ink/90' : 'text-white/95'}`}>{f.text}</p>
                    <span className={`mt-5 inline-flex items-center gap-2 font-sans text-[.82rem] font-semibold uppercase tracking-wide ${txt}`}>{h.learnMore} <Arrow size={14} /></span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===================== STORIES (reels) ===================== */}
      <section className="section-tint py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mb-12 text-center">
            <span className="tfi-label center text-[1.6rem] sm:text-[2rem]">{h.storiesTitle.replace(/<[^>]+>/g, '')}</span>
            <p className="mx-auto mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-ink-2">{h.storiesSub}</p>
          </Reveal>
          <div className="reel-slider mx-auto max-w-4xl">
            {h.reels.map(([id, title], i) => (
              <Reveal key={id} delay={i * 0.08} className="reel-slide"><Reel id={id} title={title} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== GET INVOLVED ===================== */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mb-12 max-w-3xl">
            <span className="tfi-label text-[1.6rem] sm:text-[2rem]">{h.invEyebrow}</span>
            <h2 className="mt-7 display text-[2rem] leading-[1.1] sm:text-[2.6rem]" dangerouslySetInnerHTML={{ __html: h.invTitle }} />
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2">
            {h.involve.map((v, i) => {
              const looks = [
                { bg: 'bg-gradient-to-br from-teal to-teal-deep', txt: 'text-white', sub: 'text-white/95', tile: 'bg-white/15 text-white', link: 'text-yellow' },
                { bg: 'bg-gradient-to-br from-orange to-orange-deep', txt: 'text-white', sub: 'text-white/90', tile: 'bg-white/15 text-white', link: 'text-yellow-soft' },
                { bg: 'bg-gradient-to-br from-teal-ink to-[#072826]', txt: 'text-white', sub: 'text-white/92', tile: 'bg-teal text-white', link: 'text-teal' },
                { bg: 'bg-gradient-to-br from-yellow-soft to-yellow', txt: 'text-ink', sub: 'text-ink/90', tile: 'bg-ink text-yellow', link: 'text-ink' },
              ]
              const c = looks[i] || looks[0]
              return (
                <Reveal key={v.title} delay={i * 0.07} className="h-full">
                  <Link to={v.to} className={`group relative flex h-full min-h-[270px] flex-col overflow-hidden rounded-[22px] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift sm:p-10 ${c.bg} ${c.txt}`}>
                    <span className="pointer-events-none absolute -bottom-7 -right-5 opacity-[.13] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Ico name={v.icon} size={170} />
                    </span>
                    <span className={`ico-tile relative grid h-14 w-14 place-items-center rounded-2xl ${c.tile}`}><Ico name={v.icon} size={26} /></span>
                    <h3 className={`relative mt-6 font-display text-[1.45rem] font-bold leading-snug ${c.txt}`}>{v.title}</h3>
                    <p className={`relative mt-3 grow text-[1rem] leading-relaxed ${c.sub}`}>{v.text}</p>
                    <span className={`relative mt-6 inline-flex items-center gap-2 font-sans text-[.88rem] font-bold uppercase tracking-wide transition-all group-hover:gap-3.5 ${c.link}`}>{v.link} <Arrow size={15} /></span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBanner title={h.ctaTitle} sub={h.ctaSub} primary={h.ctaBtn} primaryTo="/involved" secondary={h.ctaWa} wa />
    </>
  )
}
