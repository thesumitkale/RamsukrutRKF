/* Desk volunteers from the final company list, 28 September. The first name
   is the main point of contact for that desk, the second backs them up.
   Matched on company name so a re-entered company row keeps its volunteers. */
const DESKS = [
  [/techspian/i, 'Shraddha Wagh', 'Ankita Ovhal'],
  [/zeal/i, 'Shraddha Wagh', 'Ankita Ovhal'],
  [/johnson/i, 'Pratiksha Bhalerao', 'Chaitali Sagar Gade'],
  [/devaki/i, 'Archana Wagh', 'Chetan Shinde'],
  [/diamond pipe/i, 'Samruddhi Kanhurkar', 'Chetan Shinde'],
  [/nivara/i, 'Mayur Satpute', 'Ganesh Kadam'],
  [/lenze/i, 'Vaibhav Shetty', 'Dhanashree Kute'],
  [/autobahn/i, 'Avinash Kahnurkar', 'Pranoti Jadhav'],
  [/endurance/i, 'Prajwal Jambe', 'Kalyani Somnath Puri'],
  [/lic of india/i, 'Shreya Bhalerao', 'Kirti Deshmukh'],
  [/ecotech/i, 'Komal Kale', 'Kirti Deshmukh'],
  [/gtpl/i, 'Vishal Amrale', 'Nikhil Gulati'],
  [/hi-tech/i, 'Chaitali Gade', 'Nikhil Gulati'],
  [/skkato/i, 'Swapnil Thorat', 'Nikita Ovhal'],
  [/gaps/i, 'Rutuja Rakshe', 'Chaitali Sagar Gade'],
  [/hawk glass|shivsai/i, 'Sakshi Lonkar', 'Pranoti Jadhav'],
  [/akbar/i, 'Shraddha Tamhankar', 'Pratiksha Shendkar'],
  [/sbi life/i, 'Vidya Kolekar', 'Pratiksha Shendkar'],
  [/dhiti/i, 'Swapnil Kanhurkar', 'Suraj Jadhav'],
  [/nsb/i, 'Prachi Arude', 'Suraj Jadhav'],
]

export const volunteersOf = (organization) => {
  const hit = DESKS.find(([re]) => re.test(String(organization || '')))
  return hit ? hit.slice(1) : []
}

/* Test stops take the volunteers of the companies that set the paper. */
export const volunteersForStop = (key, organization) => {
  if (key === 'TEST') return volunteersOf('Zeal')
  if (key === 'TBPO') return [...new Set([...volunteersOf('Akbar'), ...volunteersOf('Dhiti')])]
  return volunteersOf(organization)
}
