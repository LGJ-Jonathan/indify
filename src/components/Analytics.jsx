import { useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap,
} from 'recharts'

const COLORS = [
  '#6366f1', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316',
  '#84cc16', '#a855f7', '#0ea5e9', '#d946ef', '#64748b',
]

function InfoButton({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-5 h-5 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-500 flex items-center justify-center transition-colors duration-200 text-xs font-bold"
      >
        ?
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 w-72 bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-xl px-4 py-3 shadow-2xl border border-white/10 leading-relaxed animate-[viewEnter_0.2s_ease-out]">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-bold text-indigo-300 text-[10px] uppercase tracking-wider">Insight</span>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-200">{text}</p>
          </div>
        </>
      )}
    </div>
  )
}

function Card({ title, subtitle, insight, children, className = '' }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {insight && <InfoButton text={insight} />}
      </div>
      {children}
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-xl px-4 py-3 shadow-2xl border border-white/10">
      <p className="font-bold text-sm mb-0.5">{d.fullName || d.name || payload[0].name}</p>
      <p className="text-slate-300">{payload[0].value} clients</p>
      {d.percent && <p className="text-indigo-300 font-semibold">{d.percent}% of total</p>}
    </div>
  )
}

function StatCard({ label, value, subvalue, icon, color = 'indigo' }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/25',
    violet: 'from-violet-500 to-violet-600 shadow-violet-500/25',
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/25',
    rose: 'from-rose-500 to-rose-600 shadow-rose-500/25',
  }
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      {subvalue && <p className="text-xs text-indigo-500 font-semibold mt-1">{subvalue}</p>}
    </div>
  )
}

