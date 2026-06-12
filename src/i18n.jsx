import { createContext, useContext, useEffect, useState } from 'react'
import en from './content/en.js'
import mr from './content/mr.js'

const LangCtx = createContext(null)
const DICTS = { en, mr }

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('rkf-lang') || 'en')
  useEffect(() => {
    localStorage.setItem('rkf-lang', lang)
    document.documentElement.lang = lang
  }, [lang])
  const toggle = () => setLang((l) => (l === 'en' ? 'mr' : 'en'))
  return <LangCtx.Provider value={{ lang, toggle, t: DICTS[lang] }}>{children}</LangCtx.Provider>
}
export const useLang = () => useContext(LangCtx)
