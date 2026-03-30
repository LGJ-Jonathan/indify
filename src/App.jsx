import { useState } from 'react'
import { useClients } from './hooks/useClients'
import { useIndustries } from './hooks/useIndustries'
import { INDUSTRIAS } from './constants/options'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ClientForm from './components/ClientForm'
import ClientDetail from './components/ClientDetail'

function SettingsModal({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey)

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-slate-500 text-sm mb-6">
          Enter your Anthropic API key to enable AI-powered document import.
          Your key is stored locally in your browser and never sent to any external server.
        </p>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Anthropic API Key
        </label>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-1"
          autoComplete="off"
        />
        <p className="text-xs text-slate-400 mb-6">
          Get your API key at{' '}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            console.anthropic.com
          </a>
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(key)}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
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
              <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-slate-500 text-sm">Loading clients...</p>
            </div>
          </div>
        )
        return (
          <Dashboard
            clients={clients}
            onNavigate={navigate}
          />
        )
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
    <div className="min-h-screen bg-slate-50">
      <Navbar
        currentView={currentView}
        onNavigate={navigate}
        onOpenSettings={() => setShowSettings(true)}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
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
