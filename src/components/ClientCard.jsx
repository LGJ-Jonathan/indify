import IndustryBadge from './IndustryBadge'

const BORDER_COLORS = {
  'Technology': 'border-l-blue-500',
  'Health & Medicine': 'border-l-green-500',
  'Education': 'border-l-yellow-500',
  'Retail / Commerce': 'border-l-pink-500',
  'Manufacturing': 'border-l-orange-500',
  'Financial Services': 'border-l-emerald-500',
  'Construction': 'border-l-stone-500',
  'Tourism & Hospitality': 'border-l-cyan-500',
  'Food & Beverage': 'border-l-lime-500',
  'Media & Entertainment': 'border-l-purple-500',
  'Logistics & Transportation': 'border-l-indigo-500',
  'Real Estate': 'border-l-amber-500',
  'Consulting': 'border-l-sky-500',
  'Marketing & Advertising': 'border-l-rose-500',
  'Legal Services': 'border-l-violet-500',
  'Staffing & Recruitment': 'border-l-teal-500',
  'Fundraising & Nonprofit': 'border-l-green-500',
  'Security & Protection': 'border-l-slate-500',
  'Precious Metals & Commodities': 'border-l-yellow-500',
  'Insurance & Benefits': 'border-l-blue-500',
  'Marine Finance': 'border-l-cyan-500',
  'Mortgage & Lending': 'border-l-emerald-500',
  'Public Relations': 'border-l-fuchsia-500',
  'Other': 'border-l-slate-400',
}

function getBorderColor(industria, industriaPersonalizada) {
  const label = (!industria || industria === 'Other')
    ? (industriaPersonalizada || 'Other')
    : industria
  return BORDER_COLORS[label] || 'border-l-indigo-400'
}

export default function ClientCard({ client, onClick }) {
  const fecha = new Date(client.fechaRegistro).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const companyName = client.companyName || client.empresa || '(No name)'
  const borderColor = getBorderColor(client.industria, client.industriaPersonalizada)

  return (
    <div
      onClick={onClick}
      className={`group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 border-l-4 ${borderColor} p-5 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex flex-col`}
    >
      {/* Top: Industry badge */}
      <div className="mb-3">
        <IndustryBadge industria={client.industria} industriaPersonalizada={client.industriaPersonalizada} />
      </div>

      {/* Company name */}
      <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 group-hover:text-gradient transition-colors duration-300">
        {companyName}
      </h3>

      {/* Contact */}
      {client.fullName && (
        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {client.fullName}
        </p>
      )}

      {/* Description */}
      {client.descripcion && (
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">{client.descripcion}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100/80 mt-auto">
        <div className="flex items-center gap-3">
          {client.email && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </span>
          )}
          {client.website && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Web
            </span>
          )}
          {client.ubicacion && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {client.ubicacion.length > 20 ? client.ubicacion.slice(0, 20) + '...' : client.ubicacion}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-300 font-medium">{fecha}</span>
      </div>
    </div>
  )
}
