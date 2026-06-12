import { Grad, Wrench, HeartPulse, Users, Heart, Briefcase, Rupee, Eye, School, Steth, Landmark, Handshake, Clock, MapPin, Phone, Mail, Shield, Smile, Chart } from './Icons.jsx'
const MAP = { grad: Grad, wrench: Wrench, heartpulse: HeartPulse, users: Users, heart: Heart, briefcase: Briefcase, rupee: Rupee, eye: Eye, school: School, steth: Steth, landmark: Landmark, handshake: Handshake, clock: Clock, mappin: MapPin, phone: Phone, mail: Mail, shield: Shield, smile: Smile, chart: Chart }
export const Ico = ({ name, size = 22, className = '' }) => {
  const C = MAP[name] || Grad
  return <C size={size} className={className} />
}
