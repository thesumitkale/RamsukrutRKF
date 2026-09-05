/* ==========================================================================
   Ramsukrut Job Fair 2026. All page text, English and Marathi.
   Edit the words here; the layout lives in src/pages/JobFair.jsx
   ========================================================================== */

/* PASTE THE GOOGLE APPS SCRIPT WEB APP URL BETWEEN THE QUOTES BELOW.
   It looks like: https://script.google.com/macros/s/AKfy..../exec
   Until it is filled in, the forms fall back to sending the details
   over WhatsApp so no candidate is ever lost.                        */
export const JOBFAIR_ENDPOINT = ''

export const JOBFAIR_WA = '917277404040'
export const JOBFAIR_PHONE = '+91 72774 04040'

/* Departments shown in the candidate dropdown */
const DEPTS_EN = ['IT / Software', 'Sales & Marketing', 'Process / Operations', 'Manufacturing / Production', 'Customer Support / BPO', 'Accounts & Finance', 'HR & Admin', 'Logistics & Warehouse', 'Other']
const DEPTS_MR = ['आयटी / सॉफ्टवेअर', 'विक्री व मार्केटिंग', 'प्रोसेस / ऑपरेशन्स', 'उत्पादन / मॅन्युफॅक्चरिंग', 'ग्राहक सेवा / बीपीओ', 'अकाउंट्स व फायनान्स', 'एचआर व प्रशासन', 'लॉजिस्टिक्स व वेअरहाऊस', 'इतर']

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
      description: 'A free one day job fair on 29 September 2026, 10 AM to 7 PM. Register as a candidate or book a hiring desk for your company.',
    },
    badge: 'Ramsukrut Job Fair 2026',
    h1: 'You don\u2019t need a reference.<br/>You need a resume.',
    heroSub: 'On 29 September, Bosch, Akbar Travels, Dhiti Services and ZealConnect interview candidates in Rajgurunagar, and more companies are joining. Entry is free, walk in any time between 10 in the morning and 7 at night, and register now so they read your resume before you sit down.',
    heroCtaCandidate: 'Register free in 2 minutes',
    heroCtaCorporate: 'Book a hiring desk',
    heroImg: '/img/students-campus.jpg',

    facts: [
      { k: 'Date', v: '29 September 2026' },
      { k: 'Timing', v: '10:00 AM to 7:00 PM' },
      { k: 'Venue', v: 'Rajgurunagar, Tal. Khed, Dist. Pune' },
      { k: 'Entry', v: 'Free for all candidates' },
    ],

    aboutEyebrow: 'ABOUT THE FAIR',
    aboutTitle: 'Hiring brought to the doorstep of rural youth',
    aboutBody: 'Talent in Khed taluka is not short of ability, only of access. Every interview in Pune costs a day of wages, a bus fare and a borrowed shirt. The Ramsukrut Job Fair removes all three. On 29 September, recruiting teams sit across the table from candidates in their own taluka, screen resumes on the spot and make offers the same day.',
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
        email: 'name@company.com', mobile: '10 digit mobile number', positions: 'e.g. 15 to 20',
        compensation: 'e.g. 1.8 to 3.6 LPA', departments: 'e.g. Process, Sales, Production',
        notes: 'Interview panel size, space needed, arrival time',
      },
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
      description: '२९ सप्टेंबर २०२६ रोजी सकाळी १० ते संध्याकाळी ७ पर्यंत मोफत रोजगार मेळावा. उमेदवार म्हणून नोंदणी करा किंवा तुमच्या कंपनीसाठी भरती डेस्क बुक करा.',
    },
    badge: 'रामसुकृत रोजगार मेळावा 2026',
    h1: 'नोकरीसाठी ओळख लागत नाही.<br/>रेझ्युमे लागतो.',
    heroSub: '29 सप्टेंबरला बॉश, अकबर ट्रॅव्हल्स, धिती सर्व्हिसेस आणि झीलकनेक्ट राजगुरुनगरमध्ये मुलाखती घेणार आहेत, आणि अजून कंपन्या जोडल्या जात आहेत. प्रवेश मोफत, सकाळी 10 ते रात्री 7 यादरम्यान कधीही या, आणि आता नोंदणी करा म्हणजे तुम्ही बसण्यापूर्वीच त्यांनी तुमचा रेझ्युमे वाचलेला असेल.',
    heroCtaCandidate: '2 मिनिटांत मोफत नोंदणी करा',
    heroCtaCorporate: 'भरती डेस्क बुक करा',
    heroImg: '/img/students-campus.jpg',

    facts: [
      { k: 'दिनांक', v: '२९ सप्टेंबर २०२६' },
      { k: 'वेळ', v: 'सकाळी १०:०० ते सायंकाळी ७:००' },
      { k: 'ठिकाण', v: 'राजगुरुनगर, ता. खेड, जि. पुणे' },
      { k: 'प्रवेश', v: 'सर्व उमेदवारांसाठी नि:शुल्क' },
    ],

    aboutEyebrow: 'मेळाव्याविषयी',
    aboutTitle: 'भरती आता ग्रामीण तरुणांच्या दारात',
    aboutBody: 'खेड तालुक्यातील तरुणांमध्ये क्षमतेची कमतरता नाही, संधीची आहे. पुण्यातील प्रत्येक मुलाखतीसाठी एक दिवसाची मजुरी, बसचे भाडे आणि उसना शर्ट लागतो. रामसुकृत रोजगार मेळावा हे तिन्ही अडथळे दूर करतो. २९ सप्टेंबर रोजी भरती पथके तुमच्याच तालुक्यात बसतील, जागेवरच रेझ्युमे तपासतील आणि त्याच दिवशी ऑफर देतील.',
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
        email: 'name@company.com', mobile: '१० अंकी मोबाइल क्रमांक', positions: 'उदा. १५ ते २०',
        compensation: 'उदा. १.८ ते ३.६ लाख प्रतिवर्ष', departments: 'उदा. प्रोसेस, विक्री, उत्पादन',
        notes: 'मुलाखत पॅनेल, आवश्यक जागा, येण्याची वेळ',
      },
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
