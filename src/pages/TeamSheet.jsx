/* Games for Good team sheet. ramsukrut.com/gfgteams or /#/games-for-good/team-sheet
   Two ways in:
   - Player: one person enters their own details and picks what they play.
   - Captain: a cricket captain enters the whole team in one go.
   Every row is one person per company, keyed on employee ID, so a player the captain
   added and the same player registering themselves end up as one row, not two.
   Posts to the rkf-gfg-roster edge function. */
import { useEffect, useMemo, useState } from 'react'
import { Arrow } from '../components/Icons.jsx'
import { JOBFAIR_KEY } from '../content/jobfair.js'
import { GFG_ROSTER, GFG_WA } from '../content/gfg.js'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const MAX_PLAYERS = 12
const box = 'w-full rounded-[4px] border border-sand bg-paper px-3.5 py-2.5 text-[1rem] text-ink outline-none transition focus:border-clay'
const lab = 'mb-1.5 block font-sans text-[.88rem] font-semibold text-ink'
const req = <span className="text-clay"> *</span>

const EVENTS = [
  { key: 'mixed', label: 'Badminton: mixed doubles', day: 'Sat 5 Dec', women: false },
  { key: 'womens', label: 'Badminton: women\u2019s doubles', day: 'Sat 5 Dec', women: true },
  { key: 'cricket_men', label: 'Cricket: company men\u2019s cricket', day: 'Sat 12 Dec', women: false },
  { key: 'cricket_women', label: 'Cricket: women\u2019s match', day: 'Sat 12 Dec', women: true },
]

function readMode() {
  try {
    const q = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search)
    return q.get('mode') === 'captain' ? 'captain' : 'player'
  } catch { return 'player' }
}
function readSource() {
  try {
    const p = new URLSearchParams(window.location.search)
    const h = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const tag = (p.get('s') || h.get('s') || p.get('src') || '').trim().slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, '')
    if (tag) return tag
  } catch { /* ignore */ }
  return 'team-sheet'
}
const cleanNum = (v) => v.replace(/\D/g, '').slice(0, 2)

function Text({ label, name, value, onChange, required, ph, type = 'text', inputMode, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className={lab}>{label}{required && req}</span>
      <input name={name} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        placeholder={ph} type={type} inputMode={inputMode} maxLength={type === 'email' ? 160 : 120} className={box} />
    </label>
  )
}
function Select({ label, value, onChange, options, required, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className={lab}>{label}{required && req}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required} className={box}>
        <option value="" disabled>Choose</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
function Done({ title, body, again }) {
  return (
    <div className="rounded-[8px] border border-sand bg-white p-7 shadow-soft md:p-9" role="status">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-deep text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12.5 10 17.5 19 7" /></svg>
      </span>
      <h2 className="mt-5 font-display text-[1.5rem] font-bold text-ink">{title}</h2>
      <p className="mt-2 text-[1rem] leading-[1.6] text-ink-2">{body}</p>
      <button type="button" onClick={again} className="btn-outline mt-6">Fill another</button>
    </div>
  )
}
async function send(payload) {
  const res = await fetch(GFG_ROSTER, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + JOBFAIR_KEY, apikey: JOBFAIR_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, source: readSource() }),
  })
  const out = await res.json().catch(() => ({}))
  if (!res.ok || !out.ok) throw new Error(out.error || 'failed')
  return out
}
const Consent = ({ on, set }) => (
  <label className="mt-6 flex items-start gap-3 text-[.92rem] leading-snug text-ink-2">
    <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#089E93]" />
    I agree that Ramsukrut Kalyan Foundation can contact me about Games for Good, and the details here are correct.
  </label>
)
const Fail = ({ text }) => (
  <div className="mt-4 rounded-[6px] bg-paper2 p-4 text-[.92rem] text-ink" role="alert">
    That didn&rsquo;t go through. Check your internet and try again.
    <a className="mt-2 block font-semibold text-teal-deep underline" target="_blank" rel="noreferrer"
      href={`https://wa.me/${GFG_WA}?text=${encodeURIComponent(text)}`}>Send the details on WhatsApp instead</a>
  </div>
)

