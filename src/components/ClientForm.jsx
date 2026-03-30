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
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputClass = (hasError) =>
  `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? 'border-red-400 focus:ring-red-500 focus:border-transparent'
      : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditing ? 'Edit Client' : 'New Client'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isEditing ? 'Update client information.' : 'Import from Google Doc or fill in manually.'}
        </p>
      </div>

      {/* Import from Google Doc */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-semibold text-blue-900 text-sm">Import from Google Doc</h3>
          {importStatus === 'done' && (
            <span className="ml-auto text-green-700 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full">✓ Fields filled</span>
          )}
        </div>
        <p className="text-blue-700 text-xs mb-3">
          Paste the intake form link and AI will extract all information automatically. Make sure the doc is shared as "Anyone with the link can view".
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={docUrl}
            onChange={e => { setDocUrl(e.target.value); setImportStatus('idle'); setImportError('') }}
            placeholder="https://docs.google.com/document/d/..."
            className="flex-1 border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          <button
            type="button"
            onClick={handleImportFromUrl}
            disabled={!docUrl.trim() || importStatus === 'loading'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {importStatus === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Reading...
              </>
            ) : '✨ Extract with AI'}
          </button>
        </div>
        {importStatus === 'error' && (
          <p className="text-red-600 text-xs mt-2">{importError}</p>
        )}
        {importStatus === 'done' && (
          <p className="text-green-700 text-xs mt-2">Fields filled automatically. Review and adjust as needed.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
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
            className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
            Cancel
          </button>
          <button type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            {isEditing ? 'Save Changes' : 'Register Client'}
          </button>
        </div>
      </form>
    </div>
  )
}
