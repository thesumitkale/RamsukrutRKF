/* ==========================================================================
   Ramsukrut Games for Good 2026. Page text and form options.
   Edit the words here; the layout lives in src/pages/GamesForGood.jsx
   ========================================================================== */

/* Submissions go to a small intake service that writes one row per person or
   company. The client key is the same public key the Job Fair used: it can
   only post a submission, never read anybody's details back out. */
export const GFG_ENDPOINT = 'https://agsnioiywaowamemocck.supabase.co/functions/v1/rkf-gfg-submit'

/* Read side, used only by the private desk at /#/gfg-desk. The passcode is
   checked on the server and never stored in this file. */
export const GFG_DESK = 'https://agsnioiywaowamemocck.supabase.co/functions/v1/rkf-gfg-desk'

/* Team sheet: players, cricket captains, employee IDs, T-shirt sizes and numbers. */
export const GFG_ROSTER = 'https://agsnioiywaowamemocck.supabase.co/functions/v1/rkf-gfg-roster'

export const GFG_WA = '917277404040'
export const GFG_PHONE = '+91 72774 04040'

export const DAY_HEALTH = 'Rally for Health (Badminton, Sat 5 Dec)'
export const DAY_EDU = 'Run for Education (Box cricket, Sat 12 Dec)'
export const DAYS = [DAY_HEALTH, DAY_EDU]

const TSHIRT = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export const gfg = {
  meta: {
    title: 'Games for Good 2026 | Ramsukrut Kalyan Foundation',
    description: 'Badminton and box cricket. Two Saturdays of company sport in Pune for rural health and education. Register your company, join as a player or volunteer.',
  },
  hero: {
    eyebrow: 'Ramsukrut Kalyan Foundation presents',
    title: 'Games for Good',
    lead: 'Two Saturdays of company sport for rural health and education in Maharashtra.',
    venue: 'LSBI Badminton Arena, Vadgaon Sheri, Pune',
    ctas: { company: 'Register your company', player: 'Join as a player', volunteer: 'Volunteer' },
  },
  why: {
    eyebrow: 'Why we play',
    title: 'Health and education support each other, at every age.',
    body: 'Ramsukrut works across generations in rural Maharashtra. Children need a good education. Young people need a way into work. Older people need care and regular health support. When one of these breaks, the whole family feels it. Games for Good brings Pune\u2019s companies closer to this work.',
    groups: [
      ['Children', 'A child learns better when they are healthy, and when the family isn\u2019t stretched caring for an ill grandparent.'],
      ['Young people', 'A young person with a good education can find work and support the whole family, including the elders.'],
      ['Older people', 'An older person who is cared for keeps the family steady while parents work and children study.'],
    ],
  },
  days: [
    {
      tag: 'Day 1 \u00b7 Badminton', name: 'Rally for Health',
      img: '/img/gfg/day-badminton.jpg', alt: 'A shuttlecock resting on a badminton racket', date: 'Saturday, 5 December 2026',
      why: 'In a village, when an older person falls ill, the whole family feels it. Rally for Health supports health camps and regular checkups for rural families, with special attention to older people.',
      how: ['Two events: mixed doubles and women\u2019s doubles', 'Companies enter pairs in one or both events', 'One match at a time, everyone else courtside', 'Every player gets a T-shirt with their lucky number'],
    },
    {
      tag: 'Day 2 \u00b7 Box cricket', name: 'Run for Education',
      img: '/img/gfg/day-cricket.jpg', alt: 'A floodlit cricket turf in the city at dusk', date: 'Saturday, 12 December 2026',
      why: 'Rural young people have the ability. What they often don\u2019t have is good schooling, guidance and a way to reach employers. Run for Education supports the path from the classroom to a first job.',
      how: ['Company men\u2019s cricket: 6 teams, each led by a captain', 'Every team plays every other team once', 'Top four go through to the semi-finals, then the final', 'Two separate women\u2019s matches on the day'],
    },
  ],
  included: {
    eyebrow: 'The day',
    title: 'One match at a time. Everyone else courtside.',
    // Stock photos (CC0, via Openverse). Swap for event photos after 5 December.
    photos: [
      ['/img/gfg/strip-rackets.jpg', 'Two badminton rackets and a shuttlecock on grass', 'Rally for Health \u00b7 5 Dec'],
      ['/img/gfg/strip-shuttle.jpg', 'Close-up of a feather shuttlecock', 'Mixed and women\u2019s doubles \u00b7 5 Dec'],
      ['/img/gfg/strip-ball.jpg', 'A hand holding a red cricket ball against the sky', 'Run for Education \u00b7 12 Dec'],
    ],
    items: [
      ['Courtside lounge', 'Seating facing the court, a coffee counter and a \u201cNext on court\u201d board.'],
      ['Food all day', 'Breakfast, snacks, lunch and evening chai for every team.'],
      ['Stories wall and photo booth', 'Real stories from Ramsukrut\u2019s work, and a photo to take home.'],
      ['Medals for every player', 'Trophies for winners, plus Best Cheer Squad and Spirit of the Game.'],
    ],
  },
  register: {
    eyebrow: 'Register',
    title: 'Take part',
    sub: 'Pick the form that fits you. It takes two minutes.',
    tabs: { company: 'Company', player: 'Player', volunteer: 'Volunteer' },
    intro: {
      company: 'For HR, people teams or leaders entering a company. One entry covers both days and both sports. Every player also takes a mandatory event T-shirt. We\u2019ll share the fees when we confirm your place. Cricket has 6 team places.',
      player: 'Players register on the team sheet: your name, employee ID, T-shirt size and the lucky number for your T-shirt. Cricket captains can enter their whole team there.',
      volunteer: 'Help run the day: welcome, courts, lounge, photos. Open to employees, students and friends of Ramsukrut.',
    },
    consent: 'I agree that Ramsukrut Kalyan Foundation can contact me about Games for Good.',
    feeAck: 'I understand there is an entry fee and a mandatory T-shirt for every player, shared when our place is confirmed.',
    needFee: 'Please confirm you\u2019ve read the participation fee note.',
    send: 'Submit', sending: 'Submitting',
    done: {
      company: ['Your company is registered', 'Thank you. Our team will call you within two working days to confirm your place and next steps.'],
      player: ['You\u2019re registered', 'Thank you. Your company captain and our team will be in touch before the event.'],
      volunteer: ['Thank you for volunteering', 'We\u2019ll share your role and timings before the event.'],
    },
    updated: 'We already had your details, so we\u2019ve updated them.',
    another: 'Submit another response',
    fail: 'That didn\u2019t go through. Check your internet and try again, or send us the details on WhatsApp.',
    wa: 'Send on WhatsApp instead',
    pickDay: 'Please choose at least one day.',
    needConsent: 'Please tick the consent box.',
  },
}

