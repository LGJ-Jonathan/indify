import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wsikoxfeejrukntjgnks.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzaWtveGZlZWpydWtudGpnbmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDM3MjMsImV4cCI6MjA5MDQxOTcyM30.ZJpFlrCD0HQLLqk4z-CfIF2rN5PwhjzVRLYaj6P46_I'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_API_KEY) {
  console.error('Set ANTHROPIC_API_KEY environment variable')
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

const INDUSTRIAS = [
  'Technology', 'Health & Medicine', 'Education', 'Retail / Commerce', 'Manufacturing',
  'Financial Services', 'Construction', 'Tourism & Hospitality', 'Food & Beverage',
  'Media & Entertainment', 'Logistics & Transportation', 'Real Estate', 'Consulting',
  'Marketing & Advertising', 'Legal Services', 'Staffing & Recruitment',
  'Fundraising & Nonprofit', 'Security & Protection', 'Precious Metals & Commodities',
  'Insurance & Benefits', 'Marine Finance', 'Mortgage & Lending', 'Public Relations',
]

const clients = [
  { name: "Rob Moser", url: "https://docs.google.com/document/d/1pfCKJJcyygRzrEnxNcNpMbh2Cfw0CHrKC2FBcTSFbQQ/edit" },
  { name: "Robert J Greengard", url: "https://docs.google.com/document/d/1JMOLuXtgUHOJEnq2Kr9RKBRE9RWWceunTPd-3l3C3As/edit" },
  { name: "Ross Logan", url: "https://docs.google.com/document/d/19SGLg581pFiZzNiT7r0A3lhAysiJuVDP2kNCmc-U-eE/edit" },
  { name: "Rotem Nahum", url: "https://docs.google.com/document/d/1AmoqTDGO8coI5fQFGPJouI2I_sdmCUmTKVNCOQz5kEA/edit" },
  { name: "Ryan Swan", url: "https://docs.google.com/document/d/1tBLAExgspf9Dfg3uHnaMQK0kct3CjGBvV6syzJzB1aw/edit" },
  { name: "Ryne Bandolik", url: "https://docs.google.com/document/d/1MimpM-CxiJgiDkIo84iogvTHT5god94WKen8kG4GyjE/edit" },
  { name: "Sarah Karger", url: "https://docs.google.com/document/d/1z_-7XpFo0YCFiR5jqU3qqBmwJ49f78iHmJ_BnQC0UVc/edit" },
  { name: "Stephen Delisle", url: "https://docs.google.com/document/d/1NffAXpqqDi-tkgE2REPYICP5wbWn6N1-AN2bnxVGPiw/edit" },
  { name: "Stephen Diaz", url: "https://docs.google.com/document/d/1HOLI_GHmmRt2gzGBatynK9QBDtw4L_1ZYdGaMKWRpG4/edit" },
  { name: "Stephen Hall", url: "https://docs.google.com/document/d/198bDIUQduhTG9LpZHlgK5T_b88KRYvOPi2a_Ar0zxsk/edit" },
  { name: "Stephen Whittier", url: "https://docs.google.com/document/d/1YULMnGzJVivP3b2yuY6ZaXkmC2ju6lwznN8rrJ6xGRM/edit" },
  { name: "Steve Landry", url: "https://docs.google.com/document/d/1ZF0ZzdptSFs6wTw4Spc4Q_01GcmeERE7sQ3TkHlaFWg/edit" },
  { name: "Tahia Hocking", url: "https://docs.google.com/document/d/1iUWIOxHW4b6w5Y4lTDM66I38bSGUcX6oP_Sfvk8zcPE/edit" },
  { name: "Taruna Kanani", url: "https://docs.google.com/document/d/1Fi7_gHQ6qLXU7orbPpa66Zxir1AXMvwz4-UCDO1T5ak/edit" },
  { name: "Tate J Borcoman", url: "https://docs.google.com/document/d/1bgGLq1fRhbd9NqbiN_OQGbk6dv-4xVaAf9GdOsHhvlc/edit" },
  { name: "Thasan Kankaivernian", url: "https://docs.google.com/document/d/1M1-bhs4q2AbPpouB6K8Nb11E3MDHgRmWiBqoAnwELpY/edit" },
  { name: "Todd Fuller", url: "https://docs.google.com/document/d/1c2hHkR2pLVjw-kSomiYuxMTzNp90tLShleNYKt2x4W4/edit" },
  { name: "Todd Lindeblad", url: "https://docs.google.com/document/d/1WUoVoXUqJS6F7zuWArhm1uSjRRSQrc9_i9W-4N-R7uk/edit" },
  { name: "Trey Harrell", url: "https://docs.google.com/document/d/1MfcapGMw9D4mxY1zs7GJNJoVbyUvjXjEZwBMvZqfgGw/edit" },
  { name: "Vinodh Jeyaraj", url: "https://docs.google.com/document/d/1MZQou2hUaEa2WMZlY4e1TKN4Xb9G4fx2WgoDiHHRwnc/edit" },
  { name: "Vishwak Reddy", url: "https://docs.google.com/document/d/1smIgR01n_atxzwvtFeWjU32lguPTYi_3txdL7QC9dLY/edit" },
  { name: "Walid Tamari", url: "https://docs.google.com/document/d/1Sq0U0AHjPA2RhWJh1tZaNWoZ98miLqPGGN5P4VR6chs/edit" },
  { name: "William Lynch", url: "https://docs.google.com/document/d/1LWwF3Zi2xKSGDRROh-aC0w-QDd-KuYPnBQkuUyQjZnw/edit" },
  { name: "Yitzchok Rapoport", url: "https://docs.google.com/document/d/1O32ysNMW0PqGIcw5CkM-yzSuRpWkYZkmr_XDsjWWfkw/edit" },
  { name: "Zach Crotty", url: "https://docs.google.com/document/d/1zbGxKze615EqUrI3PKCn5cplsdh1gyAfNcf3AFYbhJQ/edit" },
  { name: "ZeeShan Ali", url: "https://docs.google.com/document/d/1sYeUZyXWNifuS7aDCMqv16jJgWxOV-mb3hRGk3qIA4A/edit" },
]

