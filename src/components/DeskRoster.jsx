/* ==========================================================================
   Interview roster for the volunteer desk.

   Matching answers "who should this company see". Sign ups answers "where can
   this person sit". Neither answers the question the morning of the fair
   actually turns on: who has committed to whom, across everybody.

   This screen is that register. Read from the same rkf_jobfair_interviews
   table both other screens write to, so a recruiter handed a printed list and
   a volunteer holding a laptop are looking at the same thing.

   Two ways in, because two different people ask for it. A company wants its
   own queue for the day. A volunteer chasing a candidate on the phone wants
   that one person's slate. Both are the same rows read from opposite ends.

   Nothing here writes. It is a register, not a control panel, so a stray tap
   on a busy desk cannot unbook anybody.
   ========================================================================== */

import { useMemo, useState } from 'react'
import { band, bandClass, dedupe, dept, download, expOf, place, qualOf } from './matchScore.js'

const box = 'w-full rounded-[4px] border border-sand bg-paper px-3 py-2 text-[0.95rem] text-ink outline-none focus:border-clay'

/* Written the way a volunteer reads a clock, not the way a database stores
   one. Date included because sign ups start days before the fair. */
const stamp = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default function DeskRoster({ candidates, corporates, interviews }) {
  const [mode, setMode] = useState('company')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState({})

  const { unique } = useMemo(() => dedupe(candidates), [candidates])

  const candById = useMemo(() => {
    const m = new Map()
    unique.forEach((r) => m.set(r.id, r))
    /* A duplicate registration that was folded away can still hold a sign up,
       so the raw rows are indexed behind the deduped ones rather than instead
       of them. Nobody disappears from the register. */
    candidates.forEach((r) => { if (!m.has(r.id)) m.set(r.id, r) })
    return m
  }, [unique, candidates])

  const corpById = useMemo(() => {
    const m = new Map()
    corporates.forEach((r) => m.set(r.id, r))
    return m
  }, [corporates])

  /* One row per sign up, already joined to the person and the company, so
     every view below is a grouping of the same flat list. */
  const rows = useMemo(() => {
    const out = []
    ;(interviews || []).forEach((x) => {
      const r = candById.get(x.candidate_id)
      const co = corpById.get(x.corporate_id)
      if (!r || !co) return
      out.push({
        key: x.candidate_id + ':' + x.corporate_id,
        r,
        co,
        fit: Number(x.fit) || 0,
        at: x.created_at,
      })
    })
    out.sort((a, b) => b.fit - a.fit || String(a.at).localeCompare(String(b.at)))
    return out
  }, [interviews, candById, corpById])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((x) =>
      [x.r.name, x.r.mobile, x.co.organization, dept(x.r), x.r.village, x.r.city, x.r.taluka]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [rows, q])

  const byCompany = useMemo(() => {
    const m = new Map()
    filtered.forEach((x) => {
      if (!m.has(x.co.id)) m.set(x.co.id, { co: x.co, list: [] })
      m.get(x.co.id).list.push(x)
    })
    return [...m.values()].sort(
      (a, b) => b.list.length - a.list.length || String(a.co.organization).localeCompare(String(b.co.organization)),
    )
  }, [filtered])

  const byCandidate = useMemo(() => {
    const m = new Map()
    filtered.forEach((x) => {
      if (!m.has(x.r.id)) m.set(x.r.id, { r: x.r, list: [] })
      m.get(x.r.id).list.push(x)
    })
    return [...m.values()].sort(
      (a, b) => b.list.length - a.list.length || String(a.r.name || '').localeCompare(String(b.r.name || '')),
    )
  }, [filtered])

  /* Companies that are coming and have nobody booked yet. This is the number
     worth acting on before the day, so it is counted rather than hidden. */
  const emptyCompanies = corporates.length - new Set(rows.map((x) => x.co.id)).size

  const HEAD = [
    'Company', 'Candidate', 'Mobile', 'Department', 'Qualification',
    'Experience', 'Village', 'Taluka', 'District', 'Fit', 'Band', 'Resume', 'Signed up',
  ]

  const toLine = (x) => [
    x.co.organization,
    x.r.name,
    x.r.mobile,
    dept(x.r),
    qualOf(x.r),
    expOf(x.r),
    x.r.village || x.r.city || '',
    x.r.taluka || '',
    x.r.district || '',
    x.fit || '',
    x.fit ? band(x.fit) : '',
    x.r.resume_url || '',
    stamp(x.at),
  ]

  const exportAll = () =>
    download('rkf-interview-roster.csv', HEAD, filtered.map(toLine))

  const exportOne = (co, list) =>
    download(
      'rkf-roster-' + String(co.organization || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) + '.csv',
      HEAD,
      list.map(toLine),
    )

  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }))

  return (
    <div>
      {/* ------------------------------------------------------- the numbers */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Sign ups', rows.length],
          ['Candidates booked', new Set(rows.map((x) => x.r.id)).size],
          ['Companies with a queue', new Set(rows.map((x) => x.co.id)).size],
          ['Companies with nobody yet', emptyCompanies],
        ].map(([label, n]) => (
          <div key={label} className="rounded-[4px] border border-sand bg-paper p-4">
            <p className="font-display text-[1.7rem] font-bold leading-none text-ink">{n}</p>
            <p className="mt-1.5 text-[0.82rem] leading-snug text-ink2">{label}</p>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------- the controls */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex rounded-[4px] border border-sand bg-paper p-1">
          {[['company', 'By company'], ['candidate', 'By candidate']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={
                'rounded-[3px] px-4 py-2 text-[0.9rem] font-semibold transition ' +
                (mode === k ? 'bg-forest text-white' : 'text-ink2')
              }
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className={box + ' max-w-[300px]'}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, mobile or company"
        />
        <button
          onClick={exportAll}
          disabled={!filtered.length}
          className="rounded-[4px] border border-sand px-4 py-2 text-[0.9rem] font-semibold text-ink2 transition hover:border-clay hover:text-clay-deep disabled:opacity-50"
        >
          Download all {filtered.length ? '(' + filtered.length + ')' : ''}
        </button>
      </div>

      {rows.length === 0 && (
        <p className="mt-8 rounded-[4px] border border-sand bg-paper p-6 text-[0.95rem] leading-relaxed text-ink2">
          Nobody has signed up yet. Candidates book themselves from the My options page, or a volunteer
          books them from the Sign ups screen. Anything chosen either way lands here.
        </p>
      )}

      {rows.length > 0 && filtered.length === 0 && (
        <p className="mt-8 rounded-[4px] border border-sand bg-paper p-6 text-[0.95rem] text-ink2">
          No sign up matches that search.
        </p>
      )}

      {/* ---------------------------------------------------- by company view */}
      {mode === 'company' && filtered.length > 0 && (
        <div className="mt-6 space-y-3">
          {byCompany.map(({ co, list }) => {
            const isOpen = open[co.id] !== false
            const strong = list.filter((x) => x.fit >= 78).length
            return (
              <section key={co.id} className="overflow-hidden rounded-[4px] border border-sand bg-paper">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-4 py-3">
                  <button onClick={() => toggle(co.id)} className="flex min-w-0 items-center gap-3 text-left">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[3px] bg-forest text-[0.9rem] font-bold text-white">
                      {list.length}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-[1.02rem] font-semibold text-ink">
                        {co.organization}
                      </span>
                      <span className="block text-[0.8rem] text-ink2">
                        {strong} strong {strong === 1 ? 'match' : 'matches'}
                        {co.positions ? ' \u00b7 ' + co.positions + ' openings' : ''}
                      </span>
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportOne(co, list)}
                      className="rounded-[3px] border border-sand px-3 py-1.5 text-[0.82rem] font-semibold text-ink2 transition hover:border-clay hover:text-clay-deep"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => toggle(co.id)}
                      className="rounded-[3px] border border-sand px-3 py-1.5 text-[0.82rem] font-semibold text-ink2"
                    >
                      {isOpen ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                {isOpen && <PeopleTable list={list} />}
              </section>
            )
          })}
        </div>
      )}

      {/* -------------------------------------------------- by candidate view */}
      {mode === 'candidate' && filtered.length > 0 && (
        <div className="mt-6 space-y-3">
          {byCandidate.map(({ r, list }) => (
            <section key={r.id} className="rounded-[4px] border border-sand bg-paper px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-[1.02rem] font-semibold text-ink">{r.name}</p>
                  <p className="mt-0.5 text-[0.84rem] text-ink2">
                    <a href={'tel:' + String(r.mobile || '').replace(/\s/g, '')} className="font-semibold text-forest-2 underline">
                      {r.mobile}
                    </a>
                    {' \u00b7 '}{dept(r)}{' \u00b7 '}{qualOf(r)}{' \u00b7 '}{expOf(r)}
                    {place(r) ? ' \u00b7 ' + place(r) : ''}
                  </p>
                </div>
                <span className="shrink-0 rounded-[3px] bg-forest/10 px-2.5 py-1 text-[0.8rem] font-semibold text-forest-2">
                  {list.length} {list.length === 1 ? 'company' : 'companies'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {list.map((x) => (
                  <span
                    key={x.key}
                    className={'rounded-[3px] px-2.5 py-1 text-[0.82rem] font-medium ' + bandClass(x.fit)}
                  >
                    {x.co.organization}
                    {x.fit ? ' \u00b7 ' + x.fit : ''}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   One company's queue
   ========================================================================== */

function PeopleTable({ list }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-sand bg-paper2">
            {['Candidate', 'Mobile', 'Department', 'Qualification', 'Experience', 'From', 'Fit', 'Resume', 'Signed up'].map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2 font-display text-[0.76rem] font-semibold uppercase tracking-wider text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((x) => (
            <tr key={x.key} className="border-b border-sand/60 last:border-0">
              <td className="whitespace-nowrap px-3 py-2.5 text-[0.9rem] font-semibold text-ink">{x.r.name}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[0.9rem]">
                <a href={'tel:' + String(x.r.mobile || '').replace(/\s/g, '')} className="text-forest-2 underline">
                  {x.r.mobile}
                </a>
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[0.88rem] text-ink2">{dept(x.r)}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[0.88rem] text-ink2">{qualOf(x.r)}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[0.88rem] text-ink2">{expOf(x.r)}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[0.88rem] text-ink2">{place(x.r)}</td>
              <td className="whitespace-nowrap px-3 py-2.5">
                {x.fit ? (
                  <span className={'rounded-[3px] px-2 py-0.5 text-[0.78rem] font-semibold ' + bandClass(x.fit)}>
                    {x.fit} {band(x.fit)}
                  </span>
                ) : (
                  <span className="text-[0.85rem] text-muted">Not scored</span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[0.88rem]">
                {x.r.resume_url ? (
                  <a href={x.r.resume_url} target="_blank" rel="noreferrer" className="text-clay-deep underline">
                    Open
                  </a>
                ) : (
                  <span className="text-muted">None</span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[0.85rem] text-muted">{stamp(x.at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
