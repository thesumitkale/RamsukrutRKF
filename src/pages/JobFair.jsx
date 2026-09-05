import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { jobfair, JOBFAIR_PHONE, JOBFAIR_WA } from '../content/jobfair.js'
import Reveal from '../components/Reveal.jsx'
import SectionHead from '../components/SectionHead.jsx'
import GhostEyebrow from '../components/GhostEyebrow.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import JobFairForm from '../components/JobFairForm.jsx'
import { Arrow, Wa, Phone, Clock, Calendar, MapPin, Rupee, Briefcase, Users, Handshake, Shield } from '../components/Icons.jsx'

const FACT_ICONS = [Calendar, Clock, MapPin, Rupee]
const POINT_ICONS = [Briefcase, Users, Handshake, Shield]

/* Turns the labels and placeholders from the content file into the field list
   the shared form component understands. */
const candidateFields = (c) => [
  { name: 'name', label: c.fields.name, ph: c.ph.name, req: true },
  { name: 'mobile', label: c.fields.mobile, ph: c.ph.mobile, req: true, type: 'tel', inputMode: 'numeric', pattern: '[0-9+ ]{10,15}' },
  { name: 'email', label: c.fields.email, ph: c.ph.email, type: 'email' },
  { name: 'city', label: c.fields.city, ph: c.ph.city, req: true },
  { name: 'department', label: c.fields.department, ph: c.ph.department, req: true, type: 'select', options: c.departments, full: true },
  { name: 'qualification', label: c.fields.qualification, ph: c.ph.qualification, req: true },
  { name: 'experience', label: c.fields.experience, ph: c.ph.experience, req: true, type: 'select', options: c.experiences },
]

const corporateFields = (c) => [
  { name: 'organization', label: c.fields.organization, ph: c.ph.organization, req: true },
  { name: 'name', label: c.fields.name, ph: c.ph.name, req: true },
  { name: 'title', label: c.fields.title, ph: c.ph.title, req: true },
  { name: 'email', label: c.fields.email, ph: c.ph.email, req: true, type: 'email' },
  { name: 'mobile', label: c.fields.mobile, ph: c.ph.mobile, req: true, type: 'tel', inputMode: 'numeric', pattern: '[0-9+ ]{10,15}' },
  { name: 'positions', label: c.fields.positions, ph: c.ph.positions, req: true },
  { name: 'compensation', label: c.fields.compensation, ph: c.ph.compensation, req: true },
  { name: 'departments', label: c.fields.departments, ph: c.ph.departments, req: true, full: true },
  { name: 'notes', label: c.fields.notes, ph: c.ph.notes, type: 'textarea', full: true },
]

