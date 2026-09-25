/* ==========================================================================
   Day plan for the volunteer desk.

   Every registered person has a group, a reporting time and up to three
   stops. This screen is where the desk reads that plan three ways: the whole
   floor by time, one company's queue for the day, and one person's ticket.

   It writes in exactly two cases, both additive. New registrations and
   walk-ins who have no time yet get one from spare room, and a single person
   can be re-placed from now onwards. Nobody already told a time is moved by
   anything else here.
   ========================================================================== */

import { useMemo, useState } from 'react'
import { dept, download } from './matchScore.js'
import { WAVES, TEST, everyone, planPeople, firstOpenWave, capacity, isTestCo, panelsOf, PER_PANEL, TEST_SEATS, TEST_STARTS, DEPT_CODE } from './planner.js'

const box = 'w-full rounded-[4px] border border-sand bg-paper px-3 py-2 text-[0.95rem] text-ink outline-none focus:border-clay'
const btn = 'rounded-[4px] px-4 py-2 font-display text-[0.86rem] font-semibold transition disabled:opacity-50'
const digits = (s) => String(s || '').replace(/\D/g, '').slice(-10)

const clock = (slot) => {
  if (!slot) return ''
  const [h, mm] = String(slot).split(':').map(Number)
  return ((h + 11) % 12) + 1 + ':' + String(mm).padStart(2, '0') + (h < 12 ? ' AM' : ' PM')
}
const clockMr = (slot) => {
  if (!slot) return ''
  const [h, mm] = String(slot).split(':').map(Number)
  return (h < 12 ? 'सकाळी ' : 'दुपारी ') + (((h + 11) % 12) + 1) + ':' + String(mm).padStart(2, '0')
}

