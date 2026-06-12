# Ramsukrut Kalyan Foundation Website

A bilingual (English + मराठी) NGO website for Ramsukrut Kalyan Foundation (RKF), built with React 18, Vite 5, Tailwind CSS 3 and Framer Motion. The layout and section structure follow a modern agency-style reference (split hero with a rotating seal badge, scrolling marquees, a dark feature band with a highlighted card, a four-quadrant "why us" panel, numbered process steps and a portfolio grid), rendered entirely in Ramsukrut's own warm brand identity with real RKF photography.

## Design system

- **Palette (Ramsukrut brand):** Cream `#FBF5EA`, Burnt Orange `#EF6C12`, Dark Brown `#231505`, Warm Gold `#C2891B`, Soft Beige `#F4E9D5`. Defined in `tailwind.config.js`.
- **Type:** Poppins (display / headings) + Inter (body and UI). Marathi uses Mukta automatically for Devanagari glyphs; English visitors do not download it.
- **Motion:** hero entrance, scroll fade-ins, animated counters, a slowly rotating seal badge, infinite marquees, card hover lifts and smooth page transitions. All motion respects the visitor's "reduce motion" setting.
- **Photography:** real RKF photos (computer-training labs, eye-care camps, village school gatherings, the team) throughout, per the brief.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build for production

```bash
npm run build    # outputs dist/
npm run preview
```

## Deploy on Render (free static hosting)

1. Push this folder to a GitHub repository.
2. On render.com create a **Static Site** from the repo.
3. Build Command: `npm run build`  •  Publish Directory: `dist`
4. Create. Every push redeploys. (Same settings work on Netlify, Vercel, Cloudflare Pages.)

## Languages

Opens in English; the **मराठी / EN** control in the navbar switches the whole site and the choice is remembered on the device. All copy lives in `src/content/en.js` and `src/content/mr.js` (sourced from the Ramsukrut master brief). Edit the same key in both files to change wording.

## Common edits

| What | Where |
|---|---|
| Stats (2000+, 24+, 5+) | `home.stats` / `StatRow` in both content files |
| Focus areas, why-us, process, work cards | the `home` object keys in both content files |
| Leadership team | `about.team` in both content files; photos in `public/img/` |
| YouTube videos | `home.reels` (video IDs) in both content files |
| Photos | files in `public/img/` (named `real-p1.jpg` ... `real-p11.jpg`) |
| Roadmap / future phases | `roadmap` array in both content files |
| Phone / email / address | search `7277404040` and `ramsukrutfoundation` in `src/` |
| Colours, fonts, animations | `tailwind.config.js`, `index.html`, `src/index.css` |

## Pages

Home `/` · About `/about` · Our Work `/work` · Impact `/impact` · Media `/media` · Get Involved `/involved` · Contact `/contact`. URLs use `/#/...` (HashRouter) so refreshes work on any static host.

## Performance

Real photos are compressed and width-capped (the image folder is ~5.9 MB) and lazy-loaded; each page is code-split; the hero image is preloaded; fonts use `display=swap`; on phones the video row becomes a swipeable slider. Forms open a pre-filled WhatsApp message to +91 72774 04040 (no backend needed). Leadership bios can be added later as an extra line on each team card.
