/* Feedback after the Ramsukrut Job Fair, 29 September 2026.
   One short screen for a cheap phone: big taps, two optional text boxes,
   and the mobile prefilled from the personal link when there is one. */
import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import { JOBFAIR_KEY } from '../content/jobfair.js'

const URL_ = 'https://agsnioiywaowamemocck.supabase.co/rest/v1/rkf_jobfair_feedback'

const T = {
  en: {
    eyebrow: 'Ramsukrut Job Fair, 29 September 2026',
    title: 'How was your day at the fair?',
    lead: 'Two minutes. Your answers help us make the next fair better for everyone from our villages.',
    mobile: 'Your mobile number', mobileHint: 'The number you registered with. Optional.',
    rating: 'Overall, how was the fair?', ratings: ['Very poor', 'Poor', 'Okay', 'Good', 'Excellent'],
    companies: 'How many companies did you meet?', companiesOpts: ['None', '1', '2', '3 or more'],
    outcome: 'What happened for you?', outcomeOpts: ['Got a job offer', 'Shortlisted for the next round', 'Waiting to hear back', 'No luck this time'],
    plan: 'Was your day plan on My options helpful?', planOpts: ['Yes', 'Somewhat', 'No', 'Did not use it'],
    again: 'Would you come to the next Ramsukrut job fair?', againOpts: ['Yes', 'Maybe', 'No'],
    liked: 'What did you like most?', improve: 'What should we do better next time?',
    send: 'Send feedback', sending: 'Sending', need: 'Please choose an overall rating first.',
    err: 'That did not go through. Check your internet and press send again.',
    thanks: 'Thank you', thanksBody: 'We have your feedback. We read every answer before planning the next fair.',
  },
  mr: {
    eyebrow: 'रामसुकृत रोजगार मेळावा, २९ सप्टेंबर २०२६',
    title: 'मेळाव्यातील तुमचा दिवस कसा होता?',
    lead: 'फक्त दोन मिनिटे. तुमच्या उत्तरांमुळे पुढचा मेळावा आपल्या गावांतील सर्वांसाठी अधिक चांगला करता येईल.',
    mobile: 'तुमचा मोबाइल नंबर', mobileHint: 'नोंदणी करताना दिलेला नंबर. ऐच्छिक.',
    rating: 'एकूण मेळावा कसा वाटला?', ratings: ['खूप वाईट', 'वाईट', 'ठीक', 'चांगला', 'उत्तम'],
    companies: 'तुम्ही किती कंपन्यांना भेटलात?', companiesOpts: ['एकही नाही', '१', '२', '३ किंवा जास्त'],
    outcome: 'तुमचा निकाल काय आला?', outcomeOpts: ['नोकरीची ऑफर मिळाली', 'पुढच्या फेरीसाठी निवड झाली', 'उत्तराची वाट पाहत आहे', 'या वेळी यश मिळाले नाही'],
    plan: 'My options वरील तुमचा दिवसाचा प्लॅन उपयोगी ठरला का?', planOpts: ['हो', 'थोडासा', 'नाही', 'वापरला नाही'],
    again: 'पुढच्या रामसुकृत रोजगार मेळाव्याला याल का?', againOpts: ['हो', 'कदाचित', 'नाही'],
    liked: 'तुम्हाला सर्वात जास्त काय आवडले?', improve: 'पुढच्या वेळी आम्ही काय सुधारावे?',
    send: 'अभिप्राय पाठवा', sending: 'पाठवत आहे', need: 'आधी एकूण रेटिंग निवडा.',
    err: 'अभिप्राय गेला नाही. इंटरनेट तपासा आणि पुन्हा पाठवा दाबा.',
    thanks: 'धन्यवाद', thanksBody: 'तुमचा अभिप्राय मिळाला. पुढच्या मेळाव्याचे नियोजन करताना आम्ही प्रत्येक उत्तर वाचतो.',
  },
}
/* Answers are stored in English whichever language the candidate used. */
const EN = T.en

const initialMobile = () => {
  try {
    const m = new URLSearchParams(window.location.search).get('m') || localStorage.getItem('rkf-mobile') || ''
    return m.replace(/\D/g, '').slice(-10)
  } catch { return '' }
}

