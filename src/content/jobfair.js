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

export const JOBFAIR_WA = '917277404040'
export const JOBFAIR_PHONE = '+91 72774 04040'

/* Departments shown in the candidate dropdown */
const DEPTS_EN = ['IT / Software', 'Sales & Marketing', 'Process / Operations', 'Manufacturing / Production', 'Customer Support / BPO', 'Accounts & Finance', 'HR & Admin', 'Logistics & Warehouse', 'Other']
const DEPTS_MR = ['आयटी / सॉफ्टवेअर', 'विक्री व मार्केटिंग', 'प्रोसेस / ऑपरेशन्स', 'उत्पादन / मॅन्युफॅक्चरिंग', 'ग्राहक सेवा / बीपीओ', 'अकाउंट्स व फायनान्स', 'एचआर व प्रशासन', 'लॉजिस्टिक्स व वेअरहाऊस', 'इतर']

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
  { name: 'Bosch', logo: '/img/recruiters/bosch.svg', logoH: 'h-8 sm:h-9', tag_en: 'Manufacturing & engineering roles', tag_mr: 'उत्पादन व अभियांत्रिकी पदे' },
  { name: 'Akbar Travels', logo: '/img/recruiters/akbar-travels.svg', logoH: 'h-14 sm:h-16', tag_en: 'Travel, process & customer roles', tag_mr: 'ट्रॅव्हल, प्रोसेस व ग्राहक सेवा पदे' },
  { name: 'Dhiti Services', logo: '/img/recruiters/dhiti-services.webp', logoH: 'h-9 sm:h-10', tag_en: 'Services & operations roles', tag_mr: 'सेवा व ऑपरेशन्स पदे' },
  { name: 'Zeal Connect', logo: '/img/recruiters/zeal-connect.png', logoH: 'h-8 sm:h-9', tag_en: 'Sales & support roles', tag_mr: 'विक्री व सपोर्ट पदे' },
]

