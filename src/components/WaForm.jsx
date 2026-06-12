import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import { Arrow } from './Icons.jsx'

const cls = 'w-full border border-sand bg-paper px-4 py-3 text-[1rem] outline-none transition focus:border-clay rounded-[3px]'

export default function WaForm({ form }) {
  const { lang } = useLang()
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    let msg = (lang === 'mr' ? 'नमस्कार, रामसुकृत कल्याण फाउंडेशन.' : 'Hello, Ramsukrut Kalyan Foundation.') + '\n\n' + form.waTitle + '\n'
    data.forEach((v, k) => { if (String(v).trim()) msg += '\n' + k + ': ' + v })
    window.open('https://wa.me/917277404040?text=' + encodeURIComponent(msg), '_blank', 'noopener')
    setSent(true); e.target.reset()
  }
  return (
    <form onSubmit={submit} className="border border-sand bg-paper p-7 md:p-9 rounded-[5px]">
      <div className="grid gap-5 sm:grid-cols-2">
        {form.fields.map((f) => (
          <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
            <label className="mb-1.5 block font-sans text-[.78rem] font-semibold uppercase tracking-wide text-ink-2">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea name={f.name} required={f.req} placeholder={f.ph} className={`${cls} min-h-[110px] resize-y`} />
            ) : f.type === 'select' ? (
              <select name={f.name} className={cls} defaultValue="">
                <option value="" disabled>{f.ph}</option>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input name={f.name} type={f.type || 'text'} required={f.req} placeholder={f.ph} className={cls} />
            )}
          </div>
        ))}
      </div>
      <button type="submit" className="btn-primary mt-7 w-full">{form.btn} <Arrow size={16} /></button>
      <p className="mt-4 text-center text-[.84rem] text-ink-2/70">{form.note}</p>
      {sent && <p className="mt-4 border border-forest/30 bg-forest/5 px-4 py-3 text-center text-[1.02rem] font-medium text-forest rounded-[3px]">{form.sent}</p>}
    </form>
  )
}
