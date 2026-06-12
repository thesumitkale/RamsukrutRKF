import { useLang } from '../i18n.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHead from '../components/SectionHead.jsx'
import PageHero from '../components/PageHero.jsx'
import Reel from '../components/Reel.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

export default function Media() {
  const { t } = useLang()
  const m = t.media
  return (
    <>
      <PageHero title={m.h1} img={m.heroImg} />

      <section className="py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={m.vidEyebrow} title={m.vidTitle} sub={m.vidSub} />
          <div className="reel-slider mx-auto max-w-4xl">
            {t.home.reels.map(([id, title], i) => (
              <Reveal key={id} delay={i * 0.08} className="reel-slide"><Reel id={id} title={title} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tint py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={m.galEyebrow} title={m.galTitle} sub={m.galSub} />
          <GalleryGrid items={m.gallery} />
        </div>
      </section>

      <CtaBanner title={m.ctaTitle} sub={m.ctaSub} primary={m.ctaBtn} primaryTo="/involved#volunteer" secondary={m.ctaBtn2} secondaryTo="/contact" />
    </>
  )
}
