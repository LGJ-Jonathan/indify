import { BADGE_COLORS } from '../constants/options'

const EXTRA_COLORS = [
  'bg-fuchsia-100 text-fuchsia-800',
  'bg-red-100 text-red-800',
  'bg-cyan-100 text-cyan-800',
  'bg-lime-100 text-lime-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
]

let colorIndex = {}

function getColor(industria) {
  if (BADGE_COLORS[industria]) return BADGE_COLORS[industria]
  if (!colorIndex[industria]) {
    const keys = Object.keys(colorIndex)
    colorIndex[industria] = EXTRA_COLORS[keys.length % EXTRA_COLORS.length]
  }
  return colorIndex[industria]
}

export default function IndustryBadge({ industria, industriaPersonalizada }) {
  const label = (!industria || industria === 'Other')
    ? (industriaPersonalizada || 'Other')
    : industria
  const colorClass = getColor(label)

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${colorClass}`}>
      {label}
    </span>
  )
}
