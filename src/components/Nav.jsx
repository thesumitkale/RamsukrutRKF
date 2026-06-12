import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { Phone, Mail, MapPin } from './Icons.jsx'

export default function Nav() {
  const { t, lang, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const glass = !scrolled && !open

  const links = [
    ['/', t.nav.home], ['/about', t.nav.about], ['/work', t.nav.work],
    ['/impact', t.nav.impact], ['/media', t.nav.media], ['/involved', t.nav.involved],
  ]
  const langLabel = lang === 'en' ? 'मराठी' : 'EN'

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <div className={`transition-all duration-300 ${scrolled ? 'bg-paper/95 shadow-soft backdrop-blur-md' : glass ? 'bg-transparent' : 'bg-paper'}`}>
        <div className="container-x flex items-center justify-between" style={{ height: scrolled ? 68 : 80 }}>
          <Link to="/" className="shrink-0" aria-label="Ramsukrut Kalyan Foundation, Home">
            <img src={glass ? '/img/logo-light.png' : '/img/logo.png'} alt="Ramsukrut Kalyan Foundation"
              className={`w-auto transition-all duration-300 ${scrolled ? 'h-11' : 'h-12 md:h-[52px]'}`} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) => `navlink ${glass ? 'text-white' : 'text-ink'} ${isActive ? (glass ? 'active' : 'active !text-orange') : glass ? 'hover:!text-yellow' : 'hover:!text-orange'}`}>
                {label}
              </NavLink>
            ))}
            <span className={`h-4 w-px ${glass ? 'bg-white/30' : 'bg-sand'}`} />
            <button onClick={toggle} className={`font-sans text-[.82rem] font-semibold uppercase tracking-wider transition-colors ${glass ? 'text-white hover:text-yellow' : 'text-ink hover:text-orange'}`}
              aria-label={lang === 'en' ? 'Marathi version' : 'English version'}>
              {langLabel}
            </button>
            <Link to="/contact" className={glass ? 'liquid-glass btn text-white !py-2.5 !px-6 !text-[.85rem] hover:bg-white/10' : 'btn-primary !py-2.5 !px-6 !text-[.85rem]'}>{t.nav.cta}</Link>
          </nav>

          <button onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
            className="relative z-[110] flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`block h-[2.5px] w-6 rounded transition-all duration-300 ${glass && !open ? 'bg-white' : 'bg-ink'}
                ${open && i === 0 ? 'translate-y-[8.5px] rotate-45' : ''} ${open && i === 1 ? 'opacity-0' : ''} ${open && i === 2 ? '-translate-y-[8.5px] -rotate-45' : ''}`} />
            ))}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}
            className="fixed inset-0 z-[105] flex flex-col items-center justify-center gap-1 bg-paper lg:hidden">
            {links.map(([to, label], i) => (
              <motion.div key={to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 * i }}>
                <NavLink to={to} end={to === '/'}
                  className={({ isActive }) => `font-display text-[1.7rem] font-semibold px-6 py-2 ${isActive ? 'text-orange' : 'text-ink'}`}>
                  {label}
                </NavLink>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .34 }} className="mt-6 flex flex-col items-center gap-4">
              <button onClick={toggle} className="font-sans text-[1rem] font-semibold uppercase tracking-wider text-ink-2">
                {lang === 'en' ? 'मराठीत वाचा' : 'Read in English'}
              </button>
              <Link to="/contact" className="btn-primary">{t.nav.cta}</Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
