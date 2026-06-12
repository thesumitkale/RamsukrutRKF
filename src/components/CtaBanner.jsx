import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import { Arrow, Wa } from './Icons.jsx'

export default function CtaBanner({ title, sub, primary, primaryTo = '/involved', secondary, secondaryTo, wa = false }) {
  return (
    <section className="bg-clay text-paper">
      <div className="container-x py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display text-[2.2rem] leading-[1.08] sm:text-[3rem] md:text-[3.4rem]">{title}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-paper/85">{sub}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to={primaryTo} className="btn bg-paper text-clay hover:bg-ink hover:text-paper">{primary} <Arrow size={16} /></Link>
            {wa ? (
              <a href="https://wa.me/917277404040" target="_blank" rel="noopener noreferrer" className="btn-ghost"><Wa size={18} /> {secondary}</a>
            ) : (
              <Link to={secondaryTo || '/contact'} className="btn-ghost">{secondary}</Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
