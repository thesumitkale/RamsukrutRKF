import { motion } from 'framer-motion'
import { Wa } from './Icons.jsx'
export default function WaFloat() {
  return (
    <motion.a href="https://wa.me/917277404040" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-6 right-6 z-[90] grid h-14 w-14 place-items-center rounded-full bg-[#1fa84a] text-white shadow-[0_12px_30px_-8px_rgba(31,168,74,.6)]">
      <Wa size={26} />
    </motion.a>
  )
}
