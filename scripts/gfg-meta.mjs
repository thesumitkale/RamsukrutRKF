// Gives ramsukrut.com/gamesforgood its own link preview (WhatsApp, LinkedIn, X).
// Link previews never run JavaScript, so the tags must be in the HTML file itself.
// Runs after vite build and rewrites dist/gamesforgood/index.html only.
import { readFileSync, writeFileSync } from 'node:fs'

const file = 'dist/gamesforgood/index.html'
const url = 'https://ramsukrut.com/gamesforgood'
const title = 'Games for Good 2026 | Ramsukrut Kalyan Foundation'
const ogTitle = 'Games for Good: company sport for rural health and education'
const desc = 'Rally for Health (badminton and Kho-Kho, Sat 5 Dec) and Run for Education (box cricket, Sat 12 Dec) at LSBI Badminton Arena, Pune. Register your company, join as a player or volunteer.'
const img = 'https://ramsukrut.com/og-gamesforgood.jpg'
const alt = 'Games for Good by Ramsukrut Kalyan Foundation: Rally for Health on 5 December and Run for Education on 12 December, Pune'

let html = readFileSync(file, 'utf8')
const set = (re, value) => {
  if (!re.test(html)) throw new Error('gfg-meta: tag not found ' + re)
  html = html.replace(re, (m, a, b) => a + value + b)
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

set(/(<title>)[^<]*(<\/title>)/, esc(title))
set(/(<meta name="description" content=")[^"]*(")/, esc(desc))
set(/(<link rel="canonical" href=")[^"]*(")/, url)
set(/(<meta property="og:title" content=")[^"]*(")/, esc(ogTitle))
set(/(<meta property="og:description" content=")[^"]*(")/, esc(desc))
set(/(<meta property="og:url" content=")[^"]*(")/, url)
set(/(<meta property="og:image" content=")[^"]*(")/, img)
set(/(<meta property="og:image:secure_url" content=")[^"]*(")/, img)
set(/(<meta property="og:image:alt" content=")[^"]*(")/, esc(alt))
set(/(<meta name="twitter:title" content=")[^"]*(")/, esc(ogTitle))
set(/(<meta name="twitter:description" content=")[^"]*(")/, esc(desc))
set(/(<meta name="twitter:image" content=")[^"]*(")/, img)
set(/(<meta name="twitter:image:alt" content=")[^"]*(")/, esc(alt))

writeFileSync(file, html)
console.log('gfg-meta: link preview tags written to ' + file)
