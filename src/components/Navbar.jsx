function NavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-white/15 text-white shadow-inner'
          : 'text-slate-300 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}

export default function Navbar({ currentView, onNavigate, onOpenSettings }) {
  return (
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 gradient-accent rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-extrabold text-sm tracking-tight">I</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-bold text-white leading-none tracking-tight">Indify</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-400 leading-none mt-0.5">Lead Gen Jay</span>
          </div>
        </button>

        {/* Nav Links */}
        <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1">
          <NavLink active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')}>
            Dashboard
          </NavLink>
          <NavLink active={currentView === 'analytics'} onClick={() => onNavigate('analytics')}>
            Analytics
          </NavLink>
          <NavLink active={currentView === 'nuevo'} onClick={() => onNavigate('nuevo')}>
            + New Client
          </NavLink>
        </div>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
