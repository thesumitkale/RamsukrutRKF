import Reveal from './Reveal.jsx'

export default function GalleryGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {items.map((g, i) => (
        <Reveal key={g.img + i} delay={(i % 3) * 0.06}>
          <figure className="group relative aspect-[4/3] overflow-hidden rounded-[4px] bg-sand">
            <img src={g.img} alt={g.cap} loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
            <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,42,32,.78),transparent_58%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <figcaption className="absolute inset-x-4 bottom-4 translate-y-1.5 font-sans text-[.85rem] font-medium text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {g.cap}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  )
}
