import Anthropic from '@anthropic-ai/sdk'
import { INDUSTRIAS } from '../constants/options'

export async function fetchGoogleDocText(url) {
  // Extract document ID from various Google Doc URL formats
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) throw new Error('URL de Google Doc inválida. Asegúrate de pegar el link completo.')

  const docId = match[1]
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`

  const response = await fetch(exportUrl)
  if (!response.ok) {
    throw new Error('No se pudo leer el documento. Verifica que esté compartido como "Cualquier persona con el enlace puede ver".')
  }
  const text = await response.text()
  if (!text.trim()) throw new Error('El documento está vacío o no se pudo leer.')
  return text
}

export async function extractClientFromText({ text, apiKey }) {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const prompt = `Analiza el siguiente texto de un intake form de cliente y extrae la información estructurada.

TEXTO DEL DOCUMENTO:
"""
${text.slice(0, 8000)}
"""

Devuelve un JSON con exactamente estos campos (usa cadena vacía "" si no encuentras la información):
{
  "fullName": "nombre completo del contacto",
  "email": "email del contacto",
  "phone": "teléfono",
  "address": "dirección",
  "companyName": "nombre de la empresa o negocio",
  "website": "sitio web",
  "descripcion": "descripción de lo que hace la empresa",
  "casosDeEstudio": "casos de estudio o ejemplos relevantes",
  "pruebasSociales": "prueba social y credibilidad",
  "avatarCliente": "descripción del cliente ideal o avatar",
  "industriasObjetivo": "industrias o sectores que el cliente objetivo maneja o representa",
  "industria": "classify THIS company's industry. First try to match one of these: ${INDUSTRIAS.filter(i => i !== 'Other').join(', ')}. If none fits well, write the most accurate industry name in English (e.g. 'E-commerce', 'Cybersecurity', 'HR Tech'). Never use 'Other'.",
  "industriaPersonalizada": "leave empty string",
  "titulosDeTrabajoObjetivo": "títulos de trabajo a los que venden",
  "propuestaUnica": "propuesta de valor única o USP",
  "leadMagnets": "lead magnets que utilizan",
  "ubicacion": "ubicación o zonas donde sirve a sus clientes",
  "nombreMailboxes": "nombre para crear mailboxes",
  "infoAdicional": "cualquier otra información relevante"
}

IMPORTANT:
- All field values must be written in English, regardless of the language of the source document
- For "industria" classify the company into one of the listed options
- Respond ONLY with the JSON, no explanations or markdown`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = response.content[0].text.trim()
  // Strip markdown code blocks if present
  const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    return JSON.parse(jsonText)
  } catch {
    // Try to extract just the JSON object if there's surrounding text
    const match = jsonText.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Could not parse the AI response. Please try again.')
  }
}
