/* ==========================================================================
   Ramsukrut Job Fair 2026. All page text, English and Marathi.
   Edit the words here; the layout lives in src/pages/JobFair.jsx
   ========================================================================== */

/* Submissions go to a small intake service that stores the file privately
   and writes one row. The key below is a public client key by design: it can
   only post a submission, never read anybody's details back out.
   If the service is ever unreachable the form falls back to WhatsApp,
   so no candidate is ever lost.                                      */
export const JOBFAIR_ENDPOINT = 'https://agsnioiywaowamemocck.supabase.co/functions/v1/rkf-jobfair-submit'
export const JOBFAIR_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnc25pb2l5d2Fvd2FtZW1vY2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDY4NjYsImV4cCI6MjEwMjYyMjg2Nn0.s5B71delf4udsazTVZdDILiIPvUL3M30cOfykaP3GLA'

/* Read side, used only by the private volunteer desk at /#/desk. The
   passcode is checked on the server, never stored in this file.        */
export const JOBFAIR_DESK = 'https://agsnioiywaowamemocck.supabase.co/functions/v1/rkf-jobfair-desk'

/* Public read for a candidate who already registered. Keyed on their own
   mobile number, no passcode, returns only their own row. */
export const JOBFAIR_ME = 'https://agsnioiywaowamemocck.supabase.co/functions/v1/rkf-jobfair-me'

export const JOBFAIR_WA = '917277404040'
export const JOBFAIR_PHONE = '+91 72774 04040'

/* Departments shown in the candidate dropdown */
const DEPTS_EN = [
  'IT & Software',
  'Sales & Marketing',
  'Customer Support & BPO',
  'Accounts & Finance',
  'HR & Administration',
  'Manufacturing & Production',
  'Logistics & Warehouse',
  'Office Staff',
  'Supervisors & Team Leads',
  'Non-technical Operations',
  'General Staff',
  'Other',
]
const DEPTS_MR = [
  'आयटी व सॉफ्टवेअर',
  'विक्री व मार्केटिंग',
  'ग्राहक सेवा व बीपीओ',
  'अकाउंट्स व फायनान्स',
  'एचआर व प्रशासन',
  'उत्पादन व मॅन्युफॅक्चरिंग',
  'लॉजिस्टिक्स व वेअरहाऊस',
  'कार्यालयीन कर्मचारी',
  'पर्यवेक्षक व टीम लीड',
  'नॉन टेक्निकल ऑपरेशन्स',
  'सामान्य कर्मचारी',
  'इतर',
]
const QUALIF_EN = [
  '10th (SSC)',
  '12th (HSC)',
  'ITI',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'Other',
]
const QUALIF_MR = [
  '१०वी (SSC)',
  '१२वी (HSC)',
  'आयटीआय (ITI)',
  'डिप्लोमा',
  'पदवीधर',
  'पदव्युत्तर',
  'इतर',
]

/* Every district and taluka of Maharashtra now lives in one place, with both
   scripts on each entry, so the searchable dropdowns below can match Marathi
   or Latin typing. See src/content/maharashtra.js. */

/* Recruiter dropdowns: headcount bands, salary bands and hiring departments */
const POS_EN = ['1 to 5', '6 to 10', '11 to 25', '26 to 50', '51 to 100', 'More than 100']
const POS_MR = ['१ ते ५', '६ ते १०', '११ ते २५', '२६ ते ५०', '५१ ते १००', '१०० पेक्षा जास्त']

const COMP_EN = ['Up to 1.5 LPA', '1.5 to 2.5 LPA', '2.5 to 3.5 LPA', '3.5 to 5 LPA', '5 to 8 LPA', 'Above 8 LPA', 'Depends on the role']
const COMP_MR = ['१.५ लाखांपर्यंत', '१.५ ते २.५ लाख', '२.५ ते ३.५ लाख', '३.५ ते ५ लाख', '५ ते ८ लाख', '८ लाखांपेक्षा जास्त', 'पदानुसार ठरेल']

const EXP_EN = ['Fresher', '0 to 1 year', '1 to 3 years', '3 to 5 years', 'More than 5 years']
const EXP_MR = ['फ्रेशर', '० ते १ वर्ष', '१ ते ३ वर्षे', '३ ते ५ वर्षे', '५ वर्षांपेक्षा जास्त']

/* logoH is a Tailwind height class, tuned per mark so the logos read at the same
   optical weight even though their artwork proportions differ. */
