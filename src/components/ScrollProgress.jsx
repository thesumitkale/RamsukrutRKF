import { motion, useScroll, useSpring } from 'framer-motion'

/* A thin brand coloured bar across the very top that fills as the visitor scrolls.
   It sits above the navbar but below the press lightbox, and is hidden from screen
   readers because it carries no information they need. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 28, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-[linear-gradient(90deg,#F26A1B,#F6B93B,#10B6AC)]"
    />
  )
}