export const jobfair = {
  en: {
    navLabel: 'Job Fair',
    meta: {
      title: 'Ramsukrut Job Fair 2026. 29 September, Rajgurunagar | Ramsukrut Kalyan Foundation',
      description: 'A free one day job fair on 29 September 2026. Reporting at 10:00 AM, process runs till 7:00 PM. Register as a candidate or book a hiring desk for your company.',
    },
    badge: 'Ramsukrut Job Fair 2026',
    h1: 'You have the talent.<br/>We are bringing the opportunity to your door.',
    heroSub: 'The Ramsukrut Job Fair on 29 September brings companies hiring across production, sales, IT, accounts, support, logistics and administration to you. No reference needed, only a resume. Entry is free, reporting is at 10:00 AM sharp, and screening, interview and offer are all completed the same day.',
    heroCtaCandidate: 'Register free in 2 minutes',
    heroCtaCorporate: 'Book a hiring desk',
    heroImg: '/img/students-campus.jpg',

    facts: [
      { k: 'Date', v: '29 September 2026' },
      { k: 'Reporting time', v: '10:00 AM sharp, process runs till 7:00 PM' },
      { k: 'Venue', v: 'Rajgurunagar, Tal. Khed, Dist. Pune' },
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
    recSub: 'More organisations are being confirmed. Register once and we will tell you as new companies join.',
    recruiters: RECRUITERS.map((r) => ({ name: r.name, logo: r.logo, logoH: r.logoH, tag: r.tag_en })),

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
      fail: 'Could not submit just now. Please send your details on WhatsApp instead.',
      fileLabel: 'Upload resume',
      fileHint: 'PDF, DOC or DOCX up to 5 MB. Not ready? Submit now and bring a printed copy on the day.',
      fileChosen: 'Selected',
      fields: {
        name: 'Full name', mobile: 'Mobile number', email: 'Email (optional)',
        department: 'Department you are applying for', qualification: 'Highest qualification',
        experience: 'Experience', city: 'City or village',
      },
      ph: {
        name: 'Your name as on Aadhaar', mobile: '10 digit mobile number', email: 'you@example.com',
        department: 'Select a department', qualification: 'e.g. BA, B.Com, ITI, Diploma, 12th',
        experience: 'Select your experience', city: 'e.g. Rajgurunagar',
      },
      departments: DEPTS_EN,
      experiences: EXP_EN,
    },

    corporate: {
      heading: 'Recruiter participation',
      note: 'Our team will confirm your desk, candidate flow and timings within two working days.',
      btn: 'Request a hiring desk',
      sending: 'Submitting...',
      done: 'Thank you. Our team will call you within two working days to confirm your desk.',
      fail: 'Could not submit just now. Please send your details on WhatsApp instead.',
      fileLabel: 'Upload job description / JDs',
      fileHint: 'A single PDF or DOC with all your open roles, up to 5 MB.',
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
      { q: 'I do not have a resume yet.', a: 'Register with your details anyway. Our volunteers will help you put a simple one-page resume together at the venue from 10:00 AM.' },
      { q: 'Can I come without registering online?', a: 'Yes, walk-ins are welcome. But registering online means companies see your resume in advance, so your interview is far quicker.' },
      { q: 'Who can I call for help?', a: 'Ring or WhatsApp the foundation on ' + JOBFAIR_PHONE + ' between 9:00 AM and 6:00 PM.' },
    ],

    ctaTitle: 'A job here is a future for a whole family',
    ctaSub: 'Register today, tell a friend who is looking, and be at the venue on 29 September.',
    ctaBtn: 'Register as a candidate',
    ctaWa: 'Ask on WhatsApp',
    waIntro: 'Hello, Ramsukrut Kalyan Foundation. I want to register for the Job Fair on 29 September 2026.',
  },

  mr: {
    navLabel: 'रोजगार मेळावा',
    meta: {
      title: 'रामसुकृत रोजगार मेळावा २०२६. २९ सप्टेंबर, राजगुरुनगर | रामसुकृत कल्याण फाउंडेशन',
      description: '२९ सप्टेंबर २०२६ रोजी मोफत रोजगार मेळावा. सकाळी १०:०० वाजता हजर राहा, प्रक्रिया सायंकाळी ७:०० पर्यंत चालेल. उमेदवार म्हणून नोंदणी करा किंवा तुमच्या कंपनीसाठी भरती डेस्क बुक करा.',
    },
    badge: 'रामसुकृत रोजगार मेळावा 2026',
    h1: 'क्षमता तुमच्याकडे आहे.<br/>संधी आम्ही तुमच्या दारात आणत आहोत.',
    heroSub: 'रामसुकृत रोजगार मेळावा 29 सप्टेंबरला उत्पादन, विक्री, आयटी, अकाउंट्स, ग्राहक सेवा, लॉजिस्टिक्स आणि प्रशासन अशा सर्व विभागांसाठी भरती करणाऱ्या कंपन्या तुमच्यापर्यंत घेऊन येतो. ओळख नको, फक्त रेझ्युमे. प्रवेश मोफत, सकाळी 10:00 वाजता हजर राहा, आणि स्क्रीनिंग, मुलाखत व ऑफर सर्व काही त्याच दिवशी पूर्ण होते.',
    heroCtaCandidate: '2 मिनिटांत मोफत नोंदणी करा',
    heroCtaCorporate: 'भरती डेस्क बुक करा',
    heroImg: '/img/students-campus.jpg',

    facts: [
      { k: 'दिनांक', v: '२९ सप्टेंबर २०२६' },
      { k: 'हजर राहण्याची वेळ', v: 'सकाळी १०:०० वाजता, प्रक्रिया सायंकाळी ७:०० पर्यंत' },
      { k: 'ठिकाण', v: 'राजगुरुनगर, ता. खेड, जि. पुणे' },
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
    recSub: 'अधिक संस्थांची नावे निश्चित होत आहेत. एकदा नोंदणी करा, नवीन कंपन्या जोडल्या की आम्ही कळवू.',
    recruiters: RECRUITERS.map((r) => ({ name: r.name, logo: r.logo, logoH: r.logoH, tag: r.tag_mr })),

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
      fail: 'आत्ता पाठवता आले नाही. कृपया तुमची माहिती WhatsApp वर पाठवा.',
      fileLabel: 'रेझ्युमे अपलोड करा',
      fileHint: 'PDF, DOC किंवा DOCX, ५ MB पर्यंत. तयार नाही? आता नोंदणी करा आणि मेळाव्याच्या दिवशी प्रत आणा.',
      fileChosen: 'निवडले',
      fields: {
        name: 'संपूर्ण नाव', mobile: 'मोबाइल क्रमांक', email: 'ईमेल (ऐच्छिक)',
        department: 'कोणत्या विभागासाठी अर्ज', qualification: 'सर्वोच्च शिक्षण',
        experience: 'अनुभव', city: 'गाव किंवा शहर',
      },
      ph: {
        name: 'आधारवरील नाव', mobile: '१० अंकी मोबाइल क्रमांक', email: 'you@example.com',
        department: 'विभाग निवडा', qualification: 'उदा. बीए, बीकॉम, आयटीआय, डिप्लोमा, १२वी',
        experience: 'अनुभव निवडा', city: 'उदा. राजगुरुनगर',
      },
      departments: DEPTS_MR,
      experiences: EXP_MR,
    },

    corporate: {
      heading: 'कंपनी सहभाग',
      note: 'दोन कामकाजाच्या दिवसांत आमची टीम तुमचे डेस्क, उमेदवार संख्या आणि वेळ निश्चित करेल.',
      btn: 'भरती डेस्कसाठी विनंती',
      sending: 'पाठवत आहे...',
      done: 'धन्यवाद. दोन कामकाजाच्या दिवसांत आमची टीम तुम्हाला संपर्क करेल.',
      fail: 'आत्ता पाठवता आले नाही. कृपया तुमची माहिती WhatsApp वर पाठवा.',
      fileLabel: 'जॉब डिस्क्रिप्शन अपलोड करा',
      fileHint: 'सर्व रिक्त पदांचा एकच PDF किंवा DOC, ५ MB पर्यंत.',
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
      { q: 'माझा रेझ्युमे तयार नाही.', a: 'तरीही माहिती भरून नोंदणी करा. सकाळी १०:०० पासून आमचे स्वयंसेवक जागेवरच एक पानाचा साधा रेझ्युमे तयार करून देतील.' },
      { q: 'ऑनलाइन नोंदणीशिवाय येऊ शकतो का?', a: 'हो, थेट येऊ शकता. पण ऑनलाइन नोंदणी केल्यास कंपन्या तुमचा रेझ्युमे आधीच पाहतात आणि मुलाखत लवकर होते.' },
      { q: 'मदतीसाठी कोणाला फोन करावा?', a: 'सकाळी ९:०० ते सायंकाळी ६:०० या वेळेत ' + JOBFAIR_PHONE + ' या क्रमांकावर फोन किंवा WhatsApp करा.' },
    ],

    ctaTitle: 'येथील एक नोकरी संपूर्ण कुटुंबाचे भविष्य घडवते',
    ctaSub: 'आज नोंदणी करा, नोकरी शोधणाऱ्या मित्राला सांगा आणि २९ सप्टेंबरला मेळाव्याला उपस्थित राहा.',
    ctaBtn: 'उमेदवार नोंदणी करा',
    ctaWa: 'WhatsApp वर विचारा',
    waIntro: 'नमस्कार, रामसुकृत कल्याण फाउंडेशन. मला २९ सप्टेंबर २०२६ च्या रोजगार मेळाव्यासाठी नोंदणी करायची आहे.',
  },
}

export default jobfair
