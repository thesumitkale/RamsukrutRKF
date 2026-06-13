import { motion } from 'framer-motion'
import ScrollCue from './ScrollCue.jsx'

/* Full-screen page hero: the photograph fills the first viewport, kept clearly
   visible under a light gradient; only the page tagline sits on it. */
export default function PageHero({ title, img }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-teal-ink">
      <motion.div
        initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,28,26,.55)_0%,rgba(6,28,26,.18)_42%,rgba(6,28,26,.45)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,28,26,.66)_0%,rgba(6,28,26,.30)_36%,rgba(6,28,26,0)_60%)]" />
      <div className="container-x relative pb-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="display max-w-3xl text-[1.9rem] leading-[1.18] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-[2.5rem] md:text-[3rem]"
            dangerouslySetInnerHTML={{ __html: title }} />
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .5, duration: .7 }}
            className="mt-6 h-1.5 w-24 origin-left rounded bg-yellow" />
        </motion.div>
      </div>
      <div className="hidden sm:block"><ScrollCue delay={1.1} /></div>
    </section>
  )
}
