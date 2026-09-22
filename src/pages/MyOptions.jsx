/* ==========================================================================
   My options. The public, candidate facing half of the volunteer desk.

   A candidate who has already registered types the one thing they are certain
   of, the mobile number they registered with, and gets the only answer they
   actually want: which of these companies will see me, and which ones are
   worth queuing for first.

   This is the same arithmetic the desk runs, imported from the same file, so
   the screen in a candidate's hand and the screen on the volunteer laptop can
   never disagree in front of them.

   Written for a cheap phone on a weak signal in a village. One input, big
   taps, no login, no jargon, and every state says what to do next.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { jobfair, localizeAnswer, JOBFAIR_ME, JOBFAIR_PHONE, JOBFAIR_WA } from '../content/jobfair.js'
import { translatePlace } from '../content/maharashtra.js'
import Reveal from '../components/Reveal.jsx'
import GhostEyebrow from '../components/GhostEyebrow.jsx'
import { Arrow, Wa, Phone } from '../components/Icons.jsx'
import {
  dept,
  expOf,
  hiresEverythingOf,
  place,
  qualOf,
  scoreOf,
  wantedDeptsOf,
} from '../components/matchScore.js'

/* Below this a company is not worth an hour in a queue, so it is folded away
   rather than dangled. Same floor the desk uses. */
const OFFER_FLOOR = 58
const STRONG_FLOOR = 78

const digits = (s) => String(s || '').replace(/\D/g, '')

/* The number is kept on the device so a candidate who closes the page and
   comes back the next morning is not made to type it again. */
const SAVED = 'rkf-my-mobile'

/* The scorer writes its reasons in English, because the volunteer desk reads
   them in English. A candidate reading in Marathi should not be handed a
   phrase like "Thane, travels in", so each reason is taken apart into the
   place it names and the suffix that explains it, and both halves are put
   back in the reader's language. Anything unrecognised falls through
   unchanged rather than being mangled. */
const REASON_MR = {
  'Khed taluka, local': 'खेड तालुका, स्थानिक',
  'next to Khed': 'खेडच्या शेजारी',
  'Pune district': 'पुणे जिल्हा',
  'travels in': 'प्रवास करून येतील',
  'Khed area': 'खेड परिसर',
  'Pune area': 'पुणे परिसर',
  'district not stated': 'जिल्हा नमूद नाही',
  'Location not stated': 'ठिकाण नमूद नाही',
  'Experience not stated': 'अनुभव नमूद नाही',
  'Qualification not stated': 'शिक्षण नमूद नाही',
  'Resume attached': 'रेझ्युमे जोडलेला आहे',
  'close fit': 'जवळचा पर्याय',
}

function reasonText(raw, lang, say) {
  const t = String(raw || '').trim()
  if (lang !== 'mr') return t
  if (REASON_MR[t]) return REASON_MR[t]
  const i = t.lastIndexOf(', ')
  if (i > 0) {
    const head = t.slice(0, i)
    const tail = t.slice(i + 2)
    if (REASON_MR[tail]) {
      const shown = say(head)
      return (shown === head ? translatePlace(head, 'mr') : shown) + ', ' + REASON_MR[tail]
    }
  }
  const viaAnswer = say(t)
  if (viaAnswer !== t) return viaAnswer
  const viaPlace = translatePlace(t, 'mr')
  return viaPlace || t
}

