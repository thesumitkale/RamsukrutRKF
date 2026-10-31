// Gives the Games for Good short links their own link previews (WhatsApp, LinkedIn, X).
// Link previews never run JavaScript, so the tags must be in the HTML file itself.
// Runs after vite build and rewrites dist/gamesforgood/index.html and dist/gfgteams/index.html.
import { readFileSync, writeFileSync } from 'node:fs'

const img = 'https://ramsukrut.com/og-gamesforgood.jpg'
const alt = 'Games for Good by Ramsukrut Kalyan Foundation: Rally for Health on 5 December and Run for Education on 12 December, Pune'

const pages = [
  {
    file: 'dist/gamesforgood/index.html',
    url: 'https://ramsukrut.com/gamesforgood',
    title: 'Games for Good 2026 | Ramsukrut Kalyan Foundation',
    ogTitle: 'Games for Good: company sport for rural health and education',
    desc: 'Rally for Health (badminton, Sat 5 Dec) and Run for Education (box cricket, Sat 12 Dec) at LSBI Badminton Arena, Pune. Register your company, join as a player or volunteer.',
  },
  {
    file: 'dist/gfgteams/index.html',
    url: 'https://ramsukrut.com/gfgteams',
    title: 'Team sheet | Games for Good 2026 | Ramsukrut Kalyan Foundation',
    ogTitle: 'Games for Good team sheet: players and cricket captains',
    desc: 'Add your name, employee ID, T-shirt size and lucky number for Games for Good. Badminton on Sat 5 Dec, box cricket on Sat 12 Dec. Cricket captains can enter their whole team.',
  },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

for (const p of pages) {
  let html = readFileSync(p.file, 'utf8')
  const set = (re, value) => {
    if (!re.test(html)) throw new Error('gfg-meta: tag not found ' + re + ' in ' + p.file)
    html = html.replace(re, (m, a, b) => a + value + b)
  }
  set(/(<title>)[^<]*(<\/title>)/, esc(p.title))
  set(/(<meta name="description" content=")[^"]*(")/, esc(p.desc))
  set(/(<link rel="canonical" href=")[^"]*(")/, p.url)
  set(/(<meta property="og:title" content=")[^"]*(")/, esc(p.ogTitle))
  set(/(<meta property="og:description" content=")[^"]*(")/, esc(p.desc))
  set(/(<meta property="og:url" content=")[^"]*(")/, p.url)
  set(/(<meta property="og:image" content=")[^"]*(")/, img)
  set(/(<meta property="og:image:secure_url" content=")[^"]*(")/, img)
  set(/(<meta property="og:image:alt" content=")[^"]*(")/, esc(alt))
  set(/(<meta name="twitter:title" content=")[^"]*(")/, esc(p.ogTitle))
  set(/(<meta name="twitter:description" content=")[^"]*(")/, esc(p.desc))
  set(/(<meta name="twitter:image" content=")[^"]*(")/, img)
  set(/(<meta name="twitter:image:alt" content=")[^"]*(")/, esc(alt))
  writeFileSync(p.file, html)
  console.log('gfg-meta: link preview tags written to ' + p.file)
}