export const companyFields = [
  { name: 'organization', label: 'Company name', ph: 'Registered company name', req: true },
  { name: 'group_company', label: 'Part of the Ramsukrut group of companies?', req: true, type: 'select', options: ['Yes', 'No', 'Not sure'] },
  { name: 'contact_name', label: 'Your name', ph: 'Full name', req: true },
  { name: 'title', label: 'Designation', ph: 'e.g. HR Manager', req: true },
  { name: 'email', label: 'Work email', ph: 'name@company.com', req: true, type: 'email' },
  { name: 'mobile', label: 'Mobile', ph: '10 digit mobile', req: true, type: 'tel' },
  { name: 'days', label: 'Which days will your company play?', req: true, type: 'multi', options: DAYS, full: true },
  { name: 'supporters', label: 'Colleagues likely to come and cheer', type: 'select', options: ['Under 10', '10 to 25', '25 to 50', 'More than 50'] },
  { name: 'interests', label: 'Also interested in (optional)', type: 'multi', options: ['A point or run pledge', 'Partnering with us on the day', 'Sending volunteers'], full: true, optional: true },
  { name: 'notes', label: 'Anything we should know?', ph: 'Questions, team names, timing', type: 'textarea', full: true },
]

export const playerFields = [
  { name: 'name', label: 'Full name', ph: 'As you\u2019d like it on the scoreboard', req: true },
  { name: 'mobile', label: 'Mobile', ph: '10 digit mobile', req: true, type: 'tel' },
  { name: 'email', label: 'Email', ph: 'name@company.com', type: 'email' },
  { name: 'company', label: 'Company', ph: 'Company you\u2019re playing for', req: true },
  { name: 'gender', label: 'Gender', req: true, type: 'select', options: ['Woman', 'Man', 'Prefer not to say'], hint: 'Teams need a minimum number of women.' },
  { name: 'tshirt', label: 'T-shirt size', req: true, type: 'select', options: TSHIRT },
  { name: 'days', label: 'Which days do you want to play?', req: true, type: 'multi', options: DAYS, full: true },
  { name: 'badminton_level', label: 'Badminton level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'Not playing badminton'] },
  { name: 'cricket_role', label: 'Cricket role', type: 'select', options: ['Batter', 'Bowler', 'All-rounder', 'Wicketkeeper', 'Not playing cricket'] },
  // Saved in the existing "pickleball" column, which now holds the Kho-Kho answer.
  { name: 'pickleball', label: 'Want to play Kho-Kho?', type: 'select', options: ['Yes', 'If needed', 'No'] },
  { name: 'notes', label: 'Anything we should know?', ph: 'Injuries, preferred partner, questions', type: 'textarea', full: true },
]

export const volunteerFields = [
  { name: 'name', label: 'Full name', ph: 'Full name', req: true },
  { name: 'mobile', label: 'Mobile', ph: '10 digit mobile', req: true, type: 'tel' },
  { name: 'email', label: 'Email', ph: 'name@example.com', type: 'email' },
  { name: 'organization', label: 'Company or college', ph: 'Where you work or study' },
  { name: 'tshirt', label: 'T-shirt size', req: true, type: 'select', options: TSHIRT },
  { name: 'days', label: 'Which days can you help?', req: true, type: 'multi', options: DAYS, full: true },
  { name: 'roles', label: 'What would you like to do?', type: 'multi', options: ['Registration and welcome', 'Court and turf support', 'Lounge and hospitality', 'Stories wall and photo booth', 'Photos and social media', 'First aid (if trained)'], full: true, optional: true },
  { name: 'notes', label: 'Anything we should know?', ph: 'Experience, timing, questions', type: 'textarea', full: true },
]
