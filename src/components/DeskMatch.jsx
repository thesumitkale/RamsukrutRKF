/* ==========================================================================
   Matching view for the volunteer desk.

   A recruiter sits down, picks their company, and gets every registered
   candidate ranked against what they said they were hiring for. Scoring is
   plain arithmetic and every point is shown back as a reason, so a volunteer
   can explain a ranking out loud without knowing anything about the code.

   Nothing here writes to the database. The shortlist lives in this browser
   only, which means a recruiter can work through the list on the desk laptop
   without touching anybody else's data.
   ========================================================================== */

import { useEffect, useMemo, useState } from 'react'
import {
  EXP_WANTED,
  QUAL_MIN,
  band,
  bandClass,
  dedupe,
  dept,
  download,
  expOf,
  hiresEverythingOf,
  isLocal,
  place,
  qualOf,
  scoreOf,
  slug,
  wantedDeptsOf,
} from './matchScore.js'

const box = 'w-full rounded-[4px] border border-sand bg-paper px-3 py-2 text-[0.95rem] text-ink outline-none focus:border-clay'

/* ==========================================================================
   Component
   ========================================================================== */

export default function DeskMatch({ candidates, corporates, interviews }) {
  const [corpId, setCorpId] = useState('')
  const [expWanted, setExpWanted] = useState('any')
  const [qualMin, setQualMin] = useState('0')
  const [localOnly, setLocalOnly] = useState(false)
  const [resumeOnly, setResumeOnly] = useState(false)
  const [starredOnly, setStarredOnly] = useState(false)
  const [signedOnly, setSignedOnly] = useState(false)
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState(50)
  const [picks, setPicks] = useState([])
  const [zip, setZip] = useState('')

  const corps = useMemo(
    () => [...corporates].sort((a, b) => String(a.organization || '').localeCompare(String(b.organization || ''))),
    [corporates],
  )

  useEffect(() => {
    if (!corpId && corps.length) setCorpId(corps[0].id)
  }, [corps, corpId])

  /* Each company keeps its own shortlist in this browser, so two recruiters
     sharing the desk laptop do not overwrite one another. */
  useEffect(() => {
    if (!corpId) return
    try {
      setPicks(JSON.parse(localStorage.getItem('rkf-shortlist-' + corpId) || '[]'))
    } catch (e) {
      setPicks([])
    }
    setLimit(50)
  }, [corpId])

  const savePicks = (next) => {
    setPicks(next)
    try { localStorage.setItem('rkf-shortlist-' + corpId, JSON.stringify(next)) } catch (e) { /* private mode */ }
  }

  const toggle = (id) => savePicks(picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id])

  const corp = corps.find((c) => c.id === corpId) || null

  /* Who has actually walked up to the desk and asked to sit for this company.
     Written from the Sign ups screen, so it is the same on every laptop. */
  const signedUp = useMemo(
    () => new Set((interviews || []).filter((x) => x.corporate_id === corpId).map((x) => x.candidate_id)),
    [interviews, corpId],
  )

  const wantedDepts = useMemo(() => wantedDeptsOf(corp), [corp])
  const hiresEverything = hiresEverythingOf(wantedDepts)
  const { unique, dupes } = useMemo(() => dedupe(candidates), [candidates])

  const ranked = useMemo(() => {
    if (!corp) return []
    const needle = q.trim().toLowerCase()
    const out = []
    unique.forEach((r) => {
      const s = scoreOf(r, wantedDepts, hiresEverything, expWanted, qualMin)
      if (!s) return
      if (localOnly && !isLocal(r)) return
      if (resumeOnly && !r.resume_url) return
      if (starredOnly && !picks.includes(r.id)) return
      if (signedOnly && !signedUp.has(r.id)) return
      if (needle) {
        const hay = [r.name, r.mobile, r.village, r.city, r.taluka, r.district, dept(r), qualOf(r)].join(' ').toLowerCase()
        if (!hay.includes(needle)) return
      }
      out.push({ r, ...s })
    })
    out.sort((a, b) => b.total - a.total || String(a.r.created_at).localeCompare(String(b.r.created_at)))
    return out
  }, [unique, corp, wantedDepts, hiresEverything, expWanted, qualMin, localOnly, resumeOnly, starredOnly, signedOnly, signedUp, q, picks])

  const tally = useMemo(() => {
    const t = { strong: 0, look: 0, reserve: 0, local: 0 }
    ranked.forEach(({ r, total }) => {
      if (total >= 78) t.strong += 1
      else if (total >= 58) t.look += 1
      else t.reserve += 1
      if (isLocal(r)) t.local += 1
    })
    return t
  }, [ranked])

  const picked = useMemo(() => ranked.filter(({ r }) => picks.includes(r.id)), [ranked, picks])

  const exportList = (rowsIn, tag) => {
    const name = 'rkf-' + slug(corp && corp.organization) + '-' + tag + '.csv'
    download(
      name,
      ['Rank', 'Score', 'Band', 'Signed up', 'Name', 'Mobile', 'Email', 'Department', 'Qualification', 'Experience', 'Village', 'Taluka', 'District', 'Resume'],
      rowsIn.map(({ r, total }, i) => [
        i + 1, total, band(total), signedUp.has(r.id) ? 'yes' : '', r.name, r.mobile, r.email, dept(r), qualOf(r), expOf(r),
        r.village || r.city, r.taluka, r.district, r.resume_url,
      ]),
    )
  }

  /* Hands the recruiter a folder of the resumes they starred, numbered in the
     same order as the sheet they are holding. */
  const grabPicked = async () => {
    const withFile = picked.filter(({ r }) => r.resume_url)
    if (!withFile.length) { setZip('No resumes in the shortlist'); setTimeout(() => setZip(''), 2400); return }
    setZip('Collecting 0 of ' + withFile.length)
    try {
      const JSZip = (await import('jszip')).default
      const bag = new JSZip()
      let done = 0
      let failed = 0
      for (let i = 0; i < withFile.length; i += 1) {
        const r = withFile[i].r
        try {
          const res = await fetch(r.resume_url)
          if (!res.ok) throw new Error('bad status')
          const raw = String(r.resume_name || '')
          const ext = raw.includes('.') ? raw.slice(raw.lastIndexOf('.')) : '.pdf'
          const safe = String(r.name || 'unnamed').replace(/[^\p{L}\p{N} .-]/gu, ' ').trim().slice(0, 60)
          bag.file(String(i + 1).padStart(2, '0') + ' ' + safe + ext, await res.blob())
        } catch (e) { failed += 1 }
        done += 1
        setZip('Collecting ' + done + ' of ' + withFile.length)
      }
      setZip('Packing')
      const url = URL.createObjectURL(await bag.generateAsync({ type: 'blob' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'rkf-' + slug(corp && corp.organization) + '-shortlist.zip'
      a.click()
      URL.revokeObjectURL(url)
      setZip(failed ? failed + ' could not be fetched' : '')
      if (failed) setTimeout(() => setZip(''), 3000)
    } catch (e) {
      setZip('Could not build the zip')
      setTimeout(() => setZip(''), 3000)
    }
  }

  if (!corps.length) {
    return (
      <div className="mt-5 rounded-[8px] border border-sand bg-paper px-5 py-12 text-center shadow-soft">
        <p className="text-[0.95rem] text-muted">
          No companies have registered yet. Matching opens as soon as the first hiring desk is booked.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* -------------------------------------------------------- controls */}
      <div className="rounded-[8px] border border-sand bg-paper p-5 shadow-soft">
        <label className="block text-[0.72rem] font-semibold uppercase tracking-label text-clay">Matching for</label>
        <div className="mt-2 grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <select className={box} value={corpId} onChange={(e) => setCorpId(e.target.value)}>
            {corps.map((c) => (
              <option key={c.id} value={c.id}>
                {c.organization}{c.positions ? ' (' + c.positions + ')' : ''}
              </option>
            ))}
          </select>
          <select className={box} value={expWanted} onChange={(e) => setExpWanted(e.target.value)}>
            {EXP_WANTED.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <select className={box} value={qualMin} onChange={(e) => setQualMin(e.target.value)}>
            {QUAL_MIN.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>

        {corp && (
          <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
            {corp.contact_name}
            {corp.title ? ', ' + corp.title : ''}
            {corp.mobile ? <> . <a className="text-forest underline decoration-sand" href={'tel:+91' + corp.mobile}>{corp.mobile}</a></> : null}
            {corp.positions ? ' . Hiring ' + corp.positions : ''}
            {corp.compensation ? ' . ' + corp.compensation : ''}
            <br />
            Asked for: {wantedDepts.join(', ') || 'not stated'}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input className={box + ' max-w-[260px]'} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, mobile, village" />
          {[
            [localOnly, setLocalOnly, 'Khed and nearby only'],
            [resumeOnly, setResumeOnly, 'Has a resume'],
            [signedOnly, setSignedOnly, 'Signed up for you'],
            [starredOnly, setStarredOnly, 'Only shortlisted'],
          ].map(([on, set, label]) => (
            <button
              key={label}
              onClick={() => set(!on)}
              className={
                'rounded-full border px-3 py-1.5 text-[0.84rem] font-medium transition ' +
                (on ? 'border-clay bg-clay text-white' : 'border-sand bg-paper text-ink2 hover:border-clay')
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- summary */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          [ranked.length, 'Matched'],
          [tally.strong, 'Strong'],
          [tally.look, 'Worth a look'],
          [tally.local, 'From Khed area'],
          [signedUp.size, 'Signed up'],
          [picks.length, 'Shortlisted'],
        ].map(([n, l]) => (
          <div key={l} className="rounded-[8px] border border-sand bg-paper px-4 py-3 shadow-soft">
            <p className="font-display text-[1.5rem] font-bold leading-none text-ink">{n}</p>
            <p className="mt-1 text-[0.74rem] uppercase tracking-label text-muted">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => exportList(ranked, 'matches')}
          className="rounded-[4px] bg-forest px-4 py-2 text-[0.9rem] font-semibold text-white transition hover:bg-ink"
        >
          Download the ranked list
        </button>
        <button
          disabled={!picked.length}
          onClick={() => exportList(picked, 'shortlist')}
          className="rounded-[4px] border border-forest px-4 py-2 text-[0.9rem] font-semibold text-forest transition hover:bg-forest hover:text-white disabled:opacity-40"
        >
          Download the shortlist
        </button>
        <button
          disabled={!picked.length || !!zip}
          onClick={grabPicked}
          className="rounded-[4px] border border-clay px-4 py-2 text-[0.9rem] font-semibold text-clay-deep transition hover:bg-clay hover:text-white disabled:opacity-40"
        >
          {zip || 'Shortlist resumes as a zip'}
        </button>
        {picks.length > 0 && (
          <button onClick={() => savePicks([])} className="text-[0.85rem] text-muted underline decoration-sand">
            Clear the shortlist
          </button>
        )}
        {dupes > 0 && (
          <span className="text-[0.82rem] text-muted">
            {dupes} repeat {dupes === 1 ? 'registration' : 'registrations'} folded into one
          </span>
        )}
      </div>

      {/* ----------------------------------------------------------- list */}
      {ranked.length === 0 ? (
        <div className="mt-5 rounded-[8px] border border-sand bg-paper px-5 py-12 text-center shadow-soft">
          <p className="text-[0.95rem] text-muted">
            Nobody clears these settings. Loosen the experience or qualification bar, or turn off Khed and nearby only.
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-5 space-y-3">
            {ranked.slice(0, limit).map(({ r, total, reasons }, i) => {
              const on = picks.includes(r.id)
              return (
                <li
                  key={r.id || i}
                  className={
                    'rounded-[8px] border bg-paper p-4 shadow-soft transition ' +
                    (on ? 'border-clay' : 'border-sand')
                  }
                >
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
                    <span className="mt-1 w-7 shrink-0 font-display text-[0.95rem] font-bold text-muted">{i + 1}</span>

                    <div className="min-w-[190px] flex-1">
                      <p className="font-display text-[1.05rem] font-bold leading-tight text-ink">{r.name}</p>
                      <p className="mt-0.5 text-[0.86rem] text-muted">{place(r) || r.district || 'Location not stated'}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className={'rounded-full px-2.5 py-1 text-[0.78rem] font-semibold ' + bandClass(total)}>
                        {total}
                      </span>
                      <span className="text-[0.78rem] uppercase tracking-label text-muted">{band(total)}</span>
                      {signedUp.has(r.id) && (
                        <span className="rounded-full bg-forest/10 px-2.5 py-1 text-[0.76rem] font-semibold text-forest">
                          Signed up
                        </span>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <a
                        className="rounded-[4px] border border-sand px-3 py-1.5 text-[0.82rem] font-semibold text-forest transition hover:border-forest"
                        href={'tel:+91' + r.mobile}
                      >
                        {r.mobile}
                      </a>
                      {r.resume_url ? (
                        <a
                          className="rounded-[4px] border border-sand px-3 py-1.5 text-[0.82rem] font-semibold text-clay-deep transition hover:border-clay"
                          href={r.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Resume
                        </a>
                      ) : null}
                      <button
                        onClick={() => toggle(r.id)}
                        aria-pressed={on}
                        className={
                          'rounded-[4px] px-3 py-1.5 text-[0.82rem] font-semibold transition ' +
                          (on ? 'bg-clay text-white' : 'border border-sand text-ink2 hover:border-clay hover:text-clay-deep')
                        }
                      >
                        {on ? 'Shortlisted' : 'Shortlist'}
                      </button>
                    </div>
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

          {limit < ranked.length && (
            <button
              onClick={() => setLimit(limit + 50)}
              className="mt-5 w-full rounded-[4px] border border-sand bg-paper px-5 py-3 text-[0.9rem] font-semibold text-ink2 transition hover:border-clay hover:text-clay-deep"
            >
              Show 50 more, {ranked.length - limit} still below
            </button>
          )}
        </>
      )}

      <p className="mt-5 text-[0.82rem] leading-relaxed text-muted">
        Score out of 100: department fit up to 55, distance from Dawadi up to 22, experience against
        what you picked up to 12, qualification 8, and 3 for having a resume on file. Anybody whose
        department is unrelated to what the company asked for is left out entirely. The shortlist is
        saved in this browser only and nothing on this page changes a candidate record.
      </p>
    </div>
  )
}
