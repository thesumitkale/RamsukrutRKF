/* ==========================================================================
   Shared matching arithmetic for the volunteer desk.

   Two views need the same answer from opposite directions. A recruiter asks
   "who should I see", a candidate asks "who can I sit for". If those two ever
   disagreed the desk would lose the room, so both read the score from here.

   Everything is plain arithmetic and every point comes back as a reason, in
   the order a volunteer would say it out loud.
   ========================================================================== */

/* ---------------------------------------------------------------- tidying */

/* Early rows and Marathi submissions carry a few spellings of the same
   answer. They are folded together here rather than in the database, so no
   existing row is rewritten. */
export const DEPT_FIX = {
  'IT / Software': 'IT & Software',
  'लॉजिस्टिक्स व वेअरहाऊस': 'Logistics & Warehouse',
  'आयटी व सॉफ्टवेअर': 'IT & Software',
  'अकाउंट्स व फायनान्स': 'Accounts & Finance',
  'इतर': 'Other',
}

const EXP_FIX = { 'फ्रेशर': 'Fresher', '० ते १ वर्ष': '0 to 1 year' }

const QUAL_FIX = {
  'पदव्युत्तर': 'Post Graduate',
  'पदवीधर': 'Graduate',
  '१२वी (HSC)': '12th (HSC)',
  '१०वी (SSC)': '10th (SSC)',
  'इतर': 'Other',
  MBA: 'Post Graduate',
  'BE Mechanical': 'Graduate',
  'BSc IT': 'Graduate',
}

export const dept = (r) => DEPT_FIX[r.department] || r.department || ''
export const expOf = (r) => EXP_FIX[r.experience] || r.experience || ''
export const qualOf = (r) => QUAL_FIX[r.qualification] || r.qualification || ''
export const place = (r) => [r.village || r.city, r.taluka].filter(Boolean).join(', ')

/* ---------------------------------------------------------------- scoring */

/* Departments that a recruiter will usually still want to look at. A
   production line short of people takes a warehouse hand seriously. */
const NEAR_DEPT = {
  'Manufacturing & Production': ['Supervisors & Team Leads', 'Logistics & Warehouse', 'General Staff', 'Non-technical Operations'],
  'Logistics & Warehouse': ['Manufacturing & Production', 'General Staff', 'Non-technical Operations'],
  'Supervisors & Team Leads': ['Manufacturing & Production', 'General Staff', 'Logistics & Warehouse'],
  'General Staff': ['Manufacturing & Production', 'Logistics & Warehouse', 'Non-technical Operations', 'Office Staff'],
  'Non-technical Operations': ['General Staff', 'Office Staff', 'Logistics & Warehouse'],
  'Office Staff': ['HR & Administration', 'Accounts & Finance', 'Non-technical Operations'],
  'HR & Administration': ['Office Staff'],
  'Accounts & Finance': ['Office Staff'],
  'Sales & Marketing': ['Customer Support & BPO'],
  'Customer Support & BPO': ['Sales & Marketing', 'Office Staff'],
  'IT & Software': ['Customer Support & BPO'],
}

/* The fair is at Dawadi in Khed taluka. Somebody from Khed can start on
   Monday. Somebody from Nagpur probably cannot, whatever their resume says. */
export const ADJACENT = ['Ambegaon', 'Junnar', 'Maval', 'Shirur', 'Haveli', 'Pimpri-Chinchwad']

function locationScore(r) {
  const t = r.taluka || ''
  const d = r.district || ''
  if (t === 'Khed' && d === 'Pune') return [22, 'Khed taluka, local']
  if (d === 'Pune' && ADJACENT.includes(t)) return [17, t + ', next to Khed']
  if (d === 'Pune') return [12, t ? t + ', Pune district' : 'Pune district']
  if (d === 'Ahilyanagar (Ahmednagar)') return [7, 'Ahilyanagar, travels in']
  if (d) return [3, d + ', travels in']

  /* The earliest registrations were taken before the form asked for taluka
     and district, so they carry a single free text town in city. Reading it
     back beats telling a recruiter the person has no address at all. */
  const loose = String(r.village || r.city || '').trim()
  if (loose) {
    if (/khed|rajgurunagar|chakan|dawadi|alandi/i.test(loose)) return [18, loose + ', Khed area']
    if (/pune|pimpri|chinchwad|hinjewadi|wakad|talegaon/i.test(loose)) return [11, loose + ', Pune area']
    return [5, loose + ', district not stated']
  }
  return [2, 'Location not stated']
}

/* Close enough to Dawadi to start on Monday, however the address was
   written. Reads the same scale the score uses, so the filter and the chip on
   the card can never tell a recruiter two different things. */
export const isLocal = (r) => locationScore(r)[0] >= 17

