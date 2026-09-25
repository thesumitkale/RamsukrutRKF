/* ==========================================================================
   Candidate view for the volunteer desk.

   The mirror image of Matching. A candidate walks up, a volunteer finds them
   by name or mobile, and the screen answers the only question that person
   actually has: which of these companies can I sit for today.

   Companies are ranked by the same arithmetic the recruiter side uses, so
   the two screens can never disagree in front of the candidate. Strong
   matches are shown first and everything weaker is folded away, because a
   list of seventeen options helps nobody in a queue.

   Choosing a process writes one row to its own table, rkf_jobfair_interviews.
   No candidate record and no company record is ever touched by this screen,
   and unticking stamps the row rather than deleting it.
   ========================================================================== */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  band,
  bandClass,
  dedupe,
  dept,
  download,
  expOf,
  hiresEverythingOf,
  place,
  qualOf,
  scoreOf,
  wantedDeptsOf,
} from './matchScore.js'

const box = 'w-full rounded-[4px] border border-sand bg-paper px-3 py-2 text-[0.95rem] text-ink outline-none focus:border-clay'

const digits = (s) => String(s || '').replace(/\D/g, '')

/* A company is only offered to a candidate if the match is real. Below this
   the desk would be sending somebody to queue for an hour on a maybe. */
const OFFER_FLOOR = 58