export default function Analytics({ clients }) {
  // Industry data
  const industryData = useMemo(() => {
    const map = {}
    clients.forEach(c => {
      const ind = c.industria === 'Other' ? (c.industriaPersonalizada || 'Other') : c.industria
      if (ind) map[ind] = (map[ind] || 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name: name.length > 22 ? name.slice(0, 19) + '...' : name,
        fullName: name,
        count,
        percent: ((count / clients.length) * 100).toFixed(1),
      }))
  }, [clients])

  // Geographic data
  const locationData = useMemo(() => {
    const map = {}
    const keywords = {
      'United States': ['USA', 'United States', 'U.S.', 'US ', 'US,', 'US-', 'America', 'nationwide', 'all 50'],
      'United Kingdom': ['UK', 'United Kingdom', 'England', 'Britain'],
      'Canada': ['Canada', 'Canadian'],
      'Australia': ['Australia', 'Australian'],
      'Europe': ['Europe', 'EU ', 'European', 'Germany', 'France', 'Spain', 'Netherlands'],
      'Asia': ['Asia', 'Singapore', 'Hong Kong', 'Japan', 'India', 'Dubai', 'UAE', 'Middle East'],
      'Latin America': ['Latin America', 'Mexico', 'Brazil', 'Colombia'],
      'Global': ['Global', 'Worldwide', 'International', 'globally'],
    }
    clients.forEach(c => {
      if (!c.ubicacion) { map['Not specified'] = (map['Not specified'] || 0) + 1; return }
      const loc = c.ubicacion
      let matched = false
      for (const [region, terms] of Object.entries(keywords)) {
        if (terms.some(t => loc.toLowerCase().includes(t.toLowerCase()))) {
          map[region] = (map[region] || 0) + 1
          matched = true
          break
        }
      }
      if (!matched) {
        const simplified = loc.length > 25 ? loc.slice(0, 22) + '...' : loc
        map[simplified] = (map[simplified] || 0) + 1
      }
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [clients])

  // Radar data (top 8)
  const radarData = useMemo(() => {
    return industryData.slice(0, 8).map(d => ({
      industry: d.name.length > 12 ? d.name.slice(0, 10) + '...' : d.name,
      count: d.count,
    }))
  }, [industryData])

  const topIndustry = industryData[0] || { fullName: 'N/A', count: 0 }
  const avgPerIndustry = industryData.length > 0 ? (clients.length / industryData.length).toFixed(1) : 0
  const singleIndustries = industryData.filter(d => d.count === 1).length
  const topConcentration = topIndustry.count > 0 ? ((topIndustry.count / clients.length) * 100).toFixed(0) : 0

  return (
    <div className="view-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl mb-8">
        <div className="absolute inset-0 gradient-accent opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Client Intelligence Report</h1>
          <p className="text-blue-100/80 mt-2 text-sm">Deep insights into your client portfolio and industry distribution</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Clients" value={clients.length} color="indigo"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard label="Industries" value={industryData.length} subvalue="sectors covered" color="violet"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard label="Regions" value={locationData.filter(([l]) => l !== 'Not specified').length} subvalue={locationData[0] ? locationData[0][0] + ' is #1' : ''} color="blue"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Top Concentration" value={topConcentration + '%'} subvalue={topIndustry.fullName} color="amber"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>}
        />
        <StatCard label="Diversification" value={industryData.length >= 20 ? 'High' : industryData.length >= 10 ? 'Medium' : 'Low'} subvalue={`${singleIndustries} niche industries`} color="emerald"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
      </div>

      {/* Row 1: Donut + Geographic Reach */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Treemap - All Industries */}
        <Card title="Industry Map" subtitle="All sectors proportional to client count"
          insight={`This treemap shows all ${industryData.length} industries sized by how many clients belong to each. Larger blocks mean more clients. Your top sector is ${topIndustry.fullName} with ${topIndustry.count} clients (${topConcentration}% of your portfolio). Look for opportunities in smaller blocks — they may represent emerging or underserved markets.`}>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={industryData.map(d => ({ name: d.fullName, size: d.count, percent: d.percent }))}
                dataKey="size"
                aspectRatio={4 / 3}
                animationDuration={800}
                content={({ x, y, width, height, name, size, index }) => {
                  if (width < 4 || height < 4) return null
                  const color = COLORS[index % COLORS.length]
                  const showText = width > 50 && height > 35
                  const showCount = width > 40 && height > 50
                  return (
                    <g>
                      <rect x={x} y={y} width={width} height={height} rx={6}
                        fill={color} fillOpacity={0.88} stroke="#fff" strokeWidth={2} />
                      {showText && (
                        <text x={x + width / 2} y={y + height / 2 - (showCount ? 7 : 0)} textAnchor="middle" fill="#fff" fontSize={width > 90 ? 12 : 10} fontWeight={700}>
                          {name && name.length > Math.floor(width / 8) ? name.slice(0, Math.floor(width / 8) - 1) + '…' : name}
                        </text>
                      )}
                      {showCount && (
                        <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="#fff" fillOpacity={0.75} fontSize={10} fontWeight={600}>
                          {size} clients
                        </text>
                      )}
                    </g>
                  )
                }}
              />
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Geographic Reach */}
        <Card title="Geographic Reach" subtitle="Where your clients operate"
          insight={`Your clients operate across ${locationData.filter(([l]) => l !== 'Not specified').length} regions. ${locationData[0] ? `${locationData[0][0]} is your strongest market with ${locationData[0][1]} clients (${((locationData[0][1] / clients.length) * 100).toFixed(0)}%).` : ''} Consider expanding outreach in regions with fewer clients to diversify your geographic footprint.`}>
          <div className="space-y-4">
            {locationData.map(([loc, count], i) => {
              const percent = ((count / clients.length) * 100).toFixed(1)
              return (
                <div key={loc}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] + '15' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: COLORS[i % COLORS.length] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{loc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">{count}</span>
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{percent}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden ml-[42px]">
                    <div className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(count / locationData[0][1]) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Row 2: Radar + Portfolio Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar */}
        <Card title="Industry Radar" subtitle="Top 8 industries at a glance"
          insight={`This radar shows the balance between your top 8 industries. A perfectly round shape means even distribution. Spikes indicate heavy concentration in specific sectors. ${topIndustry.fullName} and ${industryData[1]?.fullName || 'N/A'} dominate — consider if this aligns with your business strategy or if you want to balance the portfolio.`}>
          <div className="h-[360px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="industry" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} />
                <Radar name="Clients" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} animationDuration={800} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Portfolio Health */}
        <Card title="Portfolio Health" subtitle="How diversified is your client base"
          insight={`Your top 3 industries account for ${industryData.length >= 3 ? ((industryData.slice(0, 3).reduce((s, d) => s + d.count, 0) / clients.length) * 100).toFixed(0) : 100}% of all clients. You have ${singleIndustries} niche industries with only 1 client each — these are opportunities to grow. A healthy portfolio typically has no single industry above 25% concentration. Your diversification is ${industryData.length >= 20 ? 'High' : industryData.length >= 10 ? 'Medium' : 'Low'}.`}>
          <div className="space-y-5">
            {/* Top 3 Concentration */}
            <div className="p-4 rounded-xl bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top 3 Concentration</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {industryData.length >= 3
                    ? ((industryData.slice(0, 3).reduce((s, d) => s + d.count, 0) / clients.length) * 100).toFixed(0)
                    : 100}%
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
                {industryData.slice(0, 3).map((d, i) => (
                  <div key={d.fullName} className="h-full" style={{ width: `${(d.count / clients.length) * 100}%`, backgroundColor: COLORS[i] }} />
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                {industryData.slice(0, 3).map((d, i) => (
                  <div key={d.fullName} className="flex items-center gap-1 text-xs text-slate-500">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="truncate">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-indigo-50 text-center">
                <p className="text-2xl font-extrabold text-indigo-700">{avgPerIndustry}</p>
                <p className="text-xs font-medium text-indigo-600 mt-0.5">Avg clients / industry</p>
              </div>
              <div className="p-4 rounded-xl bg-violet-50 text-center">
                <p className="text-2xl font-extrabold text-violet-700">{singleIndustries}</p>
                <p className="text-xs font-medium text-violet-600 mt-0.5">Niche industries</p>
              </div>
            </div>

            {/* Diversification Score */}
            <div className="p-4 rounded-xl bg-emerald-50">
              <p className="text-xs font-semibold text-emerald-700 mb-2">Diversification Score</p>
              <div className="flex items-center gap-3">
                <div className="h-2.5 flex-1 bg-emerald-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${Math.min(100, (industryData.length / clients.length) * 100 * 3)}%` }} />
                </div>
                <span className="text-sm font-extrabold text-emerald-700">
                  {industryData.length >= 20 ? 'High' : industryData.length >= 10 ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>

            {/* Largest vs Smallest */}
            <div className="flex gap-3">
              <div className="flex-1 p-3 rounded-xl bg-amber-50">
                <p className="text-xs font-semibold text-amber-600 mb-1">Largest Sector</p>
                <p className="text-sm font-bold text-amber-800 truncate">{topIndustry.fullName}</p>
                <p className="text-xs text-amber-600">{topIndustry.count} clients ({topConcentration}%)</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-sky-50">
                <p className="text-xs font-semibold text-sky-600 mb-1">Smallest Sector</p>
                <p className="text-sm font-bold text-sky-800 truncate">{industryData[industryData.length - 1]?.fullName || 'N/A'}</p>
                <p className="text-xs text-sky-600">{industryData[industryData.length - 1]?.count || 0} client(s)</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Full Industry Breakdown - Bar Chart */}
      <Card title="Complete Industry Breakdown" subtitle={`All ${industryData.length} industries ranked by client count`}
        insight={`This chart ranks all ${industryData.length} industries from most to fewest clients. The top 3 (${industryData.slice(0, 3).map(d => d.fullName).join(', ')}) represent ${((industryData.slice(0, 3).reduce((s, d) => s + d.count, 0) / clients.length) * 100).toFixed(0)}% of your total portfolio. Industries at the bottom with 1-2 clients may need more attention or could indicate new market opportunities worth exploring.`}>
        <div style={{ height: Math.max(400, industryData.length * 34) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={industryData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis type="category" dataKey="name" width={170}
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={22} animationDuration={800}>
                {industryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
