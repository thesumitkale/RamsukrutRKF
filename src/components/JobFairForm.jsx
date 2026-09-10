import { useEffect, useRef, useState } from 'react'
import { JOBFAIR_ENDPOINT, JOBFAIR_KEY, JOBFAIR_WA } from '../content/jobfair.js'
import { Arrow, Wa } from './Icons.jsx'

/* ---------------------------------------------------------------------------
   readSource
   Tags where a submission came from so printed posters, WhatsApp forwards and
   direct visits can be told apart in the sheet. A visitor arriving from a QR
   poster lands on a URL like ramsukrut.com/?src=qr-poster#/job-fair and the
   tag is carried into the row. Falls back to the plain page when no tag is
   present, and the value is sanitised so nothing odd reaches the database.
--------------------------------------------------------------------------- */
function readSource() {
  try {
    const p = new URLSearchParams(window.location.search)
    /* s is the short form used by printed QR codes, where every character
       removed from the URL makes the printed pattern coarser and easier to
       scan. src stays supported for links shared by hand. */
    const tag = p.get('s') || p.get('src')
    if (tag) {
      const safe = tag.trim().slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, '')
      /* Printed codes use very short tags to keep the pattern coarse. They are
         expanded here so the sheet reads plainly instead of showing wa or rec. */
      const friendly = {
        poster: 'qr-poster',
        clg: 'qr-college',
        wa: 'qr-whatsapp',
        rec: 'qr-recruiter',
      }
      if (safe) return friendly[safe] || safe
    }
  } catch { /* ignore malformed URLs and fall through */ }
  return 'ramsukrut.com/#/job-fair'
}


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

/* Candidates on phones rarely hold a tidy PDF. Most have a photo of a printed
   resume, a scan, or a Word file forwarded on WhatsApp. The ceiling is generous
   because a camera photo from a modern phone is routinely several megabytes. */
const MAX_MB = 15

/* Kept deliberately wide. A narrow accept list makes the Android picker hide
   the gallery and camera entirely, so a candidate whose resume is a photo has
   no way to attach it and abandons the form. */
const FILE_ACCEPT = [
  '.pdf', '.doc', '.docx', '.odt', '.rtf', '.txt',
  '.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/*',
].join(',')

const cls = 'w-full rounded-[4px] border border-sand bg-paper px-4 py-3 text-[1rem] text-ink outline-none transition focus:border-clay'

