import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { LangProvider } from './i18n.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import WaFloat from './components/WaFloat.jsx'
import ScrollTop from './components/ScrollTop.jsx'
import Home from './pages/Home.jsx'

const About = lazy(() => import('./pages/About.jsx'))
const Work = lazy(() => import('./pages/Work.jsx'))
const Impact = lazy(() => import('./pages/Impact.jsx'))
const Media = lazy(() => import('./pages/Media.jsx'))
const Involved = lazy(() => import('./pages/Involved.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))

const Loader = () => (
  <div className="grid min-h-[60vh] place-items-center">
    <span className="h-11 w-11 animate-spin rounded-full border-[3px] border-beigedeep border-t-orange" />
  </div>
)

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<Loader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/work" element={<Work />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/media" element={<Media />} />
            <Route path="/involved" element={<Involved />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <HashRouter>
          <ScrollTop />
          <Nav />
          <main><AnimatedRoutes /></main>
          <Footer />
          <WaFloat />
        </HashRouter>
      </MotionConfig>
    </LangProvider>
  )
}