async function fetchDocText(url) {
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) throw new Error('Invalid URL: ' + url)
  const docId = match[1]
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`
  const res = await fetch(exportUrl, { redirect: 'follow' })
  if (!res.ok) throw new Error('Could not fetch doc: ' + res.status)
  return await res.text()
}

async function extractClient(text) {
  const prompt = `Analyze the following client intake form text and extract structured information.

DOCUMENT TEXT:
"""
${text.slice(0, 8000)}
"""

Return a JSON with exactly these fields (use empty string "" if information not found):
{
  "fullName": "full name of the contact",
  "email": "contact email",
  "phone": "phone number",
  "address": "address",
  "companyName": "company or business name",
  "website": "website URL",
  "descripcion": "description of what the company does",
  "casosDeEstudio": "relevant case studies or examples",
  "pruebasSociales": "social proof and credibility",
  "avatarCliente": "ideal customer avatar description",
  "industriasObjetivo": "target industries or sectors",
  "industria": "classify THIS company's industry. First try to match one of these: ${INDUSTRIAS.join(', ')}. If none fits well, write the most accurate industry name in English. Never use 'Other'.",
  "industriaPersonalizada": "",
  "titulosDeTrabajoObjetivo": "target job titles they sell to",
  "propuestaUnica": "unique selling proposition or USP",
  "leadMagnets": "lead magnets used",
  "ubicacion": "location or areas where they serve customers",
  "nombreMailboxes": "name for creating mailboxes",
  "infoAdicional": "any other relevant information"
}

IMPORTANT:
- All field values must be written in English
- Respond ONLY with the JSON, no explanations or markdown`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = response.content[0].text.trim()
  const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  try {
    return JSON.parse(jsonText)
  } catch {
    const m = jsonText.match(/\{[\s\S]*\}/)
    if (m) return JSON.parse(m[0])
    throw new Error('Could not parse AI response')
  }
}

async function importClient(entry, index) {
  try {
    console.log(`[${index + 1}/27] Reading: ${entry.name}...`)
    const text = await fetchDocText(entry.url)

    console.log(`[${index + 1}/27] Extracting: ${entry.name}...`)
    const extracted = await extractClient(text)

    const clientData = {
      ...extracted,
      fechaRegistro: new Date().toISOString(),
    }
    // Remove empty strings
    for (const key of Object.keys(clientData)) {
      if (clientData[key] === '') delete clientData[key]
    }
    // Ensure we have at least a name
    if (!clientData.fullName) clientData.fullName = entry.name
    if (!clientData.companyName) clientData.companyName = entry.name

    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single()

    if (error) {
      console.error(`  ✗ DB error for ${entry.name}:`, error.message)
      return false
    }
    console.log(`  ✓ Saved: ${data.companyName} (${data.industria})`)
    return true
  } catch (err) {
    console.error(`  ✗ Failed: ${entry.name} - ${err.message}`)
    return false
  }
}

async function main() {
  console.log(`Starting batch import of ${clients.length} clients...\n`)
  let success = 0
  let failed = 0

  for (let i = 0; i < clients.length; i++) {
    const ok = await importClient(clients[i], i)
    if (ok) success++
    else failed++
    // Small delay to avoid rate limits
    if (i < clients.length - 1) await new Promise(r => setTimeout(r, 1000))
  }

  console.log(`\nDone! ${success} imported, ${failed} failed.`)
}

main()
