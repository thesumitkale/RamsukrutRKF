import { useEffect, useRef, useState } from 'react'
import { JOBFAIR_ENDPOINT, JOBFAIR_KEY, JOBFAIR_WA } from '../content/jobfair.js'
import { Arrow, Wa } from './Icons.jsx'

/* ---------------------------------------------------------------------------
   The registration form used twice on the Job Fair page: once for candidates,
   once for recruiting companies.

   Where the data goes
   -------------------
   Every submission is POSTed as multipart form data to the rkf-jobfair-submit
   Supabase edge function whose URL sits in src/content/jobfair.js. That
   function writes one row into public.rkf_jobfair_candidates or
   public.rkf_jobfair_corporates and drops the uploaded resume or JD into the
   private rkf-jobfair storage bucket, linking it from the row through a signed
   URL. An hourly job mirrors new rows into the internal Google Sheet.

   If the endpoint URL has not been filled in yet, or the network call fails,
   the form falls back to opening WhatsApp with the same details typed out, so
   a candidate is never lost because of a technical problem.
--------------------------------------------------------------------------- */

const MAX_MB = 5
const cls = 'w-full rounded-[4px] border border-sand bg-paper px-4 py-3 text-[1rem] text-ink outline-none transition focus:border-clay'

const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1] || '')
    r.onerror = () => reject(new Error('read failed'))
    r.readAsDataURL(file)
  })

