import Reveal from './Reveal.jsx'

/* Section header: the full section label rendered as a big outlined ghost line
   (e.g. EDUCATION & GUIDANCE, OUR VALUES), clearly visible, with the title
   tucked into its lower edge. */
export default function SectionHead({ eyebrow, title, sub, center = true, light = false }) {
  return (
    <Reveal className={`relative ${center ? 'text-center mx-auto' : ''} max-w-3xl mb-12 md:mb-16`}>
      {eyebrow && (
        <span aria-hidden="true"
          className="pointer-events-none block select-none whitespace-nowrap font-display text-[1.45rem] font-extrabold uppercase leading-none tracking-[.08em] sm:text-[2.3rem] md:text-[2.7rem]"
          style={{ color: 'transparent', WebkitTextStroke: light ? '1.7px rgba(255,255,255,.34)' : '1.7px rgba(11,33,79,.52)' }}>
          {eyebrow}
        </span>
      )}
      <h2 className={`relative mt-2 display text-[2rem] sm:mt-2.5 sm:text-[2.6rem] md:text-[3rem] ${light ? 'text-paper' : 'text-ink'}`}
        dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p className={`relative mt-5 text-[1.08rem] font-medium leading-relaxed ${light ? 'text-paper/90' : 'text-ink-2'}`}>{sub}</p>}
    </Reveal>
  )
}
