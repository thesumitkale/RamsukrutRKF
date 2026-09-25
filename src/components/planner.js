/* ==========================================================================
   Day plan for the Job Fair. Who goes where, at what time, in which group.

   The floor runs in 30 minute waves. Every interview desk takes a fixed
   number of people per wave (8 per panel), so no desk ever has more than the
   group in front of it and the group waiting. Zeal and Techspian share one
   aptitude test in a separate hall, run in batches, so an IT candidate sits
   the paper once and both companies read the same result.

   Each person gets up to three stops: strong matches first, and if they have
   fewer than three strong ones, the next best fill the gap. The test counts
   as one stop. People with the same stops at the same times form a micro
   group, and every group reports 30 minutes before its first stop, so the
   gate sees a steady trickle instead of the whole crowd at nine.

   The same code plans the first full run and every later addition, a new
   registration or a walk-in, so the desk and the plan can never disagree.
   Placement only ever fills spare room, it never moves anyone already told
   their time.
   ========================================================================== */

import { scoreOf, wantedDeptsOf, hiresEverythingOf, dedupe, dept, qualOf } from './matchScore.js'

const DEPT_CODE = {
  'IT & Software': 'IT',
  'Sales & Marketing': 'SAL',
  'Customer Support & BPO': 'BPO',
  'Accounts & Finance': 'ACC',
  'HR & Administration': 'HR',
  'Manufacturing & Production': 'MFG',
  'Logistics & Warehouse': 'LOG',
  'Office Staff': 'OFF',
  'Supervisors & Team Leads': 'SUP',
  'Non-technical Operations': 'OPS',
  'General Staff': 'GEN',
}
export const deptCode = (p) => DEPT_CODE[dept(p)] || 'OTH'

export const WAVES = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']
export const TEST_STARTS = ['09:30', '10:30', '11:30', '13:30', '14:30', '15:30']
export const TEST_SEATS = 100
export const PER_PANEL = 8
export const GROUP_MAX = 8
export const MAX_STOPS = 3
export const TEST = 'TEST'

/* Companies that run two interview panels. Matched on name so a re-entered
   company row still gets its second panel. */
const TWO_PANELS = [/diamond pipe/i, /gaps energy/i, /skkato/i, /ecotech/i, /techsham/i]
export const isTestCo = (co) => /zeal|techspian/i.test(String(co?.organization || ''))
export const panelsOf = (co) => (TWO_PANELS.some((re) => re.test(String(co?.organization || ''))) ? 2 : 1)

const len = (key) => (key === TEST ? 2 : 1)
const hhmm = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')
const mins = (s) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5))
export const reportAt = (slot) => hhmm(mins(slot) - 30)

/* Every stop a person could use, best first. Their own picks lead when they
   made any, then strong matches, then the next best. Placement walks down
   this list and keeps the first three that have room. */
/* Somebody who answered "Other" for department has not told us the work they
   want, so their qualification speaks for them: ITI and Diploma to the shop
   floor, graduates to office work, school leavers to general staff. Used for
   planning only, the registration itself is not rewritten. */
const BY_QUAL = {
  ITI: 'Manufacturing & Production',
  Diploma: 'Manufacturing & Production',
  Graduate: 'Office Staff',
  'Post Graduate': 'Office Staff',
  '12th (HSC)': 'General Staff',
  '10th (SSC)': 'General Staff',
}
export const forPlanning = (p) =>
  dept(p) === 'Other' ? { ...p, department: BY_QUAL[qualOf(p)] || 'General Staff', dept_from_qual: true } : p

