import IndustryBadge from './IndustryBadge'

export default function ClientCard({ client, onClick }) {
  const fecha = new Date(client.fechaRegistro).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-150 flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-900 text-base leading-tight">{client.companyName || client.empresa || '(No name)'}</h3>
        <IndustryBadge industria={client.industria} industriaPersonalizada={client.industriaPersonalizada} />
      </div>

      <div className="space-y-1 mb-3">
        {client.fullName && (
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {client.fullName}
          </p>
        )}
        {client.email && (
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {client.email}
          </p>
        )}
        {client.ubicacion && (
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {client.ubicacion}
          </p>
        )}
      </div>

      {client.descripcion && (
        <p className="text-xs text-slate-400 line-clamp-2 flex-1">{client.descripcion}</p>
      )}

      <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
        Registered on {fecha}
      </p>
    </div>
  )
}
