import { useState } from 'react'
import { useClients } from './hooks/useClients'
import { useIndustries } from './hooks/useIndustries'
import { INDUSTRIAS } from './constants/options'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ClientForm from './components/ClientForm'
import ClientDetail from './components/ClientDetail'
import Analytics from './components/Analytics'

function SettingsModal({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey)

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/20 p-8 w-full max-w-md border border-white/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-accent rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Enter your Anthropic API key to enable AI-powered document import.
          Your key is stored locally in your browser and never sent to any external server.
        </p>

        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Anthropic API Key
        </label>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300 bg-white/80 backdrop-blur-sm mb-1.5 transition-all duration-200"
          autoComplete="off"
        />
        <p className="text-xs text-slate-400 mb-6">
          Get your API key at{' '}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-600 font-medium hover:underline transition-colors"
          >
            console.anthropic.com
          </a>
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-all duration-200 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(key)}
            className="flex-1 py-3 gradient-accent text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 font-semibold transition-all duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { clients, loading, addClient, updateClient, deleteClient, getClientById, getClientsByIndustria } = useClients()
  const { allIndustries, addIndustry } = useIndustries()

  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('indify_apikey') || '')

  const navigate = (view, clientId = null) => {
    setCurrentView(view)
    setSelectedClientId(clientId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveApiKey = (key) => {
    localStorage.setItem('indify_apikey', key)
    setApiKey(key)
    setShowSettings(false)
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        if (loading) return (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30 animate-pulse">
                <svg className="h-7 w-7 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm font-medium">Loading clients...</p>
            </div>
          </div>
        )
        return (
          <Dashboard
            clients={clients}
            onNavigate={navigate}
          />
        )
      case 'analytics':
        return <Analytics clients={clients} />
      case 'nuevo':
        return (
          <ClientForm
            apiKey={apiKey}
            allIndustries={allIndustries}
            onNewIndustry={addIndustry}
            onSubmit={async (data) => {
              const id = await addClient(data)
              if (id) navigate('detalle', id)
            }}
            onCancel={() => navigate('dashboard')}
          />
        )
      case 'detalle': {
        const client = getClientById(selectedClientId)
        return (
          <ClientDetail
            client={client}
            onEdit={() => navigate('editar', selectedClientId)}
            onDelete={() => {
              deleteClient(selectedClientId)
              navigate('dashboard')
            }}
            onBack={() => navigate('dashboard')}
          />
        )
      }
      case 'editar': {
        const client = getClientById(selectedClientId)
        return (
          <ClientForm
            apiKey={apiKey}
            allIndustries={allIndustries}
            onNewIndustry={addIndustry}
            initialData={client}
            onSubmit={(data) => {
              updateClient(selectedClientId, data)
              navigate('detalle', selectedClientId)
            }}
            onCancel={() => navigate('detalle', selectedClientId)}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/30">
      <Navbar
        currentView={currentView}
        onNavigate={navigate}
        onOpenSettings={() => setShowSettings(true)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {renderView()}
      </main>

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