const EXP_RANK = { Fresher: 0, '0 to 1 year': 1, '1 to 3 years': 2, '3 to 5 years': 3, 'More than 5 years': 4 }

const EXP_TABLE = {
  any: [7, 9, 11, 12, 12],
  fresher: [12, 10, 5, 2, 0],
  some: [0, 7, 12, 12, 11],
  mid: [0, 0, 6, 12, 12],
  senior: [0, 0, 0, 6, 12],
}

export const EXP_WANTED = [
  ['any', 'Any experience'],
  ['fresher', 'Freshers preferred'],
  ['some', '1 year and above'],
  ['mid', '3 years and above'],
  ['senior', '5 years and above'],
]

const QUAL_RANK = {
  '10th (SSC)': 1, ITI: 2, '12th (HSC)': 2, Diploma: 3, Graduate: 4, 'Post Graduate': 5, Other: 1,
}

export const QUAL_MIN = [
  ['0', 'Any qualification'],
  ['2', '12th or ITI and above'],
  ['3', 'Diploma and above'],
  ['4', 'Graduate and above'],
  ['5', 'Post Graduate only'],
]

/* What a company said it was hiring for, tidied the same way a candidate
   answer is tidied so the two sides can actually meet. */
export function wantedDeptsOf(corp) {
  if (!corp) return []
  return String(corp.departments || '')
    .split(',')
    .map((s) => DEPT_FIX[s.trim()] || s.trim())
    .filter(Boolean)
}

/* A company that ticked nearly every box has not really told us anything, so
   everybody stays in the list at a lower base score. */
export const hiresEverythingOf = (wantedDepts) => wantedDepts.length >= 8 || wantedDepts.includes('Other')

/* Returns a score out of 100 and the reasons behind it. Null means the
   candidate is in an unrelated line of work and should not be in the list at
   all, which is kinder than ranking them last. */
export function scoreOf(r, wantedDepts, hiresEverything, expWanted, qualMin) {
  const reasons = []
  const cd = dept(r)
  let total = 0

  if (wantedDepts.includes(cd)) {
    total += 55
    reasons.push({ t: 'good', s: cd })
  } else {
    const near = wantedDepts.some((w) => (NEAR_DEPT[w] || []).includes(cd))
    if (near) {
      total += 30
      reasons.push({ t: 'ok', s: cd + ', close fit' })
    } else if (hiresEverything) {
      total += 18
      reasons.push({ t: 'ok', s: cd })
    } else {
      return null
    }
  }

  const [ls, lr] = locationScore(r)
  total += ls
  reasons.push({ t: ls >= 17 ? 'good' : 'plain', s: lr })

  const e = expOf(r)
  const er = EXP_RANK[e]
  if (er === undefined) {
    total += 4
    reasons.push({ t: 'plain', s: e || 'Experience not stated' })
  } else {
    const pts = EXP_TABLE[expWanted][er]
    total += pts
    reasons.push({ t: pts >= 10 ? 'good' : pts === 0 ? 'weak' : 'plain', s: e })
  }

  const q = qualOf(r)
  const qr = QUAL_RANK[q] || 0
  const need = Number(qualMin)
  if (qr >= need) {
    total += 8
    reasons.push({ t: need > 0 ? 'good' : 'plain', s: q || 'Qualification not stated' })
  } else {
    reasons.push({ t: 'weak', s: (q || 'Not stated') + ', below the bar' })
  }

  if (r.resume_url) {
    total += 3
    reasons.push({ t: 'plain', s: 'Resume attached' })
  } else {
    reasons.push({ t: 'weak', s: 'No resume' })
  }

  return { total: Math.min(100, total), reasons }
}

export const band = (n) => (n >= 78 ? 'strong' : n >= 58 ? 'worth a look' : 'reserve')

export const bandClass = (n) =>
  n >= 78
    ? 'bg-forest text-white'
    : n >= 58
      ? 'bg-gold text-ink'
      : 'bg-paper2 text-ink2 border border-sand'

/* One person who registered three times should appear once. The earliest
   entry is kept, since that is the one already in the sheet. */
export function dedupe(candidates) {
  const seen = new Map()
  let dup = 0
  const ordered = [...candidates].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
  ordered.forEach((r) => {
    const key = String(r.mobile || '').replace(/\D/g, '').slice(-10)
    if (!key) { seen.set('row-' + r.id, r); return }
    if (seen.has(key)) { dup += 1; return }
    seen.set(key, r)
  })
  return { unique: [...seen.values()], dupes: dup }
}

/* ----------------------------------------------------------------- export */

const csvCell = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

export function download(name, headers, rows) {
  const body = [headers.join(','), ...rows.map((r) => r.map(csvCell).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([body], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export const slug = (s) =>
  String(s || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
