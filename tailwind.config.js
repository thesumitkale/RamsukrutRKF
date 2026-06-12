/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // vibrant TFI-inspired but distinct: teal + yellow + Ramsukrut burnt orange
        paper:   '#FBF7EE',
        paper2:  '#F3ECDC',
        sand:    '#E6DAC2',
        ink:     { DEFAULT: '#141F1B', 2: '#33403B' },
        teal:    { DEFAULT: '#0CC2B4', deep: '#089E93', ink: '#0B3A38' },
        yellow:  { DEFAULT: '#FFC51F', soft: '#FFDA63' },
        orange:  { DEFAULT: '#F7660F', deep: '#DE5106', soft: '#FB9A55' },
        // aliases so existing pages inherit the new palette
        cream:   '#FBF7EE',
        beige:   '#F3ECDC',
        beigedeep:'#E6DAC2',
        brown:   { DEFAULT: '#17231F', 2: '#4F5C55' },
        muted:   '#5E6B64',
        cocoa:   { DEFAULT: '#0C3B39', 2: '#0E4A47', 3: '#125b56' },
        forest:  { DEFAULT: '#0C3B39', 2: '#0E4A47', soft: '#10B6AC' },
        clay:    { DEFAULT: '#F26A1B', deep: '#D4530B', soft: '#FB9A55' },
        gold:    { DEFAULT: '#FFC42E', soft: '#FFD968' },
      },
      fontFamily: {
        display: ['Poppins', 'Mukta', 'system-ui', 'sans-serif'],
        head: ['Poppins', 'Mukta', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Mukta', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Mukta', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grad-cta':  'linear-gradient(135deg,#F26A1B,#D4530B)',
        'grad-gold': 'linear-gradient(135deg,#FFD968,#FFC42E)',
        'grad-dark': 'linear-gradient(158deg,#0E4A47 0%,#0A302E 100%)',
        'grad-text': 'none',
      },
      boxShadow: {
        soft: '0 2px 14px -6px rgba(12,59,57,.16)',
        card: '0 18px 48px -26px rgba(12,59,57,.40)',
        glow: '0 14px 36px -16px rgba(242,106,27,.5)',
        lift: '0 26px 64px -30px rgba(12,59,57,.5)',
      },
      letterSpacing: { label: '.18em' },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        spinslow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: { marquee: 'marquee 26s linear infinite', spinslow: 'spinslow 22s linear infinite' },
    },
  },
  plugins: [],
}
