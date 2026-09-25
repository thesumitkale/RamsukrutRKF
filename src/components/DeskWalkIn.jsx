/* ==========================================================================
   Walk-in registration at the venue.

   Someone arrives on the day without having registered, often without a
   smartphone. A volunteer fills this in for them in under a minute, and the
   desk then opens that person on Day plan so they get a group and time in the
   same sitting.

   It posts to the same intake the public form uses, so the duplicate guard on
   mobile number applies here too: a person who did register online and forgot
   is updated, never entered twice. The mobile is checked against the list as
   it is typed, so the volunteer knows before they fill anything else in.
   ========================================================================== */

import { useMemo, useState } from 'react'
import { JOBFAIR_ENDPOINT, JOBFAIR_KEY, DEPTS_EN, QUALIF_EN, EXP_EN } from '../content/jobfair.js'
import { districtOptions, talukaOptions } from '../content/maharashtra.js'

const box = 'w-full rounded-[4px] border border-sand bg-paper px-3 py-3 text-[1rem] text-ink outline-none focus:border-clay'
const lab = 'mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-label text-muted'
const digits = (s) => String(s || '').replace(/\D/g, '')
const blank = { name: '', mobile: '', department: '', qualification: '', experience: '', village: '', taluka: '', district: 'Pune' }

export default function DeskWalkIn({ candidates, onDone }) {
  const [f, setF] = useState(blank)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [last, setLast] = useState('')
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value, ...(k === 'district' ? { taluka: '' } : {}) }))

  const ten = digits(f.mobile).slice(-10)
  const known = useMemo(
    () => (ten.length === 10 ? candidates.find((r) => digits(r.mobile).slice(-10) === ten) : null),
    [candidates, ten],
  )
  const talukas = talukaOptions('en', f.district)
  const ready = f.name.trim() && ten.length === 10 && f.department && f.qualification && f.experience

  const submit = async (e) => {
    e.preventDefault()
    if (!ready || busy) return
    setBusy(true)
    setErr('')
    try {
      const fd = new FormData()
      fd.append('kind', 'candidate')
      fd.append('lang', 'en')
      fd.append('source', 'Walk-in at venue')
      Object.entries(f).forEach(([k, v]) => fd.append(k, k === 'mobile' ? ten : String(v).trim()))
      if (file) fd.append('file', file)
      const res = await fetch(JOBFAIR_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + JOBFAIR_KEY, apikey: JOBFAIR_KEY },
        body: fd,
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok || !out.ok) throw new Error('failed')
      setLast(f.name.trim())
      const mobile = ten
      setF(blank)
      setFile(null)
      await onDone(mobile)
    } catch (e2) {
      setErr('That did not save. Check the network and tap Register again. Nothing was lost from the form.')
    }
    setBusy(false)
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={submit} className="rounded-[8px] border border-sand bg-paper p-5 shadow-soft sm:p-7">
        <h2 className="font-display text-[1.25rem] font-semibold text-ink">Register a walk-in</h2>
        <p className="mt-1 text-[0.92rem] text-muted">
          For anyone who arrives without registering. Once saved, their company picks open straight away.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={lab} htmlFor="wi-mobile">Mobile number</label>
            <input id="wi-mobile" className={box} inputMode="numeric" autoComplete="off" value={f.mobile} onChange={set('mobile')} placeholder="10 digit mobile" />
            {known && (
              <div className="mt-2 flex flex-wrap items-center gap-3 rounded-[4px] border border-gold bg-gold/15 px-3 py-2.5 text-[0.9rem] text-ink">
                <span>Already registered as <strong>{known.name}</strong>. Saving again only updates their details.</span>
                <button type="button" onClick={() => onDone(ten)} className="rounded-[3px] bg-forest px-3 py-1.5 text-[0.85rem] font-semibold text-white">
                  Open their day plan
                </button>
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className={lab} htmlFor="wi-name">Full name</label>
            <input id="wi-name" className={box} value={f.name} onChange={set('name')} autoComplete="off" />
          </div>
          <div>
            <label className={lab} htmlFor="wi-dept">Department they want</label>
            <select id="wi-dept" className={box} value={f.department} onChange={set('department')}>
              <option value="">Choose</option>
              {DEPTS_EN.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={lab} htmlFor="wi-q">Qualification</label>
            <select id="wi-q" className={box} value={f.qualification} onChange={set('qualification')}>
              <option value="">Choose</option>
              {QUALIF_EN.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={lab} htmlFor="wi-x">Experience</label>
            <select id="wi-x" className={box} value={f.experience} onChange={set('experience')}>
              <option value="">Choose</option>
              {EXP_EN.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={lab} htmlFor="wi-v">Village</label>
            <input id="wi-v" className={box} value={f.village} onChange={set('village')} autoComplete="off" />
          </div>
          <div>
            <label className={lab} htmlFor="wi-d">District</label>
            <select id="wi-d" className={box} value={f.district} onChange={set('district')}>
              {districtOptions('en').map((d) => <option key={d.value}>{d.value}</option>)}
            </select>
          </div>
          <div>
            <label className={lab} htmlFor="wi-t">Taluka</label>
            <select id="wi-t" className={box} value={f.taluka} onChange={set('taluka')}>
              <option value="">Choose</option>
              {talukas.map((t) => <option key={t.value}>{t.value}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={lab} htmlFor="wi-file">Resume, optional</label>
            <input
              id="wi-file"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              capture="environment"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-[0.9rem] text-ink2 file:mr-3 file:rounded-[3px] file:border-0 file:bg-paper2 file:px-4 file:py-2.5 file:font-semibold file:text-ink"
            />
            <p className="mt-1.5 text-[0.82rem] text-muted">On a phone this opens the camera, so a paper resume can be photographed.</p>
          </div>
        </div>

        {err && <p className="mt-5 rounded-[4px] border border-clay/40 bg-clay/10 px-4 py-2.5 text-[0.9rem] font-medium text-clay-deep">{err}</p>}

        <button
          type="submit"
          disabled={!ready || busy}
          className="mt-6 w-full rounded-[4px] bg-clay px-6 py-4 font-display text-[1rem] font-semibold text-white transition hover:bg-clay-deep disabled:opacity-50 sm:w-auto"
        >
          {busy ? 'Saving' : 'Register and pick companies'}
        </button>
        {!ready && <p className="mt-2 text-[0.82rem] text-muted">Name, mobile, department, qualification and experience are needed.</p>}
      </form>

      <aside className="h-fit rounded-[8px] border border-sand bg-paper2 p-5 text-[0.92rem] leading-[1.65] text-ink2">
        <p className="font-display text-[1rem] font-semibold text-ink">At the desk</p>
        <p className="mt-2">Ask for the mobile first. If it is already registered, skip the form and open their day plan.</p>
        <p className="mt-2">Walk-ins are marked Walk-in at venue in the sheet, so they can be counted after the day.</p>
        {last && <p className="mt-3 border-t border-sand pt-3 font-medium text-forest-2">Saved {last}.</p>}
      </aside>
    </div>
  )
}
