import { useState } from 'react'
import IndustryBadge from './IndustryBadge'

function InfoField({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  )
}

function Section({ title, icon, children }) {
  const hasContent = Array.isArray(children)
    ? children.some(Boolean)
    : !!children
  if (!hasContent) return null
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 mb-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100/80">
        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export default function ClientDetail({ client, onEdit, onDelete, onBack }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!client) {
    return (
      <div className="text-center py-20 view-enter">
        <p className="text-slate-500">Client not found.</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 hover:underline text-sm font-semibold">
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
    <div className="max-w-3xl mx-auto view-enter">
      {/* Breadcrumb */}
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-all duration-200 group">
        <div className="w-8 h-8 rounded-xl bg-white/80 border border-slate-200/60 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <span className="font-medium">Back to Dashboard</span>
      </button>

      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-3xl mb-5">
        <div className="absolute inset-0 gradient-accent opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <div className="mb-3">
                <IndustryBadge industria={client.industria} industriaPersonalizada={client.industriaPersonalizada} />
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">{companyName}</h1>
              {client.fullName && (
                <p className="text-blue-100/80 text-lg">{client.fullName}</p>
              )}
              <p className="text-blue-200/60 text-xs mt-3 font-medium">{fecha}</p>
            </div>
            <div className="flex items-center gap-2 self-start">
              <button onClick={onEdit}
                className="px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all duration-200 flex items-center gap-2 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <button onClick={onDelete}
                    className="bg-red-500 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-red-600 transition-all duration-200 font-semibold shadow-lg shadow-red-500/30">
                    Confirm Delete
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)}
                    className="text-white/70 text-sm px-3 py-2.5 hover:text-white font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowDeleteConfirm(true)}
                  className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl text-red-100 text-sm font-semibold transition-all duration-200 flex items-center gap-2 border border-red-400/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <Section title="Contact Information" icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <Section title="About the Business" icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }>
        <InfoField label="What the company does" value={client.descripcion} />
        <InfoField label="Unique Selling Proposition (USP)" value={client.propuestaUnica} />
        <InfoField label="Social Proof & Credibility" value={client.pruebasSociales} />
        <InfoField label="Case Studies" value={client.casosDeEstudio} />
      </Section>

      {/* Target Market */}
      <Section title="Target Market" icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      }>
        <InfoField label="Industries to Target" value={client.industriasObjetivo} />
        <InfoField label="Target Job Titles" value={client.titulosDeTrabajoObjetivo} />
        <InfoField label="Ideal Customer Avatar" value={client.avatarCliente} />
        <InfoField label="Lead Magnets" value={client.leadMagnets} />
      </Section>

      {/* Additional */}
      <Section title="Additional Information" icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }>
        <InfoField label="Other Information" value={client.infoAdicional} />
      </Section>
    </div>
  )
}
