/* Ramsukrut Games for Good, 5 and 12 December 2026, LSBI Badminton Arena, Pune.
   Public page with three registration forms: company, player, volunteer.
   Submissions post to the rkf-gfg-submit edge function, which writes one row
   per person or company. A repeat on the same mobile (or company name) updates
   the row we already hold instead of creating a second one. */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from '../components/Reveal.jsx'
import { Arrow, Calendar, MapPin } from '../components/Icons.jsx'
import { JOBFAIR_KEY } from '../content/jobfair.js'
import {
  gfg, companyFields, playerFields, volunteerFields, GFG_ENDPOINT, GFG_WA,
} from '../content/gfg.js'

const FIELDS = { company: companyFields, player: playerFields, volunteer: volunteerFields }
const cls = 'w-full rounded-[4px] border border-sand bg-paper px-4 py-3 text-[1rem] text-ink outline-none transition focus:border-clay'

/* Same source tagging as the Job Fair: ?s=poster or ?src=linkedin lands in the row. */
function readSource() {
  try {
    const p = new URLSearchParams(window.location.search)
    const tag = (p.get('s') || p.get('src') || '').trim().slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, '')
    if (tag) return tag
  } catch { /* fall through */ }
  return 'ramsukrut.com/#/games-for-good'
}

/* ?form=player opens the right tab already in view, for QR codes and links. */
function readForm() {
  try {
    const f = new URLSearchParams(window.location.search).get('form')
      || new URLSearchParams((window.location.hash.split('?')[1]) || '').get('form')
    if (f && FIELDS[f]) return f
  } catch { /* ignore */ }
  return null
}

