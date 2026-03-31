import { useState, useMemo } from 'react'
import ClientCard from './ClientCard'

export default function Dashboard({ clients, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustria, setSelectedIndustria] = useState('All')

  const industriasPresentes = useMemo(() => {
    const map = {}
    clients.forEach(c => {
      const efectiva = c.industria === 'Other' ? (c.industriaPersonalizada || 'Other') : c.industria
      if (efectiva) map[efectiva] = (map[efectiva] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [clients])

  const topIndustry = industriasPresentes.length > 0 ? industriasPresentes[0][0] : 'N/A'

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
      <div className="text-center py-24 view-enter">
        <div className="w-20 h-20 gradient-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">No clients yet</h3>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
          Start by adding your first client to build your database and discover patterns by industry.
        </p>
        <button
          onClick={() => onNavigate('nuevo')}
          className="gradient-accent text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 font-semibold transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add First Client
        </button>
      </div>
    )
  }

  return (
    <div className="view-enter">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl mb-8">
        <div className="absolute inset-0 gradient-accent opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">Lead Gen Jay</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Client Intelligence Hub</h1>
              <p className="text-blue-100/80 mt-2 text-sm">Your centralized client intake and strategy platform</p>
            </div>
            <button
              onClick={() => onNavigate('nuevo')}
              className="bg-white text-slate-900 px-6 py-3 rounded-2xl hover:bg-white/90 font-bold transition-all duration-300 flex items-center gap-2.5 self-start sm:self-auto shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Client
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Clients</p>
          <p className="text-3xl font-extrabold text-slate-900">{clients.length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Top Industry</p>
          <p className="text-lg font-bold text-slate-900 truncate">{topIndustry}</p>
        </div>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex gap-6">
        {/* Left Sidebar - Industries */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm sticky top-24 overflow-hidden">
            <div className="p-4 border-b border-slate-100/80">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industries</p>
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-2">
              <button
                onClick={() => setSelectedIndustria('All')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mb-0.5 ${
                  selectedIndustria === 'All'
                    ? 'gradient-accent text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="font-semibold">All Clients</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  selectedIndustria === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{clients.length}</span>
              </button>
              {industriasPresentes.map(([ind, count]) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustria(ind === selectedIndustria ? 'All' : ind)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mb-0.5 ${
                    selectedIndustria === ind
                      ? 'gradient-accent text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-medium truncate mr-2">{ind}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    selectedIndustria === ind ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-0.5 gradient-accent rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />
            <div className="relative bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="flex items-center">
                <div className="pl-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by company, contact, industry..."
                  className="w-full px-4 py-4 text-base focus:outline-none placeholder:text-slate-400 bg-transparent"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    className="pr-4 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile industry filter (hidden on desktop) */}
          <div className="lg:hidden bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 p-4 mb-6 shadow-sm">
            <div className="flex gap-2 overflow-x-auto filter-scroll pb-1">
              <button
                onClick={() => setSelectedIndustria('All')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  selectedIndustria === 'All'
                    ? 'gradient-accent text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({clients.length})
              </button>
              {industriasPresentes.map(([ind, count]) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustria(ind === selectedIndustria ? 'All' : ind)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    selectedIndustria === ind
                      ? 'gradient-accent text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ind} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Active filter indicator */}
          {(selectedIndustria !== 'All' || searchQuery) && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className="text-slate-500">Showing {clientesFiltrados.length} of {clients.length} clients</span>
              <button
                onClick={() => { setSearchQuery(''); setSelectedIndustria('All') }}
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Results */}
          {clientesFiltrados.length === 0 ? (
            <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No results found</h3>
              <p className="text-slate-500 text-sm">No clients match the current filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedIndustria('All') }}
                className="mt-4 text-indigo-600 text-sm hover:underline font-semibold"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      </div>
    </div>
  )
}