function Choice({ label, opts, value, onChange, cols = 2 }) {
  return (
    <fieldset className="mt-7">
      <legend className="font-display text-[1.05rem] font-semibold leading-snug text-ink">{label}</legend>
      <div className={`mt-3 grid gap-2 ${cols === 5 ? 'grid-cols-5' : cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {opts.map((o, i) => {
          const on = value === i
          return (
            <button key={i} type="button" onClick={() => onChange(i)} aria-pressed={on}
              className={`min-h-[48px] rounded-[8px] border px-2 py-2 text-[0.9rem] leading-tight transition-colors ${on ? 'border-teal bg-teal text-white' : 'border-beigedeep bg-white text-ink hover:border-teal'}`}>
              {cols === 5 ? <span className="block font-display text-[1.25rem] font-semibold">{i + 1}</span> : null}
              <span className={cols === 5 ? 'block text-[0.68rem] leading-tight' : ''}>{o}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function Feedback() {
  const { lang } = useLang()
  const t = T[lang] || T.en
  const [mobile, setMobile] = useState(initialMobile)
  const [a, setA] = useState({ rating: null, companies: null, outcome: null, plan: null, again: null })
  const [liked, setLiked] = useState('')
  const [improve, setImprove] = useState('')
  const [state, setState] = useState('idle')
  const set = (k) => (v) => setA((s) => ({ ...s, [k]: v }))

  async function send(e) {
    e.preventDefault()
    if (a.rating === null) { setState('need'); return }
    setState('sending')
    const pick = (k, list) => (a[k] === null ? null : EN[list][a[k]])
    const row = {
      mobile10: mobile.replace(/\D/g, '').slice(-10) || null,
      rating: a.rating + 1,
      companies: pick('companies', 'companiesOpts'),
      outcome: pick('outcome', 'outcomeOpts'),
      plan_helpful: pick('plan', 'planOpts'),
      come_again: pick('again', 'againOpts'),
      liked: liked.trim().slice(0, 1000) || null,
      improve: improve.trim().slice(0, 1000) || null,
      lang,
      src: (new URLSearchParams(window.location.search).get('s') || '').slice(0, 40),
      device: (() => { try { return localStorage.getItem('rkf-device') || '' } catch { return '' } })(),
    }
    try {
      const r = await fetch(URL_, {
        method: 'POST',
        headers: { apikey: JOBFAIR_KEY, Authorization: 'Bearer ' + JOBFAIR_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(row),
      })
      if (!r.ok) throw new Error(String(r.status))
      setState('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch { setState('err') }
  }

  return (
    <main className="bg-beige pb-24 pt-28 md:pt-36">
      <div className="mx-auto w-full max-w-[640px] px-5">
        <p className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-orange">{t.eyebrow}</p>
        {state === 'done' ? (
          <div className="mt-4 rounded-[12px] border border-beigedeep bg-white p-7">
            <h1 className="font-display text-[1.9rem] font-semibold leading-tight text-ink">{t.thanks}</h1>
            <p className="mt-3 text-[1rem] leading-[1.65] text-ink/80">{t.thanksBody}</p>
          </div>
        ) : (
          <form onSubmit={send} className="mt-3">
            <h1 className="font-display text-[1.9rem] font-semibold leading-tight text-ink md:text-[2.3rem]">{t.title}</h1>
            <p className="mt-3 text-[1rem] leading-[1.65] text-ink/75">{t.lead}</p>

            <div className="mt-7 rounded-[12px] border border-beigedeep bg-white p-5 md:p-7">
              <label className="block">
                <span className="font-display text-[1.05rem] font-semibold text-ink">{t.mobile}</span>
                <input type="tel" inputMode="numeric" autoComplete="tel" value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/[^\d+ ]/g, '').slice(0, 14))}
                  className="mt-2 block min-h-[48px] w-full rounded-[8px] border border-beigedeep bg-beige/40 px-4 text-[1.05rem] text-ink outline-none focus:border-teal" />
                <span className="mt-1 block text-[0.82rem] text-ink/60">{t.mobileHint}</span>
              </label>

              <Choice label={t.rating} opts={t.ratings} value={a.rating} onChange={(v) => { set('rating')(v); if (state === 'need') setState('idle') }} cols={5} />
              <Choice label={t.companies} opts={t.companiesOpts} value={a.companies} onChange={set('companies')} />
              <Choice label={t.outcome} opts={t.outcomeOpts} value={a.outcome} onChange={set('outcome')} />
              <Choice label={t.plan} opts={t.planOpts} value={a.plan} onChange={set('plan')} />
              <Choice label={t.again} opts={t.againOpts} value={a.again} onChange={set('again')} cols={3} />

              <label className="mt-7 block">
                <span className="font-display text-[1.05rem] font-semibold text-ink">{t.liked}</span>
                <textarea rows={3} value={liked} onChange={(e) => setLiked(e.target.value)}
                  className="mt-2 block w-full rounded-[8px] border border-beigedeep bg-beige/40 px-4 py-3 text-[1rem] text-ink outline-none focus:border-teal" />
              </label>
              <label className="mt-5 block">
                <span className="font-display text-[1.05rem] font-semibold text-ink">{t.improve}</span>
                <textarea rows={3} value={improve} onChange={(e) => setImprove(e.target.value)}
                  className="mt-2 block w-full rounded-[8px] border border-beigedeep bg-beige/40 px-4 py-3 text-[1rem] text-ink outline-none focus:border-teal" />
              </label>

              {state === 'need' && <p className="mt-5 text-[0.92rem] font-medium text-orange">{t.need}</p>}
              {state === 'err' && <p className="mt-5 text-[0.92rem] font-medium text-orange">{t.err}</p>}
              <button type="submit" disabled={state === 'sending'}
                className="mt-6 min-h-[52px] w-full rounded-full bg-orange px-6 font-display text-[1.05rem] font-semibold text-white transition-opacity disabled:opacity-60">
                {state === 'sending' ? t.sending : t.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
