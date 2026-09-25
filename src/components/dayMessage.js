/* One place that words a person's day plan, so the WhatsApp list, the help
   desk and anything else send exactly the same text. */
import { TEST } from './planner.js'

export const clock = (slot) => {
  if (!slot) return ''
  const [h, mm] = String(slot).split(':').map(Number)
  return ((h + 11) % 12) + 1 + ':' + String(mm).padStart(2, '0') + (h < 12 ? ' AM' : ' PM')
}
export const clockMr = (slot) => {
  if (!slot) return ''
  const [h, mm] = String(slot).split(':').map(Number)
  return (h < 12 ? 'सकाळी ' : h < 17 ? 'दुपारी ' : h < 19 ? 'सायंकाळी ' : 'रात्री ') + (((h + 11) % 12) + 1) + ':' + String(mm).padStart(2, '0')
}

/* `atDesk` is for the help desk on the day: the person is already inside, so
   the text leads with where to go instead of when to arrive. */
export function dayMessage(p, plan, stopName, atDesk = false) {
  const first = String(p.name || '').split(' ')[0]
  const head = 'Namaskar ' + first + '. Ramsukrut Job Fair, Tuesday 29 September, Mahalaxmi Mangal Karyalay, Dawadi.'
  if (plan.status === 'reserve') {
    return head + ' You are on the reserve list. ' + (atDesk ? 'Please wait near the help desk, we will call you when a desk opens.' : 'Please come by 12:30 PM and go to the help desk.') +
      ' / आपले नाव राखीव यादीत आहे. ' + (atDesk ? 'मदत कक्षाजवळ थांबा, टेबल मोकळे झाल्यावर आम्ही बोलावू.' : 'दुपारी 12:30 पर्यंत येऊन मदत कक्षात भेटा.')
  }
  const en = (plan.route || []).map((r, i) => (i + 1) + ') ' + clock(r.slot) + ' ' + stopName(r.key)).join(', ')
  const mr = (plan.route || []).map((r, i) => (i + 1) + ') ' + clockMr(r.slot) + ' ' + (r.key === TEST ? 'अभियोग्यता चाचणी' : stopName(r.key))).join(', ')
  if (atDesk) {
    return (
      head + ' You are checked in. Group ' + plan.grp + '. Your stops: ' + en +
      '. Go to each desk at its time and wait in the seating area in between. Keep this message and show it at every desk. / तुमची नोंद झाली. गट ' + plan.grp + '. ' + mr +
      '. प्रत्येक टेबलवर दिलेल्या वेळी जा, मधल्या वेळेत बैठक व्यवस्थेत थांबा. हा मेसेज प्रत्येक टेबलवर दाखवा.'
    )
  }
  return (
    head + ' Group ' + plan.grp +
    '. Reach the venue by ' + clock(plan.report_at) + ' and go to any help desk at the entrance. They will tell you where to go and when. Your stops: ' + en +
    '. See your full plan and save a screenshot: ramsukrut.com/#/my-options . Bring 3 copies of your resume and a photo ID. / गट ' + plan.grp + '. प्रवेशद्वारावर ' + clockMr(plan.report_at) + ' पर्यंत पोहोचा आणि प्रवेशद्वाराजवळील कोणत्याही मदत कक्षात जा. कुठे आणि केव्हा जायचे ते तिथे सांगितले जाईल. ' + mr + '. तुमचा प्लॅन पाहून स्क्रीनशॉट घ्या: ramsukrut.com/#/my-options'
  )
}
