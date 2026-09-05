import { createContext, useContext, useEffect, useState } from 'react'
import en from './content/en.js'
import mr from './content/mr.js'

const LangCtx = createContext(null)
const DICTS = { en, mr }

/* Some browsers (private mode, embedded frames, strict cookie settings) throw
   on localStorage instead of returning null. The language choice is a nicety,
   never a reason for the whole site to fail to render. */
const readLang = () => {
  try { return localStorage.getItem('rkf-lang') || 'en' } catch { return 'en' }
}
const writeLang = (v) => {
  try { localStorage.setItem('rkf-lang', v) } catch { /* ignore */ }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(readLang)
  useEffect(() => {
    writeLang(lang)
    document.documentElement.lang = lang
  }, [lang])
  const toggle = () => setLang((l) => (l === 'en' ? 'mr' : 'en'))
  return <LangCtx.Provider value={{ lang, toggle, t: DICTS[lang] }}>{children}</LangCtx.Provider>
}
export const useLang = () => useContext(LangCtx)
