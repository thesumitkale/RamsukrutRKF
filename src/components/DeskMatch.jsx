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

const box = 'w-full rounded-[4px] border border-sand bg-paper px-3 py-2 text-[0.95rem] text-ink outline-none focus:border-clay'

/* ---------------------------------------------------------------- tidying */

/* Early rows and Marathi submissions carry a few spellings of the same
   answer. They are folded together here rather than in the database, so no
   existing row is rewritten. */
const DEPT_FIX = {
  'IT / Software': 'IT & Software',
  'लॉजिस्टिक्स व वेअरहाऊस': 'Logistics & Warehouse',
}

const EXP_FIX = { 'फ्रेशर': 'Fresher' }

const QUAL_FIX = {
  'पदव्युत्तर': 'Post Graduate',
  MBA: 'Post Graduate',
  'BE Mechanical': 'Graduate',
  'BSc IT': 'Graduate',
}

const dept = (r) => DEPT_FIX[r.department] || r.department || ''
const expOf = (r) => EXP_FIX[r.experience] || r.experience || ''
const qualOf = (r) => QUAL_FIX[r.qualification] || r.qualification || ''
const place = (r) => [r.village || r.city, r.taluka].filter(Boolean).join(', ')

/* ---------------------------------------------------------------- scoring */

/* Departments that a recruiter will usually still want to look at. A
   production line short of people takes a warehouse hand seriously. */
const NEAR_DEPT = {
  'Manufacturing & Production': ['Supervisors & Team Leads', 'Logistics & Warehouse', 'General Staff', 'Non-technical Operations'],
  'Logistics & Warehouse': ['Manufacturing & Production', 'General Staff', 'Non-technical Operations'],
  'Supervisors & Team Leads': ['Manufacturing & Production', 'General Staff', 'Logistics & Warehouse'],
  'General Staff': ['Manufacturing & Production', 'Logistics & Warehouse', 'Non-technical Operations', 'Office Staff'],
  'Non-technical Operations': ['General Staff', 'Office Staff', 'Logistics & Warehouse'],
  'Office Staff': ['HR & Administration', 'Accounts & Finance', 'Non-technical Operations'],
  'HR & Administration': ['Office Staff'],
  'Accounts & Finance': ['Office Staff'],
  'Sales & Marketing': ['Customer Support & BPO'],
  'Customer Support & BPO': ['Sales & Marketing', 'Office Staff'],
  'IT & Software': ['Customer Support & BPO'],
}

/* The fair is at Dawadi in Khed taluka. Somebody from Khed can start on
   Monday. Somebody from Nagpur probably cannot, whatever their resume says. */
const ADJACENT = ['Ambegaon', 'Junnar', 'Maval', 'Shirur', 'Haveli', 'Pimpri-Chinchwad']

function locationScore(r) {
  const t = r.taluka || ''
  const d = r.district || ''
  if (t === 'Khed' && d === 'Pune') return [22, 'Khed taluka, local']
  if (d === 'Pune' && ADJACENT.includes(t)) return [17, t + ', next to Khed']
  if (d === 'Pune') return [12, (t || 'Pune district') + ', Pune district']
  if (d === 'Ahilyanagar (Ahmednagar)') return [7, 'Ahilyanagar, travels in']
  if (!d) return [2, 'Location not stated']
  return [3, d + ', travels in']
}

const EXP_RANK = { Fresher: 0, '0 to 1 year': 1, '1 to 3 years': 2, '3 to 5 years': 3, 'More than 5 years': 4 }

const EXP_TABLE = {
  any: [7, 9, 11, 12, 12],
  fresher: [12, 10, 5, 2, 0],
  some: [0, 7, 12, 12, 11],
  mid: [0, 0, 6, 12, 12],
  senior: [0, 0, 0, 6, 12],
}

const EXP_WANTED = [
  ['any', 'Any experience'],
  ['fresher', 'Freshers preferred'],
  ['some', '1 year and above'],
  ['mid', '3 years and above'],
  ['senior', '5 years and above'],
]

const QUAL_RANK = {
  '10th (SSC)': 1, ITI: 2, '12th (HSC)': 2, Diploma: 3, Graduate: 4, 'Post Graduate': 5, Other: 1,
}

const QUAL_MIN = [
  ['0', 'Any qualification'],
  ['2', '12th or ITI and above'],
  ['3', 'Diploma and above'],
  ['4', 'Graduate and above'],
  ['5', 'Post Graduate only'],
]

/* Returns a score out of 100 and the reasons behind it, in the order a
   recruiter would say them out loud. */
