import { useState } from 'react'
import { fetchGoogleDocText, extractClientFromText } from '../utils/extractFromDoc'

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  companyName: '',
  website: '',
  descripcion: '',
  casosDeEstudio: '',
  pruebasSociales: '',
  avatarCliente: '',
  industriasObjetivo: '',
  industria: '',
  industriaPersonalizada: '',
  titulosDeTrabajoObjetivo: '',
  propuestaUnica: '',
  leadMagnets: '',
  ubicacion: '',
  nombreMailboxes: '',
  infoAdicional: '',
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  )
}

const inputClass = (hasError) =>
  `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
    hasError
      ? 'border-red-400 focus:ring-red-500/40 focus:border-red-400'
      : 'border-slate-200 focus:ring-indigo-500/40 focus:border-indigo-300 hover:border-slate-300'
  }`

export default function ClientForm({ onSubmit, onCancel, initialData, apiKey, allIndustries = [], onNewIndustry }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialData })
  const [errors, setErrors] = useState({})
  const isEditing = !!initialData

  const [docUrl, setDocUrl] = useState('')
  const [importStatus, setImportStatus] = useState('idle')
  const [importError, setImportError] = useState('')

  const handleImportFromUrl = async () => {
    if (!docUrl.trim()) return
    if (!apiKey) {
      setImportError('Please set your Anthropic API key in Settings first.')
      setImportStatus('error')
      return
    }
    setImportStatus('loading')
    setImportError('')
    try {
      const text = await fetchGoogleDocText(docUrl)
      const extracted = await extractClientFromText({ text, apiKey })

      // Auto-create new industry if not in the list
      if (extracted.industria && !allIndustries.includes(extracted.industria)) {
        onNewIndustry?.(extracted.industria)
      }

      setForm(prev => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(extracted).filter(([, v]) => v !== null && v !== undefined && v !== '')
        ),
      }))
      setImportStatus('done')
    } catch (err) {
      setImportStatus('error')
      setImportError(err.message || 'Could not read the document.')
    }
  }

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const newErrors = {}
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!form.fullName.trim()) newErrors.fullName = 'Contact name is required'
    if (!form.industria) newErrors.industria = 'Please select an industry'
    if (form.industria === 'Other' && !form.industriaPersonalizada.trim())
      newErrors.industriaPersonalizada = 'Please specify the industry'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  return (
    <div className="max-w-3xl mx-auto view-enter">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isEditing ? 'Edit Client' : 'New Client'}
        </h1>
        <p className="text-slate-500 text-sm mt-1.5">
          {isEditing ? 'Update client information.' : 'Import from Google Doc or fill in manually.'}
        </p>
      </div>

      {/* Import from Google Doc */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 border border-indigo-200/60 rounded-2xl p-6 mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-accent opacity-5 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 gradient-accent rounded-xl flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Import from Google Doc</h3>
            {importStatus === 'done' && (
              <span className="ml-auto text-green-700 text-xs font-semibold bg-green-100 px-3 py-1 rounded-full">Fields filled</span>
            )}
          </div>
          <p className="text-slate-500 text-xs mb-4 ml-[42px]">
            Paste the intake form link and AI will extract all information automatically. Make sure the doc is shared as "Anyone with the link can view".
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={docUrl}
              onChange={e => { setDocUrl(e.target.value); setImportStatus('idle'); setImportError('') }}
              placeholder="https://docs.google.com/document/d/..."
              className="flex-1 border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300 bg-white/80 backdrop-blur-sm"
            />
            <button
              type="button"
              onClick={handleImportFromUrl}
              disabled={!docUrl.trim() || importStatus === 'loading'}
              className="px-5 py-2.5 gradient-accent hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              {importStatus === 'loading' ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Reading...
                </>
              ) : 'Extract with AI'}
            </button>
          </div>
          {importStatus === 'error' && (
            <p className="text-red-600 text-xs mt-2 font-medium">{importError}</p>
          )}
          {importStatus === 'done' && (
            <p className="text-green-700 text-xs mt-2 font-medium">Fields filled automatically. Review and adjust as needed.</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-base font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" error={errors.fullName} required>
              <input type="text" value={form.fullName} onChange={set('fullName')}
                placeholder="Full Name" className={inputClass(errors.fullName)} />
            </Field>
            <Field label="Company Name" error={errors.companyName} required>
              <input type="text" value={form.companyName} onChange={set('companyName')}
                placeholder="Company Name" className={inputClass(errors.companyName)} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')}
                placeholder="Email" className={inputClass(false)} />
            </Field>
            <Field label="Phone">
              <input type="text" value={form.phone} onChange={set('phone')}
                placeholder="Phone" className={inputClass(false)} />
            </Field>
            <Field label="Address">
              <input type="text" value={form.address} onChange={set('address')}
                placeholder="Address" className={inputClass(false)} />
            </Field>
            <Field label="Website">
              <input type="text" value={form.website} onChange={set('website')}
                placeholder="Website" className={inputClass(false)} />
            </Field>
          </div>
        </div>

        {/* Classification */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-base font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            Classification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Industry / Sector" error={errors.industria} required>
              <select value={form.industria} onChange={set('industria')} className={inputClass(errors.industria)}>
                <option value="">Select industry...</option>
                {allIndustries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            {form.industria === 'Other' && (
              <Field label="Specify Industry" error={errors.industriaPersonalizada} required>
                <input type="text" value={form.industriaPersonalizada} onChange={set('industriaPersonalizada')}
                  placeholder="Describe the industry..." className={inputClass(errors.industriaPersonalizada)} />
              </Field>
            )}
            <Field label="Location Served">
              <input type="text" value={form.ubicacion} onChange={set('ubicacion')}
                placeholder="Location your business serves customers" className={inputClass(false)} />
            </Field>
          </div>
        </div>

        {/* About the Business */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-base font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            About the Business
          </h2>
          <div className="space-y-4">
            <Field label="What does your company do?">
              <textarea value={form.descripcion} onChange={set('descripcion')} rows={3}
                placeholder="Please do your best to describe what you do..." className={inputClass(false)} />
            </Field>
            <Field label="Unique Selling Proposition (USP)">
              <textarea value={form.propuestaUnica} onChange={set('propuestaUnica')} rows={2}
                placeholder="Unique Selling Proposition" className={inputClass(false)} />
            </Field>
            <Field label="Social Proof & Credibility">
              <textarea value={form.pruebasSociales} onChange={set('pruebasSociales')} rows={2}
                placeholder="Social proof and credibility" className={inputClass(false)} />
            </Field>
            <Field label="Case Studies">
              <textarea value={form.casosDeEstudio} onChange={set('casosDeEstudio')} rows={2}
                placeholder="Do you have any relevant case studies?" className={inputClass(false)} />
            </Field>
          </div>
        </div>

        {/* Target Market */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-base font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Target Market
          </h2>
          <div className="space-y-4">
            <Field label="Industries to Target">
              <textarea value={form.industriasObjetivo} onChange={set('industriasObjetivo')} rows={2}
                placeholder="Industries to target" className={inputClass(false)} />
            </Field>
            <Field label="Target Job Titles">
              <textarea value={form.titulosDeTrabajoObjetivo} onChange={set('titulosDeTrabajoObjetivo')} rows={2}
                placeholder="What job titles do you sell to?" className={inputClass(false)} />
            </Field>
            <Field label="Ideal Customer Avatar">
              <textarea value={form.avatarCliente} onChange={set('avatarCliente')} rows={2}
                placeholder="Customer Avatar" className={inputClass(false)} />
            </Field>
            <Field label="Lead Magnets">
              <textarea value={form.leadMagnets} onChange={set('leadMagnets')} rows={2}
                placeholder="Lead Magnets" className={inputClass(false)} />
            </Field>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-base font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Additional Information
          </h2>
          <div className="space-y-4">
            <Field label="Mailbox Name">
              <input type="text" value={form.nombreMailboxes} onChange={set('nombreMailboxes')}
                placeholder="Name to use for creating mailboxes" className={inputClass(false)} />
            </Field>
            <Field label="Other Information">
              <textarea value={form.infoAdicional} onChange={set('infoAdicional')} rows={3}
                placeholder="Any other information to add..." className={inputClass(false)} />
            </Field>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pb-8">
          <button type="button" onClick={onCancel}
            className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-all duration-200 hover:border-slate-300">
            Cancel
          </button>
          <button type="submit"
            className="px-8 py-3 gradient-accent text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 font-semibold transition-all duration-300 hover:scale-[1.02]">
            {isEditing ? 'Save Changes' : 'Register Client'}
          </button>
        </div>
      </form>
    </div>
  )
}
