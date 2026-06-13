import { useState } from 'react'
import Reveal from './Reveal.jsx'

/* Press clippings: framed newspaper images with a coloured top tag (paper + date).
   Click to open a full-size lightbox so the article stays readable. */
export default function PressGrid({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <>
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([img, paper, date], i) => (
          <Reveal key={img} delay={i * 0.08} className="h-full">
            <button onClick={() => setOpen(img)}
              className="group block h-full w-full overflow-hidden rounded-[18px] bg-white text-left shadow-card ring-1 ring-teal-ink/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-orange to-orange-deep px-5 py-3">
                <span className="font-display text-[.95rem] font-bold text-white">{paper}</span>
                <span className="rounded-full bg-white/20 px-3 py-1 font-sans text-[.72rem] font-bold uppercase tracking-wide text-white">{date}</span>
              </div>
              <div className="overflow-hidden bg-beige">
                <img src={img} alt={`${paper} - ${date}`} loading="lazy"
                  className="h-full max-h-[360px] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="px-5 py-3.5">
                <span className="inline-flex items-center gap-2 font-sans text-[.8rem] font-bold uppercase tracking-wide text-orange-deep">
                  Read clipping
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {open && (
        <div onClick={() => setOpen(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-teal-ink/90 p-4 backdrop-blur-sm sm:p-10"
          role="dialog" aria-modal="true">
          <button onClick={() => setOpen(null)} aria-label="Close"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 transition hover:bg-white hover:text-teal-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
          <img src={open} alt="Press clipping" onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-[10px] object-contain shadow-lift" />
        </div>
      )}
    </>
  )
}
