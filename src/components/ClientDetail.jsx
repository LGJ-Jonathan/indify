import { useState } from 'react'
import IndustryBadge from './IndustryBadge'

function InfoField({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-slate-800 whitespace-pre-wrap">{value}</p>
    </div>
  )
}

function Section({ title, children }) {
  const hasContent = Array.isArray(children)
    ? children.some(Boolean)
    : !!children
  if (!hasContent) return null
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4 pb-2 border-b border-slate-100">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export default function ClientDetail({ client, onEdit, onDelete, onBack }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Client not found.</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline text-sm">
          Back to dashboard
        </button>
      </div>
    )
  }

  const fecha = new Date(client.fechaRegistro).toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const companyName = client.companyName || client.empresa || '(No name)'

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{companyName}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <IndustryBadge industria={client.industria} industriaPersonalizada={client.industriaPersonalizada} />
              {client.fullName && (
                <>
                  <span className="text-slate-400 text-xs">·</span>
                  <span className="text-slate-500 text-sm">{client.fullName}</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">Registered on {fecha}</p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <button onClick={onEdit}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
              Edit
            </button>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Confirm?</span>
                <button onClick={onDelete}
                  className="bg-red-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="text-slate-500 text-sm px-2 py-2 hover:text-slate-700">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition-colors">
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoField label="Full Name" value={client.fullName} />
          <InfoField label="Company" value={companyName} />
          <InfoField label="Email" value={client.email} />
          <InfoField label="Phone" value={client.phone} />
          <InfoField label="Address" value={client.address} />
          <InfoField label="Website" value={client.website} />
          <InfoField label="Location Served" value={client.ubicacion} />
          <InfoField label="Mailbox Name" value={client.nombreMailboxes} />
        </div>
      </Section>

      {/* About the Business */}
      <Section title="About the Business">
        <InfoField label="What the company does" value={client.descripcion} />
        <InfoField label="Unique Selling Proposition (USP)" value={client.propuestaUnica} />
        <InfoField label="Social Proof & Credibility" value={client.pruebasSociales} />
        <InfoField label="Case Studies" value={client.casosDeEstudio} />
      </Section>

      {/* Target Market */}
      <Section title="Target Market">
        <InfoField label="Industries to Target" value={client.industriasObjetivo} />
        <InfoField label="Target Job Titles" value={client.titulosDeTrabajoObjetivo} />
        <InfoField label="Ideal Customer Avatar" value={client.avatarCliente} />
        <InfoField label="Lead Magnets" value={client.leadMagnets} />
      </Section>

      {/* Additional */}
      <Section title="Additional Information">
        <InfoField label="Other Information" value={client.infoAdicional} />
      </Section>
    </div>
  )
}