export default function DeskPlan({ candidates, corporates, interviews, plans, post, onSaved, openMobile }) {
  const [view, setView] = useState('time')
  const [co, setCo] = useState('')
  const [q, setQ] = useState(openMobile || '')
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')

  const people = useMemo(() => everyone(candidates), [candidates])
  const byId = useMemo(() => new Map(people.map((p) => [p.id, p])), [people])
  const coById = useMemo(() => new Map(corporates.map((c) => [c.id, c])), [corporates])
  const planBy = useMemo(() => new Map(plans.map((p) => [p.candidate_id, p])), [plans])
  const stopName = (key) => (key === TEST ? 'Aptitude test (Zeal + Techspian)' : coById.get(key)?.organization || 'Company')

  const planned = plans.filter((p) => p.status === 'planned' && byId.has(p.candidate_id))
  const reserve = plans.filter((p) => p.status === 'reserve' && byId.has(p.candidate_id))
  const unplanned = people.filter((p) => !planBy.has(p.id))
  const groups = new Set(planned.map((p) => p.grp))

  const arrivals = useMemo(() => {
    const m = {}
    planned.forEach((p) => { m[p.report_at] = (m[p.report_at] || 0) + 1 })
    return Object.entries(m).sort()
  }, [planned])
  const peak = Math.max(1, ...arrivals.map(([, n]) => n))

  /* stop -> wave -> group -> [people] */
  const floor = useMemo(() => {
    const f = {}
    planned.forEach((p) => {
      ;(p.route || []).forEach((r) => {
        f[r.key] ??= {}
        f[r.key][r.slot] ??= {}
        ;(f[r.key][r.slot][p.grp] ??= []).push(p.candidate_id)
      })
    })
    return f
  }, [planned])

  const cap0 = useMemo(() => capacity(corporates, []), [corporates])
  const stops = [TEST, ...corporates.filter((c) => !isTestCo(c)).map((c) => c.id)]

  const save = async (rows, label) => {
    setBusy(label)
    setMsg('')
    try {
      const out = await post({ action: 'plan_put', rows })
      if (!out.ok) throw new Error(out.error || 'failed')
      await onSaved()
      setMsg('Saved ' + out.saved + (out.saved === 1 ? ' person.' : ' people.'))
    } catch (e) {
      setMsg('Could not save just now. Try again.')
    }
    setBusy('')
  }

  const placeNew = () => {
    const rows = planPeople({ people: unplanned, corporates, interviews, plans, from: firstOpenWave() })
    if (rows.length) save(rows, 'new')
  }

  const replaceOne = (person) => {
    const rest = plans.filter((p) => p.candidate_id !== person.id)
    const rows = planPeople({ people: [person], corporates, interviews, plans: rest, from: firstOpenWave() })
    save(rows, person.id)
  }

  const message = (p, plan) => {
    const first = String(p.name || '').split(' ')[0]
    if (plan.status === 'reserve') {
      return 'Namaskar ' + first + '. Ramsukrut Job Fair, Tuesday 29 September, Mahalaxmi Mangal Karyalay, Dawadi. You are on the reserve list. Please come by 12:30 PM and go to the help desk. / आपले नाव राखीव यादीत आहे. दुपारी 12:30 पर्यंत येऊन मदत कक्षात भेटा.'
    }
    const en = (plan.route || []).map((r) => clock(r.slot) + ' ' + stopName(r.key)).join(', ')
    const mr = (plan.route || []).map((r) => clockMr(r.slot) + ' ' + (r.key === TEST ? 'अभियोग्यता चाचणी' : stopName(r.key))).join(', ')
    return (
      'Namaskar ' + first + '. Ramsukrut Job Fair, Tuesday 29 September, Mahalaxmi Mangal Karyalay, Dawadi. Group ' + plan.grp +
      '. Reach the venue by ' + clock(plan.report_at) + ' and go to any help desk at the entrance. They will tell you where to go and when. Your stops: ' + en +
      '. See your full plan and save a screenshot: ramsukrut.com/#/my-options . Bring 3 copies of your resume and a photo ID. / गट ' + plan.grp + '. प्रवेशद्वारावर ' + clockMr(plan.report_at) + ' पर्यंत पोहोचा आणि प्रवेशद्वाराजवळील कोणत्याही मदत कक्षात जा. कुठे आणि केव्हा जायचे ते तिथे सांगितले जाईल. ' + mr + '. तुमचा प्लॅन पाहून स्क्रीनशॉट घ्या: ramsukrut.com/#/my-options'
    )
  }

  const exportAll = () => {
    const rows = []
    people.forEach((p) => {
      const plan = planBy.get(p.id)
      if (!plan) return
      const r = plan.route || []
      rows.push([
        p.name, digits(p.mobile), dept(p), plan.grp || '', plan.status, clock(plan.report_at),
        ...[0, 1, 2].flatMap((i) => (r[i] ? [clock(r[i].slot), stopName(r[i].key)] : ['', ''])),
        message(p, plan),
      ])
    })
    rows.sort((a, b) => String(a[3]).localeCompare(String(b[3])))
    download('rkf-day-plan.csv', ['Name', 'Mobile', 'Department', 'Group', 'Status', 'Report by', 'Stop 1 time', 'Stop 1', 'Stop 2 time', 'Stop 2', 'Stop 3 time', 'Stop 3', 'WhatsApp message'], rows)
  }

  const exportCompany = (key) => {
    const rows = []
    Object.entries(floor[key] || {}).sort().forEach(([slot, gs]) => {
      Object.entries(gs).sort().forEach(([g, ids]) => {
        ids.forEach((id) => {
          const p = byId.get(id)
          if (p) rows.push([clock(slot), g, p.name, digits(p.mobile), dept(p), p.qualification || '', p.experience || '', p.resume_url || ''])
        })
      })
    })
    download('rkf-' + String(stopName(key)).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-queue.csv', ['Time', 'Group', 'Name', 'Mobile', 'Department', 'Qualification', 'Experience', 'Resume'], rows)
  }

  /* One person, by name or mobile. */
  const found = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (t.length < 3) return []
    const d = digits(t)
    return people
      .filter((p) => (d.length >= 4 && digits(p.mobile).includes(d)) || String(p.name || '').toLowerCase().includes(t) || (planBy.get(p.id)?.grp || '').toLowerCase() === t)
      .slice(0, 12)
  }, [q, people, planBy])

  return (
    <div className="mt-5 space-y-5">
      {/* ------------------------------------------------------ summary */}
      <div className="rounded-[8px] border border-sand bg-paper p-5 shadow-soft">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['With a time', planned.length],
            ['Micro groups', groups.size],
            ['Reserve list', reserve.length],
            ['No time yet', unplanned.length],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="font-display text-[1.7rem] font-bold leading-none text-ink">{v}</p>
              <p className="mt-1 text-[0.82rem] text-muted">{k}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" disabled={!unplanned.length || !!busy} onClick={placeNew} className={btn + ' bg-clay text-white hover:bg-clay-deep'}>
            {busy === 'new' ? 'Placing...' : 'Give times to ' + unplanned.length + ' new'}
          </button>
          <button type="button" onClick={exportAll} className={btn + ' border border-sand text-ink hover:border-clay'}>
            Download plan with WhatsApp messages
          </button>
        </div>
        {msg && <p className="mt-3 text-[0.9rem] text-forest-2">{msg}</p>}
        <p className="mt-4 text-[0.85rem] leading-[1.6] text-muted">
          The floor opens at 10:00. Each panel sees 8 people every 30 minutes and is booked {PER_PANEL}, since we expect about 800 of 1,368 to come. The aptitude hall has 100 seats and is booked {TEST_SEATS} per batch, one test for both Zeal and Techspian. IT candidates sit the test first, then two related desks. Everyone enters by 9:30 and is briefed at any of the 22 help desks, which look people up here by name or mobile. New people only fill spare room from the next wave onwards.
        </p>
      </div>

      {/* ------------------------------------------------------ one person */}
      <div className="rounded-[8px] border border-sand bg-paper p-5 shadow-soft">
        <p className="font-display text-[1rem] font-semibold text-ink">Find a person or group</p>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, mobile, or group like MFG-03" className={box + ' mt-3'} />
        {found.length > 0 && (
          <ul className="mt-3 divide-y divide-sand">
            {found.map((p) => {
              const plan = planBy.get(p.id)
              return (
                <li key={p.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-display text-[0.98rem] font-semibold text-ink">
                      {p.name} <span className="font-normal text-muted">{digits(p.mobile)}</span>
                    </p>
                    <p className="text-[0.85rem] text-muted">{dept(p)}</p>
                    {!plan && <p className="mt-1 text-[0.9rem] text-clay-deep">No time yet</p>}
                    {plan?.status === 'reserve' && <p className="mt-1 text-[0.9rem] text-clay-deep">Reserve list, send to the first desk that opens</p>}
                    {plan?.status === 'planned' && (
                      <p className="mt-1 text-[0.9rem] leading-[1.6] text-ink2">
                        <strong className="text-ink">{plan.grp}</strong>, report {clock(plan.report_at)}.{' '}
                        {(plan.route || []).map((r) => clock(r.slot) + ' ' + stopName(r.key)).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {plan && (
                      <a
                        href={'https://wa.me/91' + digits(p.mobile) + '?text=' + encodeURIComponent(message(p, plan))}
                        target="_blank"
                        rel="noreferrer"
                        className={btn + ' bg-[#25D366] text-white'}
                      >
                        WhatsApp
                      </a>
                    )}
                    <button type="button" disabled={!!busy} onClick={() => replaceOne(p)} className={btn + ' border border-sand text-ink hover:border-clay'}>
                      {busy === p.id ? 'Placing...' : plan ? 'Re-place from now' : 'Give a time'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* ------------------------------------------------------ floor */}
      <div className="rounded-[8px] border border-sand bg-paper p-5 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          {[['time', 'Floor by time'], ['company', 'One company'], ['arrivals', 'Arrivals']].map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setView(k)}
              className={btn + ' whitespace-nowrap ' + (view === k ? 'bg-forest text-white' : 'border border-sand text-ink hover:border-clay')}
            >
              {label}
            </button>
          ))}
        </div>

        {view === 'arrivals' && (
          <div className="mt-5 space-y-2">
            {arrivals.map(([t, n]) => (
              <div key={t} className="flex items-center gap-3">
                <span className="w-[4.8rem] shrink-0 font-display text-[0.9rem] font-semibold text-ink">{clock(t)}</span>
                <span className="h-5 rounded-[3px] bg-clay" style={{ width: Math.max(4, (n / peak) * 70) + '%' }} />
                <span className="text-[0.88rem] text-ink2">{n}</span>
              </div>
            ))}
          </div>
        )}

        {view === 'time' && (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-collapse text-[0.82rem]">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-paper px-2 py-2 text-left font-display font-semibold text-ink">Desk</th>
                  {WAVES.map((w) => (
                    <th key={w} className="whitespace-nowrap px-2 py-2 font-display font-semibold text-ink">{clock(w)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stops.map((key) => (
                  <tr key={key} className="border-t border-sand">
                    <td className="sticky left-0 max-w-[12rem] truncate bg-paper px-2 py-2 font-semibold text-ink">
                      {stopName(key)}
                      {key !== TEST && panelsOf(coById.get(key)) > 1 && <span className="ml-1 font-normal text-muted">(2 panels)</span>}
                    </td>
                    {WAVES.map((w, i) => {
                      const gs = floor[key]?.[w] || {}
                      const n = Object.values(gs).reduce((a, x) => a + x.length, 0)
                      const cap = cap0[key]?.[i] || 0
                      return (
                        <td key={w} className={'px-2 py-2 text-center align-top ' + (n && n >= cap ? 'bg-gold/30' : n ? 'bg-forest/5' : '')}>
                          {n ? (
                            <>
                              {key === TEST && (
                                <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-forest-2">Batch T{TEST_STARTS.indexOf(w) + 1}</span>
                              )}
                              <span className="block font-display text-[1.15rem] font-extrabold leading-tight text-ink">{n}</span>
                              <span className="mt-1 block space-y-0.5 text-[0.72rem] leading-tight">
                                {Object.keys(gs).sort((a, b) => gs[b].length - gs[a].length || a.localeCompare(b)).map((g) => (
                                  <span key={g} className="flex items-center justify-between gap-2 whitespace-nowrap">
                                    <span className="font-semibold text-ink2">{g}</span>
                                    <span className="text-muted">{gs[g].length}</span>
                                  </span>
                                ))}
                              </span>
                            </>
                          ) : key === TEST && !cap ? '' : <span className="text-sand">.</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 rounded-[10px] border border-sand bg-paper p-4 text-[0.85rem] leading-[1.55] text-ink2">
              <p className="font-display font-semibold text-ink">How to read this</p>
              <ul className="mt-2 space-y-1.5">
                <li><b className="text-ink">Row</b> is one company desk. <b className="text-ink">Column</b> is the half hour a group reaches it.</li>
                <li><b className="text-ink">Big number</b> is the total people booked there for that half hour. About 2 in 3 turn up, so 12 booked means about 8 seen.</li>
                <li><b className="text-ink">Group code</b> with its head count sits under it. IT-47 means IT, batch 47.</li>
                <li><b className="text-ink">Why codes:</b> a group is people with exactly the same day, the same stops at the same times. Calling "IT-47 to Lenze" moves all of them at once, instead of reading out 12 names. Small groups exist because their other stops differ.</li>
                <li><b className="text-ink">Test batches</b> T1 to T5 run at 10:00, 11:00, 12:00, 1:30 and 2:30. Only IT groups sit it, under their own IT code. Zeal and Techspian interview their shortlist by name from 3:30 to 5:00.</li>
                <li><b className="text-ink">Gold</b> means the desk is full for that half hour. Light means it still has room.</li>
              </ul>
              <p className="mt-4 font-display font-semibold text-ink">Code full forms</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(DEPT_CODE).map(([name, code]) => (
                  <span key={code} className="rounded-full border border-sand bg-white px-3 py-1 text-[0.8rem]">
                    <b className="text-ink">{code}</b> <span className="text-muted">{name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'company' && (
          <div className="mt-5">
            <div className="flex flex-wrap gap-2">
              <select value={co} onChange={(e) => setCo(e.target.value)} className={box + ' max-w-sm'}>
                <option value="">Pick a desk</option>
                {stops.map((k) => (
                  <option key={k} value={k}>{stopName(k)}</option>
                ))}
              </select>
              {co && (
                <button type="button" onClick={() => exportCompany(co)} className={btn + ' border border-sand text-ink hover:border-clay'}>
                  Download queue
                </button>
              )}
            </div>
            {co && (
              <div className="mt-4 space-y-4">
                {Object.entries(floor[co] || {}).sort().map(([slot, gs]) => (
                  <div key={slot}>
                    <p className="font-display text-[0.95rem] font-semibold text-clay-deep">{clock(slot)}</p>
                    {Object.entries(gs).sort().map(([g, ids]) => (
                      <div key={g} className="mt-1.5">
                        <p className="text-[0.85rem] font-semibold text-ink">{g} <span className="font-normal text-muted">({ids.length})</span></p>
                        <p className="text-[0.85rem] leading-[1.6] text-ink2">
                          {ids.map((id) => byId.get(id)?.name).filter(Boolean).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
                {!floor[co] && <p className="text-[0.9rem] text-muted">Nobody scheduled at this desk yet.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
