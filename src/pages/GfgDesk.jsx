/* Private desk for Games for Good. Not linked anywhere on the site.
   Reachable at /#/gfg-desk with the passcode, which is checked on the server.
   Remove only hides a row (it shows under Removed and comes back with one tap). */
import { useEffect, useMemo, useState } from 'react'
import { JOBFAIR_KEY } from '../content/jobfair.js'
import { GFG_DESK, DAY_HEALTH, DAY_EDU } from '../content/gfg.js'

const REFRESH_MS = 30000
const box = 'w-full rounded-[4px] border border-sand bg-paper px-3 py-2 text-[.95rem] text-ink outline-none focus:border-clay'

const COLS = {
  companies: [
    ['created_at', 'Registered'], ['organization', 'Company'], ['group_company', 'Group'],
    ['contact_name', 'Contact'], ['title', 'Designation'], ['mobile', 'Mobile'], ['email', 'Email'],
    ['days', 'Days'], ['supporters', 'Supporters'], ['interests', 'Interested in'], ['notes', 'Notes'], ['source', 'Source'],
  ],
  players: [
    ['created_at', 'Registered'], ['name', 'Name'], ['company', 'Company'], ['gender', 'Gender'],
    ['mobile', 'Mobile'], ['email', 'Email'], ['days', 'Days'], ['badminton_level', 'Badminton'],
    ['cricket_role', 'Cricket'], ['pickleball', 'Pickleball'], ['tshirt', 'T-shirt'], ['notes', 'Notes'], ['source', 'Source'],
  ],
  volunteers: [
    ['created_at', 'Registered'], ['name', 'Name'], ['organization', 'Company or college'], ['mobile', 'Mobile'],
    ['email', 'Email'], ['days', 'Days'], ['roles', 'Roles'], ['tshirt', 'T-shirt'], ['notes', 'Notes'], ['source', 'Source'],
  ],
}
const TAB_LABEL = { companies: 'Companies', players: 'Players', volunteers: 'Volunteers' }

