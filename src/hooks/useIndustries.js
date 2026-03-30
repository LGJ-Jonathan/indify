import { useState } from 'react'
import { INDUSTRIAS, BADGE_COLORS } from '../constants/options'

const STORAGE_KEY = 'indify_custom_industries'

const EXTRA_COLORS = [
  'bg-fuchsia-100 text-fuchsia-800',
  'bg-red-100 text-red-800',
  'bg-cyan-100 text-cyan-800',
  'bg-lime-100 text-lime-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
]

function loadCustom() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useIndustries() {
  const [customIndustries, setCustomIndustries] = useState(loadCustom)

  const allIndustries = [
    ...INDUSTRIAS.filter(i => i !== 'Other'),
    ...customIndustries,
    'Other',
  ]

  const getBadgeColor = (industria) => {
    if (BADGE_COLORS[industria]) return BADGE_COLORS[industria]
    const idx = customIndustries.indexOf(industria) % EXTRA_COLORS.length
    return EXTRA_COLORS[idx >= 0 ? idx : 0]
  }

  const addIndustry = (name) => {
    const trimmed = name.trim()
    if (!trimmed || allIndustries.includes(trimmed)) return
    const updated = [...customIndustries, trimmed]
    setCustomIndustries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { allIndustries, getBadgeColor, addIndustry }
}