export default function JobFair() {
  const { lang } = useLang()
  const v = jobfair[lang] || jobfair.en
  const [tab, setTab] = useState('candidate')
  const [openFaq, setOpenFaq] = useState(0)

  /* /#/job-fair#register from the hero buttons should scroll, not reload. */
  const goForms = (which) => {
    setTab(which)
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* The site is a single page app, so the tab title has to be set by hand. */
  useEffect(() => {
    const prev = document.title
    document.title = v.meta.title
    const tag = document.querySelector('meta[name="description"]')
    const prevDesc = tag?.getAttribute('content')
    tag?.setAttribute('content', v.meta.description)
    return () => {
      document.title = prev
      if (prevDesc != null) tag?.setAttribute('content', prevDesc)
    }
  }, [v])

  useEffect(() => {
    if (window.location.hash.split('#')[2] === 'register') {
      setTimeout(() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }), 220)
    }
  }, [])

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-teal-ink">
        <motion.div
          initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${v.heroImg})` }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,28,26,.78)_0%,rgba(6,28,26,.52)_45%,rgba(6,28,26,.82)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,28,26,.8)_0%,rgba(6,28,26,.32)_58%,rgba(6,28,26,0)_86%)]" />

        <div className="container-x relative py-28">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow px-4 py-2 font-sans text-[.74rem] font-extrabold uppercase tracking-[.14em] text-ink">
              <Briefcase size={15} /> {v.badge}
            </span>

            <h1 className="display mt-6 max-w-4xl text-[1.95rem] leading-[1.16] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,.5)] sm:text-[2.6rem] md:text-[3.2rem]"
              dangerouslySetInnerHTML={{ __html: v.h1 }} />

            <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-white/85 md:text-[1.1rem]">{v.heroSub}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button onClick={() => goForms('candidate')} className="btn-primary">
                {v.heroCtaCandidate} <Arrow size={16} />
              </button>
              <button onClick={() => goForms('corporate')} className="liquid-glass btn text-white hover:bg-white/10">
                {v.heroCtaCorporate}
              </button>
            </div>

            <div className="mt-12 grid max-w-4xl gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {v.facts.map((f, i) => {
                const Ico = FACT_ICONS[i] || Clock
                return (
                  <div key={f.k} className="flex items-start gap-3 border-l-2 border-yellow/70 pl-4">
                    <div>
                      <span className="flex items-center gap-1.5 font-sans text-[.68rem] font-bold uppercase tracking-[.16em] text-yellow">
                        <Ico size={13} /> {f.k}
                      </span>
                      <p className="mt-1.5 font-display text-[1.02rem] font-semibold leading-snug text-white">{f.v}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------------------- About */}
      <section className="py-16 md:py-24">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal x={-30} y={0}>
            <GhostEyebrow text={v.aboutEyebrow} />
            <h2 className="mt-3 font-display text-[1.85rem] font-bold leading-[1.16] text-ink md:text-[2.3rem]">{v.aboutTitle}</h2>
            <p className="mt-5 text-[1.04rem] leading-relaxed text-ink-2">{v.aboutBody}</p>
            <a href={`tel:${JOBFAIR_PHONE.replace(/\s/g, '')}`}
              className="mt-7 inline-flex items-center gap-2 font-display text-[1.1rem] font-bold text-clay transition hover:text-orange">
              <Phone size={19} /> {JOBFAIR_PHONE}
            </a>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {v.aboutPoints.map((p, i) => {
              const Ico = POINT_ICONS[i] || Briefcase
              return (
                <Reveal key={p.t} delay={i * 0.07} className="h-full">
                  <article className="flex h-full flex-col rounded-[16px] border border-sand bg-paper2/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal text-white"><Ico size={21} /></span>
                    <h3 className="mt-4 font-display text-[1.08rem] font-bold leading-snug text-ink">{p.t}</h3>
                    <p className="mt-2 text-[.97rem] leading-relaxed text-ink-2">{p.d}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Recruiters */}
      <section className="section-tint py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={v.recEyebrow} title={v.recTitle} sub={v.recSub} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {v.recruiters.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08} className="h-full">
                <article className="group flex h-full flex-col items-center rounded-[18px] border border-sand bg-paper p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-clay hover:shadow-lift">
                  {/* Fixed-height band so four logos of different proportions sit on one line. */}
                  <span className="flex h-20 w-full items-center justify-center">
                    <img src={r.logo} alt={r.name} loading="lazy" decoding="async"
                      className={`${r.logoH} w-auto max-w-[80%] object-contain`} />
                  </span>
                  <h3 className="mt-4 font-display text-[1.15rem] font-bold text-ink">{r.name}</h3>
                  <p className="mt-2 text-[.94rem] leading-relaxed text-ink-2">{r.tag}</p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Departments */}
          <Reveal delay={.1} className="mt-14 rounded-[20px] bg-grad-dark p-8 md:p-11">
            <span className="font-sans text-[.7rem] font-bold uppercase tracking-[.18em] text-yellow">{v.deptEyebrow}</span>
            <h3 className="mt-2.5 font-display text-[1.6rem] font-bold text-white md:text-[2rem]">{v.deptTitle}</h3>
            <div className="mt-7 flex flex-wrap gap-3">
              {v.depts.map((d) => (
                <span key={d} className="rounded-full border border-white/25 bg-white/[.07] px-5 py-2.5 font-sans text-[.92rem] font-medium text-white">
                  {d}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- Forms */}
      <section id="register" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={v.formEyebrow} title={v.formTitle} sub={v.formSub} />

          <div className="mx-auto mb-9 flex max-w-xl overflow-hidden rounded-full border border-sand bg-paper2 p-1.5">
            {[['candidate', v.tabCandidate], ['corporate', v.tabCorporate]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} aria-pressed={tab === key}
                className={`flex-1 rounded-full px-4 py-3 font-sans text-[.86rem] font-bold transition-all duration-300 ${
                  tab === key ? 'bg-clay text-white shadow-glow' : 'text-ink-2 hover:text-clay'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="mx-auto max-w-3xl">
            {tab === 'candidate' ? (
              <JobFairForm key="candidate" kind="candidate" copy={v.candidate}
                fields={candidateFields(v.candidate)} lang={lang} waIntro={v.waIntro} />
            ) : (
              <JobFairForm key="corporate" kind="corporate" copy={v.corporate}
                fields={corporateFields(v.corporate)} lang={lang} waIntro={v.waIntro} />
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- FAQ */}
      <section className="section-tint py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={v.faqEyebrow} title={v.faqTitle} />
          <div className="mx-auto max-w-3xl divide-y divide-sand overflow-hidden rounded-[14px] border border-sand bg-paper">
            {v.faqs.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition hover:bg-paper2/60">
                  <span className="font-display text-[1.04rem] font-semibold leading-snug text-ink">{f.q}</span>
                  <span className={`shrink-0 text-clay transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`}>
                    <Arrow size={17} />
                  </span>
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-6 text-[.99rem] leading-relaxed text-ink-2">{f.a}</p>
                )}
              </div>
            ))}
          </div>

          <Reveal delay={.1} className="mt-10 text-center">
            <a href={`https://wa.me/${JOBFAIR_WA}?text=${encodeURIComponent(v.waIntro)}`}
              target="_blank" rel="noopener noreferrer" className="btn-wa">
              <Wa size={19} /> {v.ctaWa}
            </a>
          </Reveal>
        </div>
      </section>

      <CtaBanner title={v.ctaTitle} sub={v.ctaSub} primary={v.ctaBtn} primaryTo="/job-fair" secondary={v.ctaWa} wa />
    </>
  )
}
