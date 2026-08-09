import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'

/* Shown when a visitor lands on a link that does not exist. Before this page
   existed such a link produced a completely blank screen with no way back. */
export default function NotFound() {
  const { t } = useLang()
  const n = t.notFound

  return (
    <section className="grid min-h-[72vh] place-items-center bg-paper px-5 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl text-center"
      >
        <span className="display block text-[clamp(4.5rem,18vw,8rem)] leading-none text-orange">{n.code}</span>
        <div className="mx-auto mt-4 h-1 w-16 rounded bg-yellow" />
        <h1 className="display mt-7 text-[1.7rem] text-ink sm:text-[2.1rem]">{n.title}</h1>
        <p className="mt-4 font-body text-[1.02rem] leading-relaxed text-ink/70">{n.text}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <Link to="/" className="btn-primary">{n.home}</Link>
          <Link to="/contact" className="btn-outline">{n.contact}</Link>
        </div>
      </motion.div>
    </section>
  )
}
