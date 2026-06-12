import { motion } from 'framer-motion'

/* Replaces the old mouse-pill: a ringed button with two cascading chevrons,
   the scroll cue pattern used on premium agency sites. */
export default function ScrollCue({ delay = 1.2 }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: .8 }}
      className="absolute bottom-7 left-1/2 -translate-x-1/2" aria-hidden="true">
      <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="grid h-12 w-12 place-items-center rounded-full bg-white/[.07] ring-1 ring-white/45 backdrop-blur-sm">
        <span className="relative block h-5 w-4">
          {[0, 1].map((i) => (
            <motion.svg key={i} viewBox="0 0 16 9" className="absolute left-0 w-4" style={{ top: i * 7 }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}>
              <path d="M1 1l7 6 7-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          ))}
        </span>
      </motion.div>
    </motion.div>
  )
}
