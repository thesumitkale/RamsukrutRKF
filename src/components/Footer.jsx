import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { MapPin, Phone, Mail, Clock } from './Icons.jsx'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  return (
    <footer className="bg-forest text-paper/90">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr] md:py-20">
        <div>
          <img src="/img/logo-light.png" alt="Ramsukrut Kalyan Foundation" className="mb-6 h-12 w-auto" />
        </div>
        <div>
          <h4 className="mb-5 font-sans text-[.74rem] font-semibold uppercase tracking-[.16em] text-paper/45">{f.links}</h4>
          <div className="flex flex-col gap-3 text-[1rem]">
            {[['/about', t.nav.about], ['/work', t.nav.work], ['/impact', t.nav.impact], ['/media', t.nav.media]].map(([to, l]) => (
              <Link key={to} to={to} className="w-fit text-paper/90 transition-colors hover:text-clay-soft">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-5 font-sans text-[.74rem] font-semibold uppercase tracking-[.16em] text-paper/45">{t.nav.involved}</h4>
          <div className="flex flex-col gap-3 text-[1rem]">
            {f.involve.map(([hash, l]) => (
              <Link key={hash} to={`/involved#${hash}`} className="w-fit text-paper/90 transition-colors hover:text-clay-soft">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-5 font-sans text-[.74rem] font-semibold uppercase tracking-[.16em] text-paper/45">{t.nav.contact}</h4>
          <div className="flex flex-col gap-3.5 text-[.93rem]">
            <span className="flex gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-clay-soft" />{f.addr}</span>
            <a className="flex gap-3 transition-colors hover:text-clay-soft" href="tel:+917277404040"><Phone size={17} className="mt-0.5 shrink-0 text-clay-soft" />+91 72774 04040</a>
            <a className="flex gap-3 break-all transition-colors hover:text-clay-soft" href="mailto:ramsukrutfoundation@gmail.com"><Mail size={17} className="mt-0.5 shrink-0 text-clay-soft" />ramsukrutfoundation@gmail.com</a>
            <span className="flex gap-3"><Clock size={17} className="mt-0.5 shrink-0 text-clay-soft" />{f.hours}</span>
          </div>
        </div>
      </div>
      <div className="">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-[.82rem] text-paper/45 sm:flex-row">
          <span>© {new Date().getFullYear()} {f.copy}</span>
          <span>{f.estd}</span>
        </div>
      </div>
    </footer>
  )
}
