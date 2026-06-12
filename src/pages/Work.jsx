import { useLang } from '../i18n.jsx'
import PageHero from '../components/PageHero.jsx'
import WorkBlock from '../components/WorkBlock.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

export default function Work() {
  const { t } = useLang()
  const w = t.work
  return (
    <>
      <PageHero title={w.h1} img={w.heroImg} />
      {w.blocks.map((b, i) => (
        <WorkBlock key={b.id} id={b.id} data={b} flip={i % 2 === 1} alt={i % 2 === 1} />
      ))}
      <CtaBanner title={w.ctaTitle} sub={w.ctaSub} primary={w.ctaBtn} primaryTo="/involved" secondary={w.ctaBtn2} secondaryTo="/impact" />
    </>
  )
}