const fmt = (iso) => iso ? new Date(iso).toLocaleString('en-IN', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
}) : ''
const csvCell = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s }
function download(name, cols, rows) {
  const body = [cols.map((c) => c[1]).join(','), ...rows.map((r) => cols.map(([k]) => csvCell(k === 'created_at' ? fmt(r[k]) : r[k])).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob(['\ufeff' + body], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url)
}
const hasDay = (r, d) => String(r.days || '').includes(d)

export default function GfgDesk() {
  const [code, setCode] = useState(() => sessionStorage.getItem('gfg-desk') || '')
  const [authed, setAuthed] = useState(false)
  const [gateErr, setGateErr] = useState('')
  const [tab, setTab] = useState('companies')
  const [data, setData] = useState({ companies: [], players: [], volunteers: [] })
  const [at, setAt] = useState(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [day, setDay] = useState('')
  const [showRemoved, setShowRemoved] = useState(false)
  const [busy, setBusy] = useState(false)

  const post = async (theCode, body) => {
    const res = await fetch(GFG_DESK, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + JOBFAIR_KEY, apikey: JOBFAIR_KEY, 'x-desk-code': theCode.trim(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 401) throw new Error('bad_code')
    const out = await res.json()
    if (!out.ok) throw new Error(out.error || 'failed')
    return out
  }

  const load = async (theCode = code) => {
    setBusy(true)
    try {
      const out = await post(theCode, { action: 'list' })
      setData(out.data); setAt(new Date()); setErr(''); setAuthed(true)
      sessionStorage.setItem('gfg-desk', theCode.trim())
    } catch (e) {
      if (e.message === 'bad_code') { setAuthed(false); setGateErr('That passcode is not right.'); sessionStorage.removeItem('gfg-desk') }
      else setErr('Could not refresh. Check the connection.')
    }
    setBusy(false)
  }

  useEffect(() => { if (code) load(code) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!authed) return
    const t = setInterval(() => load(), REFRESH_MS)
    return () => clearInterval(t)
  }, [authed, code]) // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (action, id) => {
    try { await post(code, { action, which: tab, id }); load() } catch { setErr('That change did not save.') }
  }

  const rows = useMemo(() => {
    const all = data[tab] || []
    const needle = q.trim().toLowerCase()
    return all.filter((r) => (showRemoved ? r.removed_at : !r.removed_at))
      .filter((r) => !day || hasDay(r, day))
      .filter((r) => !needle || Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(needle)))
  }, [data, tab, q, day, showRemoved])

  const live = (k) => (data[k] || []).filter((r) => !r.removed_at)
  const stats = [
    ['Companies', live('companies').length, `${live('companies').filter((r) => hasDay(r, DAY_HEALTH)).length} badminton · ${live('companies').filter((r) => hasDay(r, DAY_EDU)).length} cricket`],
    ['Players', live('players').length, `${live('players').filter((r) => r.gender === 'Woman').length} women · ${live('players').filter((r) => hasDay(r, DAY_HEALTH)).length} badminton · ${live('players').filter((r) => hasDay(r, DAY_EDU)).length} cricket`],
    ['Volunteers', live('volunteers').length, `${live('volunteers').filter((r) => hasDay(r, DAY_HEALTH)).length} on 5 Dec · ${live('volunteers').filter((r) => hasDay(r, DAY_EDU)).length} on 12 Dec`],
  ]

  if (!authed) {
    return (
      <section className="grid min-h-[80vh] place-items-center bg-paper px-5 pt-28">
        <form onSubmit={(e) => { e.preventDefault(); setGateErr(''); load(code) }}
          className="w-full max-w-sm rounded-[8px] border border-sand bg-white p-7 shadow-soft">
          <p className="font-sans text-[.74rem] font-bold uppercase tracking-[.14em] text-teal-deep">Games for Good</p>
          <h1 className="mt-2 font-display text-[1.5rem] font-bold text-ink">Team desk</h1>
          <label className="mt-5 block text-[.9rem] font-semibold text-ink">Passcode
            <input type="password" value={code} onChange={(e) => setCode(e.target.value)} className={box + ' mt-1.5'} autoFocus />
          </label>
          {gateErr && <p className="mt-3 text-[.9rem] font-semibold text-clay-deep">{gateErr}</p>}
          <button className="btn-primary mt-5 w-full" disabled={busy}>{busy ? 'Checking' : 'Open desk'}</button>
        </form>
      </section>
    )
  }

  const cols = COLS[tab]
  return (
    <section className="bg-paper px-4 pb-16 pt-28 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[.74rem] font-bold uppercase tracking-[.14em] text-teal-deep">Games for Good · Team desk</p>
            <h1 className="mt-1 font-display text-[1.8rem] font-bold text-ink">Registrations</h1>
          </div>
          <p className="text-[.85rem] text-muted">{at ? `Updated ${fmt(at.toISOString())} · refreshes every 30s` : ''}{err && <span className="ml-2 text-clay-deep">{err}</span>}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {stats.map(([t, n, sub]) => (
            <div key={t} className="rounded-[8px] border border-sand bg-white p-4">
              <p className="text-[.8rem] font-semibold uppercase tracking-wide text-muted">{t}</p>
              <p className="mt-1 font-display text-[2rem] font-bold leading-none text-ink">{n}</p>
              <p className="mt-2 text-[.82rem] text-ink-2">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {Object.keys(COLS).map((k) => (
            <button key={k} onClick={() => setTab(k)}
              className={`rounded-full px-4 py-2 text-[.9rem] font-semibold ${tab === k ? 'bg-teal-ink text-white' : 'bg-white text-ink-2 border border-sand'}`}>
              {TAB_LABEL[k]} ({live(k).length})
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_260px_auto_auto]">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, company, mobile" className={box} />
          <select value={day} onChange={(e) => setDay(e.target.value)} className={box}>
            <option value="">Both days</option>
            <option value={DAY_HEALTH}>Rally for Health (5 Dec)</option>
            <option value={DAY_EDU}>Run for Education (12 Dec)</option>
          </select>
          <label className="flex items-center gap-2 px-2 text-[.9rem] text-ink-2">
            <input type="checkbox" checked={showRemoved} onChange={(e) => setShowRemoved(e.target.checked)} /> Removed
          </label>
          <button onClick={() => download(`gfg-${tab}.csv`, cols, rows)} className="btn-dark !px-5 !py-2.5">Download CSV</button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-[8px] border border-sand bg-white">
          <table className="min-w-full text-left text-[.86rem]">
            <thead className="bg-paper2 text-ink">
              <tr>{cols.map(([, l]) => <th key={l} className="whitespace-nowrap px-3 py-2.5 font-semibold">{l}</th>)}<th className="px-3 py-2.5" /></tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={cols.length + 1} className="px-3 py-10 text-center text-muted">No registrations here yet.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-sand/70 align-top">
                  {cols.map(([k]) => (
                    <td key={k} className="max-w-[260px] px-3 py-2.5 text-ink-2">
                      {k === 'created_at' ? <span className="whitespace-nowrap">{fmt(r[k])}</span>
                        : k === 'mobile' ? <a href={`tel:${r[k]}`} className="whitespace-nowrap text-teal-deep underline">{r[k]}</a>
                        : k === 'email' && r[k] ? <a href={`mailto:${r[k]}`} className="text-teal-deep underline">{r[k]}</a>
                        : r[k]}
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    {showRemoved
                      ? <button onClick={() => act('restore', r.id)} className="text-[.82rem] font-semibold text-teal-deep underline">Restore</button>
                      : <button onClick={() => act('remove', r.id)} className="text-[.82rem] font-semibold text-clay-deep underline">Remove</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