export default function JobFairForm({ kind, copy, fields, lang, waIntro }) {
  const [state, setState] = useState('idle') // idle | sending | done | doneNoFile | fail
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const [picked, setPicked] = useState({})   // multi-choice fields: name -> [values]
  const [multiError, setMultiError] = useState('')
  const [otherOn, setOtherOn] = useState({}) // selects showing their write in box
  const [chosen, setChosen] = useState({})   // searchable dropdowns: name -> value
  const [searchError, setSearchError] = useState('')
  const formRef = useRef(null)

  /* A dropdown that offers Other reveals a text box when Other is chosen.
     Other is always the last option in both languages. */
  const isOther = (f, value) =>
    Boolean(f.otherLabel) && (f.type === 'search'
      ? value === f.search.other
      : value === f.options[f.options.length - 1])

  /* Searchable dropdowns: the option list of a dependent field, such as the
     talukas of the chosen district, and the reset that follows when the parent
     changes so a Pune taluka can never sit under a Nashik district. */
  const searchOptions = (f) => {
    const base = f.optionsFor ? f.optionsFor(chosen[f.dependsOn] || '') : (f.options || [])
    return f.otherLabel ? [...base, { value: f.search.other }] : base
  }

  const chooseSearch = (f, value) => {
    setSearchError('')
    setChosen((prev) => {
      const next = { ...prev, [f.name]: value }
      fields.forEach((other) => { if (other.dependsOn === f.name) next[other.name] = '' })
      return next
    })
    setOtherOn((prev) => {
      const next = { ...prev, [f.name]: isOther(f, value) }
      fields.forEach((other) => { if (other.dependsOn === f.name) next[other.name] = false })
      return next
    })
  }

  /* Switching the page language rewrites every option list, so an already
     chosen district or taluka is carried over into the new language rather
     than being left behind in the old one. */
  useEffect(() => {
    setChosen((prev) => {
      const next = { ...prev }
      fields.forEach((f) => {
        if (f.type === 'search' && f.translate && next[f.name]) next[f.name] = f.translate(next[f.name])
      })
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

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
    /* Over the ceiling the file is dropped rather than the whole registration.
       The candidate is told plainly, and the form stays ready to submit. */
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(copy.fileTooBig || copy.fileHint)
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

    /* Same for the searchable dropdowns, which hold their value in state
       rather than in a native select the browser would validate for us. */
    const blank = fields.find((f) => f.type === 'search' && f.req && !chosen[f.name])
    if (blank) {
      setSearchError(blank.search.required || '')
      document.getElementById(`${kind}-${blank.name}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    /* Ticked boxes travel as one comma separated cell so the sheet stays flat. */
    const readField = (f) => {
      if (f.type === 'multi') return (picked[f.name] || []).join(', ')
      const v = f.type === 'search' ? (chosen[f.name] || '') : (data.get(f.name) || '')
      /* When Other is chosen, the typed place name is what gets stored, so the
         sheet holds a real taluka or district rather than the word Other. */
      if (isOther(f, v)) return String(data.get(`${f.name}_other`) || '').trim() || v
      return v
    }

    // Human-labelled copy for the WhatsApp fallback message
    const labelled = {}
    fields.forEach((f) => { labelled[f.label] = readField(f) })

    // Machine-keyed copy for the spreadsheet
    const values = {}
    fields.forEach((f) => { values[f.name] = readField(f) })

    if (!JOBFAIR_ENDPOINT) { openWhatsApp(labelled); setState('done'); form.reset(); setFileName(''); setPicked({}); setOtherOn({}); setChosen({}); return }

    setState('sending')
    try {
      /* Sent as multipart so the resume travels as a real file rather than
         a base64 string, which keeps large uploads reliable on mobile data. */
      const payload = new FormData()
      payload.append('kind', kind)
      payload.append('lang', lang)
      payload.append('source', readSource())
      Object.entries(values).forEach(([k, v]) => payload.append(k, v))
      if (kind === 'corporate') payload.append('contact_name', values.name || '')

      const file = data.get('attachment')
      const hadFile = Boolean(file && file.size)
      if (hadFile) payload.append('file', file, file.name)

      const send = (body) => fetch(JOBFAIR_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + JOBFAIR_KEY, apikey: JOBFAIR_KEY },
        body,
      })

      let out
      try {
        const res = await send(payload)
        out = await res.json().catch(() => ({ ok: res.ok }))
        if (!out.ok) throw new Error(out.error || 'rejected')
      } catch (first) {
        /* Almost every failure here is the attachment: an odd file type, a slow
           upload dropping on mobile data, a photo the phone reports strangely.
           The person and their details matter more than the file, so the same
           submission is retried once without it rather than being lost. */
        if (!hadFile) throw first
        const retry = new FormData()
        for (const [k, v] of payload.entries()) if (k !== 'file') retry.append(k, v)
        const res2 = await send(retry)
        const out2 = await res2.json().catch(() => ({ ok: res2.ok }))
        if (!out2.ok) throw new Error(out2.error || 'rejected')
        out = { ...out2, resume_saved: false }
      }

      /* The function reports whether the attachment itself reached storage, so
         the confirmation can tell a candidate to bring a printed copy instead
         of implying the resume is on file when it is not. */
      const savedFlag = kind === 'corporate' ? out.jd_saved : out.resume_saved
      const fileMissing = hadFile && savedFlag === false
      setState(fileMissing && copy.doneNoFile ? 'doneNoFile' : 'done')
      form.reset(); setFileName(''); setFileError(''); setPicked({}); setOtherOn({}); setChosen({})
    } catch (err) {
      setState('fail')
      openWhatsApp(labelled)
    }
  }

  const busy = state === 'sending'

  return (
    <form ref={formRef} onSubmit={submit} className="rounded-[8px] border border-sand bg-paper p-6 shadow-soft md:p-8">
      <h3 className="font-display text-[1.3rem] font-bold text-ink">{copy.heading}</h3>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={`min-w-0 ${f.full ? 'sm:col-span-2' : ''}`}>
            <label htmlFor={`${kind}-${f.name}`} className="mb-1.5 block font-sans text-[.76rem] font-semibold uppercase tracking-wide text-ink-2">
              {f.label}{f.req && <span className="text-clay"> *</span>}
            </label>

            {f.type === 'textarea' ? (
              <textarea id={`${kind}-${f.name}`} name={f.name} required={f.req} placeholder={f.ph}
                className={`${cls} min-h-[104px] resize-y`} />
            ) : f.type === 'select' ? (
              <>
                <select id={`${kind}-${f.name}`} name={f.name} required={f.req} defaultValue=""
                  onChange={(e) => {
                    if (!f.otherLabel) return
                    setOtherOn((prev) => ({ ...prev, [f.name]: isOther(f, e.target.value) }))
                  }}
                  className={cls}>
                  <option value="" disabled>{f.ph}</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {f.otherLabel && otherOn[f.name] && (
                  <input name={`${f.name}_other`} type="text" required aria-label={f.otherLabel}
                    placeholder={f.otherPh} className={`${cls} mt-2.5`} />
                )}
              </>
            ) : f.type === 'search' ? (
              <>
                <SearchSelect
                  id={`${kind}-${f.name}`}
                  label={f.label}
                  placeholder={f.ph}
                  searchPlaceholder={f.search.ph}
                  emptyText={f.search.empty}
                  lockedText={f.dependsOn && !chosen[f.dependsOn] ? f.search.lockedTaluka : ''}
                  options={searchOptions(f)}
                  value={chosen[f.name] || ''}
                  onPick={(v) => chooseSearch(f, v)}
                  error={searchError && !chosen[f.name] ? searchError : ''}
                />
                {f.otherLabel && otherOn[f.name] && (
                  <input name={`${f.name}_other`} type="text" required aria-label={f.otherLabel}
                    placeholder={f.otherPh} className={`${cls} mt-2.5`} />
                )}
              </>
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
              {fileName ? `${copy.fileChosen}: ${fileName}` : <span className="hidden sm:inline">{`${copy.fileShort || 'PDF / DOC / DOCX'} · ${MAX_MB} MB`}</span>}
            </span>
          </label>
          <input id={`${kind}-attachment`} name="attachment" type="file" onChange={onFile} className="sr-only"
            accept={FILE_ACCEPT} />
          <p className={`mt-2 text-[.82rem] leading-relaxed ${fileError ? 'font-semibold text-clay-deep' : 'text-ink-2/75'}`}>
            {fileError || copy.fileHint}
          </p>
        </div>
      </div>

      <button type="submit" disabled={busy}
        className={`btn-primary mt-7 w-full justify-center ${busy ? 'pointer-events-none opacity-70' : ''}`}>
        {busy ? copy.sending : copy.btn} {!busy && <Arrow size={16} />}
      </button>

      <p className="mt-4 text-center text-[.84rem] leading-relaxed text-ink-2/75">{copy.note}</p>

      {(state === 'done' || state === 'doneNoFile') && (
        <p role="status" className="mt-4 rounded-[4px] border border-teal-deep/30 bg-teal/10 px-4 py-3 text-center text-[1rem] font-medium text-teal-ink">
          {state === 'doneNoFile' ? copy.doneNoFile : copy.done}
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
   SearchSelect
   A single-choice dropdown with a search box, used for district and taluka
   where the lists run to 36 and 358 entries. Typing filters the list; matching
   is accent-free and works on either script, because every option carries its
   name in the other language as a hidden alias. So a candidate reading the
   Marathi page can type khed and still land on खेड.

   Behaves like a native select otherwise: click to open, tap away or Escape to
   close, arrow keys to move, Enter to choose. The panel is capped in height and
   scrolls, and the search box only takes focus on pointer devices so a phone
   keyboard does not cover the list the moment it opens.
--------------------------------------------------------------------------- */
/* Only one searchable dropdown should stand open at a time. Opening one
   announces itself and the others close, so the district panel can never sit
   on top of the taluka panel. */
const OPEN_EVENT = 'rkf-select-open'

function SearchSelect({ id, label, placeholder, searchPlaceholder, emptyText, lockedText, options, value, onPick, error }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const wrap = useRef(null)
  const input = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false) }
    const key = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', key)
    /* Only auto focus the search box where there is a physical keyboard. */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) input.current?.focus()
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', key) }
  }, [open])

  useEffect(() => { if (!open) { setQ(''); setActive(0) } }, [open])

  useEffect(() => {
    const other = (e) => { if (e.detail !== id) setOpen(false) }
    document.addEventListener(OPEN_EVENT, other)
    return () => document.removeEventListener(OPEN_EVENT, other)
  }, [id])

  const toggle = () => {
    setOpen((v) => {
      if (!v) document.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }))
      return !v
    })
  }

  const norm = (s) => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
  const needle = norm(q)
  const shown = needle
    ? options.filter((o) => norm(o.value).includes(needle) || norm(o.alt).includes(needle))
    : options

  const pick = (v) => { onPick(v); setOpen(false) }

  const onKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => {
        const next = e.key === 'ArrowDown' ? Math.min(i + 1, shown.length - 1) : Math.max(i - 1, 0)
        listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (shown[active]) pick(shown[active].value)
    }
  }

  const locked = Boolean(lockedText)

  return (
    <div id={id} ref={wrap} className="relative">
      <button type="button" disabled={locked} onClick={toggle}
        aria-haspopup="listbox" aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-[4px] border bg-paper px-4 py-3 text-left text-[1rem] outline-none transition ${locked ? 'cursor-not-allowed border-sand bg-paper2/60' : open ? 'border-clay' : error ? 'border-clay-deep/60' : 'border-sand hover:border-clay/60'}`}>
        <span className={`min-w-0 flex-1 truncate ${value ? 'text-ink' : 'text-ink-2/70'}`}>
          {locked ? lockedText : value || placeholder}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" className={`shrink-0 transition ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && !locked && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[6px] border border-sand bg-paper shadow-soft">
          <div className="border-b border-sand/80 p-2">
            <input ref={input} type="text" value={q} onChange={(e) => { setQ(e.target.value); setActive(0) }}
              onKeyDown={onKey} placeholder={searchPlaceholder} aria-label={searchPlaceholder}
              className="w-full rounded-[4px] border border-sand bg-paper2/60 px-3 py-2.5 text-[.95rem] text-ink outline-none transition focus:border-clay" />
          </div>
          <div role="listbox" aria-label={label} ref={listRef} className="max-h-60 overflow-auto p-1">
            {shown.length === 0 && (
              <p className="px-3 py-3 text-[.9rem] leading-snug text-ink-2/80">{emptyText}</p>
            )}
            {shown.map((o, i) => {
              const on = o.value === value
              return (
                <button key={o.value} type="button" role="option" aria-selected={on}
                  onMouseEnter={() => setActive(i)} onClick={() => pick(o.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-[4px] px-3 py-2.5 text-left text-[.95rem] leading-snug transition ${on ? 'bg-clay/10 font-semibold text-ink' : i === active ? 'bg-paper2 text-ink' : 'text-ink-2'}`}>
                  <span className="min-w-0 truncate">{o.value}</span>
                  {on && (
                    <svg width="12" height="12" viewBox="0 0 24 24" className="shrink-0 text-clay" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-[.82rem] font-semibold text-clay-deep">{error}</p>}
    </div>
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