export function stopsFor(person0, corporates, picks = []) {
  const person = forPlanning(person0)
  const byId = new Map(corporates.map((c) => [c.id, c]))
  const scored = []
  corporates.forEach((co) => {
    const w = wantedDeptsOf(co)
    const s = scoreOf(person, w, hiresEverythingOf(w), 'any', '0')
    if (s) scored.push({ co, fit: s.total })
  })
  scored.sort((a, b) => b.fit - a.fit || String(a.co.id).localeCompare(String(b.co.id)))

  const out = []
  const push = (co, fit) => {
    const key = isTestCo(co) ? TEST : co.id
    if (out.some((x) => x.key === key)) return
    out.push({ key, fit })
  }
  picks
    .map((p) => ({ co: byId.get(p.corporate_id), fit: Number(p.fit) || 0 }))
    .filter((p) => p.co)
    .sort((a, b) => b.fit - a.fit)
    .forEach((p) => push(p.co, p.fit))
  scored.forEach((s) => push(s.co, s.fit))
  return out
}

/* Room left, keyed by stop then wave index. */
export function capacity(corporates, plans) {
  const cap = {}
  cap[TEST] = WAVES.map((w) => (TEST_STARTS.includes(w) ? TEST_SEATS : 0))
  corporates.forEach((co) => {
    if (!isTestCo(co)) cap[co.id] = WAVES.map(() => panelsOf(co) * PER_PANEL)
  })
  plans.forEach((p) => {
    if (p.removed_at) return
    ;(p.route || []).forEach((r) => {
      const i = WAVES.indexOf(r.slot)
      if (cap[r.key] && i >= 0) cap[r.key][i] -= 1
    })
  })
  return cap
}

const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])))

/* Earliest route for `size` people through these stops, one stop after
   another, never more than one wave of waiting between two stops. */
function fit(stops, size, cap, from) {
  let best = null
  for (const order of perms(stops)) {
    for (let start = from; start < WAVES.length; start++) {
      let t = start
      const route = []
      let ok = true
      for (const s of order) {
        let w = -1
        for (let j = t; j < WAVES.length && j <= t + 1 + (route.length ? 0 : 99); j++) {
          if (j + len(s.key) > WAVES.length) break
          const room = cap[s.key]?.[j] ?? 0
          if (room >= size) { w = j; break }
        }
        if (w < 0) { ok = false; break }
        route.push({ key: s.key, slot: WAVES[w], fit: s.fit })
        t = w + len(s.key)
      }
      if (!ok) continue
      const firstI = WAVES.indexOf(route.reduce((a, r) => (mins(r.slot) < mins(a) ? r.slot : a), route[0].slot))
      const end = t
      if (!best || end < best.end || (end === best.end && firstI < best.first)) best = { route, end, first: firstI }
      break
    }
  }
  return best && best.route.sort((a, b) => mins(a.slot) - mins(b.slot))
}

const take = (cap, route, n) => route.forEach((r) => { cap[r.key][WAVES.indexOf(r.slot)] -= n })

/* Plan everyone in `people` who is not already planned. Returns new plan rows.
   `from` is the first wave allowed, so a walk-in at 11:10 is never given 9:30. */
