import { useState } from 'react'
import { Play } from './Icons.jsx'

export default function Reel({ id, title }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-[5px] bg-forest shadow-card">
      {playing ? (
        <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
          title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={title} className="group block h-full w-full">
          <img src={`https://i.ytimg.com/vi/${id}/oar2.jpg`} alt={title} loading="lazy"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,42,32,.5),transparent_55%)]" />
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/95 text-clay shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play size={22} />
          </span>
        </button>
      )}
    </div>
  )
}