/* ---------------- Player ---------------- */
const blankPlayer = {
  company: '', name: '', employee_id: '', mobile: '', gender: '', tshirt: '', shirt_number: '',
  mixed_partner: '', mixed_partner_emp: '', womens_partner: '', womens_partner_emp: '', captain_name: '', notes: '',
}
function PlayerForm() {
  const [f, setF] = useState(blankPlayer)
  const [ev, setEv] = useState([])
  const [ok, setOk] = useState(false)
  const [state, setState] = useState('idle')
  const [err, setErr] = useState('')
  const set = (k) => (v) => { setErr(''); setF((p) => ({ ...p, [k]: k === 'shirt_number' ? cleanNum(v) : v })) }
  const isMan = f.gender === 'Man'
  const shown = EVENTS.filter((e) => !(e.women && isMan))
  useEffect(() => { if (isMan) setEv((p) => p.filter((k) => !EVENTS.find((e) => e.key === k).women)) }, [isMan])
  const toggle = (k) => { setErr(''); setEv((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k])) }
  const has = (k) => ev.includes(k)

  const submit = async (e) => {
    e.preventDefault()
    if (!ev.length) return setErr('Choose at least one event you\u2019re playing.')
    if (f.shirt_number === '') return setErr('Enter the lucky number for your T-shirt (0 to 99).')
    if (has('mixed') && (!f.mixed_partner.trim() || !f.mixed_partner_emp.trim())) return setErr('Add your mixed doubles partner\u2019s name and employee ID.')
    if (has('womens') && (!f.womens_partner.trim() || !f.womens_partner_emp.trim())) return setErr('Add your women\u2019s doubles partner\u2019s name and employee ID.')
    if ((has('cricket_men') || has('cricket_women')) && !f.captain_name.trim()) return setErr('Add your cricket captain\u2019s name.')
    if (!ok) return setErr('Please tick the box to confirm.')
    setState('sending')
    try {
      await send({
        mode: 'player', ...f,
        mixed_doubles: has('mixed') ? 'Yes' : '', womens_doubles: has('womens') ? 'Yes' : '',
        cricket: has('cricket_men') ? 'Company men\u2019s cricket' : has('cricket_women') ? 'Women\u2019s match' : '',
        cricket_women_too: has('cricket_men') && has('cricket_women') ? 'Yes' : '',
      })
      setState('done'); window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch { setState('fail') }
  }

  if (state === 'done') {
    return <Done title={'You\u2019re on the team sheet'}
      body={`Thank you, ${f.name.split(' ')[0] || 'player'}. We\u2019ve got your T-shirt size and number ${f.shirt_number}. If you need to change anything, fill the form again with the same employee ID and we\u2019ll update it.`}
      again={() => { setF(blankPlayer); setEv([]); setOk(false); setState('idle') }} />
  }

  const waText = ['Games for Good team sheet (player)', ...Object.entries(f).map(([k, v]) => `${k}: ${v || '-'}`), `events: ${ev.join(', ')}`].join('\n')
  return (
    <form onSubmit={submit} className="rounded-[8px] border border-sand bg-white p-6 shadow-soft md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Text label="Company" value={f.company} onChange={set('company')} required ph={'Company you\u2019re playing for'} className="sm:col-span-2" />
        <Text label="Full name" value={f.name} onChange={set('name')} required ph="Full name" />
        <Text label="Employee ID" value={f.employee_id} onChange={set('employee_id')} required ph="As on your company ID" />
        <Text label="Mobile" value={f.mobile} onChange={set('mobile')} required ph="10 digit mobile" type="tel" inputMode="numeric" />
        <Select label="Gender" value={f.gender} onChange={set('gender')} options={['Woman', 'Man']} required />
        <Select label="T-shirt size" value={f.tshirt} onChange={set('tshirt')} options={SIZES} required />
        <Text label="Lucky number for your T-shirt" value={f.shirt_number} onChange={set('shirt_number')} required ph="0 to 99" inputMode="numeric" />
      </div>

      <fieldset className="mt-7">
        <legend className="mb-2 font-sans text-[.9rem] font-semibold text-ink">What are you playing?{req}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {shown.map((e) => {
            const on = has(e.key)
            return (
              <button key={e.key} type="button" aria-pressed={on} onClick={() => toggle(e.key)}
                className={`flex items-start gap-3 rounded-[6px] border px-4 py-3 text-left text-[.95rem] leading-snug transition ${on ? 'border-teal-deep bg-teal/10 text-ink' : 'border-sand bg-paper text-ink-2 hover:border-teal'}`}>
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border ${on ? 'border-teal-deep bg-teal-deep text-white' : 'border-sand bg-white'}`}>
                  {on && <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M3 8.5 6.5 12 13 4.5" /></svg>}
                </span>
                <span>{e.label}<span className="block text-[.8rem] text-muted">{e.day}</span></span>
              </button>
            )
          })}
        </div>
        {!f.gender && <p className="mt-2 text-[.82rem] text-muted">Women&rsquo;s doubles and the women&rsquo;s cricket match are open to women players.</p>}
      </fieldset>

      {has('mixed') && (
        <div className="mt-6 grid gap-5 rounded-[6px] bg-paper2 p-4 sm:grid-cols-2">
          <p className="sm:col-span-2 text-[.88rem] font-semibold text-teal-deep">Your mixed doubles partner</p>
          <Text label={'Partner\u2019s name'} value={f.mixed_partner} onChange={set('mixed_partner')} required ph="Full name" />
          <Text label={'Partner\u2019s employee ID'} value={f.mixed_partner_emp} onChange={set('mixed_partner_emp')} required ph="Employee ID" />
        </div>
      )}
      {has('womens') && (
        <div className="mt-4 grid gap-5 rounded-[6px] bg-paper2 p-4 sm:grid-cols-2">
          <p className="sm:col-span-2 text-[.88rem] font-semibold text-teal-deep">Your women&rsquo;s doubles partner</p>
          <Text label={'Partner\u2019s name'} value={f.womens_partner} onChange={set('womens_partner')} required ph="Full name" />
          <Text label={'Partner\u2019s employee ID'} value={f.womens_partner_emp} onChange={set('womens_partner_emp')} required ph="Employee ID" />
        </div>
      )}
      {(has('cricket_men') || has('cricket_women')) && (
        <div className="mt-4 rounded-[6px] bg-paper2 p-4">
          <Text label={'Your cricket captain\u2019s name'} value={f.captain_name} onChange={set('captain_name')} required ph="So we can put you in the right team" />
        </div>
      )}
      <label className="mt-6 block"><span className={lab}>Anything we should know?</span>
        <textarea value={f.notes} onChange={(e) => set('notes')(e.target.value)} rows={2} maxLength={600} className={box} placeholder="Optional" />
      </label>
      <p className="mt-4 text-[.85rem] text-muted">Your partner also needs to fill this form with their own T-shirt size and number, or ask your captain to add them.</p>
      <Consent on={ok} set={setOk} />
      {err && <p className="mt-4 text-[.92rem] font-semibold text-clay-deep" role="alert">{err}</p>}
      {state === 'fail' && <Fail text={waText} />}
      <button type="submit" disabled={state === 'sending'} className="btn-primary mt-7 w-full sm:w-auto disabled:opacity-60">
        {state === 'sending' ? 'Submitting' : 'Submit'} <Arrow className="h-4 w-4" />
      </button>
    </form>
  )
}

/* ---------------- Captain ---------------- */
const blankRow = () => ({ name: '', employee_id: '', gender: '', tshirt: '', shirt_number: '' })
const blankCap = { company: '', team_name: '', cricket: '', name: '', employee_id: '', mobile: '', gender: '', tshirt: '', shirt_number: '', notes: '' }
function CaptainForm() {
  const [c, setC] = useState(blankCap)
  const [rows, setRows] = useState(() => Array.from({ length: 7 }, blankRow))
  const [ok, setOk] = useState(false)
  const [state, setState] = useState('idle')
  const [err, setErr] = useState('')
  const setCap = (k) => (v) => { setErr(''); setC((p) => ({ ...p, [k]: k === 'shirt_number' ? cleanNum(v) : v })) }
  const setRow = (i, k) => (v) => { setErr(''); setRows((p) => p.map((r, j) => (j === i ? { ...r, [k]: k === 'shirt_number' ? cleanNum(v) : v } : r))) }
  const filled = rows.filter((r) => Object.values(r).some((v) => String(v).trim()))
  const dupNums = useMemo(() => {
    const all = [c.shirt_number, ...filled.map((r) => r.shirt_number)].filter((n) => n !== '')
    return [...new Set(all.filter((n, i) => all.indexOf(n) !== i))]
  }, [c.shirt_number, filled])

  const submit = async (e) => {
    e.preventDefault()
    if (!c.cricket) return setErr('Choose which team this is.')
    if (c.shirt_number === '') return setErr('Enter your own lucky number for your T-shirt.')
    for (const [i, r] of filled.entries()) {
      if (!r.name.trim() || !r.employee_id.trim() || !r.tshirt || r.shirt_number === '') return setErr(`Player ${i + 1}: add name, employee ID, T-shirt size and number.`)
    }
    if (!filled.length) return setErr('Add at least one player.')
    if (dupNums.length) return setErr(`Two players have number ${dupNums.join(', ')}. Each number can be used once per team.`)
    const ids = [c.employee_id, ...filled.map((r) => r.employee_id)].map((x) => x.trim().toLowerCase())
    if (new Set(ids).size !== ids.length) return setErr('The same employee ID appears twice.')
    if (!ok) return setErr('Please tick the box to confirm.')
    setState('sending')
    try {
      await send({ mode: 'captain', ...c, players: filled })
      setState('done'); window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch { setState('fail') }
  }

  if (state === 'done') {
    return <Done title="Your team is on the sheet"
      body={`Thank you, ${c.name.split(' ')[0] || 'captain'}. We have ${filled.length + 1} players for ${c.team_name || c.company}, including you. To add or change players later, fill this again with the same employee IDs and we\u2019ll update them.`}
      again={() => { setC(blankCap); setRows(Array.from({ length: 7 }, blankRow)); setOk(false); setState('idle') }} />
  }

  const waText = ['Games for Good team sheet (captain)', ...Object.entries(c).map(([k, v]) => `${k}: ${v || '-'}`),
    ...filled.map((r, i) => `P${i + 1}: ${r.name} | ${r.employee_id} | ${r.gender || '-'} | ${r.tshirt} | #${r.shirt_number}`)].join('\n')
  return (
    <form onSubmit={submit} className="rounded-[8px] border border-sand bg-white p-6 shadow-soft md:p-9">
      <p className="mb-5 font-sans text-[.78rem] font-bold uppercase tracking-[.14em] text-teal-deep">Your team</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Text label="Company" value={c.company} onChange={setCap('company')} required ph="Company name" />
        <Text label="Team name" value={c.team_name} onChange={setCap('team_name')} ph="Optional, e.g. company name XI" />
        <Select label="Which team is this?" value={c.cricket} onChange={setCap('cricket')} options={['Company men\u2019s cricket', 'Women\u2019s match']} required className="sm:col-span-2" />
      </div>

      <p className="mb-5 mt-8 font-sans text-[.78rem] font-bold uppercase tracking-[.14em] text-teal-deep">You, the captain</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Text label="Full name" value={c.name} onChange={setCap('name')} required ph="Full name" />
        <Text label="Employee ID" value={c.employee_id} onChange={setCap('employee_id')} required ph="As on your company ID" />
        <Text label="Mobile" value={c.mobile} onChange={setCap('mobile')} required ph="10 digit mobile" type="tel" inputMode="numeric" />
        <Select label="Gender" value={c.gender} onChange={setCap('gender')} options={['Woman', 'Man']} required />
        <Select label="T-shirt size" value={c.tshirt} onChange={setCap('tshirt')} options={SIZES} required />
        <Text label="Lucky number for your T-shirt" value={c.shirt_number} onChange={setCap('shirt_number')} required ph="0 to 99" inputMode="numeric" />
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <p className="font-sans text-[.78rem] font-bold uppercase tracking-[.14em] text-teal-deep">Your players</p>
        <p className="text-[.82rem] text-muted">{filled.length} added · up to {MAX_PLAYERS}</p>
      </div>
      <p className="mt-1 text-[.85rem] text-muted">Players can also fill the player form themselves. Matching employee IDs are merged, never doubled.</p>
      <div className="mt-4 space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 rounded-[6px] border border-sand bg-paper p-3 sm:grid-cols-[1.6fr_1.1fr_.9fr_.8fr_.7fr_auto] sm:items-end">
            <span className="col-span-2 text-[.78rem] font-semibold text-muted sm:hidden">Player {i + 1}</span>
            <label className="col-span-2 sm:col-span-1"><span className="mb-1 hidden text-[.75rem] font-semibold text-muted sm:block">{i === 0 ? 'Name' : '\u00a0'}</span>
              <input aria-label={`Player ${i + 1} name`} value={r.name} onChange={(e) => setRow(i, 'name')(e.target.value)} placeholder="Full name" className={box} maxLength={120} /></label>
            <label><span className="mb-1 hidden text-[.75rem] font-semibold text-muted sm:block">{i === 0 ? 'Employee ID' : '\u00a0'}</span>
              <input aria-label={`Player ${i + 1} employee ID`} value={r.employee_id} onChange={(e) => setRow(i, 'employee_id')(e.target.value)} placeholder="Employee ID" className={box} maxLength={60} /></label>
            <label><span className="mb-1 hidden text-[.75rem] font-semibold text-muted sm:block">{i === 0 ? 'Gender' : '\u00a0'}</span>
              <select aria-label={`Player ${i + 1} gender`} value={r.gender} onChange={(e) => setRow(i, 'gender')(e.target.value)} className={box}>
                <option value="">Gender</option><option>Woman</option><option>Man</option></select></label>
            <label><span className="mb-1 hidden text-[.75rem] font-semibold text-muted sm:block">{i === 0 ? 'Size' : '\u00a0'}</span>
              <select aria-label={`Player ${i + 1} T-shirt size`} value={r.tshirt} onChange={(e) => setRow(i, 'tshirt')(e.target.value)} className={box}>
                <option value="">Size</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label><span className="mb-1 hidden text-[.75rem] font-semibold text-muted sm:block">{i === 0 ? 'Number' : '\u00a0'}</span>
              <input aria-label={`Player ${i + 1} T-shirt number`} value={r.shirt_number} onChange={(e) => setRow(i, 'shirt_number')(e.target.value)} placeholder="No." inputMode="numeric"
                className={`${box} ${dupNums.includes(r.shirt_number) && r.shirt_number !== '' ? '!border-clay' : ''}`} /></label>
            <button type="button" onClick={() => setRows((p) => (p.length > 1 ? p.filter((_, j) => j !== i) : [blankRow()]))}
              className="col-span-2 justify-self-end px-2 py-2 text-[.82rem] font-semibold text-clay-deep underline sm:col-span-1" aria-label={`Remove player ${i + 1}`}>Remove</button>
          </div>
        ))}
      </div>
      {rows.length < MAX_PLAYERS && (
        <button type="button" onClick={() => setRows((p) => [...p, blankRow()])} className="btn-outline mt-4">+ Add a player</button>
      )}
      <label className="mt-6 block"><span className={lab}>Anything we should know?</span>
        <textarea value={c.notes} onChange={(e) => setCap('notes')(e.target.value)} rows={2} maxLength={600} className={box} placeholder="Optional" />
      </label>
      <Consent on={ok} set={setOk} />
      {err && <p className="mt-4 text-[.92rem] font-semibold text-clay-deep" role="alert">{err}</p>}
      {state === 'fail' && <Fail text={waText} />}
      <button type="submit" disabled={state === 'sending'} className="btn-primary mt-7 w-full sm:w-auto disabled:opacity-60">
        {state === 'sending' ? 'Submitting' : 'Submit team'} <Arrow className="h-4 w-4" />
      </button>
    </form>
  )
}

export default function TeamSheet() {
  const [mode, setMode] = useState(readMode)
  useEffect(() => {
    const prev = document.title
    document.title = 'Team sheet | Games for Good 2026 | Ramsukrut Kalyan Foundation'
    return () => { document.title = prev }
  }, [])
  const pick = (m) => {
    setMode(m)
    const base = window.location.hash.split('?')[0] || '#/games-for-good/team-sheet'
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}${base}?mode=${m}`)
  }
  return (
    <>
      <section className="bg-teal-ink pb-12 pt-32 text-white md:pb-16 md:pt-40">
        <div className="container-x max-w-[880px]">
          <p className="font-sans text-[.76rem] font-bold uppercase tracking-[.16em] text-yellow">Games for Good 2026</p>
          <h1 className="display mt-3 text-[2.6rem] leading-[1.02] sm:text-[3.4rem]">Team sheet</h1>
          <p className="mt-4 max-w-xl text-[1.08rem] leading-[1.55] text-white/85">
            Name, employee ID, T-shirt size and the lucky number you want printed on your T-shirt. It takes two minutes.
          </p>
          <div className="mt-6 grid max-w-xl gap-2 text-[.92rem] text-white/80 sm:grid-cols-2">
            <p><span className="font-semibold text-white">Sat 5 Dec</span> · Badminton: mixed doubles, women&rsquo;s doubles</p>
            <p><span className="font-semibold text-white">Sat 12 Dec</span> · Box cricket: company men&rsquo;s cricket (6 teams), plus women&rsquo;s matches</p>
          </div>
        </div>
      </section>
      <section className="bg-paper2 py-12 md:py-16">
        <div className="container-x max-w-[880px]">
          <div role="tablist" aria-label="Who is filling this?" className="grid grid-cols-2 gap-1 rounded-full bg-white p-1 shadow-soft">
            {[['player', 'I\u2019m a player'], ['captain', 'I\u2019m a cricket captain']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={mode === k} onClick={() => pick(k)}
                className={`rounded-full px-3 py-3 font-sans text-[.92rem] font-semibold transition ${mode === k ? 'bg-teal-ink text-white' : 'text-ink-2 hover:text-ink'}`}>{l}</button>
            ))}
          </div>
          <p className="mt-4 text-[.92rem] text-ink-2">
            {mode === 'player'
              ? 'Fill this for yourself. Playing both days? One entry covers both, and you get one T-shirt.'
              : 'Pick your team and enter everyone in one go. Your players don\u2019t need to fill anything, but they can if they want to.'}
          </p>
          <div className="mt-6">{mode === 'player' ? <PlayerForm key="p" /> : <CaptainForm key="c" />}</div>
          <p className="mt-6 text-center text-[.9rem] text-ink-2">
            Is your company registered? <a href="#/games-for-good?form=company" className="font-semibold text-teal-deep underline">Register your company</a>
          </p>
        </div>
      </section>
    </>
  )
}
