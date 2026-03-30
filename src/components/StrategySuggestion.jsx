import { useState } from 'react'
import { sugerirEstrategia } from '../utils/anthropic'

function renderWithBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function StrategySuggestion({ client, apiKey, getClientsByIndustria, onSave }) {
  const [status, setStatus] = useState('idle')
  const [suggestion, setSuggestion] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const industria = client.industria === 'Otra'
    ? (client.industriaPersonalizada || 'Otra')
    : client.industria

  const similarClients = getClientsByIndustria(industria).filter(c => c.id !== client.id)

  const handleGenerate = async () => {
    setStatus('loading')
    setSuggestion('')
    setError('')
    setSaved(false)

    try {
      setStatus('streaming')
      for await (const chunk of sugerirEstrategia({
        cliente: client,
        clientesSimilares: similarClients,
        apiKey,
      })) {
        setSuggestion(prev => prev + chunk)
      }
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Error al conectar con la API de Anthropic')
    }
  }

  const handleSave = () => {
    onSave(suggestion)
    setSaved(true)
  }

  if (status === 'idle') {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5">✨</div>
          <div className="flex-1">
            <h3 className="font-semibold text-teal-900 mb-1">Sugerencia de Estrategia con IA</h3>
            <p className="text-teal-700 text-sm mb-4">
              {similarClients.length > 0
                ? `Se analizarán ${similarClients.length} cliente${similarClients.length === 1 ? '' : 's'} previo${similarClients.length === 1 ? '' : 's'} en la industria de ${industria} para generar una estrategia personalizada.`
                : `No hay clientes previos en ${industria}. La IA generará recomendaciones basadas en mejores prácticas de la industria.`
              }
            </p>
            <button
              onClick={handleGenerate}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Generar Sugerencia
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="font-semibold text-red-900 mb-1">Error al generar sugerencia</h3>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <button
          onClick={handleGenerate}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status === 'streaming' ? 'bg-teal-400 animate-pulse' : 'bg-teal-500'}`} />
          <span className="text-slate-400 text-xs font-mono">
            {status === 'loading' ? 'Conectando con Claude...' :
             status === 'streaming' ? 'Generando estrategia...' :
             'Estrategia generada'}
          </span>
        </div>
        {status === 'done' && (
          <div className="flex items-center gap-2">
            {saved ? (
              <span className="text-teal-400 text-xs font-medium">✓ Guardado</span>
            ) : (
              <button
                onClick={handleSave}
                className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md transition-colors"
              >
                Guardar como estrategia
              </button>
            )}
            <button
              onClick={handleGenerate}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Regenerar
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 font-mono text-sm text-green-300 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
        {suggestion ? (
          <>
            {renderWithBold(suggestion)}
            {status === 'streaming' && (
              <span className="animate-pulse text-teal-400">▋</span>
            )}
          </>
        ) : (
          <span className="text-slate-500 animate-pulse">Iniciando generación...</span>
        )}
      </div>
    </div>
  )
}