export default function JobFairForm({ kind, copy, fields, lang, waIntro }) {
  const [state, setState] = useState('idle') // idle | sending | done | fail
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const [picked, setPicked] = useState({})   // multi-choice fields: name -> [values]
  const [multiError, setMultiError] = useState('')
  const formRef = useRef(null)

  /* Checkbox groups are not covered by the browser's required attribute, so
     they are held in React state and validated by hand on submit. */
  const togglePick = (field, value) => {
    setMultiError('')
    setPicked((prev) => {
      const current = prev[field] || []
      const next = current.includes(value) ? current.filter((x) => x !== value) : [...current, value]
      return { ...prev, [field]: next }
    })
  }

  const openWhatsApp = (values) => {
    let msg = waIntro + '\n\n' + copy.heading
    Object.entries(values).forEach(([k, v]) => { if (String(v || '').trim()) msg += '\n' + k + ': ' + v })
    if (fileName) msg += '\n\n(' + copy.fileLabel + ': ' + fileName + ')'
    window.open('https://wa.me/' + JOBFAIR_WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener')
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    setFileError('')
    if (!f) { setFileName(''); return }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(copy.fileHint)
      e.target.value = ''
      setFileName('')
      return
    }
    setFileName(f.name)
  }

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    /* A required checkbox group with nothing ticked stops the submission. */
    const missing = fields.find((f) => f.type === 'multi' && f.req && !(picked[f.name] || []).length)
    if (missing) {
      setMultiError(copy.multiError || '')
      document.getElementById(`${kind}-${missing.name}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    /* Ticked boxes travel as one comma separated cell so the sheet stays flat. */
    const readField = (f) => (f.type === 'multi' ? (picked[f.name] || []).join(', ') : data.get(f.name) || '')

    // Human-labelled copy for the WhatsApp fallback message
    const labelled = {}
    fields.forEach((f) => { labelled[f.label] = readField(f) })

    // Machine-keyed copy for the spreadsheet
    const values = {}
    fields.forEach((f) => { values[f.name] = readField(f) })

    if (!JOBFAIR_ENDPOINT) { openWhatsApp(labelled); setState('done'); form.reset(); setFileName(''); setPicked({}); return }

    setState('sending')
    try {
      /* Sent as multipart so the resume travels as a real file rather than
         a base64 string, which keeps large uploads reliable on mobile data. */
      const payload = new FormData()
      payload.append('kind', kind)
      payload.append('lang', lang)
      payload.append('source', 'ramsukrut.com/#/job-fair')
      Object.entries(values).forEach(([k, v]) => payload.append(k, v))
      if (kind === 'corporate') payload.append('contact_name', values.name || '')

      const file = data.get('attachment')
      if (file && file.size) payload.append('file', file, file.name)

      const res = await fetch(JOBFAIR_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + JOBFAIR_KEY, apikey: JOBFAIR_KEY },
        body: payload,
      })
      const out = await res.json().catch(() => ({ ok: res.ok }))
      if (!out.ok) throw new Error(out.error || 'rejected')
      setState('done'); form.reset(); setFileName(''); setPicked({})
    } catch (err) {
      setState('fail')
      openWhatsApp(labelled)
    }
  }

  const busy = state === 'sending'

  return (
    <form ref={formRef} onSubmit={submit} className="rounded-[8px] border border-sand bg-paper p-6 shadow-soft md:p-8">
      <h3 className="font-display text-[1.3rem] font-bold text-ink">{copy.heading}</h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
            <label htmlFor={`${kind}-${f.name}`} className="mb-1.5 block font-sans text-[.76rem] font-semibold uppercase tracking-wide text-ink-2">
              {f.label}{f.req && <span className="text-clay"> *</span>}
            </label>

            {f.type === 'textarea' ? (
              <textarea id={`${kind}-${f.name}`} name={f.name} required={f.req} placeholder={f.ph}
                className={`${cls} min-h-[104px] resize-y`} />
            ) : f.type === 'select' ? (
              <select id={`${kind}-${f.name}`} name={f.name} required={f.req} defaultValue="" className={cls}>
                <option value="" disabled>{f.ph}</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'multi' ? (
              <MultiDropdown
                id={`${kind}-${f.name}`}
                label={f.label}
                placeholder={f.ph}
                options={f.options}
                selected={picked[f.name] || []}
                onToggle={(v) => togglePick(f.name, v)}
                error={multiError}
                hint={copy.multiHint}
              />
            ) : (
              <input id={`${kind}-${f.name}`} name={f.name} type={f.type || 'text'} required={f.req}
                placeholder={f.ph} inputMode={f.inputMode} pattern={f.pattern} className={cls} />
            )}
          </div>
        ))}

        {/* File upload */}
        <div className="sm:col-span-2">
          <label htmlFor={`${kind}-attachment`} className="mb-1.5 block font-sans text-[.76rem] font-semibold uppercase tracking-wide text-ink-2">
            {copy.fileLabel}
          </label>
          <label htmlFor={`${kind}-attachment`}
            className="flex cursor-pointer flex-wrap items-center gap-3 rounded-[4px] border border-dashed border-sand bg-paper2/60 px-4 py-3.5 transition hover:border-clay hover:bg-paper2">
            <span className="rounded-full bg-clay px-4 py-1.5 font-sans text-[.8rem] font-bold text-white">
              {copy.fileLabel}
            </span>
            <span className="min-w-0 flex-1 truncate text-[.92rem] text-ink-2">
              {fileName ? `${copy.fileChosen}: ${fileName}` : <span className="hidden sm:inline">{`PDF / DOC / DOCX · ${MAX_MB} MB`}</span>}
            </span>
          </label>
          <input id={`${kind}-attachment`} name="attachment" type="file" onChange={onFile} className="sr-only"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
          <p className={`mt-2 text-[.82rem] leading-relaxed ${fileError ? 'font-semibold text-clay-deep' : 'text-ink-2/75'}`}>
            {copy.fileHint}
          </p>
        </div>
      </div>

      <button type="submit" disabled={busy}
        className={`btn-primary mt-7 w-full justify-center ${busy ? 'pointer-events-none opacity-70' : ''}`}>
        {busy ? copy.sending : copy.btn} {!busy && <Arrow size={16} />}
      </button>

      <p className="mt-4 text-center text-[.84rem] leading-relaxed text-ink-2/75">{copy.note}</p>

      {state === 'done' && (
        <p role="status" className="mt-4 rounded-[4px] border border-teal-deep/30 bg-teal/10 px-4 py-3 text-center text-[1rem] font-medium text-teal-ink">
          {copy.done}
        </p>
      )}
      {state === 'fail' && (
        <div className="mt-4 rounded-[4px] border border-clay/40 bg-clay/10 px-4 py-3 text-center">
          <p className="text-[.98rem] font-medium text-clay-deep">{copy.fail}</p>
          <a href={'https://wa.me/' + JOBFAIR_WA} target="_blank" rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 font-sans text-[.88rem] font-bold text-teal-ink underline">
            <Wa size={16} /> WhatsApp
          </a>
        </div>
      )}
    </form>
  )
}

/* ---------------------------------------------------------------------------
   MultiDropdown
   A compact, keyboard friendly dropdown that lets a recruiter tick more than
   one option. Behaves like a native select trigger: click to open, tap outside
   to close, Escape to close. Selected values show as small chips in the
   trigger so the choice stays visible when it is closed.
--------------------------------------------------------------------------- */
function MultiDropdown({ id, label, placeholder, options, selected, onToggle, error, hint }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false) }
    const key = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', key) }
  }, [open])

  const count = selected.length
  return (
    <div id={id} ref={wrap} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-[4px] border bg-paper px-4 py-3 text-left text-[1rem] outline-none transition ${open ? 'border-clay' : 'border-sand hover:border-clay/60'}`}>
        <span className={`min-w-0 flex-1 truncate ${count ? 'text-ink' : 'text-ink-2/70'}`}>
          {count === 0 ? placeholder : count === 1 ? selected[0] : `${count} selected`}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" className={`shrink-0 transition ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {count > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-clay/10 px-2.5 py-1 text-[.82rem] font-medium text-clay-deep">
              {s}
              <button type="button" onClick={() => onToggle(s)} aria-label={`Remove ${s}`}
                className="grid h-4 w-4 place-items-center rounded-full text-clay-deep/80 hover:bg-clay/20 hover:text-clay-deep">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6l-12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div role="listbox" aria-label={label}
          className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-[6px] border border-sand bg-paper p-1 shadow-soft">
          {options.map((o) => {
            const on = selected.includes(o)
            return (
              <button key={o} type="button" role="option" aria-selected={on} onClick={() => onToggle(o)}
                className={`flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-left text-[.95rem] leading-snug transition ${on ? 'bg-clay/10 text-ink' : 'text-ink-2 hover:bg-paper2'}`}>
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border ${on ? 'border-clay bg-clay text-white' : 'border-sand bg-paper'}`}>
                  {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                </span>
                <span>{o}</span>
              </button>
            )
          })}
        </div>
      )}

      <p className={`mt-2 text-[.82rem] ${error ? 'font-semibold text-clay-deep' : 'text-ink-2/75'}`}>{error || hint || placeholder}</p>
    </div>
  )
}
