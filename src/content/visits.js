/* Counts people on the fair day: one quiet row per phone per page, plus a row
   when someone looks up their plan or registers. Only totals are ever read back. */
import { JOBFAIR_KEY } from './jobfair.js'

const URL_ = 'https://agsnioiywaowamemocck.supabase.co/rest/v1'
const FAIR_FROM = Date.parse('2026-09-29T06:00:00+05:30')
const FAIR_TO = Date.parse('2026-09-29T21:00:00+05:30')

export const isFairDay = () => { const n = Date.now(); return n >= FAIR_FROM && n < FAIR_TO }

function device() {
  try {
    let d = localStorage.getItem('rkf-device')
    if (!d) { d = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('rkf-device', d) }
    return d
  } catch { return 'nostore-' + Math.random().toString(36).slice(2) }
}

function tag() {
  try {
    const p = new URLSearchParams(window.location.search)
    const t = (p.get('s') || p.get('src') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40)
    if (t) { try { sessionStorage.setItem('rkf-src', t) } catch { /* private mode */ } return t }
    return sessionStorage.getItem('rkf-src') || ''
  } catch { return '' }
}

export function track(event, extra = {}) {
  try {
    const row = {
      device: device(), src: tag(), event,
      page: (window.location.hash || '#/').slice(0, 60),
      mobile10: String(extra.mobile10 || '').replace(/\D/g, '').slice(-10),
      ua: navigator.userAgent.slice(0, 300),
    }
    fetch(URL_ + '/rkf_jobfair_visits', {
      method: 'POST', keepalive: true,
      headers: { apikey: JOBFAIR_KEY, Authorization: 'Bearer ' + JOBFAIR_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    }).catch(() => {})
  } catch { /* never block the page */ }
}

export async function visitCounts() {
  const r = await fetch(URL_ + '/rpc/rkf_jobfair_visit_counts', {
    method: 'POST', headers: { apikey: JOBFAIR_KEY, Authorization: 'Bearer ' + JOBFAIR_KEY, 'Content-Type': 'application/json' }, body: '{}',
  })
  return r.json()
}
