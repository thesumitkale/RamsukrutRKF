import { useLang } from '../i18n.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHead from '../components/SectionHead.jsx'
import PageHero from '../components/PageHero.jsx'
import WaForm from '../components/WaForm.jsx'
import { Ico } from '../components/iconMap.jsx'
import { MapPin } from '../components/Icons.jsx'

const MAP_EMBED = 'https://www.google.com/maps?q=Dawadi,+Rajgurunagar,+Khed,+Pune,+Maharashtra+410505&output=embed'
const MAP_LINK = 'https://maps.app.goo.gl/d4wTU6XLSyYRH4uq7'

export default function Contact() {
  const { t } = useLang()
  const c = t.contact
  return (
    <>
      <PageHero title={c.h1} img={c.heroImg} />

      <section className="py-16 md:py-24">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {c.cards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.07} className="h-full">
                <article className="h-full rounded-[5px] card-premium p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <span className="grid h-11 w-11 place-items-center rounded-[4px] ico-tile bg-grad-cta text-white shadow-glow"><Ico name={card.icon} size={21} /></span>
                  <h4 className="mt-4 display">{card.title}</h4>
                  <div className="mt-2 flex flex-col gap-0.5 text-[.9rem] leading-relaxed text-ink-2">
                    {card.lines.map((l, j) =>
                      card.tel && j === 0 ? <a key={l} href="tel:+917277404040" className="font-semibold text-clay hover:text-orange">{l}</a>
                      : card.mail ? <a key={l} href={`mailto:${l}`} className="break-all font-semibold text-clay hover:text-orange">{l}</a>
                      : <span key={l}>{l}</span>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal x={36} y={0}><WaForm form={c.form} /></Reveal>
        </div>
      </section>

      <section className="section-tint py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow={c.mapEyebrow} title={c.mapTitle} sub={c.mapSub} />
          <Reveal>
            <div className="overflow-hidden rounded-[6px] border border-beigedeep shadow-card">
              <iframe src={MAP_EMBED} title="Ramsukrut Kalyan Foundation map" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" className="h-[420px] w-full border-0" />
            </div>
            <div className="mt-8 text-center">
              <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MapPin size={18} /> {c.mapBtn}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