export default function DeskCandidate({ candidates, corporates, interviews, onSit, openMobile }) {
  const [q, setQ] = useState('')
  const [pickedId, setPickedId] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [busyCorp, setBusyCorp] = useState('')
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState('')
  const searchRef = useRef(null)

  const { unique } = useMemo(() => dedupe(candidates), [candidates])

  const corps = useMemo(
    () => [...corporates].sort((a, b) => String(a.organization || '').localeCompare(String(b.organization || ''))),
    [corporates],
  )

  /* Search is name or mobile, and a mobile is matched on digits alone so a
     volunteer can type it however the candidate says it. */
  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (needle.length < 2) return []
    const num = digits(needle)
    return unique
      .filter((r) => {
        if (num.length >= 4 && digits(r.mobile).includes(num)) return true
        return String(r.name || '').toLowerCase().includes(needle)
      })
      .slice(0, 12)
  }, [unique, q])

  const person = useMemo(() => unique.find((r) => r.id === pickedId) || null, [unique, pickedId])

  /* Arriving from the walk-in form: open the person who was just saved. */
  useEffect(() => {
    if (!openMobile) return
    const hit = unique.find((r) => digits(r.mobile).slice(-10) === openMobile)
    if (hit) setPickedId(hit.id)
  }, [openMobile, unique])

  /* Every company scored for this one person. The recruiter side lets a
     recruiter tighten experience and qualification for themselves. Here the
     bar is left open, since the desk is telling the candidate where they may
     sit, not deciding who gets hired. */
  const options = useMemo(() => {
    if (!person) return []
    const out = []
    corps.forEach((c) => {
      const wanted = wantedDeptsOf(c)
      const s = scoreOf(person, wanted, hiresEverythingOf(wanted), 'any', '0')
      if (!s) return
      out.push({ c, wanted, ...s })
    })
    out.sort((a, b) => b.total - a.total || String(a.c.organization).localeCompare(String(b.c.organization)))
    return out
  }, [person, corps])

  const chosen = useMemo(() => {
    if (!person) return new Set()
    return new Set(
      (interviews || []).filter((x) => x.candidate_id === person.id).map((x) => x.corporate_id),
    )
  }, [interviews, person])

  const strong = options.filter((o) => o.total >= OFFER_FLOOR)
  /* A chosen company always stays on screen even if a later edit to the
     company record drops it under the floor, so nobody loses a slot silently. */
  const shown = showAll ? options : options.filter((o) => o.total >= OFFER_FLOOR || chosen.has(o.c.id))
  const hidden = options.length - shown.length

  useEffect(() => { setShowAll(false); setErr(''); setCopied('') }, [pickedId])

  const sit = async (corpId, on, fit) => {
    /* Five per person, the same ceiling the candidate page and the server hold. */
    if (on && !chosen.has(corpId) && chosen.size >= 5) {
      setErr('Already booked for 5 companies. Untick one first.')
      return
    }
    setBusyCorp(corpId)
    setErr('')
    try {
      const ok = await onSit({
        candidate_id: person.id,
        corporate_id: corpId,
        on,
        fit,
        band: band(fit),
      })
      if (!ok) throw new Error('write failed')
    } catch (e) {
      setErr('That did not save. Check the network and tap again.')
    }
    setBusyCorp('')
  }

  const chosenRows = options.filter((o) => chosen.has(o.c.id))

  /* What the candidate walks away with. A volunteer reads it out, or sends
     it on WhatsApp, and the candidate knows exactly which desks to join. */
  const slipText = () => {
    if (!person || !chosenRows.length) return ''
    const lines = chosenRows.map(
      (o, i) => (i + 1) + '. ' + o.c.organization + (o.c.positions ? ' (hiring ' + o.c.positions + ')' : ''),
    )
    return [
      'Ramsukrut Job Fair, 29 September 2026',
      person.name,
      '',
      'Interview desks you are signed up for:',
      ...lines,
      '',
      'Carry a printed resume and a photo ID. Reach by 9 AM.',
    ].join('\n')
  }

  const copySlip = async () => {
    const text = slipText()
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied('Copied')
    } catch (e) {
      setCopied('Could not copy')
    }
    setTimeout(() => setCopied(''), 2200)
  }

  const downloadSlip = () => {
    download(
      'rkf-' + digits(person.mobile).slice(-10) + '-desks.csv',
      ['Candidate', 'Mobile', 'Company', 'Contact', 'Hiring', 'Fit', 'Band'],
      chosenRows.map((o) => [
        person.name, person.mobile, o.c.organization, o.c.contact_name, o.c.positions, o.total, band(o.total),
      ]),
    )
  }

  /* ------------------------------------------------------------- render */

  if (!corps.length) {
    return (
      <div className="mt-5 rounded-[8px] border border-sand bg-paper px-5 py-12 text-center shadow-soft">
        <p className="text-[0.95rem] text-muted">
          No companies have registered yet, so there is nothing to offer a candidate.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* --------------------------------------------------------- search */}
      <div className="rounded-[8px] border border-sand bg-paper p-5 shadow-soft">
        <label className="block text-[0.72rem] font-semibold uppercase tracking-label text-clay">
          Find the candidate
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            ref={searchRef}
            className={box + ' max-w-[320px]'}
            value={q}
            onChange={(e) => { setQ(e.target.value); setPickedId('') }}
            placeholder="Name or mobile number"
          />
          {(q || person) && (
            <button
              onClick={() => { setQ(''); setPickedId(''); if (searchRef.current) searchRef.current.focus() }}
              className="text-[0.85rem] text-muted underline decoration-sand"
            >
              Next candidate
            </button>
          )}
        </div>

        {q.trim().length >= 2 && !person && (
          hits.length ? (
            <ul className="mt-3 divide-y divide-sand overflow-hidden rounded-[6px] border border-sand">
              {hits.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setPickedId(r.id)}
                    className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 bg-paper px-3 py-2.5 text-left transition hover:bg-paper2"
                  >
                    <span className="font-display text-[0.98rem] font-bold text-ink">{r.name}</span>
                    <span className="text-[0.85rem] text-muted">{r.mobile}</span>
                    <span className="text-[0.85rem] text-muted">{place(r) || r.district || 'Location not stated'}</span>
                    <span className="text-[0.85rem] text-muted">{dept(r)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[0.88rem] text-muted">
              Nobody matches that. Check the spelling, or try the last four digits of the mobile.
            </p>
          )
        )}
      </div>

      {!person ? (
        <div className="mt-5 rounded-[8px] border border-sand bg-paper px-5 py-12 text-center shadow-soft">
          <p className="text-[0.95rem] text-muted">
            Search a name or mobile above. The screen then shows only the companies that person can
            genuinely sit for, and they pick the ones they want.
          </p>
        </div>
      ) : (
        <>
          {/* ------------------------------------------------------ person */}
          <div className="mt-4 rounded-[8px] border border-forest bg-paper p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-[1.35rem] font-bold leading-tight text-ink">{person.name}</p>
                <p className="mt-1 text-[0.9rem] text-muted">
                  {place(person) || person.district || 'Location not stated'}
                  {person.district ? ' . ' + person.district : ''}
                </p>
                <p className="mt-1 text-[0.9rem] text-muted">
                  {[dept(person), qualOf(person), expOf(person)].filter(Boolean).join(' . ')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  className="rounded-[4px] border border-sand px-3 py-1.5 text-[0.85rem] font-semibold text-forest transition hover:border-forest"
                  href={'tel:+91' + person.mobile}
                >
                  {person.mobile}
                </a>
                {person.resume_url && (
                  <a
                    className="rounded-[4px] border border-sand px-3 py-1.5 text-[0.85rem] font-semibold text-clay-deep transition hover:border-clay"
                    href={person.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-sand pt-4">
              <p className="text-[0.9rem] text-ink2">
                <span className="font-display text-[1.25rem] font-bold text-ink">{chosen.size}</span>
                {' '}signed up, {strong.length} open to them
              </p>
              {chosen.size > 0 && (
                <>
                  <button
                    onClick={copySlip}
                    className="rounded-[4px] bg-forest px-4 py-2 text-[0.88rem] font-semibold text-white transition hover:bg-ink"
                  >
                    {copied || 'Copy their list for WhatsApp'}
                  </button>
                  <button
                    onClick={downloadSlip}
                    className="rounded-[4px] border border-forest px-4 py-2 text-[0.88rem] font-semibold text-forest transition hover:bg-forest hover:text-white"
                  >
                    Download the slip
                  </button>
                </>
              )}
            </div>

            {err && <p className="mt-3 text-[0.88rem] font-semibold text-clay-deep">{err}</p>}
          </div>

          {/* ----------------------------------------------------- options */}
          {shown.length === 0 ? (
            <div className="mt-4 rounded-[8px] border border-sand bg-paper px-5 py-10 text-center shadow-soft">
              <p className="text-[0.95rem] text-muted">
                No company at this fair is hiring in {dept(person) || 'that line of work'} right now.
                Take their number for the next one.
              </p>
              {options.length > 0 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="mt-3 text-[0.88rem] font-semibold text-clay-deep underline decoration-sand"
                >
                  Show the {options.length} weaker {options.length === 1 ? 'option' : 'options'} anyway
                </button>
              )}
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {shown.map(({ c, total, reasons, wanted }) => {
                const on = chosen.has(c.id)
                const working = busyCorp === c.id
                return (
                  <li
                    key={c.id}
                    className={
                      'rounded-[8px] border bg-paper p-4 shadow-soft transition ' +
                      (on ? 'border-forest' : 'border-sand')
                    }
                  >
                    <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
                      <div className="min-w-[190px] flex-1">
                        <p className="font-display text-[1.05rem] font-bold leading-tight text-ink">
                          {c.organization}
                        </p>
                        <p className="mt-0.5 text-[0.86rem] text-muted">
                          {[c.positions ? 'Hiring ' + c.positions : '', c.compensation].filter(Boolean).join(' . ') ||
                            'Openings not stated'}
                        </p>
                        <p className="mt-0.5 text-[0.84rem] text-muted">{wanted.join(', ') || 'Roles not stated'}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className={'rounded-full px-2.5 py-1 text-[0.78rem] font-semibold ' + bandClass(total)}>
                          {total}
                        </span>
                        <span className="text-[0.78rem] uppercase tracking-label text-muted">{band(total)}</span>
                      </div>

                      <button
                        onClick={() => sit(c.id, !on, total)}
                        disabled={working}
                        aria-pressed={on}
                        className={
                          'shrink-0 rounded-[4px] px-4 py-2 text-[0.85rem] font-semibold transition disabled:opacity-50 ' +
                          (on
                            ? 'bg-forest text-white hover:bg-ink'
                            : 'border border-clay text-clay-deep hover:bg-clay hover:text-white')
                        }
                      >
                        {working ? 'Saving' : on ? 'Signed up' : 'Sit for this'}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {reasons.map((x, k) => (
                        <span
                          key={k}
                          className={
                            'rounded-full px-2.5 py-0.5 text-[0.78rem] ' +
                            (x.t === 'good'
                              ? 'bg-forest/10 text-forest'
                              : x.t === 'weak'
                                ? 'bg-clay/10 text-clay-deep'
                                : x.t === 'ok'
                                  ? 'bg-gold/25 text-ink'
                                  : 'bg-paper2 text-muted')
                          }
                        >
                          {x.s}
                        </span>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {hidden > 0 && shown.length > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 w-full rounded-[4px] border border-sand bg-paper px-5 py-3 text-[0.9rem] font-semibold text-ink2 transition hover:border-clay hover:text-clay-deep"
            >
              Show {hidden} weaker {hidden === 1 ? 'option' : 'options'}
            </button>
          )}
          {showAll && options.length > strong.length && (
            <button
              onClick={() => setShowAll(false)}
              className="mt-4 w-full rounded-[4px] border border-sand bg-paper px-5 py-3 text-[0.9rem] font-semibold text-ink2 transition hover:border-clay"
            >
              Show strong matches only
            </button>
          )}
        </>
      )}

      <p className="mt-5 text-[0.82rem] leading-relaxed text-muted">
        Companies are scored for this candidate on the same arithmetic the recruiter screen uses, so
        both sides see the same number. Only matches of {OFFER_FLOOR} and above are offered, because
        sending somebody to queue on a weak match wastes their day. A signed up choice is saved for
        everyone on every desk, and unticking keeps the record rather than deleting it.
      </p>
    </div>
  )
}