function Field({ f, picked, toggle }) {
  const label = (
    <span className="mb-1.5 block font-sans text-[.9rem] font-semibold text-ink">
      {f.label}{f.req && <span className="text-clay"> *</span>}
    </span>
  )
  const wrap = f.full ? 'sm:col-span-2' : ''
  if (f.type === 'multi') {
    const cur = picked[f.name] || []
    return (
      <fieldset className={wrap}>
        <legend className="mb-2 font-sans text-[.9rem] font-semibold text-ink">
          {f.label}{f.req && <span className="text-clay"> *</span>}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {f.options.map((o) => {
            const on = cur.includes(o)
            return (
              <button key={o} type="button" aria-pressed={on} onClick={() => toggle(f.name, o)}
                className={`flex items-start gap-3 rounded-[6px] border px-4 py-3 text-left text-[.95rem] leading-snug transition ${on ? 'border-teal-deep bg-teal/10 text-ink' : 'border-sand bg-paper text-ink-2 hover:border-teal'}`}>
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border ${on ? 'border-teal-deep bg-teal-deep text-white' : 'border-sand bg-white'}`}>
                  {on && <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M3 8.5 6.5 12 13 4.5" /></svg>}
                </span>
                {o}
              </button>
            )
          })}
        </div>
      </fieldset>
    )
  }
  if (f.type === 'select') {
    return (
      <label className={`block ${wrap}`}>{label}
        <select name={f.name} required={f.req} defaultValue="" className={cls}>
          <option value="" disabled>Choose</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {f.hint && <span className="mt-1 block text-[.8rem] text-muted">{f.hint}</span>}
      </label>
    )
  }
  if (f.type === 'textarea') {
    return (
      <label className={`block ${wrap}`}>{label}
        <textarea name={f.name} rows={3} placeholder={f.ph} className={cls} maxLength={1200} />
      </label>
    )
  }
  return (
    <label className={`block ${wrap}`}>{label}
      <input name={f.name} required={f.req} placeholder={f.ph}
        type={f.type === 'tel' ? 'tel' : f.type === 'email' ? 'email' : 'text'}
        inputMode={f.type === 'tel' ? 'numeric' : undefined}
        pattern={f.type === 'tel' ? '[0-9+ ]{10,15}' : undefined}
        autoComplete={f.type === 'tel' ? 'tel' : f.type === 'email' ? 'email' : f.name === 'name' || f.name === 'contact_name' ? 'name' : 'off'}
        className={cls} maxLength={f.type === 'email' ? 160 : 200} />
    </label>
  )
}

function RegForm({ kind }) {
  const r = gfg.register
  const fields = FIELDS[kind]
  const [picked, setPicked] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done | updated | fail
  const [err, setErr] = useState('')
  const [lastWa, setLastWa] = useState('')
  const formRef = useRef(null)

  const toggle = (name, v) => {
    setErr('')
    setPicked((p) => {
      const cur = p[name] || []
      return { ...p, [name]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] }
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    for (const f of fields) {
      if (f.type === 'multi' && f.req && !(picked[f.name] || []).length) { setErr(r.pickDay); return }
    }
    if (!form.consent.checked) { setErr(r.needConsent); return }
    const fd = new FormData(form)
    fd.delete('consent')
    fields.filter((f) => f.type === 'multi').forEach((f) => fd.set(f.name, (picked[f.name] || []).join('; ')))
    fd.set('kind', kind)
    fd.set('source', readSource())

    const wa = ['Games for Good registration (' + kind + ')',
      ...fields.map((f) => `${f.label}: ${fd.get(f.name) || '-'}`)].join('\n')
    setLastWa(wa)
    setState('sending'); setErr('')
    try {
      const res = await fetch(GFG_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + JOBFAIR_KEY, apikey: JOBFAIR_KEY },
        body: fd,
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok || !out.ok) throw new Error(out.error || 'failed')
      setState(out.updated ? 'updated' : 'done')
      form.reset(); setPicked({})
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {
      setState('fail')
    }
  }

  if (state === 'done' || state === 'updated') {
    const [t, b] = r.done[kind]
    return (
      <div ref={formRef} className="rounded-[8px] border border-sand bg-paper p-7 shadow-soft md:p-9" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-deep text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12.5 10 17.5 19 7" /></svg>
        </span>
        <h3 className="mt-5 font-display text-[1.5rem] font-bold text-ink">{t}</h3>
        <p className="mt-2 text-[1rem] leading-[1.6] text-ink-2">{b}</p>
        {state === 'updated' && <p className="mt-2 text-[.92rem] text-muted">{r.updated}</p>}
        <button type="button" onClick={() => setState('idle')} className="btn-outline mt-6">{r.another}</button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate={false}
      className="rounded-[8px] border border-sand bg-white p-6 shadow-soft md:p-9">
      <p className="mb-6 text-[.98rem] leading-[1.6] text-ink-2">{r.intro[kind]}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => <Field key={kind + f.name} f={f} picked={picked} toggle={toggle} />)}
      </div>
      {/* Honeypot. Hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0" />
      <label className="mt-6 flex items-start gap-3 text-[.92rem] leading-snug text-ink-2">
        <input type="checkbox" name="consent" className="mt-0.5 h-5 w-5 shrink-0 accent-[#089E93]" />
        {r.consent}
      </label>
      {err && <p className="mt-4 text-[.92rem] font-semibold text-clay-deep" role="alert">{err}</p>}
      {state === 'fail' && (
        <div className="mt-4 rounded-[6px] bg-paper2 p-4 text-[.92rem] text-ink" role="alert">
          {r.fail}
          <a className="mt-3 flex w-fit items-center gap-2 font-semibold text-teal-deep underline"
            href={`https://wa.me/${GFG_WA}?text=${encodeURIComponent(lastWa)}`} target="_blank" rel="noreferrer">{r.wa}</a>
        </div>
      )}
      <button type="submit" disabled={state === 'sending'} className="btn-primary mt-7 w-full sm:w-auto disabled:opacity-60">
        {state === 'sending' ? r.sending : r.send} <Arrow className="h-4 w-4" />
      </button>
    </form>
  )
}

export default function GamesForGood() {
  const [tab, setTab] = useState(() => readForm() || 'company')
  const h = gfg.hero

  useEffect(() => {
    const prev = document.title
    document.title = gfg.meta.title
    const tag = document.querySelector('meta[name="description"]')
    const prevDesc = tag?.getAttribute('content')
    tag?.setAttribute('content', gfg.meta.description)
    if (readForm()) setTimeout(() => document.getElementById('register')?.scrollIntoView({ block: 'start' }), 60)
    return () => { document.title = prev; if (prevDesc != null) tag?.setAttribute('content', prevDesc) }
  }, [])

  const go = (which) => {
    setTab(which)
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-teal-ink pb-16 pt-32 text-white md:pb-24 md:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full border-[28px] border-white/[.04]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-4 top-36 h-[220px] w-[220px] rounded-full border-[16px] border-yellow/10" />
        <div className="container-x relative">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
            className="font-sans text-[.76rem] font-bold uppercase tracking-[.16em] text-yellow">{h.eyebrow}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .05 }}
            className="display mt-4 text-[3.2rem] leading-[.98] sm:text-[4.6rem] md:text-[6rem]">{h.title}</motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .4, duration: .6 }}
            className="mt-6 h-1.5 w-24 origin-left rounded bg-yellow" />
          <p className="mt-6 max-w-xl text-[1.15rem] leading-[1.55] text-white/85 md:text-[1.3rem]">{h.lead}</p>

          <div className="mt-9 grid max-w-3xl gap-4 sm:grid-cols-2">
            {gfg.days.map((d) => (
              <div key={d.name} className="rounded-[8px] border border-white/15 bg-white/[.04] p-5">
                <p className="font-sans text-[.72rem] font-bold uppercase tracking-[.14em] text-yellow">{d.tag}</p>
                <p className="mt-2 font-display text-[1.45rem] font-bold leading-tight">{d.name}</p>
                <p className="mt-1 flex items-center gap-2 text-[.92rem] text-white/75"><Calendar className="h-4 w-4" />{d.date}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-[.95rem] text-white/75"><MapPin className="h-4 w-4" />{h.venue}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={() => go('company')} className="btn-primary">{h.ctas.company} <Arrow className="h-4 w-4" /></button>
            <button onClick={() => go('player')} className="btn-ghost">{h.ctas.player}</button>
            <button onClick={() => go('volunteer')} className="btn-ghost">{h.ctas.volunteer}</button>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{gfg.why.eyebrow}</p>
            <h2 className="display mt-4 max-w-3xl text-[2rem] text-ink sm:text-[2.6rem] md:text-[3rem]">{gfg.why.title}</h2>
            <p className="mt-6 max-w-2xl text-[1.06rem] leading-[1.7] text-ink-2">{gfg.why.body}</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {gfg.why.groups.map(([t, b], i) => (
              <Reveal key={t} delay={i * .08}>
                <div className="h-full rounded-[8px] border border-sand bg-white p-6 shadow-soft">
                  <span className="block h-1 w-8 rounded bg-orange" />
                  <h3 className="mt-5 font-display text-[1.3rem] font-bold text-ink">{t}</h3>
                  <p className="mt-2 text-[.98rem] leading-[1.6] text-ink-2">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The two days */}
      <section className="bg-paper2 py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">The two days</p>
            <h2 className="display mt-4 text-[2rem] text-ink sm:text-[2.6rem] md:text-[3rem]">Two Saturdays, two causes.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {gfg.days.map((d, i) => (
              <Reveal key={d.name} delay={i * .08}>
                <article className="h-full overflow-hidden rounded-[8px] border border-sand bg-white shadow-soft">
                  <div className="bg-teal-ink p-6 text-white md:p-7">
                    <p className="font-sans text-[.72rem] font-bold uppercase tracking-[.14em] text-yellow">{d.tag}</p>
                    <h3 className="mt-2 font-display text-[1.8rem] font-bold leading-tight">{d.name}</h3>
                    <p className="mt-1 text-[.95rem] text-white/75">{d.date}</p>
                  </div>
                  <div className="p-6 md:p-7">
                    <p className="text-[1rem] leading-[1.65] text-ink-2">{d.why}</p>
                    <p className="mt-6 font-sans text-[.74rem] font-bold uppercase tracking-[.14em] text-teal-deep">How it works</p>
                    <ul className="mt-3 space-y-2">
                      {d.how.map((x) => (
                        <li key={x} className="flex gap-3 text-[.97rem] leading-snug text-ink">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />{x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The day */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{gfg.included.eyebrow}</p>
            <h2 className="display mt-4 max-w-3xl text-[2rem] text-ink sm:text-[2.6rem] md:text-[3rem]">{gfg.included.title}</h2>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {gfg.included.items.map(([t, b], i) => (
              <Reveal key={t} delay={i * .06}>
                <div className="border-t-2 border-ink/10 pt-5">
                  <h3 className="font-display text-[1.15rem] font-bold text-ink">{t}</h3>
                  <p className="mt-2 text-[.96rem] leading-[1.6] text-ink-2">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="scroll-mt-20 bg-paper2 py-20 md:py-28">
        <div className="container-x max-w-[880px]">
          <Reveal>
            <p className="eyebrow">{gfg.register.eyebrow}</p>
            <h2 className="display mt-4 text-[2rem] text-ink sm:text-[2.6rem] md:text-[3rem]">{gfg.register.title}</h2>
            <p className="mt-4 text-[1.05rem] text-ink-2">{gfg.register.sub}</p>
          </Reveal>
          <div role="tablist" aria-label="Registration type" className="mt-9 grid grid-cols-3 gap-1 rounded-full bg-white p-1 shadow-soft">
            {Object.entries(gfg.register.tabs).map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`rounded-full px-3 py-3 font-sans text-[.92rem] font-semibold transition ${tab === k ? 'bg-teal-ink text-white' : 'text-ink-2 hover:text-ink'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative mt-6">
            <RegForm key={tab} kind={tab} />
          </div>
        </div>
      </section>
    </>
  )
}
