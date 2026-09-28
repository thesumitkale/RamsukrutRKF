/* Desk volunteers from the final sheet, 29 September. Candidates see the
   main point of contact (ground floor) and the help desk number. The desk
   board also shows the floor 1 volunteer and the help desk captain.
   Matched on company name so a re-entered company row keeps its people. */
const DESKS = [
  // [match, main POC, floor 1 volunteer, help desk, captain]
  [/lenze/i, 'Khushbu Bhatia', 'Dhanashree Kute', 'HD6', 'Srushti'],
  [/autobahn/i, 'Avinash Kahnurkar', 'Pranoti Jadhav', 'HD6', 'Srushti'],
  [/gaps/i, 'Rutuja Rakshe', 'Chaitali Sagar Gade', 'HD6', 'Srushti'],
  [/nivara/i, 'Mayur Satpute', 'Ganesh Kadam', 'HD5', 'Samiksha D'],
  [/lic of india/i, 'Shreya Bhalerao', 'Kirti Deshmukh', 'HD5', 'Samiksha D'],
  [/ecotech/i, 'Komal Kale', 'Kirti Deshmukh', 'HD5', 'Samiksha D'],
  [/^bvg/i, 'Mark Masih', 'Nikhil Gulati', 'HD5', 'Samiksha D'],
  [/skkato/i, 'Swapnil Thorat', 'Nikita Ovhal', 'HD4', 'Bhushan T'],
  [/hi-tech/i, 'Chaitali Gade', 'Nikhil Gulati', 'HD4', 'Bhushan T'],
  [/hawk glass|shivsai/i, 'Sakshi Lonkar', 'Pranoti Jadhav', 'HD4', 'Bhushan T'],
  [/endurance/i, 'Prajwal Jambe', 'Kalyani Somnath Puri', 'HD3', 'Victoria'],
  [/gtpl/i, 'Vishal Amrale', 'Nikhil Gulati', 'HD3', 'Victoria'],
  [/sbi life/i, 'Vidya Kolekar', 'Pratiksha Shendkar', 'HD3', 'Victoria'],
  [/nsb/i, 'Prachi Arude', 'Suraj Jadhav', 'HD3', 'Victoria'],
  [/johnson/i, 'Pratiksha Bhalerao', 'Chaitali Sagar Gade', 'HD2', 'Vaibhav Shetty'],
  [/devaki/i, 'Archana Wagh', 'Chetan Shinde', 'HD2', 'Vaibhav Shetty'],
  [/diamond pipe/i, 'Samruddhi Kanhurkar', 'Chetan Shinde', 'HD2', 'Vaibhav Shetty'],
  [/techspian/i, 'Shraddha Wagh', 'Ankita Ovhal', 'HD1', 'Prashant Chauhan'],
  [/zeal/i, 'Shraddha Wagh', 'Ankita Ovhal', 'HD1', 'Prashant Chauhan'],
  [/akbar/i, 'Shraddha Tamhankar', 'Pratiksha Shendkar', 'HD1', 'Prashant Chauhan'],
  [/dhiti/i, 'Swapnil Kanhurkar', 'Suraj Jadhav', 'HD1', 'Prashant Chauhan'],
]

const empty = { main: [], floor: [], hd: '', captain: '' }
const deskOf = (organization) => {
  const hit = DESKS.find(([re]) => re.test(String(organization || '')))
  return hit ? { main: [hit[1]], floor: [hit[2]], hd: hit[3], captain: hit[4] } : empty
}

/* Test stops take the people of the companies that set the paper. */
export const deskPeople = (key, organization) => {
  if (key === 'TEST') return deskOf('Zeal')
  if (key === 'TBPO') {
    const a = deskOf('Akbar'), b = deskOf('Dhiti')
    return { main: [...a.main, ...b.main], floor: [...a.floor, ...b.floor], hd: a.hd, captain: a.captain }
  }
  return deskOf(organization)
}
