import { useState } from 'react'
import { Play } from './Icons.jsx'

/* YouTube player that shows only a thumbnail until tapped (no login, no cookies).
   `wide` = a normal 16:9 video; default is a 9:16 Short / reel. */
export default function Reel({ id, title, wide = false, label }) {
  const [playing, setPlaying] = useState(false)
  const thumbs = wide ? ['maxresdefault', 'sddefault', 'hqdefault'] : ['oar2', 'hqdefault']
  const nextThumb = (img) => {
    const i = Number(img.dataset.i || 0) + 1
    if (i < thumbs.length) { img.dataset.i = i; img.src = `https://i.ytimg.com/vi/${id}/${thumbs[i]}.jpg` }
  }
  return (
    <div className={`relative ${wide ? 'aspect-video' : 'aspect-[9/16]'} overflow-hidden rounded-[5px] bg-forest shadow-card`}>
      {playing ? (
        <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`}
          title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={title} className="group block h-full w-full">
          <img src={`https://i.ytimg.com/vi/${id}/${thumbs[0]}.jpg`} alt={title} loading="lazy"
            onError={(e) => nextThumb(e.currentTarget)}
            onLoad={(e) => { if (e.currentTarget.naturalWidth <= 120) nextThumb(e.currentTarget) }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,42,32,.65),transparent_55%)]" />
          {label && (
            <span className="absolute left-3 top-3 rounded-full bg-clay px-3 py-1 font-sans text-[.68rem] font-bold uppercase tracking-wide text-white shadow">{label}</span>
          )}
          <span className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/95 text-clay shadow-lg ring-4 ring-white/30 transition-transform duration-300 group-hover:scale-110 ${wide ? 'h-16 w-16 md:h-20 md:w-20' : 'h-14 w-14'}`}>
            <Play size={wide ? 28 : 22} />
          </span>
          {label && (
            <span className="absolute inset-x-4 bottom-3 text-left font-display text-[.95rem] font-bold leading-snug text-white drop-shadow md:text-[1.05rem]">{title}</span>
          )}
        </button>
      )}
    </div>
  )
}