export default function MyOptions() {
  const { lang } = useLang()
  const c = jobfair[lang]
  const m = c.mine

  /* An answer is stored in whichever language the person registered in. It is
     shown back in whichever language they are reading now, so a Marathi
     speaker is never handed their own answer in English. */
  const say = useCallback((v) => localizeAnswer(v, lang), [lang])
  const sayPlace = useCallback(
    (r) => [r.village || r.city, r.taluka ? translatePlace(r.taluka, lang) : ''].filter(Boolean).join(', '),
    [lang],
  )

  const [mobile, setMobile] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [data, setData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [showWeak, setShowWeak] = useState(false)
  const [savingId, setSavingId] = useState('')

  useEffect(() => {
    document.title = m.metaTitle
    const tag = document.querySelector('meta[name="description"]')
    if (tag) tag.setAttribute('content', m.metaDesc)
  }, [m])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED)
      if (saved) setMobile(saved)
    } catch (e) { /* private mode */ }
  }, [])

  const post = useCallback(async (payload) => {
    const res = await fetch(JOBFAIR_ME, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.json()
  }, [])

  const lookup = async (e) => {
    if (e) e.preventDefault()
    const num = digits(mobile).slice(-10)
    if (num.length !== 10) { setErr(m.errShort); return }
    setBusy(true)
    setErr('')
    setNotFound(false)
    try {
      const out = await post({ action: 'lookup', mobile: num })
      if (!out.ok) throw new Error(out.error || 'failed')
      if (!out.found) { setNotFound(true); setData(null) } else {
        setData(out)
        try { localStorage.setItem(SAVED, num) } catch (err2) { /* private mode */ }
      }
    } catch (e2) {
      setErr(m.errNet)
    }
    setBusy(false)
  }

  const reset = () => {
    setData(null)
    setNotFound(false)
    setErr('')
    setShowWeak(false)
    setMobile('')
    try { localStorage.removeItem(SAVED) } catch (e) { /* private mode */ }
  }

  /* Every confirmed company scored against this one person. The experience and
     qualification bars are left open, because this screen tells a candidate
     where they may sit, it does not decide who gets hired. */
  const options = useMemo(() => {
    if (!data) return []
    /* The endpoint never sends the resume link back, only whether one exists.
       The shared scorer reads resume_url, so the flag is put back as a marker
       and the candidate sees the same three points the desk gives them. */
    const person = { ...data.candidate, resume_url: data.candidate.has_resume ? 'on-file' : '' }
    const out = []
    ;(data.corporates || []).forEach((co) => {
      const wanted = wantedDeptsOf(co)
      const s = scoreOf(person, wanted, hiresEverythingOf(wanted), 'any', '0')
      if (!s) return
      out.push({ co, ...s })
    })
    out.sort((a, b) => b.total - a.total || String(a.co.organization).localeCompare(String(b.co.organization)))
    return out
  }, [data])

  const chosen = useMemo(() => new Set(data?.chosen || []), [data])

  const strong = options.filter((o) => o.total >= STRONG_FLOOR)
  /* A company already picked stays visible even if it later slips under the
     floor, so nobody loses a slot without being told. */
  const mid = options.filter((o) => o.total < STRONG_FLOOR && (o.total >= OFFER_FLOOR || chosen.has(o.co.id)))
  const weak = options.filter((o) => o.total < OFFER_FLOOR && !chosen.has(o.co.id))

  const sit = async (o, on) => {
    setSavingId(o.co.id)
    setErr('')
    try {
      const out = await post({
        action: 'sit',
        mobile: digits(mobile).slice(-10),
        corporate_id: o.co.id,
        on,
        fit: o.total,
        band: o.total >= STRONG_FLOOR ? 'strong' : o.total >= OFFER_FLOOR ? 'worth a look' : 'reserve',
      })
      if (!out.ok) throw new Error(out.error || 'failed')
      setData(out)
    } catch (e) {
      setErr(m.errNet)
    }
    setSavingId('')
  }

  const bandName = (n) => (n >= STRONG_FLOOR ? m.bandStrong : n >= OFFER_FLOOR ? m.bandOk : m.bandWeak)
  const bandLook = (n) =>
    n >= STRONG_FLOOR
      ? 'bg-forest text-white'
      : n >= OFFER_FLOOR
        ? 'bg-gold text-ink'
        : 'bg-paper2 text-ink2 border border-sand'

  const count = chosen.size

  return (
    <main className="bg-paper">
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-sand bg-forest px-5 pb-16 pt-28 text-white sm:px-8 sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute right-[-12%] top-[-30%] h-[26rem] w-[26rem] rounded-full bg-forest-soft/15 blur-3xl" />
        <div className="relative mx-auto w-full max-w-4xl">
          <GhostEyebrow text={m.badge} light />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[2.9rem]"
            dangerouslySetInnerHTML={{ __html: m.h1 }}
          />
          <p className="mt-5 max-w-2xl text-[1rem] leading-[1.7] text-white/80 sm:text-[1.08rem]">{m.sub}</p>
        </div>
      </section>

      {/* ----------------------------------------------------------- lookup */}
      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto w-full max-w-4xl">
          {!data && (
            <Reveal>
              <form onSubmit={lookup} className="rounded-[6px] border border-sand bg-paper2 p-6 sm:p-8">
                <label htmlFor="my-mobile" className="block font-display text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-muted">
                  {m.inputLabel}
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="my-mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={15}
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value); setErr(''); setNotFound(false) }}
                    placeholder={m.inputPh}
                    className="w-full rounded-[4px] border border-sand bg-paper px-4 py-4 text-[1.15rem] tracking-[0.04em] text-ink outline-none focus:border-clay sm:text-[1.25rem]"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] bg-clay px-7 py-4 font-display text-[0.98rem] font-semibold text-white transition hover:bg-clay-deep disabled:opacity-60"
                  >
                    {busy ? m.loading : m.cta}
                    {!busy && <Arrow className="h-4 w-4" />}
                  </button>
                </div>
                {err && <p className="mt-3 text-[0.92rem] text-clay-deep">{err}</p>}
                <p className="mt-4 text-[0.85rem] leading-[1.6] text-muted">{m.privacy}</p>
              </form>
            </Reveal>
          )}

          {notFound && (
            <Reveal>
              <div className="mt-6 rounded-[6px] border border-sand bg-white p-6 sm:p-8">
                <h2 className="font-display text-[1.25rem] font-semibold text-ink">{m.notFoundTitle}</h2>
                <p className="mt-3 text-[0.98rem] leading-[1.7] text-ink2">{m.notFoundBody}</p>
                <Link
                  to="/job-fair"
                  className="mt-5 inline-flex items-center gap-2 rounded-[4px] bg-forest px-6 py-3.5 font-display text-[0.95rem] font-semibold text-white transition hover:bg-forest-2"
                >
                  {m.notFoundCta}
                  <Arrow className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          )}

          {/* ------------------------------------------------------- results */}
          {data && (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sand pb-6">
                <div>
                  <p className="font-display text-[1.5rem] font-semibold leading-tight text-ink sm:text-[1.9rem]">
                    {m.hello}, {String(data.candidate.name || '').split(' ')[0]}
                  </p>
                  <p className="mt-2 text-[0.95rem] leading-[1.6] text-ink2">
                    {m.youAre} <strong className="font-semibold text-ink">{say(dept(data.candidate))}</strong>
                    {' '}&middot;{' '}{say(qualOf(data.candidate))}{' '}&middot;{' '}{say(expOf(data.candidate))}
                  </p>
                  {place(data.candidate) && (
                    <p className="mt-1 text-[0.9rem] text-muted">{m.from} {sayPlace(data.candidate)}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-[4px] border border-sand px-4 py-2.5 font-display text-[0.86rem] font-semibold text-ink2 transition hover:border-clay hover:text-clay-deep"
                >
                  {m.change}
                </button>
              </div>

              {/* Running tally, so the page always answers "am I done". */}
              <div className="mt-6 rounded-[6px] border border-sand bg-paper2 p-5 sm:p-6">
                <p className="font-display text-[1.02rem] font-semibold text-ink">
                  {count === 0 ? m.chosenNone : count === 1 ? m.chosenOne : m.chosenMany.replace('{n}', String(count))}
                </p>
                {count > 0 && <p className="mt-2 text-[0.93rem] leading-[1.65] text-ink2">{m.chosenHint}</p>}
                {!data.candidate.has_resume && (
                  <p className="mt-3 border-t border-sand pt-3 text-[0.9rem] leading-[1.6] text-clay-deep">{m.noResume}</p>
                )}
              </div>

              {err && <p className="mt-4 text-[0.92rem] text-clay-deep">{err}</p>}

              {options.length === 0 && (
                <div className="mt-8 rounded-[6px] border border-sand bg-white p-6 sm:p-8">
                  <h2 className="font-display text-[1.2rem] font-semibold text-ink">{m.noneTitle}</h2>
                  <p className="mt-3 text-[0.98rem] leading-[1.7] text-ink2">{m.noneBody}</p>
                </div>
              )}

              <Group
                title={m.strongTitle}
                sub={m.strongSub}
                items={strong}
                {...{ m, chosen, sit, savingId, bandName, bandLook, say, lang }}
              />
              <Group
                title={m.okTitle}
                sub={m.okSub}
                items={mid}
                {...{ m, chosen, sit, savingId, bandName, bandLook, say, lang }}
              />

              {weak.length > 0 && (
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setShowWeak(!showWeak)}
                    className="rounded-[4px] border border-sand px-5 py-3 font-display text-[0.9rem] font-semibold text-ink2 transition hover:border-clay hover:text-clay-deep"
                  >
                    {showWeak ? m.showLess : m.showMore + ' (' + weak.length + ')'}
                  </button>
                  {showWeak && (
                    <Group title="" sub="" items={weak} {...{ m, chosen, sit, savingId, bandName, bandLook, say, lang }} />
                  )}
                </div>
              )}

              {/* --------------------------------------------------- help */}
              <div className="mt-12 rounded-[6px] border border-sand bg-white p-6 sm:p-8">
                <h2 className="font-display text-[1.15rem] font-semibold text-ink">{m.helpTitle}</h2>
                <p className="mt-3 text-[0.96rem] leading-[1.7] text-ink2">{m.helpBody}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={'tel:' + JOBFAIR_PHONE.replace(/\s/g, '')}
                    className="inline-flex items-center gap-2 rounded-[4px] border border-sand px-5 py-3 font-display text-[0.92rem] font-semibold text-ink transition hover:border-clay hover:text-clay-deep"
                  >
                    <Phone className="h-4 w-4" />
                    {JOBFAIR_PHONE}
                  </a>
                  <a
                    href={JOBFAIR_WA}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-[4px] bg-[#25D366] px-5 py-3 font-display text-[0.92rem] font-semibold text-white transition hover:brightness-95"
                  >
                    <Wa size={17} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

/* ==========================================================================
   One band of companies
   ========================================================================== */

function Group({ title, sub, items, m, chosen, sit, savingId, bandName, bandLook, say, lang }) {
  if (!items.length) return null
  return (
    <div className="mt-10">
      {title && (
        <div className="mb-5">
          <h2 className="font-display text-[1.28rem] font-semibold tracking-[-0.01em] text-ink sm:text-[1.5rem]">{title}</h2>
          <p className="mt-1.5 text-[0.93rem] leading-[1.6] text-muted">{sub}</p>
        </div>
      )}
      <div className="grid gap-4">
        {items.map((o) => {
          const on = chosen.has(o.co.id)
          const saving = savingId === o.co.id
          return (
            <article
              key={o.co.id}
              className={
                'rounded-[6px] border bg-white p-5 transition sm:p-6 ' +
                (on ? 'border-forest ring-1 ring-forest/25' : 'border-sand')
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-[1.1rem] font-semibold leading-snug text-ink sm:text-[1.22rem]">
                    {o.co.organization}
                  </h3>
                  {o.co.positions && (
                    <p className="mt-1 text-[0.88rem] text-muted">{say(o.co.positions)} {m.openings}</p>
                  )}
                </div>
                <span className={'shrink-0 rounded-full px-3 py-1.5 font-display text-[0.76rem] font-semibold ' + bandLook(o.total)}>
                  {bandName(o.total)}
                </span>
              </div>

              {/* The reasons the desk would say out loud, shown to the person
                  they are about, so a ranking is never a black box. */}
              <div className="mt-4 flex flex-wrap gap-2">
                {o.reasons.filter((r) => r.t !== 'weak').slice(0, 4).map((r, i) => (
                  <span
                    key={i}
                    className={
                      'rounded-[3px] px-2.5 py-1 text-[0.8rem] ' +
                      (r.t === 'good' ? 'bg-forest/10 text-forest-2' : 'bg-paper2 text-ink2')
                    }
                  >
                    {reasonText(r.s, lang, say)}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => sit(o, !on)}
                disabled={saving}
                className={
                  'mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[4px] px-6 py-3.5 font-display text-[0.95rem] font-semibold transition disabled:opacity-60 sm:w-auto ' +
                  (on
                    ? 'bg-forest text-white hover:bg-forest-2'
                    : 'border border-clay bg-clay text-white hover:bg-clay-deep')
                }
              >
                {saving ? m.saving : on ? m.picked : m.pick}
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