const RECRUITERS = [
  { name: 'Kunal Facility India', logo: null, open_en: 'More than 100 openings', open_mr: '100 हून अधिक जागा', tag_en: 'Production, office staff and operations roles', tag_mr: 'उत्पादन, ऑफिस स्टाफ व ऑपरेशन्स पदे' },
  { name: 'Endurance Technologies', logo: '/img/recruiters/endurance.png', logoH: 'h-9 sm:h-10', open_en: '51 to 100 openings', open_mr: '51 ते 100 जागा', tag_en: 'Manufacturing and plant roles', tag_mr: 'उत्पादन व प्लांट पदे' },
  { name: 'Johnson Lifts', logo: '/img/recruiters/johnson-lifts.png', logoH: 'h-12 sm:h-14', open_en: '51 to 100 openings', open_mr: '51 ते 100 जागा', tag_en: 'Production, operations and general staff roles', tag_mr: 'उत्पादन, ऑपरेशन्स व जनरल स्टाफ पदे' },
  { name: 'Hi-tech Services', logo: '/img/recruiters/hi-tech-services.png', logoH: 'h-9 sm:h-10', open_en: '26 to 50 openings', open_mr: '26 ते 50 जागा', tag_en: 'Manufacturing and production roles', tag_mr: 'उत्पादन व प्रॉडक्शन पदे' },
  { name: 'Devaki Commercial Vehicle', logo: '/img/recruiters/devaki.png', logoH: 'h-6 sm:h-7', open_en: '26 to 50 openings', open_mr: '26 ते 50 जागा', tag_en: 'Authorised Tata Motors commercial vehicle dealer', tag_mr: 'टाटा मोटर्स कमर्शियल व्हेइकल अधिकृत डीलर' },
  { name: 'BVG India', logo: '/img/recruiters/bvg-india.png', logoH: 'h-14 sm:h-16', open_en: '26 to 50 openings', open_mr: '26 ते 50 जागा', tag_en: 'Facility and non technical operations roles', tag_mr: 'फॅसिलिटी व नॉन टेक्निकल ऑपरेशन्स पदे' },
  { name: 'SkkAto India', logo: '/img/recruiters/skkato.png', logoH: 'h-10 sm:h-12', open_en: '26 to 50 openings', open_mr: '26 ते 50 जागा', tag_en: 'Supervisor, team lead and general staff roles', tag_mr: 'सुपरवायझर, टीम लीड व जनरल स्टाफ पदे' },
  { name: 'GAPS Energy', logo: '/img/recruiters/gaps-energy.png', logoH: 'h-14 sm:h-16', open_en: '11 to 25 openings', open_mr: '11 ते 25 जागा', tag_en: 'Production and administration roles', tag_mr: 'उत्पादन व प्रशासन पदे' },
  { name: 'Ecotech Chutes', logo: '/img/recruiters/ecotech-chutes.png', logoH: 'h-9 sm:h-10', open_en: '11 to 25 openings', open_mr: '11 ते 25 जागा', tag_en: 'Production, office staff and operations roles', tag_mr: 'उत्पादन, ऑफिस स्टाफ व ऑपरेशन्स पदे' },
  { name: 'NSB Systems', logo: null, open_en: '11 to 25 openings', open_mr: '11 ते 25 जागा', tag_en: 'Production and non technical operations roles', tag_mr: 'उत्पादन व नॉन टेक्निकल ऑपरेशन्स पदे' },
  { name: 'Akbar Travels', logo: '/img/recruiters/akbar-travels.svg', logoH: 'h-14 sm:h-16', open_en: '6 to 10 openings', open_mr: '6 ते 10 जागा', tag_en: 'Customer support and sales roles', tag_mr: 'ग्राहक सेवा व विक्री पदे' },
  { name: 'SBI Life Insurance', logo: '/img/recruiters/sbi-life.png', logoH: 'h-7 sm:h-8', open_en: '6 to 10 openings', open_mr: '6 ते 10 जागा', tag_en: 'Sales and marketing roles', tag_mr: 'विक्री व मार्केटिंग पदे' },
  { name: 'Techspian', logo: '/img/recruiters/techspian.svg', logoH: 'h-7 sm:h-8', open_en: '1 to 5 openings', open_mr: '1 ते 5 जागा', tag_en: 'IT and software roles', tag_mr: 'आयटी व सॉफ्टवेअर पदे' },
  { name: 'Zeal Connect Solutions', logo: '/img/recruiters/zeal-connect.png', logoH: 'h-8 sm:h-9', open_en: '1 to 5 openings', open_mr: '1 ते 5 जागा', tag_en: 'IT and software roles', tag_mr: 'आयटी व सॉफ्टवेअर पदे' },
  { name: 'Dhiti Services', logo: '/img/recruiters/dhiti-services.webp', logoH: 'h-9 sm:h-10', open_en: '1 to 5 openings', open_mr: '1 ते 5 जागा', tag_en: 'Customer support and BPO roles', tag_mr: 'ग्राहक सेवा व बीपीओ पदे' },
  { name: 'Diamond Pipe Supports', logo: null, open_en: '1 to 5 openings', open_mr: '1 ते 5 जागा', tag_en: 'Production and supervisor roles', tag_mr: 'उत्पादन व सुपरवायझर पदे' },
  { name: 'Techsham Stamping', logo: null, open_en: '1 to 5 openings', open_mr: '1 ते 5 जागा', tag_en: 'Production, office staff and operations roles', tag_mr: 'उत्पादन, ऑफिस स्टाफ व ऑपरेशन्स पदे' },
]

/* The answer a candidate chose is stored exactly as they picked it, in the
   language they registered in. These lists are index aligned, so a stored
   answer can be shown back in whichever language the reader is using now,
   without rewriting anything in the database. */
const ANSWER_PAIRS = [
  [DEPTS_EN, DEPTS_MR],
  [QUALIF_EN, QUALIF_MR],
  [EXP_EN, EXP_MR],
  [POS_EN, POS_MR],
]

export function localizeAnswer(value, lang) {
  const v = String(value || '').trim()
  if (!v) return v
  for (const [en, mr] of ANSWER_PAIRS) {
    const from = lang === 'mr' ? en : mr
    const to = lang === 'mr' ? mr : en
    const i = from.indexOf(v)
    if (i >= 0) return to[i] || v
  }
  return v
}

