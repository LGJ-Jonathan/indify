import { useState, useMemo } from 'react'
import ClientCard from './ClientCard'

export default function Dashboard({ clients, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustria, setSelectedIndustria] = useState('All')

  const industriasPresentes = useMemo(() => {
    const set = new Set()
    clients.forEach(c => {
      const efectiva = c.industria === 'Other' ? (c.industriaPersonalizada || 'Other') : c.industria
      if (efectiva) set.add(efectiva)
    })
    return Array.from(set).sort()
  }, [clients])

  const clientesFiltrados = useMemo(() => {
    return clients.filter(c => {
      const industriaEfectiva = c.industria === 'Other'
        ? (c.industriaPersonalizada || 'Other')
        : c.industria

      const matchIndustria =
        selectedIndustria === 'All' ||
        industriaEfectiva === selectedIndustria ||
        c.industria === selectedIndustria

      const query = searchQuery.toLowerCase().trim()
      const matchSearch =
        !query ||
        (c.companyName || c.empresa || '').toLowerCase().includes(query) ||
        (c.fullName || c.contacto || '').toLowerCase().includes(query) ||
        (industriaEfectiva || '').toLowerCase().includes(query) ||
        (c.descripcion || c.objetivos || '').toLowerCase().includes(query)

      return matchIndustria && matchSearch
    })
  }, [clients, searchQuery, selectedIndustria])

  if (clients.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No clients yet</h3>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Start by adding your first client to build your database and discover patterns by industry.
        </p>
        <button
          onClick={() => onNavigate('nuevo')}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Add First Client
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'} registered
          </p>
        </div>
        <button
          onClick={() => onNavigate('nuevo')}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by company, contact, industry..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            ✕
          </button>
        )}
      </div>

      {/* Industry filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedIndustria('All')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedIndustria === 'All'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({clients.length})
        </button>
        {industriasPresentes.map(ind => {
          const count = clients.filter(c => {
            const ef = c.industria === 'Other' ? (c.industriaPersonalizada || 'Other') : c.industria
            return ef === ind || c.industria === ind
          }).length
          return (
            <button
              key={ind}
              onClick={() => setSelectedIndustria(ind === selectedIndustria ? 'All' : ind)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedIndustria === ind
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {ind} ({count})
            </button>
          )
        })}
      </div>

      {/* Results */}
      {clientesFiltrados.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No results found</h3>
          <p className="text-slate-500 text-sm">No clients match the current filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedIndustria('All') }}
            className="mt-4 text-blue-600 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => onNavigate('detalle', client.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