export function planPeople({ people, corporates, interviews, plans, from = 0 }) {
  const cap = capacity(corporates, plans)
  const planned = new Set(plans.filter((p) => !p.removed_at).map((p) => p.candidate_id))
  const picksBy = new Map()
  interviews.forEach((i) => {
    if (!picksBy.has(i.candidate_id)) picksBy.set(i.candidate_id, [])
    picksBy.get(i.candidate_id).push(i)
  })

  /* People who picked for themselves go first, then earliest registration. */
  const todo = people
    .filter((p) => !planned.has(p.id))
    .map((p) => ({ p, stops: stopsFor(p, corporates, picksBy.get(p.id) || []), picked: picksBy.has(p.id) }))
    .sort((a, b) => Number(b.picked) - Number(a.picked) || String(a.p.created_at).localeCompare(String(b.p.created_at)))

  /* Same department and same stops, same group. A desk calling "MFG-03"
     gets eight people who all came for the same kind of work. */
  const bundles = new Map()
  todo.forEach((t) => {
    const k = deptCode(forPlanning(t.p)) + '#' + t.stops.slice(0, MAX_STOPS).map((s) => s.key).sort().join('|')
    if (!bundles.has(k)) bundles.set(k, [])
    bundles.get(k).push(t)
  })

  const out = []
  const used = new Set(plans.map((p) => p.grp).filter(Boolean))
  const counters = {}
  const nextGroup = (code) => {
    let n = counters[code] || 1
    while (used.has(code + '-' + String(n).padStart(2, '0'))) n++
    counters[code] = n + 1
    const g = code + '-' + String(n).padStart(2, '0')
    used.add(g)
    return g
  }

  /* Walk down the ranked list, keeping each stop that still leaves a route
     the whole group can follow, until there are three. */
  const place = (ranked, n) => {
    let keep = []
    let best = null
    for (const st of ranked) {
      if (keep.length >= MAX_STOPS) break
      const r = fit([...keep, st], n, cap, from)
      if (r) { keep = [...keep, st]; best = r }
    }
    return best
  }

  for (const [k, list] of bundles.entries()) {
    const code = k.split('#')[0]
    for (let i = 0; i < list.length; i += GROUP_MAX) {
      const chunk = list.slice(i, i + GROUP_MAX)
      const route = place(chunk[0].stops, chunk.length)
      if (route) {
        take(cap, route, chunk.length)
        const g = nextGroup(code)
        chunk.forEach((t) => out.push(row(t.p.id, g, route, 'planned')))
        continue
      }
      /* The group will not fit anywhere whole. Place people one at a time and
         let those who land on the same route share a group. */
      const byRoute = new Map()
      chunk.forEach((t) => {
        const r = place(t.stops, 1)
        if (!r) { out.push(row(t.p.id, null, [], t.stops.length ? 'reserve' : 'no_match')); return }
        take(cap, r, 1)
        const rk = r.map((x) => x.key + '@' + x.slot).join('|')
        if (!byRoute.has(rk)) byRoute.set(rk, { r, ids: [] })
        byRoute.get(rk).ids.push(t.p.id)
      })
      byRoute.forEach(({ r, ids }) => {
        const g = nextGroup(code)
        ids.forEach((id) => out.push(row(id, g, r, 'planned')))
      })
    }
  }
  /* Last try before the reserve list. Field sales and customer support hire
     from every background, so anyone still without a desk is offered those
     with room, best fit first. */
  const stuck = out.filter((r) => r.status === 'reserve')
  stuck.forEach((r) => {
    const t = todo.find((x) => x.p.id === r.candidate_id)
    if (!t) return
    for (const d of ['Sales & Marketing', 'Customer Support & BPO']) {
      const ranked = stopsFor({ ...t.p, department: d }, corporates).filter((s) => s.key !== TEST)
      const route = place(ranked, 1)
      if (route) {
        take(cap, route, 1)
        Object.assign(r, row(r.candidate_id, nextGroup(d === 'Sales & Marketing' ? 'SAL' : 'BPO'), route, 'planned'))
        return
      }
    }
  })
  return out
}

const row = (candidate_id, grp, route, status) => ({
  candidate_id,
  grp,
  status,
  report_at: route.length ? reportAt(route[0].slot) : null,
  route: route.map((r) => ({ key: r.key, slot: r.slot, fit: r.fit })),
})

/* Everybody, deduped the way the desk dedupes. */
export const everyone = (candidates) => dedupe(candidates).unique

/* First wave a new placement may use: now plus 20 minutes on the day, the
   first wave on any day before. */
export function firstOpenWave(now = new Date()) {
  const ist = new Date(now.getTime() + 330 * 60000)
  const day = ist.toISOString().slice(0, 10)
  if (day < '2026-09-29') return 0
  const m = ist.getUTCHours() * 60 + ist.getUTCMinutes() + 20
  const i = WAVES.findIndex((w) => mins(w) >= m)
  return i < 0 ? WAVES.length : i
}