export const jobfair = {
  en: {
    navLabel: 'Job Fair',
    meta: {
      title: 'Ramsukrut Job Fair 2026. 29 September, Dawadi, Khed, Pune | Ramsukrut Kalyan Foundation',
      description: 'A free one day job fair on 29 September 2026. Reporting at 9:00 AM, process runs till 5:00 PM. Register as a candidate or book a hiring desk for your company.',
    },
    badge: 'Ramsukrut Job Fair 2026',
    h1: 'You have the talent.<br/>We are bringing the opportunity to your door.',
    heroSub: 'The Ramsukrut Job Fair on 29 September brings companies hiring across production, sales, IT, accounts, support, logistics and administration to you. No reference needed, only a resume. Entry is free, reporting is at 9:00 AM sharp, and screening, interview and offer are all completed the same day.',
    heroCtaCandidate: 'Register free in 2 minutes',
    heroCtaCorporate: 'Book a hiring desk',
    heroImg: '/img/students-campus.jpg',

    facts: [
      { k: 'Date', v: '29 September 2026' },
      { k: 'Reporting time', v: '9:00 AM sharp, process runs till 5:00 PM' },
      { k: 'Venue', v: 'Mahalaxmi Mangal Karyalay, Dawadi, Tal. Khed, Dist. Pune 410505' },
      { k: 'Entry', v: 'Free for all candidates' },
    ],

    aboutEyebrow: 'ABOUT THE FAIR',
    aboutTitle: 'Hiring brought to the doorstep of rural youth',
    aboutBody: 'Ramsukrut Kalyan Foundation exists to close the distance between ability and access. The young people here are ready to work. What has been missing is a hiring team willing to sit in front of them, and that has only ever been available to those who could afford to keep travelling and waiting. The Ramsukrut Job Fair moves the hiring instead. Recruiters bring their own desks and their own open positions, across production, sales, IT, accounts, customer support, logistics and administration, so there is something to apply for whatever you have studied or done so far. Screening, interview and offer all happen on 29 September itself, and nobody is asked to come back another day. No candidate is charged a rupee at any stage.',
    aboutPoints: [
      { t: 'Walk in with a resume', d: 'Carry three printed copies of your resume, an Aadhaar copy and your marksheets. Register online first so companies can shortlist you before the day.' },
      { t: 'Meet every company once', d: 'Each recruiting organisation gets its own desk. One registration puts your resume in front of all of them, including companies confirmed after you apply.' },
      { t: 'Interviews the same day', d: 'Screening, interview and, for many roles, the offer discussion all happen on the same day at the venue.' },
      { t: 'No fee, ever', d: 'Ramsukrut charges candidates nothing. If anyone asks you for money in our name, call us on the number below.' },
    ],

    recEyebrow: 'RECRUITING ORGANISATIONS',
    recTitle: 'Who is hiring on the day',
    recSub: 'These 17 organisations have confirmed a hiring desk so far, with more than 350 openings between them. More are being confirmed every week. Register once and your resume goes to all of them, including the companies that join after you apply.',
    recMoreTitle: 'Also confirmed',
    recMoreSub: 'These companies have confirmed a desk and will be at the venue on the day.',
    recruiters: RECRUITERS.map((r) => ({ name: r.name, logo: r.logo, logoH: r.logoH, openings: r.open_en, tag: r.tag_en })),

    deptEyebrow: 'ROLES ON OFFER',
    deptTitle: 'Departments hiring',
    depts: DEPTS_EN.filter((d) => d !== 'Other'),

    formEyebrow: 'REGISTER NOW',
    formTitle: 'Two ways to join the day',
    formSub: 'Candidates register to be shortlisted. Companies register to get a hiring desk at the venue.',
    tabCandidate: 'I am looking for a job',
    tabCorporate: 'We want to hire',

    candidate: {
      heading: 'Candidate registration',
      note: 'Your details go only to Ramsukrut Kalyan Foundation and the recruiting companies at this fair.',
      btn: 'Submit my application',
      sending: 'Submitting...',
      done: 'Registered. Keep your phone reachable. Our team will call you with your slot before 29 September.',
      doneUpdated: 'You had already registered on this number, so we have updated your details instead of adding you twice. Keep your phone reachable. Our team will call you with your slot before 29 September.',
      doneNoFile: 'Registered. Your resume file did not go through, so bring a printed copy on the day. Our team will call you with your slot before 29 September.',
      fail: 'Could not submit just now. Please send your details on WhatsApp instead.',
      fileLabel: 'Upload resume',
      fileHint: 'A PDF, Word file or a clear photo of your resume, up to 15 MB. Not ready? Submit now and bring a printed copy on the day.',
      fileTooBig: 'That file is larger than 15 MB, so it was not attached. Submit your details now and bring a printed copy on the day.',
      fileShort: 'PDF, Word or photo',
      fileChosen: 'Selected',
      fields: {
        name: 'Full name', mobile: 'Mobile number', email: 'Email (optional)',
        department: 'Department you are applying for', qualification: 'Highest qualification',
        experience: 'Experience',
        village: 'Village or town', taluka: 'Taluka', district: 'District',
        talukaOther: 'Name your taluka', districtOther: 'Name your district',
      },
      ph: {
        name: 'Your name as on Aadhaar', mobile: '10 digit mobile number', email: 'you@example.com',
        department: 'Select a department', qualification: 'Select your qualification',
        experience: 'Select your experience',
        village: 'e.g. Dawadi', taluka: 'Search your taluka', district: 'Search your district',
        talukaOther: 'Type your taluka', districtOther: 'Type your district',
      },
      departments: DEPTS_EN,
      qualifications: QUALIF_EN,
      experiences: EXP_EN,
      /* Copy for the searchable district and taluka dropdowns */
      search: {
        ph: 'Type to search',
        empty: 'No match. Pick Other and type the name.',
        other: 'Other',
        lockedTaluka: 'Choose your district first',
        required: 'Please choose your district and taluka.',
        count: (n) => `${n} options`,
      },
    },

    corporate: {
      heading: 'Recruiter participation',
      note: 'Our team will confirm your desk, candidate flow and timings within two working days.',
      btn: 'Request a hiring desk',
      sending: 'Submitting...',
      done: 'Thank you. Our team will call you within two working days to confirm your desk.',
      doneUpdated: 'Your organisation is already registered, so we have updated your details instead of adding a second desk. Our team will call you within two working days to confirm.',
      doneNoFile: 'Thank you. Your JD file did not go through, so please email it to us. Our team will call you within two working days to confirm your desk.',
      fail: 'Could not submit just now. Please send your details on WhatsApp instead.',
      fileLabel: 'Upload job description / JDs',
      fileHint: 'A single PDF, Word file or scan with all your open roles, up to 15 MB.',
      fileTooBig: 'That file is larger than 15 MB, so it was not attached. Submit your request now and email the JD to us.',
      fileShort: 'PDF, Word or scan',
      fileChosen: 'Selected',
      fields: {
        organization: 'Organisation name', name: 'Contact person', title: 'Designation',
        email: 'Work email', mobile: 'Mobile number', positions: 'Positions to fill',
        compensation: 'Compensation range', departments: 'Departments you are hiring for',
        notes: 'Anything else we should know',
      },
      ph: {
        organization: 'Company or organisation', name: 'Your name', title: 'e.g. HR Manager',
        email: 'name@company.com', mobile: '10 digit mobile number',
        positions: 'Select number of positions', compensation: 'Select a salary range',
        departments: 'Tick every department you are hiring for',
        notes: 'Interview panel size, space needed, arrival time',
      },
      opts: { positions: POS_EN, compensation: COMP_EN, departments: DEPTS_EN },
      multiHint: 'Choose one or more.',
      multiError: 'Please choose at least one department.',
    },

    faqEyebrow: 'BEFORE YOU COME',
    faqTitle: 'Common questions',
    faqs: [
      { q: 'Is there any registration fee?', a: 'No. The fair is completely free for candidates. Ramsukrut Kalyan Foundation never charges for a job, an interview or a referral.' },
      { q: 'What should I bring?', a: 'Three printed copies of your resume, an Aadhaar card copy, your final marksheets and any experience letters. Dress as you would for an interview.' },
      { q: 'I do not have a resume yet.', a: 'Register with your details anyway. Our volunteers will help you put a simple one-page resume together at the venue from 9:00 AM.' },
      { q: 'Can I come without registering online?', a: 'Yes, walk-ins are welcome. But registering online means companies see your resume in advance, so your interview is far quicker.' },
      { q: 'Who can I call for help?', a: 'Ring or WhatsApp the foundation on ' + JOBFAIR_PHONE + ' between 9:00 AM and 6:00 PM.' },
    ],

    mine: {
      navLabel: 'My options',
      checkCta: 'See which companies you match with',
      bannerTitle: 'Already registered?',
      bannerBody: 'Enter your mobile number and see which of the confirmed companies you match with, and pick the ones you want to sit for on the day.',
      metaTitle: 'Check your interview options | Ramsukrut Job Fair 2026',
      metaDesc: 'Already registered for the Ramsukrut Job Fair? Enter your mobile number to see which companies you match with on 29 September and choose the ones you want to sit for.',
      badge: 'For registered candidates',
      h1: 'See which companies<br/>you can sit for',
      sub: 'Type the mobile number you registered with. You will see the companies coming on 29 September that best fit what you have studied and done, strongest first, and you can pick up to 5 to appear for.',
      inputLabel: 'Your registered mobile number',
      inputPh: '10 digit number',
      cta: 'Show my companies',
      loading: 'Checking',
      errShort: 'Enter the 10 digit mobile number you registered with.',
      errNet: 'That did not go through. Check your network and try again.',
      notFoundTitle: 'No registration on this number',
      notFoundBody: 'We could not find anyone registered on this number. If you used a different number, try that one. If you have not registered yet, it takes two minutes and it is free.',
      notFoundCta: 'Register now',
      hello: 'Hello',
      youAre: 'Registered for',
      from: 'From',
      change: 'Use a different number',
      strongTitle: 'Strong matches',
      strongSub: 'These companies are hiring for what you have studied and done. Start here.',
      okTitle: 'Other options worth trying',
      okSub: 'A weaker fit, but the desk will still see you. Pick these as backups.',
      showMore: 'Show weaker options',
      showLess: 'Hide weaker options',
      noneTitle: 'No company matches yet',
      noneBody: 'More companies are confirming every week. We will call you when one matches what you are looking for. You can still walk in on the day.',
      bandStrong: 'Strong match',
      bandOk: 'Good option',
      bandWeak: 'Backup option',
      openings: 'openings',
      pick: 'I want to sit for this',
      picked: 'You are signed up',
      saving: 'Saving',
      chosenNone: 'You have not picked any company yet. Tap the companies you want to appear for.',
      chosenOne: 'You are signed up for 1 company.',
      chosenMany: 'You are signed up for {n} companies.',
      limit: '{n} of {max} chosen. You can sit for up to {max} companies on the day, so pick the ones you want most.',
      fullBtn: 'Limit of 5 reached',
      fullErr: 'You have already picked 5 companies. Remove one to choose this one instead.',
      chosenHint: 'Nothing else to do now. Reach the venue by 9:00 AM on 29 September with three copies of your resume and an Aadhaar copy. Show this screen at the help desk and they will point you to your first company.',
      noResume: 'You have not attached a resume. Bring three printed copies on the day, or reach by 9:00 AM and our volunteers will make one for you at the venue for free.',
      why: 'Why this match',
      helpTitle: 'Something look wrong?',
      helpBody: 'If your details are out of date, register again with the same number and the new answers will replace the old ones. For anything else, call or WhatsApp us.',
      privacy: 'Only your own registration is shown. Your resume and email are never displayed on this screen.',
    },

    ctaTitle: 'A job here is a future for a whole family',
    ctaSub: 'Register today, tell a friend who is looking, and be at the venue on 29 September.',
    ctaBtn: 'Register as a candidate',
    ctaWa: 'Ask on WhatsApp',
    waIntro: 'Hello, Ramsukrut Kalyan Foundation. I want to register for the Job Fair on 29 September 2026.',
  },

  mr: {
    navLabel: 'रोजगार मेळावा',
    meta: {
      title: 'रामसुकृत रोजगार मेळावा २०२६. २९ सप्टेंबर, दावडी, खेड, पुणे | रामसुकृत कल्याण फाउंडेशन',
      description: '२९ सप्टेंबर २०२६ रोजी मोफत रोजगार मेळावा. सकाळी ९:०० वाजता हजर राहा, प्रक्रिया सायंकाळी ५:०० पर्यंत चालेल. उमेदवार म्हणून नोंदणी करा किंवा तुमच्या कंपनीसाठी भरती डेस्क बुक करा.',
    },
    badge: 'रामसुकृत रोजगार मेळावा 2026',
    h1: 'क्षमता तुमच्याकडे आहे.<br/>संधी आम्ही तुमच्या दारात आणत आहोत.',
    heroSub: 'रामसुकृत रोजगार मेळावा 29 सप्टेंबरला उत्पादन, विक्री, आयटी, अकाउंट्स, ग्राहक सेवा, लॉजिस्टिक्स आणि प्रशासन अशा सर्व विभागांसाठी भरती करणाऱ्या कंपन्या तुमच्यापर्यंत घेऊन येतो. ओळख नको, फक्त रेझ्युमे. प्रवेश मोफत, सकाळी 9:00 वाजता हजर राहा, आणि स्क्रीनिंग, मुलाखत व ऑफर सर्व काही त्याच दिवशी पूर्ण होते.',
    heroCtaCandidate: '2 मिनिटांत मोफत नोंदणी करा',
    heroCtaCorporate: 'भरती डेस्क बुक करा',
    heroImg: '/img/students-campus.jpg',

    facts: [
      { k: 'दिनांक', v: '२९ सप्टेंबर २०२६' },
      { k: 'हजर राहण्याची वेळ', v: 'सकाळी ९:०० वाजता, प्रक्रिया सायंकाळी ५:०० पर्यंत' },
      { k: 'ठिकाण', v: 'महालक्ष्मी मंगल कार्यालय, दावडी, ता. खेड, जि. पुणे 410505' },
      { k: 'प्रवेश', v: 'सर्व उमेदवारांसाठी नि:शुल्क' },
    ],

    aboutEyebrow: 'मेळाव्याविषयी',
    aboutTitle: 'भरती आता ग्रामीण तरुणांच्या दारात',
    aboutBody: 'क्षमता आणि संधी यांच्यातील अंतर कमी करण्यासाठी रामसुकृत कल्याण फाउंडेशन काम करते. येथील तरुण काम करण्यास पूर्ण तयार आहेत. कमी पडत होती ती केवळ त्यांच्यासमोर बसणारी भरती टीम, आणि ती आजपर्यंत फक्त वारंवार प्रवास आणि वाट पाहणे परवडणाऱ्यांनाच उपलब्ध होती. रामसुकृत रोजगार मेळावा भरतीलाच तुमच्याकडे आणतो. भरती करणाऱ्या कंपन्या स्वतःचे डेस्क आणि स्वतःच्या रिक्त जागा घेऊन येतात, उत्पादन, विक्री, आयटी, अकाउंट्स, ग्राहक सेवा, लॉजिस्टिक्स आणि प्रशासन अशा सर्व विभागांमध्ये, म्हणजे तुम्ही जे शिकले असाल किंवा जे काम केले असेल, त्यासाठी अर्ज करण्याजोगे काहीतरी नक्की आहे. स्क्रीनिंग, मुलाखत आणि ऑफर सर्व काही २९ सप्टेंबरलाच होते, आणि कोणालाही दुसऱ्या दिवशी परत बोलावले जात नाही. कोणत्याही उमेदवाराकडून एक रुपयाही घेतला जात नाही.',
    aboutPoints: [
      { t: 'रेझ्युमे घेऊन थेट या', d: 'रेझ्युमेच्या तीन प्रती, आधार कार्डची प्रत आणि गुणपत्रके सोबत आणा. आधी ऑनलाइन नोंदणी केल्यास कंपन्या तुमची निवड आधीच करू शकतात.' },
      { t: 'सर्व कंपन्या एकाच ठिकाणी', d: 'भरती करणाऱ्या प्रत्येक संस्थेचे स्वतंत्र डेस्क असेल. एक नोंदणी तुमचा रेझ्युमे सर्वांपर्यंत पोहोचवते, नंतर जोडल्या जाणाऱ्या कंपन्यांपर्यंतही.' },
      { t: 'त्याच दिवशी मुलाखत', d: 'स्क्रीनिंग, मुलाखत आणि बऱ्याच पदांसाठी ऑफरची चर्चा त्याच दिवशी त्याच ठिकाणी होईल.' },
      { t: 'कोणतीही फी नाही', d: 'रामसुकृत उमेदवारांकडून एक रुपयाही घेत नाही. आमच्या नावाने कोणी पैसे मागितले तर खालील क्रमांकावर संपर्क करा.' },
    ],

    recEyebrow: 'भरती करणाऱ्या संस्था',
    recTitle: 'या दिवशी भरती करणाऱ्या कंपन्या',
    recSub: 'आतापर्यंत 17 संस्थांनी भरती डेस्क निश्चित केला आहे आणि त्यांच्याकडे मिळून 350 हून अधिक जागा आहेत. दर आठवड्याला आणखी कंपन्या जोडल्या जात आहेत. एकदा नोंदणी करा, तुमचा रेझ्युमे या सर्व कंपन्यांपर्यंत पोहोचतो, तुम्ही अर्ज केल्यानंतर जोडल्या जाणाऱ्या कंपन्यांपर्यंतही.',
    recMoreTitle: 'हेही निश्चित झाले आहेत',
    recMoreSub: 'या कंपन्यांनी डेस्क निश्चित केला आहे आणि त्या दिवशी त्या ठिकाणी उपस्थित राहतील.',
    recruiters: RECRUITERS.map((r) => ({ name: r.name, logo: r.logo, logoH: r.logoH, openings: r.open_mr, tag: r.tag_mr })),

    deptEyebrow: 'उपलब्ध पदे',
    deptTitle: 'भरती होणारे विभाग',
    depts: DEPTS_MR.filter((d) => d !== 'इतर'),

    formEyebrow: 'आता नोंदणी करा',
    formTitle: 'सहभागी होण्याचे दोन मार्ग',
    formSub: 'उमेदवारांनी निवडीसाठी नोंदणी करावी. कंपन्यांनी मेळाव्यात डेस्कसाठी नोंदणी करावी.',
    tabCandidate: 'मला नोकरी हवी आहे',
    tabCorporate: 'आम्हाला भरती करायची आहे',

    candidate: {
      heading: 'उमेदवार नोंदणी',
      note: 'तुमची माहिती केवळ रामसुकृत कल्याण फाउंडेशन आणि या मेळाव्यातील कंपन्यांपर्यंत जाते.',
      btn: 'माझा अर्ज पाठवा',
      sending: 'पाठवत आहे...',
      done: 'नोंदणी झाली. फोन सुरू ठेवा. २९ सप्टेंबरपूर्वी आमची टीम तुम्हाला वेळ कळवेल.',
      doneUpdated: 'या क्रमांकावर तुमची नोंदणी आधीच झाली आहे, म्हणून दुसरी नोंद न करता तुमची माहिती अद्ययावत केली आहे. फोन सुरू ठेवा. २९ सप्टेंबरपूर्वी आमची टीम तुम्हाला वेळ कळवेल.',
      doneNoFile: 'नोंदणी झाली. तुमची रेझ्युमे फाइल पोहोचली नाही, म्हणून मेळाव्याच्या दिवशी छापील प्रत आणा. २९ सप्टेंबरपूर्वी आमची टीम तुम्हाला वेळ कळवेल.',
      fail: 'आत्ता पाठवता आले नाही. कृपया तुमची माहिती WhatsApp वर पाठवा.',
      fileLabel: 'रेझ्युमे अपलोड करा',
      fileHint: 'PDF, Word फाइल किंवा रेझ्युमेचा स्पष्ट फोटो, १५ MB पर्यंत. तयार नाही? आता नोंदणी करा आणि मेळाव्याच्या दिवशी प्रत आणा.',
      fileTooBig: 'ही फाइल १५ MB पेक्षा मोठी आहे, त्यामुळे जोडली गेली नाही. आता माहिती पाठवा आणि मेळाव्याच्या दिवशी छापील प्रत आणा.',
      fileShort: 'PDF, Word किंवा फोटो',
      fileChosen: 'निवडले',
      fields: {
        name: 'संपूर्ण नाव', mobile: 'मोबाइल क्रमांक', email: 'ईमेल (ऐच्छिक)',
        department: 'कोणत्या विभागासाठी अर्ज', qualification: 'सर्वोच्च शिक्षण',
        experience: 'अनुभव',
        village: 'गाव किंवा शहर', taluka: 'तालुका', district: 'जिल्हा',
        talukaOther: 'तुमचा तालुका लिहा', districtOther: 'तुमचा जिल्हा लिहा',
      },
      ph: {
        name: 'आधारवरील नाव', mobile: '१० अंकी मोबाइल क्रमांक', email: 'you@example.com',
        department: 'विभाग निवडा', qualification: 'शिक्षण निवडा',
        experience: 'अनुभव निवडा',
        village: 'उदा. दावडी', taluka: 'तालुका शोधा', district: 'जिल्हा शोधा',
        talukaOther: 'तालुका लिहा', districtOther: 'जिल्हा लिहा',
      },
      departments: DEPTS_MR,
      qualifications: QUALIF_MR,
      experiences: EXP_MR,
      search: {
        ph: 'शोधण्यासाठी लिहा',
        empty: 'जुळणी नाही. इतर निवडून नाव लिहा.',
        other: 'इतर',
        lockedTaluka: 'आधी जिल्हा निवडा',
        required: 'कृपया जिल्हा आणि तालुका निवडा.',
        count: (n) => `${n} पर्याय`,
      },
    },

    corporate: {
      heading: 'कंपनी सहभाग',
      note: 'दोन कामकाजाच्या दिवसांत आमची टीम तुमचे डेस्क, उमेदवार संख्या आणि वेळ निश्चित करेल.',
      btn: 'भरती डेस्कसाठी विनंती',
      sending: 'पाठवत आहे...',
      done: 'धन्यवाद. दोन कामकाजाच्या दिवसांत आमची टीम तुम्हाला संपर्क करेल.',
      doneUpdated: 'तुमच्या संस्थेची नोंदणी आधीच झाली आहे, म्हणून दुसरी नोंद न करता तुमची माहिती अद्ययावत केली आहे. दोन कामकाजाच्या दिवसांत आमची टीम तुम्हाला संपर्क करेल.',
      doneNoFile: 'धन्यवाद. तुमची JD फाइल पोहोचली नाही, कृपया ती ईमेलने पाठवा. दोन कामकाजाच्या दिवसांत आमची टीम तुम्हाला संपर्क करेल.',
      fail: 'आत्ता पाठवता आले नाही. कृपया तुमची माहिती WhatsApp वर पाठवा.',
      fileLabel: 'जॉब डिस्क्रिप्शन अपलोड करा',
      fileHint: 'सर्व रिक्त पदांचा एकच PDF, Word फाइल किंवा स्कॅन, १५ MB पर्यंत.',
      fileTooBig: 'ही फाइल १५ MB पेक्षा मोठी आहे, त्यामुळे जोडली गेली नाही. आता विनंती पाठवा आणि JD ईमेलने पाठवा.',
      fileShort: 'PDF, Word किंवा स्कॅन',
      fileChosen: 'निवडले',
      fields: {
        organization: 'संस्थेचे नाव', name: 'संपर्क व्यक्ती', title: 'पदनाम',
        email: 'कार्यालयीन ईमेल', mobile: 'मोबाइल क्रमांक', positions: 'भरायची पदे',
        compensation: 'वेतन श्रेणी', departments: 'कोणत्या विभागांसाठी भरती',
        notes: 'अन्य माहिती',
      },
      ph: {
        organization: 'कंपनी किंवा संस्था', name: 'तुमचे नाव', title: 'उदा. एचआर मॅनेजर',
        email: 'name@company.com', mobile: '१० अंकी मोबाइल क्रमांक',
        positions: 'पदांची संख्या निवडा', compensation: 'वेतन श्रेणी निवडा',
        departments: 'भरती करायच्या सर्व विभागांवर खूण करा',
        notes: 'मुलाखत पॅनेल, आवश्यक जागा, येण्याची वेळ',
      },
      opts: { positions: POS_MR, compensation: COMP_MR, departments: DEPTS_MR },
      multiHint: 'एक किंवा अधिक निवडा.',
      multiError: 'कृपया कमीत कमी एक विभाग निवडा.',
    },

    faqEyebrow: 'येण्यापूर्वी',
    faqTitle: 'नेहमीचे प्रश्न',
    faqs: [
      { q: 'नोंदणी शुल्क आहे का?', a: 'नाही. मेळावा उमेदवारांसाठी पूर्णपणे नि:शुल्क आहे. रामसुकृत कल्याण फाउंडेशन नोकरी, मुलाखत किंवा शिफारशीसाठी कधीही पैसे घेत नाही.' },
      { q: 'सोबत काय आणायचे?', a: 'रेझ्युमेच्या तीन प्रती, आधार कार्डची प्रत, अंतिम गुणपत्रके आणि अनुभव पत्रे. मुलाखतीसारखा पेहराव करा.' },
      { q: 'माझा रेझ्युमे तयार नाही.', a: 'तरीही माहिती भरून नोंदणी करा. सकाळी ९:०० पासून आमचे स्वयंसेवक जागेवरच एक पानाचा साधा रेझ्युमे तयार करून देतील.' },
      { q: 'ऑनलाइन नोंदणीशिवाय येऊ शकतो का?', a: 'हो, थेट येऊ शकता. पण ऑनलाइन नोंदणी केल्यास कंपन्या तुमचा रेझ्युमे आधीच पाहतात आणि मुलाखत लवकर होते.' },
      { q: 'मदतीसाठी कोणाला फोन करावा?', a: 'सकाळी ९:०० ते सायंकाळी ६:०० या वेळेत ' + JOBFAIR_PHONE + ' या क्रमांकावर फोन किंवा WhatsApp करा.' },
    ],

    mine: {
      navLabel: 'माझे पर्याय',
      checkCta: 'तुमच्याशी कोणत्या कंपन्या जुळतात ते पाहा',
      bannerTitle: 'नोंदणी आधीच केली आहे का?',
      bannerBody: 'तुमचा मोबाइल क्रमांक टाका आणि निश्चित झालेल्या कंपन्यांपैकी तुमच्याशी कोणत्या जुळतात ते पाहा, आणि त्या दिवशी कोणत्या कंपन्यांमध्ये बसायचे ते निवडा.',
      metaTitle: 'तुमच्या मुलाखतीच्या संधी पाहा | रामसुकृत रोजगार मेळावा 2026',
      metaDesc: 'रामसुकृत रोजगार मेळाव्यासाठी नोंदणी केली आहे का? तुमचा मोबाइल क्रमांक टाका आणि 29 सप्टेंबरला कोणत्या कंपन्यांशी तुमचे जुळते ते पाहा.',
      badge: 'नोंदणी केलेल्या उमेदवारांसाठी',
      h1: 'तुम्ही कोणत्या कंपन्यांमध्ये<br/>बसू शकता ते पाहा',
      sub: 'तुम्ही ज्या मोबाइल क्रमांकावरून नोंदणी केली तो टाका. 29 सप्टेंबरला येणाऱ्यांपैकी तुमच्या शिक्षणाशी आणि अनुभवाशी सर्वात जास्त जुळणाऱ्या कंपन्या दिसतील, सर्वात जुळणारी आधी, आणि त्यापैकी जास्तीत जास्त 5 निवडता येतील.',
      inputLabel: 'नोंदणी केलेला मोबाइल क्रमांक',
      inputPh: '10 अंकी क्रमांक',
      cta: 'माझ्या कंपन्या दाखवा',
      loading: 'तपासत आहोत',
      errShort: 'नोंदणी केलेला 10 अंकी मोबाइल क्रमांक टाका.',
      errNet: 'हे पाठवता आले नाही. नेटवर्क तपासा आणि पुन्हा प्रयत्न करा.',
      notFoundTitle: 'या क्रमांकावर नोंदणी आढळली नाही',
      notFoundBody: 'या क्रमांकावर कोणाचीही नोंदणी सापडली नाही. तुम्ही दुसरा क्रमांक वापरला असेल तर तो टाकून पाहा. अजून नोंदणी केली नसेल तर ती फक्त दोन मिनिटांची आहे आणि नि:शुल्क आहे.',
      notFoundCta: 'आता नोंदणी करा',
      hello: 'नमस्कार',
      youAre: 'नोंदणी केली आहे',
      from: 'गाव',
      change: 'दुसरा क्रमांक वापरा',
      strongTitle: 'पक्के जुळणारे पर्याय',
      strongSub: 'तुम्ही जे शिकला आहात आणि जे काम केले आहे त्यासाठीच या कंपन्या भरती करत आहेत. इथून सुरुवात करा.',
      okTitle: 'इतर पर्याय, प्रयत्न करण्यासारखे',
      okSub: 'जुळणी थोडी कमी आहे, पण डेस्क तुम्हाला भेटेलच. हे राखीव पर्याय म्हणून निवडा.',
      showMore: 'कमी जुळणारे पर्याय दाखवा',
      showLess: 'कमी जुळणारे पर्याय लपवा',
      noneTitle: 'अजून कोणतीही कंपनी जुळत नाही',
      noneBody: 'दर आठवड्याला आणखी कंपन्या निश्चित होत आहेत. तुमच्यासाठी योग्य कंपनी आली की आम्ही फोन करू. तुम्ही त्या दिवशी थेट येऊ शकताच.',
      bandStrong: 'पक्की जुळणी',
      bandOk: 'चांगला पर्याय',
      bandWeak: 'राखीव पर्याय',
      openings: 'जागा',
      pick: 'मला इथे बसायचे आहे',
      picked: 'तुमची नोंद झाली आहे',
      saving: 'नोंदवत आहोत',
      chosenNone: 'तुम्ही अजून कोणतीही कंपनी निवडलेली नाही. ज्या कंपन्यांमध्ये बसायचे आहे त्यावर टॅप करा.',
      chosenOne: 'तुमची 1 कंपनीसाठी नोंद झाली आहे.',
      chosenMany: 'तुमची {n} कंपन्यांसाठी नोंद झाली आहे.',
      limit: '{max} पैकी {n} निवडल्या. त्या दिवशी जास्तीत जास्त {max} कंपन्यांमध्ये मुलाखत देता येईल, म्हणून सर्वात हव्या त्या निवडा.',
      fullBtn: '5 ची मर्यादा पूर्ण',
      fullErr: 'तुम्ही आधीच 5 कंपन्या निवडल्या आहेत. ही निवडायची असेल तर आधी एक काढा.',
      chosenHint: 'आता दुसरे काही करायचे नाही. 29 सप्टेंबरला सकाळी 9:00 पर्यंत रेझ्युमेच्या तीन प्रती आणि आधार कार्डाची प्रत घेऊन ठिकाणी पोहोचा. मदत कक्षात ही स्क्रीन दाखवा, ते तुम्हाला पहिल्या कंपनीकडे पाठवतील.',
      noResume: 'तुम्ही रेझ्युमे जोडलेला नाही. त्या दिवशी छापील तीन प्रती आणा, किंवा सकाळी 9:00 पर्यंत पोहोचा, आमचे स्वयंसेवक जागेवरच नि:शुल्क रेझ्युमे तयार करून देतील.',
      why: 'ही जुळणी का',
      helpTitle: 'काही चुकीचे वाटते आहे का?',
      helpBody: 'तुमची माहिती जुनी असेल तर त्याच क्रमांकाने पुन्हा नोंदणी करा, नवी उत्तरे जुन्यांच्या जागी येतील. इतर कशासाठीही आम्हाला फोन किंवा WhatsApp करा.',
      privacy: 'फक्त तुमचीच नोंदणी दाखवली जाते. तुमचा रेझ्युमे आणि ईमेल या स्क्रीनवर कधीही दिसत नाहीत.',
    },

    ctaTitle: 'येथील एक नोकरी संपूर्ण कुटुंबाचे भविष्य घडवते',
    ctaSub: 'आज नोंदणी करा, नोकरी शोधणाऱ्या मित्राला सांगा आणि २९ सप्टेंबरला मेळाव्याला उपस्थित राहा.',
    ctaBtn: 'उमेदवार नोंदणी करा',
    ctaWa: 'WhatsApp वर विचारा',
    waIntro: 'नमस्कार, रामसुकृत कल्याण फाउंडेशन. मला २९ सप्टेंबर २०२६ च्या रोजगार मेळाव्यासाठी नोंदणी करायची आहे.',
  },
}

export default jobfair

/* The English option lists, for the volunteer desk walk-in form, so a person
   registered at the venue lands in exactly the same buckets as one who
   registered online. */
export { DEPTS_EN, QUALIF_EN, EXP_EN }