function scoreOf(r, wantedDepts, hiresEverything, expWanted, qualMin) {
  const reasons = []
  const cd = dept(r)
  let total = 0

  if (wantedDepts.includes(cd)) {
    total += 55
    reasons.push({ t: 'good', s: cd })
  } else {
    const near = wantedDepts.some((w) => (NEAR_DEPT[w] || []).includes(cd))
    if (near) {
      total += 30
      reasons.push({ t: 'ok', s: cd + ', close fit' })
    } else if (hiresEverything) {
      total += 18
      reasons.push({ t: 'ok', s: cd })
    } else {
      return null
    }
  }

  const [ls, lr] = locationScore(r)
  total += ls
  reasons.push({ t: ls >= 17 ? 'good' : 'plain', s: lr })

  const e = expOf(r)
  const er = EXP_RANK[e]
  if (er === undefined) {
    total += 4
    reasons.push({ t: 'plain', s: e || 'Experience not stated' })
  } else {
    const pts = EXP_TABLE[expWanted][er]
    total += pts
    reasons.push({ t: pts >= 10 ? 'good' : pts === 0 ? 'weak' : 'plain', s: e })
  }

  const q = qualOf(r)
  const qr = QUAL_RANK[q] || 0
  const need = Number(qualMin)
  if (qr >= need) {
    total += 8
    reasons.push({ t: need > 0 ? 'good' : 'plain', s: q || 'Qualification not stated' })
  } else {
    reasons.push({ t: 'weak', s: (q || 'Not stated') + ', below the bar' })
  }

  if (r.resume_url) {
    total += 3
    reasons.push({ t: 'plain', s: 'Resume attached' })
  } else {
    reasons.push({ t: 'weak', s: 'No resume' })
  }

  return { total: Math.min(100, total), reasons }
}

const band = (n) => (n >= 78 ? 'strong' : n >= 58 ? 'worth a look' : 'reserve')

const bandClass = (n) =>
  n >= 78
    ? 'bg-forest text-white'
    : n >= 58
      ? 'bg-gold text-ink'
      : 'bg-paper2 text-ink2 border border-sand'

/* ---------------------------------------------------------------- export */

const csvCell = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

function download(name, headers, rows) {
  const body = [headers.join(','), ...rows.map((r) => r.map(csvCell).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([body], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

const slug = (s) => String(s || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)

/* ==========================================================================
   Component
   ========================================================================== */

export default function DeskMatch({ candidates, corporates }) {
  const [corpId, setCorpId] = useState('')
  const [expWanted, setExpWanted] = useState('any')
  const [qualMin, setQualMin] = useState('0')
  const [localOnly, setLocalOnly] = useState(false)
  const [resumeOnly, setResumeOnly] = useState(false)
  const [starredOnly, setStarredOnly] = useState(false)
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

  const wantedDepts = useMemo(() => {
    if (!corp) return []
    return String(corp.departments || '')
      .split(',')
      .map((s) => DEPT_FIX[s.trim()] || s.trim())
      .filter(Boolean)
  }, [corp])

  /* A company that ticked nearly every box has not really told us anything,
     so everybody stays in the list at a lower base score. */
  const hiresEverything = wantedDepts.length >= 8 || wantedDepts.includes('Other')

  /* One person who registered three times should appear once. The earliest
     entry is kept, since that is the one already in the sheet. */
  const { unique, dupes } = useMemo(() => {
    const seen = new Map()
    let dup = 0
    const ordered = [...candidates].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
    ordered.forEach((r) => {
      const key = String(r.mobile || '').replace(/\D/g, '').slice(-10)
      if (!key) { seen.set('row-' + r.id, r); return }
      if (seen.has(key)) { dup += 1; return }
      seen.set(key, r)
    })
    return { unique: [...seen.values()], dupes: dup }
  }, [candidates])

  const ranked = useMemo(() => {
    if (!corp) return []
    const needle = q.trim().toLowerCase()
    const out = []
    unique.forEach((r) => {
      const s = scoreOf(r, wantedDepts, hiresEverything, expWanted, qualMin)
      if (!s) return
      if (localOnly && !(r.district === 'Pune' && (r.taluka === 'Khed' || ADJACENT.includes(r.taluka)))) return
      if (resumeOnly && !r.resume_url) return
      if (starredOnly && !picks.includes(r.id)) return
      if (needle) {
        const hay = [r.name, r.mobile, r.village, r.city, r.taluka, r.district, dept(r), qualOf(r)].join(' ').toLowerCase()
        if (!hay.includes(needle)) return
      }
      out.push({ r, ...s })
    })
    out.sort((a, b) => b.total - a.total || String(a.r.created_at).localeCompare(String(b.r.created_at)))
    return out
  }, [unique, corp, wantedDepts, hiresEverything, expWanted, qualMin, localOnly, resumeOnly, starredOnly, q, picks])

  const tally = useMemo(() => {
    const t = { strong: 0, look: 0, reserve: 0, local: 0 }
    ranked.forEach(({ r, total }) => {
      if (total >= 78) t.strong += 1
      else if (total >= 58) t.look += 1
      else t.reserve += 1
      if (r.district === 'Pune' && (r.taluka === 'Khed' || ADJACENT.includes(r.taluka))) t.local += 1
    })
    return t
  }, [ranked])

  const picked = useMemo(() => ranked.filter(({ r }) => picks.includes(r.id)), [ranked, picks])

  const exportList = (rowsIn, tag) => {
    const name = 'rkf-' + slug(corp && corp.organization) + '-' + tag + '.csv'
    download(
      name,
      ['Rank', 'Score', 'Band', 'Name', 'Mobile', 'Email', 'Department', 'Qualification', 'Experience', 'Village', 'Taluka', 'District', 'Resume'],
      rowsIn.map(({ r, total }, i) => [
        i + 1, total, band(total), r.name, r.mobile, r.email, dept(r), qualOf(r), expOf(r),
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
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          [ranked.length, 'Matched'],
          [tally.strong, 'Strong'],
          [tally.look, 'Worth a look'],
          [tally.local, 'From Khed area'],
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
