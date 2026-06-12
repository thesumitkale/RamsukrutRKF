/* Left-aligned section marker: the full label as a clearly visible outlined ghost line. */
export default function GhostEyebrow({ text, light = false }) {
  if (!text) return null
  return (
    <span aria-hidden="true"
      className="pointer-events-none mb-1.5 block select-none whitespace-nowrap font-display text-[1.3rem] font-extrabold uppercase leading-none tracking-[.08em] sm:text-[1.9rem] md:text-[2.2rem]"
      style={{ color: 'transparent', WebkitTextStroke: light ? '1.7px rgba(255,255,255,.34)' : '1.7px rgba(11,33,79,.52)' }}>
      {text}
    </span>
  )
}
