/* ==========================================================================
   Private volunteer desk for the Job Fair. Not linked from anywhere on the
   site and not in the sitemap. Reachable only at /#/desk with the passcode.

   It reads through the rkf-jobfair-desk service, which checks the passcode
   on the server. Junk and duplicate entries can be removed from the list, but
   removal only hides a row: it stays in the table, appears under Removed, and
   goes back with one tap. A tired volunteer at 4pm cannot lose anybody's
   details, which is why there is no hard delete anywhere on this page.
   ========================================================================== */

import { useEffect, useMemo, useState } from 'react'
import { JOBFAIR_DESK, JOBFAIR_KEY } from '../content/jobfair.js'

const REFRESH_MS = 15000

const box = 'w-full rounded-[4px] border border-sand bg-paper px-3 py-2 text-[0.95rem] text-ink outline-none focus:border-clay'

const fmt = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'Asia/Kolkata',
  })
}

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

export default function Desk() {
  const [code, setCode] = useState('')
  const [authed, setAuthed] = useState(false)
  const [gateError, setGateError] = useState('')
  const [tab, setTab] = useState('candidates')
  const [data, setData] = useState({ candidates: [], corporates: [] })
  const [at, setAt] = useState(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('')
  const [taluka, setTaluka] = useState('')
  const [busy, setBusy] = useState(false)
  const [zip, setZip] = useState('')
  const [view, setView] = useState('live')      // live | removed
  const [armed, setArmed] = useState('')        // row id waiting for a second tap
  const [acting, setActing] = useState('')      // row id currently being written
  const [actErr, setActErr] = useState('')
  const [data2, setData2] = useState({ candidates: [], corporates: [] }) // removed rows

  const load = async (theCode) => {
    setBusy(true)
    try {
      const res = await fetch(JOBFAIR_DESK, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + JOBFAIR_KEY,
          apikey: JOBFAIR_KEY,
          'x-desk-code': theCode,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'list' }),
      })
      if (res.status === 401) {
        setBusy(false)
        return { ok: false, bad: true }
      }
      const out = await res.json()
      if (!out.ok) throw new Error('read failed')
      setData({ candidates: out.candidates || [], corporates: out.corporates || [] })
      setData2({ candidates: out.removed_candidates || [], corporates: out.removed_corporates || [] })
      setAt(new Date())
      setErr('')
      setBusy(false)
      return { ok: true }
    } catch (e) {
      setErr('Could not reach the list just now. Retrying.')
      setBusy(false)
      return { ok: false }
    }
  }

  const unlock = async (e) => {
    e.preventDefault()
    setGateError('')
    const r = await load(code.trim())
    if (r.bad) { setGateError('That passcode is not right.'); return }
    if (!r.ok) { setGateError('Could not connect. Check the network and try again.'); return }
    setAuthed(true)
  }

  useEffect(() => {
    if (!authed) return
    const t = setInterval(() => { load(code.trim()) }, REFRESH_MS)
    return () => clearInterval(t)
  }, [authed, code])

  /* An armed row disarms itself, so a tap left behind on a shared laptop
     cannot be completed by whoever sits down next. */
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(''), 6000)
    return () => clearTimeout(t)
  }, [armed])

  const rows = view === 'removed' ? data2[tab] : data[tab]

  /* Remove hides a row from the working list. Restore brings it back. Both go
     through the server with the passcode, and the row itself is never deleted. */
  const act = async (action, id) => {
    setActing(id)
    setActErr('')
    setArmed('')
    try {
      const res = await fetch(JOBFAIR_DESK, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + JOBFAIR_KEY,
          apikey: JOBFAIR_KEY,
          'x-desk-code': code.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, which: tab, id }),
      })
      const out = await res.json().catch(() => ({ ok: false }))
      if (!out.ok) throw new Error(out.error || 'failed')
      await load(code.trim())
    } catch (e) {
      setActErr(action === 'remove' ? 'Could not remove that entry. Try again.' : 'Could not put that entry back. Try again.')
    }
    setActing('')
  }

  /* Pulls every attached file for the rows currently on screen and hands back
     one zip, named so the files sort in the order people registered. */
  const grabFiles = async () => {
    const key = tab === 'candidates' ? 'resume_url' : 'jd_url'
    const nameKey = tab === 'candidates' ? 'name' : 'organization'
    const fileKey = tab === 'candidates' ? 'resume_name' : 'jd_name'
    const withFile = shown.filter((r) => r[key])
    if (withFile.length === 0) { setZip('Nothing attached yet'); setTimeout(() => setZip(''), 2200); return }
    setZip('Collecting 0 of ' + withFile.length)
    try {
      const JSZip = (await import('jszip')).default
      const bag = new JSZip()
      let done = 0
      let failed = 0
      for (let i = 0; i < withFile.length; i += 1) {
        const r = withFile[i]
        try {
          const res = await fetch(r[key])
          if (!res.ok) throw new Error('bad status')
          const blob = await res.blob()
          const raw = String(r[fileKey] || '')
          const ext = raw.includes('.') ? raw.slice(raw.lastIndexOf('.')) : '.pdf'
          const safe = String(r[nameKey] || 'unnamed').replace(/[^\p{L}\p{N} .-]/gu, ' ').trim().slice(0, 60)
          bag.file(String(i + 1).padStart(3, '0') + ' ' + safe + ext, blob)
        } catch (e) {
          failed += 1
        }
        done += 1
        setZip('Collecting ' + done + ' of ' + withFile.length)
      }
      setZip('Packing')
      const out = await bag.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(out)
      const a = document.createElement('a')
      a.href = url
      a.download = tab === 'candidates' ? 'rkf-resumes.zip' : 'rkf-job-descriptions.zip'
      a.click()
      URL.revokeObjectURL(url)
      setZip(failed ? failed + ' could not be fetched' : '')
      if (failed) setTimeout(() => setZip(''), 3000)
      else setZip('')
    } catch (e) {
      setZip('Could not build the zip')
      setTimeout(() => setZip(''), 3000)
    }
  }

  const depts = useMemo(() => {
    const s = new Set(data.candidates.map((r) => r.department).filter(Boolean))
    return [...s].sort()
  }, [data.candidates])

  /* Built from the rows themselves, so a write in taluka appears here too. */
  const talukas = useMemo(() => {
    const s = new Set(data.candidates.map((r) => r.taluka).filter(Boolean))
    return [...s].sort()
  }, [data.candidates])

  const counts = useMemo(() => {
    const m = {}
    data.candidates.forEach((r) => { const k = r.department || 'Not stated'; m[k] = (m[k] || 0) + 1 })
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }, [data.candidates])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (tab === 'candidates' && dept && r.department !== dept) return false
      if (tab === 'candidates' && taluka && r.taluka !== taluka) return false
      if (!needle) return true
      return Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(needle))
    })
  }, [rows, q, dept, taluka, tab])

  const today = useMemo(() => {
    const d = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    return data.candidates.filter((r) => new Date(r.created_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) === d).length
  }, [data.candidates])

  /* ---------------------------------------------------------------- gate */
  if (!authed) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 pt-24 pb-16 md:pt-28">
        <form onSubmit={unlock} className="w-full rounded-[8px] border border-sand bg-paper p-7 shadow-soft">
          <p className="text-[0.72rem] font-semibold uppercase tracking-label text-clay">Ramsukrut Job Fair</p>
          <h1 className="mt-2 font-display text-[1.5rem] font-bold text-ink">Volunteer desk</h1>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            Live list of everyone who has registered. Enter the passcode you were given.
          </p>
          <input
            className={box + ' mt-5'}
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Passcode"
            autoFocus
          />
          {gateError && <p className="mt-2 text-[0.85rem] text-clay-deep">{gateError}</p>}
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="mt-4 w-full rounded-[4px] bg-grad-cta px-5 py-3 text-[0.95rem] font-semibold text-white shadow-glow disabled:opacity-60"
          >
            {busy ? 'Checking' : 'Open the desk'}
          </button>
        </form>
      </section>
    )
  }

  /* ---------------------------------------------------------------- desk */
  const candHead = ['Time', 'Name', 'Mobile', 'Department', 'Qualification', 'Experience', 'Village', 'Taluka', 'District', 'Resume']
  const corpHead = ['Time', 'Organization', 'Contact', 'Mobile', 'Positions', 'Departments', 'JD']
  const removedCount = data2[tab].length

  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-14 pt-28 md:pt-32">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-label text-clay">Live desk</p>
          <h1 className="mt-1 font-display text-[1.6rem] font-bold text-ink">Job Fair registrations</h1>
          <p className="mt-1 text-[0.9rem] text-muted">
            Updates by itself every 15 seconds.
            {at && <span> Last checked {at.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })}.</span>}
          </p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="font-display text-[1.9rem] font-bold leading-none text-ink">{data.candidates.length}</p>
            <p className="text-[0.78rem] uppercase tracking-label text-muted">Candidates</p>
          </div>
          <div>
            <p className="font-display text-[1.9rem] font-bold leading-none text-ink">{today}</p>
            <p className="text-[0.78rem] uppercase tracking-label text-muted">Today</p>
          </div>
          <div>
            <p className="font-display text-[1.9rem] font-bold leading-none text-ink">{data.corporates.length}</p>
            <p className="text-[0.78rem] uppercase tracking-label text-muted">Companies</p>
          </div>
        </div>
      </header>

      {err && <p className="mt-4 rounded-[4px] border border-sand bg-paper2 px-4 py-2 text-[0.88rem] text-ink2">{err}</p>}
      {actErr && <p className="mt-4 rounded-[4px] border border-clay/40 bg-clay/10 px-4 py-2 text-[0.88rem] font-medium text-clay-deep">{actErr}</p>}

      {counts.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {counts.map(([k, n]) => (
            <button
              key={k}
              onClick={() => { setTab('candidates'); setDept(dept === k ? '' : k) }}
              className={
                'rounded-full border px-3 py-1 text-[0.82rem] transition ' +
                (dept === k ? 'border-clay bg-clay text-white' : 'border-sand bg-paper text-ink2 hover:border-clay')
              }
            >
              {k} <span className="font-semibold">{n}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-[4px] border border-sand bg-paper p-1">
          {[['candidates', 'Candidates'], ['corporates', 'Companies']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => { setTab(k); setQ(''); setDept(''); setTaluka(''); setArmed(''); setActErr('') }}
              className={
                'rounded-[3px] px-4 py-2 text-[0.9rem] font-semibold transition ' +
                (tab === k ? 'bg-forest text-white' : 'text-ink2')
              }
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex rounded-[4px] border border-sand bg-paper p-1">
          {[['live', 'Working list'], ['removed', removedCount ? 'Removed ' + removedCount : 'Removed']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => { setView(k); setArmed(''); setActErr('') }}
              className={
                'rounded-[3px] px-4 py-2 text-[0.9rem] font-semibold transition ' +
                (view === k ? 'bg-clay text-white' : 'text-ink2')
              }
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className={box + ' max-w-[280px]'}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, mobile, village"
        />
        {tab === 'candidates' && (
          <select className={box + ' max-w-[220px]'} value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">All departments</option>
            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        {tab === 'candidates' && (
          <select className={box + ' max-w-[200px]'} value={taluka} onChange={(e) => setTaluka(e.target.value)}>
            <option value="">All talukas</option>
            {talukas.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
        <button
          disabled={!!zip}
          onClick={() => grabFiles()}
          className="rounded-[4px] bg-forest px-4 py-2 text-[0.9rem] font-semibold text-white transition hover:bg-ink disabled:opacity-60"
        >
          {zip || (tab === 'candidates' ? 'Download all resumes' : 'Download all JDs')}
        </button>
        <button
          onClick={() => {
            if (tab === 'candidates') {
              download('rkf-candidates.csv', candHead.concat(['Email', 'Resume file']),
                shown.map((r) => [fmt(r.created_at), r.name, r.mobile, r.department, r.qualification, r.experience, r.village || r.city, r.taluka, r.district, r.resume_url, r.email, r.resume_name]))
            } else {
              download('rkf-companies.csv', corpHead.concat(['Email', 'Title', 'Compensation', 'Notes']),
                shown.map((r) => [fmt(r.created_at), r.organization, r.contact_name, r.mobile, r.positions, r.departments, r.jd_url, r.email, r.title, r.compensation, r.notes]))
            }
          }}
          className="rounded-[4px] border border-forest px-4 py-2 text-[0.9rem] font-semibold text-forest transition hover:bg-forest hover:text-white"
        >
          Download CSV
        </button>
        <span className="text-[0.85rem] text-muted">{shown.length} shown</span>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[8px] border border-sand bg-paper shadow-soft">
        {shown.length === 0 ? (
          <p className="px-5 py-12 text-center text-[0.95rem] text-muted">
            {rows.length > 0
              ? 'Nothing matches that search.'
              : view === 'removed'
                ? 'Nothing has been removed. Entries you remove from the working list collect here.'
                : 'No registrations yet. This list fills itself the moment somebody submits the form.'}
          </p>
        ) : (
          <table className="w-full border-collapse text-left text-[0.9rem]">
            <thead>
              <tr className="bg-paper2 text-[0.75rem] uppercase tracking-label text-ink2">
                {(tab === 'candidates' ? candHead : corpHead).map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>
                ))}
                {/* Pinned to the right edge so the control stays reachable on a
                    phone without scrolling the whole table across. */}
                <th className="sticky right-0 whitespace-nowrap border-l border-sand bg-paper2 px-4 py-3 text-right font-semibold">
                  {view === 'removed' ? 'Put back' : 'Remove'}
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => (
                <tr key={r.id || i} className="border-t border-sand align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{fmt(r.created_at)}</td>
                  {tab === 'candidates' ? (
                    <>
                      <td className="px-4 py-3 font-semibold text-ink">{r.name}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <a className="text-forest underline decoration-sand hover:decoration-clay" href={'tel:+91' + r.mobile}>{r.mobile}</a>
                      </td>
                      <td className="px-4 py-3">{r.department}</td>
                      <td className="px-4 py-3">{r.qualification}</td>
                      <td className="whitespace-nowrap px-4 py-3">{r.experience}</td>
                      {/* Rows taken before the location fields split still
                          carry a single city value, so it stands in here. */}
                      <td className="px-4 py-3">{r.village || r.city}</td>
                      <td className="whitespace-nowrap px-4 py-3">{r.taluka}</td>
                      <td className="whitespace-nowrap px-4 py-3">{r.district}</td>
                      <td className="px-4 py-3">
                        {r.resume_url
                          ? <a className="font-semibold text-clay underline decoration-sand" href={r.resume_url} target="_blank" rel="noopener noreferrer">Open</a>
                          : <span className="text-muted">None</span>}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-semibold text-ink">{r.organization}</td>
                      <td className="px-4 py-3">{r.contact_name}{r.title ? <span className="block text-[0.8rem] text-muted">{r.title}</span> : null}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <a className="text-forest underline decoration-sand hover:decoration-clay" href={'tel:+91' + r.mobile}>{r.mobile}</a>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{r.positions}</td>
                      <td className="px-4 py-3">{r.departments}</td>
                      <td className="px-4 py-3">
                        {r.jd_url
                          ? <a className="font-semibold text-clay underline decoration-sand" href={r.jd_url} target="_blank" rel="noopener noreferrer">Open</a>
                          : <span className="text-muted">None</span>}
                      </td>
                    </>
                  )}
                  {/* Removing takes two taps. The first arms this one row and
                      nothing else, so a stray tap while scrolling a phone at
                      the venue does nothing. */}
                  <td className="sticky right-0 whitespace-nowrap border-l border-sand bg-paper px-4 py-3 text-right">
                    {!r.id ? (
                      <span className="text-[0.8rem] text-muted">—</span>
                    ) : view === 'removed' ? (
                      <button
                        disabled={acting === r.id}
                        onClick={() => act('restore', r.id)}
                        className="rounded-[4px] border border-forest px-3 py-1.5 text-[0.82rem] font-semibold text-forest transition hover:bg-forest hover:text-white disabled:opacity-50"
                      >
                        {acting === r.id ? 'Working' : 'Put back'}
                      </button>
                    ) : armed === r.id ? (
                      <span className="inline-flex items-center gap-2">
                        <button
                          disabled={acting === r.id}
                          onClick={() => act('remove', r.id)}
                          className="rounded-[4px] bg-clay-deep px-3 py-1.5 text-[0.82rem] font-semibold text-white transition hover:bg-ink disabled:opacity-50"
                        >
                          {acting === r.id ? 'Removing' : 'Yes, remove'}
                        </button>
                        <button
                          onClick={() => setArmed('')}
                          className="text-[0.82rem] text-muted underline decoration-sand"
                        >
                          Keep
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setArmed(r.id)}
                        aria-label={'Remove ' + (r.name || r.organization || 'this entry')}
                        className="rounded-[4px] border border-sand px-3 py-1.5 text-[0.82rem] font-semibold text-ink2 transition hover:border-clay hover:text-clay-deep"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 text-[0.82rem] leading-relaxed text-muted">
        Removing an entry only hides it from the working list. It moves to Removed and
        goes back with one tap, so nothing a candidate typed is ever destroyed from this
        page. Rows already copied into the Google Sheet stay there and need clearing in
        the sheet as well.
      </p>
    </section>
  )
}
